import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'
import { adoptedProductionPages, reviewedMigrationStatuses, type ProductionCollectionSlug } from './lib/productionScope'

type DataRecord = Record<string, unknown>
type Issue = { label: string; message: string; severity: 'error' | 'warn' }

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

const strict = process.argv.includes('--strict')

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
  `${collection}/${asString(doc.slug) || asString(doc.filename) || asString(doc.title) || String(doc.id || 'unknown')}`

const commonRequiredFields = [
  { path: 'title', label: 'Titel' },
  { path: 'slug', label: 'Slug' },
  { path: 'seo.title', label: 'SEO-Titel' },
  { path: 'seo.description', label: 'Meta-Beschreibung' },
  { path: 'seo.canonicalUrl', label: 'Canonical' },
  { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
  { path: 'legacy.renderSource', label: 'Render-Quelle' },
  { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
]

const collectionRequiredFields: Record<ProductionCollectionSlug, Array<{ path: string; label: string }>> = {
  'site-pages': [{ path: 'pageType', label: 'Seitentyp' }],
  'service-pages': [
    { path: 'serviceType', label: 'Leistungstyp' },
    { path: 'heroImage', label: 'Hero-Bild' },
    { path: 'intro', label: 'Intro' },
  ],
  'journal-posts': [
    { path: 'category', label: 'Kategorie' },
    { path: 'publishedAt', label: 'Veroeffentlichungsdatum' },
    { path: 'coverImage', label: 'Coverbild' },
    { path: 'excerpt', label: 'Kurztext' },
  ],
  'local-seo-pages': [
    { path: 'city', label: 'Stadt / Region' },
    { path: 'service', label: 'Leistung' },
    { path: 'intro', label: 'Lokale Einleitung' },
  ],
  'portfolio-projects': [
    { path: 'category', label: 'Kategorie' },
    { path: 'coverImage', label: 'Coverbild' },
    { path: 'excerpt', label: 'Kurztext' },
    { path: 'gallery', label: 'Bildstrecke' },
  ],
  'portfolio-categories': [
    { path: 'coverImage', label: 'Coverbild' },
    { path: 'intro', label: 'Kurzbeschreibung' },
  ],
}

const publishedReleaseFields: Record<ProductionCollectionSlug, Array<{ path: string; label: string }>> = {
  'site-pages': [...commonRequiredFields, ...collectionRequiredFields['site-pages']],
  'service-pages': [...commonRequiredFields, ...collectionRequiredFields['service-pages']],
  'local-seo-pages': [...commonRequiredFields, ...collectionRequiredFields['local-seo-pages']],
  'journal-posts': [...commonRequiredFields, ...collectionRequiredFields['journal-posts']],
  'portfolio-projects': [
    { path: 'title', label: 'Titel' },
    { path: 'slug', label: 'Slug' },
    { path: 'seo.title', label: 'SEO-Titel' },
    { path: 'seo.description', label: 'Meta-Beschreibung' },
    { path: 'seo.canonicalUrl', label: 'Canonical' },
    { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
    { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
    ...collectionRequiredFields['portfolio-projects'],
  ],
  'portfolio-categories': [
    { path: 'title', label: 'Titel' },
    { path: 'slug', label: 'Slug' },
    { path: 'seo.title', label: 'SEO-Titel' },
    { path: 'seo.description', label: 'Meta-Beschreibung' },
    ...collectionRequiredFields['portfolio-categories'],
  ],
}

const isReviewed = (value: unknown) => reviewedMigrationStatuses.includes(asString(value) as never)

const textForPolicyChecks = (doc: DataRecord) =>
  [
    doc.title,
    doc.intro,
    doc.excerpt,
    valueAtPath(doc, 'seo.title'),
    valueAtPath(doc, 'seo.description'),
    valueAtPath(doc, 'legacy.extractedText'),
  ]
    .map(asString)
    .filter(Boolean)
    .join('\n')

function collectStrings(value: unknown, values: string[] = []) {
  if (typeof value === 'string') {
    values.push(value)
    return values
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, values)
    return values
  }

  if (!value || typeof value !== 'object') return values

  for (const item of Object.values(value as DataRecord)) collectStrings(item, values)
  return values
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

async function findAll(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: ProductionCollectionSlug | 'media',
  depth = 0,
) {
  const docs: DataRecord[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: collection as never,
      depth,
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

function addMissingFieldIssues(issues: Issue[], label: string, doc: DataRecord, fields: Array<{ path: string; label: string }>) {
  const missing = fields.filter((field) => !hasValue(valueAtPath(doc, field.path)))
  if (missing.length > 0) {
    issues.push({
      severity: 'error',
      label,
      message: `Pflichtfelder fehlen: ${missing.map((field) => field.label).join(', ')}`,
    })
  }
}

function assertActivePage(issues: Issue[], page: (typeof adoptedProductionPages)[number], doc?: DataRecord) {
  const label = `${page.label} (${page.collection}/${page.slug})`
  if (!doc) {
    issues.push({ severity: 'error', label, message: 'Dokument fehlt in Payload.' })
    return
  }

  addMissingFieldIssues(issues, label, doc, [...commonRequiredFields, ...(collectionRequiredFields[page.collection] || [])])

  const legacy = asRecord(doc.legacy)
  const renderSource = asString(legacy.renderSource)
  const migrationStatus = asString(legacy.migrationStatus)
  const sourceFile = asString(legacy.sourceFile)

  if (doc._status !== 'published') {
    issues.push({ severity: 'error', label, message: `Dokument ist nicht published (Status: ${asString(doc._status) || 'none'}).` })
  }

  if (sourceFile !== page.sourceFile) {
    issues.push({ severity: 'error', label, message: `Legacy-Datei passt nicht: erwartet ${page.sourceFile}, gefunden ${sourceFile || 'none'}.` })
  }

  if (!isReviewed(migrationStatus)) {
    issues.push({ severity: 'error', label, message: `Migrationsstatus ist noch nicht abgenommen: ${migrationStatus || 'none'}.` })
  }

  if (renderSource === 'payload-legacy-html' && !hasValue(legacy.renderedBodyHtml)) {
    issues.push({ severity: 'error', label, message: 'Render-Quelle ist Payload Legacy HTML, aber renderedBodyHtml fehlt.' })
  }

  if (renderSource === 'structured-blocks' && !hasValue(doc.blocks)) {
    issues.push({ severity: 'error', label, message: 'Render-Quelle ist structured-blocks, aber blocks fehlen.' })
  }

  if (!['payload-legacy-html', 'structured-blocks'].includes(renderSource)) {
    issues.push({ severity: 'error', label, message: `Render-Quelle ist fuer aktive Seiten nicht release-faehig: ${renderSource || 'none'}.` })
  }

  if (/\bstudio\b/i.test(textForPolicyChecks(doc))) {
    issues.push({ severity: 'error', label, message: 'Text enthaelt noch "Studio", obwohl kein Studio kommuniziert werden soll.' })
  }

  if (/[ÃÂ]|â€/.test(textForPolicyChecks(doc))) {
    issues.push({ severity: 'warn', label, message: 'Moeglicher Encoding-Artefakt in sichtbaren CMS-Texten gefunden.' })
  }
}

function assertMediaLibrary(issues: Issue[], docs: DataRecord[]) {
  for (const doc of docs) {
    const label = labelFor('media', doc)
    for (const field of ['title', 'alt', 'category', 'usagePurpose']) {
      if (!hasValue(doc[field])) issues.push({ severity: 'error', label, message: `Medien-Pflichtfeld fehlt: ${field}.` })
    }
    if (!hasValue(doc.orientation)) {
      issues.push({ severity: 'warn', label, message: 'Ausrichtung fehlt; Focal/Crop-Entscheidungen werden dadurch unschaerfer.' })
    }
    if (!hasValue(doc.blurDataUrl)) {
      issues.push({ severity: 'warn', label, message: 'Blur/LQIP fehlt fuer performante Platzhalter.' })
    }
  }
}

function assertLocalSeoDraftGate(issues: Issue[], docs: DataRecord[]) {
  const publishedUnreviewed = docs.filter((doc) => doc._status === 'published' && !isReviewed(valueAtPath(doc, 'legacy.migrationStatus')))

  for (const doc of publishedUnreviewed.slice(0, 20)) {
    issues.push({
      severity: 'error',
      label: labelFor('local-seo-pages', doc),
      message: 'Lokale SEO-Seite ist published, aber noch nicht reviewed/componentized/live.',
    })
  }

  if (publishedUnreviewed.length > 20) {
    issues.push({
      severity: 'error',
      label: 'local-seo-pages',
      message: `${publishedUnreviewed.length - 20} weitere published Local-SEO-Seiten ohne Review.`,
    })
  }
}

function assertPublishedDocs(
  issues: Issue[],
  collection: ProductionCollectionSlug,
  docs: DataRecord[],
  activeKeys: Set<string>,
) {
  for (const doc of docs) {
    if (doc._status !== 'published') continue

    const key = `${collection}:${asString(doc.slug)}`
    if (activeKeys.has(key)) continue

    const label = labelFor(collection, doc)
    addMissingFieldIssues(issues, label, doc, publishedReleaseFields[collection])

    const legacy = asRecord(doc.legacy)
    const renderSource = asString(legacy.renderSource)
    const migrationStatus = asString(legacy.migrationStatus)

    if (publishedReleaseFields[collection].some((field) => field.path === 'legacy.migrationStatus') && !isReviewed(migrationStatus)) {
      issues.push({ severity: 'error', label, message: `Migrationsstatus ist published, aber nicht review-freigegeben: ${migrationStatus || 'none'}.` })
    }

    if (renderSource === 'payload-legacy-html' && !hasValue(legacy.renderedBodyHtml)) {
      issues.push({ severity: 'error', label, message: 'Render-Quelle ist Payload Legacy HTML, aber renderedBodyHtml fehlt.' })
    }

    if (renderSource && !['payload-legacy-html', 'structured-blocks'].includes(renderSource)) {
      issues.push({ severity: 'error', label, message: `Render-Quelle ist fuer published Content nicht release-faehig: ${renderSource}.` })
    }

    if (/\bstudio\b/i.test(textForPolicyChecks(doc))) {
      issues.push({ severity: 'error', label, message: 'Text enthaelt noch "Studio", obwohl kein Studio kommuniziert werden soll.' })
    }

    if (/[ÃƒÃ‚]|Ã¢â‚¬/.test(textForPolicyChecks(doc))) {
      issues.push({ severity: 'warn', label, message: 'Moeglicher Encoding-Artefakt in sichtbaren CMS-Texten gefunden.' })
    }
  }
}

async function assertGlobalPolicyChecks(payload: Awaited<ReturnType<typeof getPayload>>, issues: Issue[]) {
  for (const globalSlug of ['navigation', 'footer', 'site-settings', 'global-ctas'] as const) {
    const doc = (await payload.findGlobal({ slug: globalSlug, depth: 2, overrideAccess: true })) as unknown as DataRecord
    const text = collectStrings(doc).join('\n')
    if (/\bstudio\b/i.test(text)) {
      issues.push({
        severity: 'error',
        label: `global/${globalSlug}`,
        message: 'Globaler CMS-Text enthaelt noch "Studio", obwohl kein Studio kommuniziert werden soll.',
      })
    }
  }
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const issues: Issue[] = []
  const activeDocs = []

  for (const page of adoptedProductionPages) {
    const doc = await findBySlug(cms, page.collection, page.slug)
    activeDocs.push({ page, doc })
    assertActivePage(issues, page, doc)
  }

  const activeKeys = new Set(adoptedProductionPages.map((page) => `${page.collection}:${page.slug}`))
  const [mediaDocs, localSeoDocs] = await Promise.all([findAll(cms, 'media'), findAll(cms, 'local-seo-pages')])
  const publishedCollectionDocs = new Map<ProductionCollectionSlug, DataRecord[]>()
  for (const collection of [
    'site-pages',
    'service-pages',
    'local-seo-pages',
    'portfolio-projects',
    'portfolio-categories',
    'journal-posts',
  ] as ProductionCollectionSlug[]) {
    const docs = collection === 'local-seo-pages' ? localSeoDocs : await findAll(cms, collection)
    publishedCollectionDocs.set(collection, docs)
    assertPublishedDocs(issues, collection, docs, activeKeys)
  }

  assertMediaLibrary(issues, mediaDocs)
  assertLocalSeoDraftGate(issues, localSeoDocs)
  await assertGlobalPolicyChecks(cms, issues)

  const errors = issues.filter((issue) => issue.severity === 'error')
  const warnings = issues.filter((issue) => issue.severity === 'warn')
  const reviewedActiveDocs = activeDocs.filter(({ doc }) => doc && doc._status === 'published' && isReviewed(valueAtPath(doc, 'legacy.migrationStatus')))
  const localSeoPublished = localSeoDocs.filter((doc) => doc._status === 'published').length
  const publishedReleaseDocs = Array.from(publishedCollectionDocs.values())
    .flat()
    .filter((doc) => doc._status === 'published').length

  console.log('CMS Production Release Audit')
  console.log('============================')
  console.log(`Aktive Produktionsseiten: ${reviewedActiveDocs.length}/${adoptedProductionPages.length}`)
  console.log(`Published Release-Dokumente: ${publishedReleaseDocs}`)
  console.log(`Medien: ${mediaDocs.length}`)
  console.log(`Lokale SEO-Seiten published: ${localSeoPublished}/${localSeoDocs.length}`)
  console.log(`Errors: ${errors.length}`)
  console.log(`Warnings: ${warnings.length}`)

  for (const issue of issues.slice(0, 120)) {
    console.log(`- [${issue.severity.toUpperCase()}] ${issue.label}: ${issue.message}`)
  }
  if (issues.length > 120) console.log(`- ... ${issues.length - 120} weitere Hinweise`)

  if (strict && errors.length > 0) process.exitCode = 1
} catch (error) {
  printPayloadScriptError(error, 'CMS Production Release Audit')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
