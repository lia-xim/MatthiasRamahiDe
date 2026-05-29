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
