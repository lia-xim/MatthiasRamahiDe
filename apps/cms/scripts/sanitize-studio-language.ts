import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type DataRecord = Record<string, unknown>
type CollectionSlug =
  | 'site-pages'
  | 'service-pages'
  | 'local-seo-pages'
  | 'portfolio-projects'
  | 'portfolio-categories'
  | 'journal-posts'
  | 'media'

const collections: CollectionSlug[] = [
  'site-pages',
  'service-pages',
  'local-seo-pages',
  'portfolio-projects',
  'portfolio-categories',
  'journal-posts',
  'media',
]

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

const sanitizeStudioText = (value: string) =>
  value
    .replace(/\bim Studio\b/gi, 'vor Ort')
    .replace(/\bins Studio\b/gi, 'zum Shooting')
    .replace(/\bStudio-Shooting\b/gi, 'Shooting')
    .replace(/\bStudio Shooting\b/gi, 'Shooting')
    .replace(/\bStudiofotografie\b/gi, 'Fotografie')
    .replace(/\bFotostudio\b/gi, 'Fotograf')
    .replace(/\bStudio\b/gi, 'Fotograf')

function sanitizeValue(value: unknown): { changed: boolean; value: unknown } {
  if (typeof value === 'string') {
    const nextValue = sanitizeStudioText(value)
    return { changed: nextValue !== value, value: nextValue }
  }

  if (Array.isArray(value)) {
    let changed = false
    const nextValue = value.map((item) => {
      const result = sanitizeValue(item)
      changed ||= result.changed
      return result.value
    })
    return { changed, value: nextValue }
  }

  if (value && typeof value === 'object') {
    let changed = false
    const nextValue: DataRecord = {}
    for (const [key, item] of Object.entries(value as DataRecord)) {
      const result = sanitizeValue(item)
      changed ||= result.changed
      nextValue[key] = result.value
    }
    return { changed, value: nextValue }
  }

  return { changed: false, value }
}

function sanitizeFooter(value: DataRecord) {
  const result = sanitizeValue(value)
  const footer = result.value as DataRecord
  let changed = result.changed

  const aboutLink = footer.aboutLink as DataRecord | undefined
  if (aboutLink && typeof aboutLink.label === 'string' && /\bstudio\b/i.test(aboutLink.label)) {
    aboutLink.label = 'Ueber mich'
    changed = true
  }

  for (const column of Array.isArray(footer.columns) ? footer.columns : []) {
    if (!column || typeof column !== 'object') continue
    const current = column as DataRecord
    if (typeof current.label === 'string' && /\bstudio\b/i.test(current.label)) {
      current.label = 'Ueber mich'
      changed = true
    }
  }

  return { changed, value: footer }
}

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: CollectionSlug) {
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

  let globalUpdates = 0
  for (const globalSlug of ['navigation', 'footer', 'site-settings', 'global-ctas'] as const) {
    const globalDoc = (await cms.findGlobal({ slug: globalSlug, depth: 2, overrideAccess: true })) as unknown as DataRecord
    const result = globalSlug === 'footer' ? sanitizeFooter(globalDoc) : sanitizeValue(globalDoc)

    if (result.changed) {
      await cms.updateGlobal({
        slug: globalSlug,
        data: result.value as never,
        overrideAccess: true,
      })
      globalUpdates += 1
    }
  }

  let docUpdates = 0
  for (const collection of collections) {
    const docs = await findAll(cms, collection)
    for (const doc of docs) {
      const result = sanitizeValue(doc)
      if (!result.changed) continue

      await cms.update({
        collection: collection as never,
        id: doc.id as never,
        data: {
          ...(result.value as DataRecord),
          _status: doc._status,
        } as never,
        overrideAccess: true,
      })
      docUpdates += 1
    }
  }

  console.log(`Studio-Sprachreste: ${globalUpdates + docUpdates > 0 ? 'bereinigt' : 'keine gefunden'}.`)
  console.log(`Globals aktualisiert: ${globalUpdates}`)
  console.log(`Dokumente aktualisiert: ${docUpdates}`)
} catch (error) {
  printPayloadScriptError(error, 'Studio-Sprache bereinigen')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
