import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type DataRecord = Record<string, unknown>

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

const asRecord = (value: unknown): DataRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as DataRecord) : {}

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: 'portfolio-projects' | 'portfolio-categories') {
  const docs: DataRecord[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: collection as never,
      depth: 0,
      draft: true,
      limit: 100,
      overrideAccess: true,
      page,
    })
    docs.push(...(result.docs as DataRecord[]))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return docs
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  let updated = 0

  for (const collection of ['portfolio-categories', 'portfolio-projects'] as const) {
    for (const doc of await findAll(cms, collection)) {
      if (doc._status !== 'published') continue

      const legacy = asRecord(doc.legacy)
      await cms.update({
        collection: collection as never,
        id: doc.id as string | number,
        data: {
          legacy: {
            ...legacy,
            migrationStatus: 'reviewed',
            renderSource: 'structured-blocks',
          },
        } as never,
        overrideAccess: true,
      })
      updated += 1
    }
  }

  console.log(`Portfolio-Basis geprueft: ${updated} Dokumente auf reviewed/structured-blocks gesetzt.`)
} catch (error) {
  printPayloadScriptError(error, 'Portfolio Review Marker')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
