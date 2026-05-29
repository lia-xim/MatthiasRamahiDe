import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'
import { adoptedProductionPages, reviewedMigrationStatuses, type ProductionCollectionSlug } from './lib/productionScope'

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

const hasFlag = (name: string) => process.argv.includes(`--${name}`)
const write = hasFlag('write')
const requestedStatus = process.argv.find((entry) => entry.startsWith('--status='))?.slice(9)
const targetStatus: (typeof reviewedMigrationStatuses)[number] = reviewedMigrationStatuses.includes(requestedStatus as never)
  ? (requestedStatus as (typeof reviewedMigrationStatuses)[number])
  : 'reviewed'
const targetRenderSource = 'native-component'

const asRecord = (value: unknown): DataRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as DataRecord) : {}

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const hasValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && typeof value !== 'undefined'
}

const valueAtPath = (data: DataRecord, dottedPath: string) =>
  dottedPath.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as DataRecord)[segment]
  }, data)

const requiredCommonFields = ['title', 'slug', 'seo.title', 'seo.description', 'seo.canonicalUrl', 'legacy.sourceFile', 'legacy.renderSource']

const collectionRequiredFields: Record<ProductionCollectionSlug, string[]> = {
  'site-pages': ['pageType'],
  'service-pages': ['serviceType', 'heroImage', 'intro'],
  'journal-posts': ['category', 'publishedAt', 'coverImage', 'excerpt'],
  'local-seo-pages': ['city', 'service', 'intro'],
  'portfolio-projects': ['category', 'coverImage', 'excerpt', 'gallery'],
  'portfolio-categories': ['coverImage', 'intro'],
}

async function findBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: ProductionCollectionSlug,
  slug: string,
) {
  const result = await payload.find({
    collection: collection as never,
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    } as never,
  })

  return result.docs[0] as DataRecord | undefined
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const updateDocument = (options: {
    collection: ProductionCollectionSlug
    id: string | number
    data: DataRecord
    overrideAccess: boolean
  }) => cms.update(options as never)

  console.log('Adopted Production Review Marker')
  console.log('================================')
  console.log(
    write
      ? `Schreibe Status "${targetStatus}" und Render-Quelle "${targetRenderSource}".`
      : 'Dry run. Mit --write wirklich speichern.',
  )

  let updated = 0
  let skipped = 0
  let blocked = 0

  for (const page of adoptedProductionPages) {
    const doc = await findBySlug(cms, page.collection, page.slug)

    if (!doc) {
      blocked += 1
      console.log(`- BLOCK ${page.label}: Dokument fehlt (${page.collection}/${page.slug}).`)
      continue
    }

    const legacy = asRecord(doc.legacy)
    const missing = [...requiredCommonFields, ...(collectionRequiredFields[page.collection] || [])].filter(
      (field) => !hasValue(valueAtPath(doc, field)),
    )
    const sourceFile = asString(legacy.sourceFile)
    const renderSource = asString(legacy.renderSource)

    if (doc._status !== 'published' || missing.length > 0 || sourceFile !== page.sourceFile || !renderSource) {
      blocked += 1
      console.log(
        `- BLOCK ${page.label}: status=${asString(doc._status) || 'none'}, source=${sourceFile || 'none'}, missing=${missing.join(', ') || '-'}`,
      )
      continue
    }

    const currentStatus = asString(legacy.migrationStatus)
    if (reviewedMigrationStatuses.includes(currentStatus as never) && renderSource === targetRenderSource) {
      skipped += 1
      console.log(`- OK ${page.label}: bereits ${currentStatus}/${targetRenderSource}.`)
      continue
    }

    if (currentStatus && currentStatus !== 'seeded' && !reviewedMigrationStatuses.includes(currentStatus as never)) {
      skipped += 1
      console.log(`- SKIP ${page.label}: unbekannter bestehender Status "${currentStatus}" bleibt unangetastet.`)
      continue
    }

    if (write) {
      await updateDocument({
        collection: page.collection,
        id: doc.id as string | number,
        data: {
          legacy: {
            ...legacy,
            migrationStatus: targetStatus,
            renderSource: targetRenderSource,
          },
        },
        overrideAccess: true,
      })
    }

    updated += 1
    console.log(
      `- ${write ? 'UPDATED' : 'WOULD UPDATE'} ${page.label}: ${currentStatus || 'none'}/${renderSource || 'none'} -> ${targetStatus}/${targetRenderSource}.`,
    )
  }

  console.log('')
  console.log(`Aktualisiert: ${updated}`)
  console.log(`Uebersprungen: ${skipped}`)
  console.log(`Blockiert: ${blocked}`)

  if (blocked > 0) process.exitCode = 1
} catch (error) {
  printPayloadScriptError(error, 'Adopted Production Review Marker')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
