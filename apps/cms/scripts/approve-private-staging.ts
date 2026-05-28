import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'
import { reviewedMigrationStatuses, type ProductionCollectionSlug } from './lib/productionScope'

type DataRecord = Record<string, unknown>

type CollectionConfig = {
  required: string[]
  reviewGate: boolean
}

const collections: ProductionCollectionSlug[] = [
  'site-pages',
  'service-pages',
  'local-seo-pages',
  'portfolio-projects',
  'portfolio-categories',
  'journal-posts',
]

const collectionConfig: Record<ProductionCollectionSlug, CollectionConfig> = {
  'site-pages': {
    reviewGate: true,
    required: [
      'title',
      'slug',
      'pageType',
      'seo.title',
      'seo.description',
      'seo.canonicalUrl',
      'legacy.sourceFile',
      'legacy.renderSource',
      'legacy.renderedBodyHtml',
      'legacy.migrationStatus',
    ],
  },
  'service-pages': {
    reviewGate: true,
    required: [
      'title',
      'slug',
      'serviceType',
      'heroImage',
      'intro',
      'seo.title',
      'seo.description',
      'seo.canonicalUrl',
      'legacy.sourceFile',
      'legacy.renderSource',
      'legacy.renderedBodyHtml',
      'legacy.migrationStatus',
    ],
  },
  'local-seo-pages': {
    reviewGate: true,
    required: [
      'title',
      'slug',
      'city',
      'service',
      'intro',
      'seo.title',
      'seo.description',
      'seo.canonicalUrl',
      'legacy.sourceFile',
      'legacy.renderSource',
      'legacy.renderedBodyHtml',
      'legacy.migrationStatus',
    ],
  },
  'portfolio-projects': {
    reviewGate: true,
    required: [
      'title',
      'slug',
      'category',
      'coverImage',
      'excerpt',
      'gallery',
      'seo.title',
      'seo.description',
      'seo.canonicalUrl',
      'legacy.sourceFile',
      'legacy.migrationStatus',
    ],
  },
  'portfolio-categories': {
    reviewGate: true,
    required: ['title', 'slug', 'coverImage', 'intro', 'seo.title', 'seo.description'],
  },
  'journal-posts': {
    reviewGate: true,
    required: [
      'title',
      'slug',
      'category',
      'publishedAt',
      'coverImage',
      'excerpt',
      'seo.title',
      'seo.description',
      'seo.canonicalUrl',
      'legacy.sourceFile',
      'legacy.renderSource',
      'legacy.renderedBodyHtml',
      'legacy.migrationStatus',
    ],
  },
}

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
const only = process.argv.find((entry) => entry.startsWith('--collection='))?.slice(13) as ProductionCollectionSlug | undefined
const requestedStatus = process.argv.find((entry) => entry.startsWith('--status='))?.slice(9)
const targetMigrationStatus: (typeof reviewedMigrationStatuses)[number] = reviewedMigrationStatuses.includes(requestedStatus as never)
  ? (requestedStatus as (typeof reviewedMigrationStatuses)[number])
  : 'reviewed'

const selectedCollections = only ? collections.filter((collection) => collection === only) : collections

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

const labelFor = (collection: string, doc: DataRecord) =>
  `${collection}/${asString(doc.slug) || asString(doc.title) || String(doc.id || 'unknown')}`

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: ProductionCollectionSlug) {
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

  const updateDocument = (options: {
    collection: ProductionCollectionSlug
    id: string | number
    data: DataRecord
    overrideAccess: boolean
  }) => cms.update(options as never)

  console.log('Private Staging Approval')
  console.log('========================')
  console.log(write ? `Schreibe _status=published und migrationStatus=${targetMigrationStatus}.` : 'Dry run. Mit --write wirklich speichern.')
  console.log(`Collections: ${selectedCollections.join(', ')}`)

  let updated = 0
  let skipped = 0
  let blocked = 0

  for (const collection of selectedCollections) {
    const docs = await findAll(cms, collection)
    const rules = collectionConfig[collection]

    console.log('')
    console.log(`${collection}: ${docs.length} Dokumente`)

    for (const doc of docs) {
      const legacy = asRecord(doc.legacy)
      const seo = asRecord(doc.seo)
      const migrationStatus = asString(legacy.migrationStatus)
      const missing = rules.required.filter((field) => !hasValue(valueAtPath(doc, field)))
      const isReviewed = !rules.reviewGate || reviewedMigrationStatuses.includes(migrationStatus as never)
      const isPublished = doc._status === 'published'

      if (missing.length > 0) {
        blocked += 1
        console.log(`- BLOCK ${labelFor(collection, doc)}: Pflichtfelder fehlen: ${missing.join(', ')}`)
        continue
      }

      if (isPublished && isReviewed && seo.noIndex !== true) {
        skipped += 1
        continue
      }

      if (write) {
        await updateDocument({
          collection,
          id: doc.id as string | number,
          data: {
            _status: 'published',
            legacy: rules.reviewGate
              ? {
                  ...legacy,
                  migrationStatus: targetMigrationStatus,
                }
              : legacy,
            seo: {
              ...seo,
              noIndex: false,
            },
          },
          overrideAccess: true,
        })
      }

      updated += 1
      console.log(
        `- ${write ? 'UPDATED' : 'WOULD UPDATE'} ${labelFor(collection, doc)}: ${asString(doc._status) || 'none'}/${migrationStatus || 'none'} -> published/${targetMigrationStatus}`,
      )
    }
  }

  console.log('')
  console.log(`Aktualisiert: ${updated}`)
  console.log(`Uebersprungen: ${skipped}`)
  console.log(`Blockiert: ${blocked}`)

  if (blocked > 0) process.exitCode = 1
} catch (error) {
  printPayloadScriptError(error, 'Private Staging Approval')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
