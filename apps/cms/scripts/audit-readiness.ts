import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type CollectionSlug =
  | 'media'
  | 'site-pages'
  | 'service-pages'
  | 'local-seo-pages'
  | 'portfolio-categories'
  | 'portfolio-projects'
  | 'journal-posts'

type Rule = {
  path: string
  label: string
  publishOnly?: boolean
}

type CollectionAuditConfig = {
  label: string
  required: Rule[]
  reviewGate?: boolean
}

type AuditItem = {
  id: string | number
  label: string
  status: string
  migrationStatus: string
  missing: string[]
}

const collectionAudits: Record<CollectionSlug, CollectionAuditConfig> = {
  media: {
    label: 'Medien',
    reviewGate: false,
    required: [
      { path: 'title', label: 'Bildtitel' },
      { path: 'alt', label: 'Alt-Text' },
      { path: 'category', label: 'Kategorie' },
      { path: 'orientation', label: 'Ausrichtung' },
      { path: 'usagePurpose', label: 'Verwendungszweck' },
      { path: 'blurDataUrl', label: 'Blur/LQIP', publishOnly: true },
    ],
  },
  'site-pages': {
    label: 'Standardseiten',
    reviewGate: true,
    required: [
      { path: 'title', label: 'Titel' },
      { path: 'slug', label: 'Slug' },
      { path: 'pageType', label: 'Seitentyp' },
      { path: 'seo.title', label: 'SEO-Titel' },
      { path: 'seo.description', label: 'Meta-Beschreibung' },
      { path: 'seo.canonicalUrl', label: 'Canonical URL' },
      { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
      { path: 'legacy.renderSource', label: 'Render-Quelle' },
      { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
    ],
  },
  'service-pages': {
    label: 'Service-Seiten',
    reviewGate: true,
    required: [
      { path: 'title', label: 'Titel' },
      { path: 'slug', label: 'Slug' },
      { path: 'serviceType', label: 'Leistungstyp' },
      { path: 'heroImage', label: 'Hero-Bild' },
      { path: 'intro', label: 'Einleitung' },
      { path: 'seo.title', label: 'SEO-Titel' },
      { path: 'seo.description', label: 'Meta-Beschreibung' },
      { path: 'seo.canonicalUrl', label: 'Canonical URL' },
      { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
      { path: 'legacy.renderSource', label: 'Render-Quelle' },
      { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
    ],
  },
  'local-seo-pages': {
    label: 'Lokale SEO-Seiten',
    reviewGate: true,
    required: [
      { path: 'title', label: 'Titel' },
      { path: 'slug', label: 'Slug' },
      { path: 'city', label: 'Stadt / Region' },
      { path: 'service', label: 'Leistung' },
      { path: 'intro', label: 'Lokale Einleitung' },
      { path: 'seo.title', label: 'SEO-Titel' },
      { path: 'seo.description', label: 'Meta-Beschreibung' },
      { path: 'seo.canonicalUrl', label: 'Canonical URL' },
      { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
      { path: 'legacy.renderSource', label: 'Render-Quelle' },
      { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
    ],
  },
  'portfolio-categories': {
    label: 'Portfolio-Kategorien',
    reviewGate: true,
    required: [
      { path: 'title', label: 'Titel' },
      { path: 'slug', label: 'Slug' },
      { path: 'coverImage', label: 'Cover-Bild' },
      { path: 'intro', label: 'Kurzbeschreibung' },
      { path: 'seo.title', label: 'SEO-Titel' },
      { path: 'seo.description', label: 'Meta-Beschreibung' },
    ],
  },
  'portfolio-projects': {
    label: 'Portfolio-Projekte',
    reviewGate: true,
    required: [
      { path: 'title', label: 'Titel' },
      { path: 'slug', label: 'Slug' },
      { path: 'category', label: 'Kategorie' },
      { path: 'coverImage', label: 'Cover-Bild' },
      { path: 'excerpt', label: 'Kurztext' },
      { path: 'gallery', label: 'Bildstrecke' },
      { path: 'seo.title', label: 'SEO-Titel' },
      { path: 'seo.description', label: 'Meta-Beschreibung' },
      { path: 'seo.canonicalUrl', label: 'Canonical URL' },
      { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
      { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
    ],
  },
  'journal-posts': {
    label: 'Journal-Beitraege',
    reviewGate: true,
    required: [
      { path: 'title', label: 'Titel' },
      { path: 'slug', label: 'Slug' },
      { path: 'category', label: 'Kategorie' },
      { path: 'publishedAt', label: 'Veroeffentlichungsdatum' },
      { path: 'coverImage', label: 'Cover-Bild' },
      { path: 'excerpt', label: 'Kurztext' },
      { path: 'seo.title', label: 'SEO-Titel' },
      { path: 'seo.description', label: 'Meta-Beschreibung' },
      { path: 'seo.canonicalUrl', label: 'Canonical URL' },
      { path: 'legacy.sourceFile', label: 'Legacy-Datei' },
      { path: 'legacy.renderSource', label: 'Render-Quelle' },
      { path: 'legacy.migrationStatus', label: 'Migrationsstatus' },
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

const hasValue = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && typeof value !== 'undefined'
}

const valueAtPath = (data: Record<string, unknown>, dottedPath: string) =>
  dottedPath.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[segment]
  }, data)

const labelFor = (doc: Record<string, unknown>) =>
  String(doc.slug || doc.filename || doc.title || doc.id || 'unknown')

const increment = (counts: Map<string, number>, key: string) => {
  counts.set(key, (counts.get(key) || 0) + 1)
}

const isReviewedMigrationStatus = (status: string) =>
  status === 'reviewed' || status === 'componentized' || status === 'live'

const formatCounts = (counts: Map<string, number>) => {
  if (counts.size === 0) return '-'
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `${key}: ${count}`)
    .join(', ')
}

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: CollectionSlug) {
  const docs: Array<Record<string, unknown>> = []
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

    docs.push(...(result.docs as Array<Record<string, unknown>>))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return docs
}

const strict = process.argv.includes('--strict')
const releaseRenderSources = ['native-component', 'structured-blocks'] as const
let totalMissing = 0
let totalReleaseBlocked = 0
let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  console.log('CMS Content Readiness Audit')
  console.log('===========================')
  console.log('Hinweis: Dieses Audit schreibt nichts in die Datenbank. Es zeigt fehlende redaktionelle Pflichtfelder.')

  for (const [collection, auditConfig] of Object.entries(collectionAudits) as Array<[CollectionSlug, CollectionAuditConfig]>) {
    const docs = await findAll(cms, collection)
    const statusCounts = new Map<string, number>()
    const migrationCounts = new Map<string, number>()
    const renderSourceCounts = new Map<string, number>()
    const items: AuditItem[] = []
    const reviewOpen: AuditItem[] = []
    const productionReady: AuditItem[] = []

    for (const doc of docs) {
      const status = String(doc._status || 'none')
      const migrationStatus = String(valueAtPath(doc, 'legacy.migrationStatus') || 'none')
      const renderSource = String(valueAtPath(doc, 'legacy.renderSource') || 'none')
      increment(statusCounts, status)
      increment(migrationCounts, migrationStatus)
      increment(renderSourceCounts, renderSource)

      const missing = auditConfig.required
        .filter((rule) => !rule.publishOnly || status === 'published')
        .filter((rule) => !hasValue(valueAtPath(doc, rule.path)))
        .map((rule) => rule.label)

      if (missing.length > 0) {
        totalMissing += missing.length
        items.push({
          id: doc.id as string | number,
          label: labelFor(doc),
          status,
          migrationStatus,
          missing,
        })
      }

      const auditItem = {
        id: doc.id as string | number,
        label: labelFor(doc),
        status,
        migrationStatus,
        missing,
      }

      if (auditConfig.reviewGate && !isReviewedMigrationStatus(migrationStatus)) {
        reviewOpen.push(auditItem)
      }

      const isProductionReady =
        missing.length === 0 &&
        (collection === 'media' || status === 'published') &&
        (!auditConfig.reviewGate || isReviewedMigrationStatus(migrationStatus)) &&
        (collection === 'media' || !renderSource || releaseRenderSources.includes(renderSource as never))

      if (isProductionReady) productionReady.push(auditItem)
      else if (collection !== 'media' && renderSource && !releaseRenderSources.includes(renderSource as never)) totalReleaseBlocked += 1
    }

    const fieldCompleteDocs = docs.length - items.length
    const fieldReadiness = docs.length === 0 ? 100 : Math.round((fieldCompleteDocs / docs.length) * 100)
    const productionReadiness = docs.length === 0 ? 100 : Math.round((productionReady.length / docs.length) * 100)

    console.log('')
    console.log(`${auditConfig.label} (${collection})`)
    console.log(`- Dokumente: ${docs.length}`)
    console.log(`- Feld-vollstaendig: ${fieldCompleteDocs}/${docs.length} (${fieldReadiness}%)`)
    console.log(`- Produktionsbereit: ${productionReady.length}/${docs.length} (${productionReadiness}%)`)
    console.log(`- Status: ${formatCounts(statusCounts)}`)
    console.log(`- Migration: ${formatCounts(migrationCounts)}`)
    console.log(`- Render-Quelle: ${formatCounts(renderSourceCounts)}`)

    if (reviewOpen.length > 0) {
      console.log(`- Review/1:1-Abnahme offen: ${reviewOpen.length}`)
      console.log(`  Beispiele: ${reviewOpen.slice(0, 8).map((item) => item.label).join(', ')}`)
    }

    if (items.length > 0) {
      console.log('- Beispiele mit Luecken:')
      for (const item of items.slice(0, 12)) {
        console.log(`  - ${item.label} [${item.status}/${item.migrationStatus}]: ${item.missing.join(', ')}`)
      }
      if (items.length > 12) {
        console.log(`  - ... ${items.length - 12} weitere Dokumente`)
      }
    }
  }

  console.log('')
  console.log(`Gesamt fehlende Feldwerte: ${totalMissing}`)
  console.log(`Nicht release-faehige Render-Quellen: ${totalReleaseBlocked}`)
  if (strict && (totalMissing > 0 || totalReleaseBlocked > 0)) process.exitCode = 1
} catch (error) {
  printPayloadScriptError(error, 'CMS Content Readiness Audit')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
