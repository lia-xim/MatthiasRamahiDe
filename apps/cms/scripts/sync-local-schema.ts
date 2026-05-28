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
