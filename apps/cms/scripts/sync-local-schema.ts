import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

const localSqlitePath = () => {
  const url = process.env.DATABASE_URL || 'file:./payload-dev.db'
  if (!url.startsWith('file:')) return ''
  return path.resolve(process.cwd(), url.replace(/^file:/, ''))
}

const ensureColumn = (db: DatabaseSync, table: string, column: string, definition: string) => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>
  if (columns.some((entry) => entry.name === column)) return false
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  return true
}

const ensureTable = (db: DatabaseSync, table: string, sql: string) => {
  const before = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)
  db.exec(sql)
  return !before
}

const ensureSectionTables = (db: DatabaseSync, prefix: string, parentTable: string, versionParentTable: string) => {
  const changes: string[] = []
  const baseTables = [
    [`${prefix}_hero_panels`, '"image_id" integer'],
    [`${prefix}_statement_body`, '"text" text'],
    [`${prefix}_shooting_styles`, '"image_id" integer, "title" text, "text" text'],
    [`${prefix}_portfolio_tiles`, '"image_id" integer, "label" text'],
    [`${prefix}_audience_cards`, '"image_id" integer, "number" text, "title" text, "text" text'],
  ] as const
  const versionTables = [
    [`_${prefix}_v_version_hero_panels`, '"image_id" integer, "_uuid" text'],
    [`_${prefix}_v_version_statement_body`, '"text" text, "_uuid" text'],
    [`_${prefix}_v_version_shooting_styles`, '"image_id" integer, "title" text, "text" text, "_uuid" text'],
    [`_${prefix}_v_version_portfolio_tiles`, '"image_id" integer, "label" text, "_uuid" text'],
    [`_${prefix}_v_version_audience_cards`, '"image_id" integer, "number" text, "title" text, "text" text, "_uuid" text'],
  ] as const

  for (const [table, fields] of baseTables) {
    if (
      ensureTable(
        db,
        table,
        `CREATE TABLE IF NOT EXISTS "${table}" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" text PRIMARY KEY NOT NULL, ${fields})`,
      )
    ) {
      changes.push(table)
    }
    db.exec(`CREATE INDEX IF NOT EXISTS "${table}_order_idx" ON "${table}" ("_order")`)
    db.exec(`CREATE INDEX IF NOT EXISTS "${table}_parent_id_idx" ON "${table}" ("_parent_id")`)
    if (fields.includes('image_id')) db.exec(`CREATE INDEX IF NOT EXISTS "${table}_image_idx" ON "${table}" ("image_id")`)
  }

  for (const [table, fields] of versionTables) {
    if (
      ensureTable(
        db,
        table,
        `CREATE TABLE IF NOT EXISTS "${table}" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" integer PRIMARY KEY NOT NULL, ${fields})`,
      )
    ) {
      changes.push(table)
    }
    db.exec(`CREATE INDEX IF NOT EXISTS "${table}_order_idx" ON "${table}" ("_order")`)
    db.exec(`CREATE INDEX IF NOT EXISTS "${table}_parent_id_idx" ON "${table}" ("_parent_id")`)
    if (fields.includes('image_id')) db.exec(`CREATE INDEX IF NOT EXISTS "${table}_image_idx" ON "${table}" ("image_id")`)
  }

  if (ensureColumn(db, parentTable, 'hero_line2', 'text')) changes.push(`${parentTable}.hero_line2`)
  if (ensureColumn(db, parentTable, 'statement_headline', 'text')) changes.push(`${parentTable}.statement_headline`)
  if (ensureColumn(db, parentTable, 'statement_emphasis', 'text')) changes.push(`${parentTable}.statement_emphasis`)
  if (ensureColumn(db, versionParentTable, 'version_hero_line2', 'text')) changes.push(`${versionParentTable}.version_hero_line2`)
  if (ensureColumn(db, versionParentTable, 'version_statement_headline', 'text')) {
    changes.push(`${versionParentTable}.version_statement_headline`)
  }
  if (ensureColumn(db, versionParentTable, 'version_statement_emphasis', 'text')) {
    changes.push(`${versionParentTable}.version_statement_emphasis`)
  }

  return changes
}

const repairKnownLocalSQLiteDrift = () => {
  const databasePath = localSqlitePath()
  if (!databasePath || !fs.existsSync(databasePath)) return []

  const db = new DatabaseSync(databasePath)
  const changes: string[] = []

  try {
    if (ensureColumn(db, 'footer', 'about_link_seo_purpose', "text DEFAULT 'contextual'")) {
      changes.push('footer.about_link_seo_purpose')
    }
    if (ensureColumn(db, 'footer', 'about_link_rel', "text DEFAULT 'follow'")) {
      changes.push('footer.about_link_rel')
    }
    if (ensureColumn(db, 'footer', 'about_link_open_in_new_tab', 'integer DEFAULT 0')) {
      changes.push('footer.about_link_open_in_new_tab')
    }

    const beforeHeroSlides = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_pages_hero_slides'")
      .get()
    const beforeVersionHeroSlides = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = '_site_pages_v_version_hero_slides'")
      .get()

    db.exec(`
      CREATE TABLE IF NOT EXISTS "site_pages_hero_slides" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "image_id" integer,
        "headline_line1" text DEFAULT 'Fotografie',
        "headline_line2" text,
        "lead" text,
        "primary_label" text DEFAULT 'Projekt anfragen',
        "primary_href" text DEFAULT '#anfrage',
        "secondary_label" text DEFAULT 'Arbeiten ansehen',
        "secondary_href" text DEFAULT '/portfolio.html',
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null,
        FOREIGN KEY ("_parent_id") REFERENCES "site_pages"("id") ON DELETE cascade
      );

      CREATE TABLE IF NOT EXISTS "_site_pages_v_version_hero_slides" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" integer PRIMARY KEY NOT NULL,
        "image_id" integer,
        "headline_line1" text DEFAULT 'Fotografie',
        "headline_line2" text,
        "lead" text,
        "primary_label" text DEFAULT 'Projekt anfragen',
        "primary_href" text DEFAULT '#anfrage',
        "secondary_label" text DEFAULT 'Arbeiten ansehen',
        "secondary_href" text DEFAULT '/portfolio.html',
        "_uuid" text,
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null,
        FOREIGN KEY ("_parent_id") REFERENCES "_site_pages_v"("id") ON DELETE cascade
      );

      CREATE INDEX IF NOT EXISTS "site_pages_hero_slides_order_idx" ON "site_pages_hero_slides" ("_order");
      CREATE INDEX IF NOT EXISTS "site_pages_hero_slides_parent_id_idx" ON "site_pages_hero_slides" ("_parent_id");
      CREATE INDEX IF NOT EXISTS "site_pages_hero_slides_image_idx" ON "site_pages_hero_slides" ("image_id");
      CREATE INDEX IF NOT EXISTS "_site_pages_v_version_hero_slides_order_idx" ON "_site_pages_v_version_hero_slides" ("_order");
      CREATE INDEX IF NOT EXISTS "_site_pages_v_version_hero_slides_parent_id_idx" ON "_site_pages_v_version_hero_slides" ("_parent_id");
      CREATE INDEX IF NOT EXISTS "_site_pages_v_version_hero_slides_image_idx" ON "_site_pages_v_version_hero_slides" ("image_id");
    `)

    if (!beforeHeroSlides) changes.push('site_pages_hero_slides')
    if (!beforeVersionHeroSlides) changes.push('_site_pages_v_version_hero_slides')

    changes.push(...ensureSectionTables(db, 'service_pages', 'service_pages', '_service_pages_v'))
    changes.push(...ensureSectionTables(db, 'local_seo_pages', 'local_seo_pages', '_local_seo_pages_v'))
  } finally {
    db.close()
  }

  return changes
}

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  if (process.env.PAYLOAD_DB !== 'sqlite') {
    throw new Error('sync-local-schema ist nur fuer PAYLOAD_DB=sqlite gedacht. Fuer Postgres bitte echte Payload-Migrationen verwenden.')
  }

  const repairedColumns = repairKnownLocalSQLiteDrift()
  process.env.PAYLOAD_DB_PUSH = 'false'

  const { default: config } = await import('../src/payload.config')
  payload = await getPayload({ config })

  if (repairedColumns.length > 0) {
    console.log(`Lokales SQLite-Schema repariert: ${repairedColumns.join(', ')}`)
  } else {
    console.log('Lokales SQLite-Schema brauchte keine bekannte Reparatur.')
  }
} catch (error) {
  printPayloadScriptError(error, 'Lokaler Payload Schema-Sync')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
