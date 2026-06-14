import { resolveTinaMediaRef } from './tinaMedia'
import type { PayloadDoc } from './payload'

type RawDoc = Record<string, unknown>
type RawModules = Record<string, RawDoc>

type ListOptions = {
  draft?: boolean
  limit?: number
  sort?: string
}

const pageModules = import.meta.glob('../../content/pages/*.json', { eager: true, import: 'default' }) as RawModules
const servicePageModules = import.meta.glob('../../content/service-pages/*.json', { eager: true, import: 'default' }) as RawModules
const localSeoPageModules = import.meta.glob('../../content/local-seo-pages/*.json', { eager: true, import: 'default' }) as RawModules
const portfolioProjectModules = import.meta.glob('../../content/portfolio-projects/*.json', {
  eager: true,
  import: 'default',
}) as RawModules
const portfolioCategoryModules = import.meta.glob('../../content/portfolio-categories/*.json', {
  eager: true,
  import: 'default',
}) as RawModules
const journalPostModules = import.meta.glob('../../content/journal-posts/*.json', { eager: true, import: 'default' }) as RawModules

const siteSettingsModules = import.meta.glob('../../content/globals/site-settings/*.json', {
  eager: true,
  import: 'default',
}) as RawModules
const navigationModules = import.meta.glob('../../content/globals/navigation/*.json', {
  eager: true,
  import: 'default',
}) as RawModules
const globalCtasModules = import.meta.glob('../../content/globals/global-ctas/*.json', {
  eager: true,
  import: 'default',
}) as RawModules
const footerModules = import.meta.glob('../../content/globals/footer/*.json', { eager: true, import: 'default' }) as RawModules

const collectionModules: Record<string, RawModules> = {
  'site-pages': pageModules,
  pages: pageModules,
  'service-pages': servicePageModules,
  servicePages: servicePageModules,
  'local-seo-pages': localSeoPageModules,
  localSeoPages: localSeoPageModules,
  'portfolio-projects': portfolioProjectModules,
  portfolioProjects: portfolioProjectModules,
  'portfolio-categories': portfolioCategoryModules,
  portfolioCategories: portfolioCategoryModules,
  'journal-posts': journalPostModules,
  journalPosts: journalPostModules,
}

const globalModules: Record<string, RawModules> = {
  'site-settings': siteSettingsModules,
  siteSettings: siteSettingsModules,
  navigation: navigationModules,
  'global-ctas': globalCtasModules,
  globalCtas: globalCtasModules,
  footer: footerModules,
}

const imageFieldNames = new Set([
  'coverImage',
  'defaultOgImage',
  'fullImage',
  'heroImage',
  'image',
  'ogImage',
  'teaserImage',
])

function firstModuleValue(modules: RawModules) {
  return Object.values(modules)[0]
}

function isImageField(key: string) {
  return imageFieldNames.has(key) || /^image\d+$/i.test(key)
}

function resolveMediaValue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') return resolveTinaMediaRef(value) || value
  if (!value || typeof value !== 'object') return value

  const maybeMedia = resolveTinaMediaRef(value as never)
  return maybeMedia || normalizeValue(value)
}

function normalizeBlock(block: unknown) {
  const normalized = normalizeValue(block)
  if (!normalized || typeof normalized !== 'object' || Array.isArray(normalized)) return normalized

  const entry = normalized as RawDoc
  if (typeof entry._template === 'string' && !entry.blockType) {
    entry.blockType = entry._template
  }
  return entry
}

function normalizeValue(value: unknown, key = ''): unknown {
  if (Array.isArray(value)) return value.map((item) => normalizeValue(item, key))
  if (isImageField(key)) return resolveMediaValue(value)
  if (!value || typeof value !== 'object') return value

  const source = value as RawDoc
  const next: RawDoc = {}
  for (const [entryKey, entryValue] of Object.entries(source)) {
    if (entryKey === 'blocks' && Array.isArray(entryValue)) {
      next.blocks = entryValue.map(normalizeBlock)
      continue
    }
    next[entryKey] = normalizeValue(entryValue, entryKey)
  }
  return next
}

function moduleFilename(modulePath: string) {
  return modulePath.split('/').pop()?.replace(/\.json$/i, '') || ''
}

function moduleRelativePath(modulePath: string) {
  return modulePath.split('/').pop() || ''
}

function normalizeDoc(raw: RawDoc, collection: string, modulePath = ''): PayloadDoc {
  const doc = normalizeValue(raw) as PayloadDoc
  const payloadId = typeof raw.payloadId === 'string' || typeof raw.payloadId === 'number' ? String(raw.payloadId) : ''
  doc.id = payloadId || moduleFilename(modulePath) || doc.slug || collection

  if (typeof raw.status === 'string' && !doc._status) {
    doc._status = raw.status === 'draft' ? 'draft' : 'published'
  }

  if (collection === 'portfolio-projects' && typeof doc.category === 'string' && doc.category.startsWith('content/')) {
    const category = getTinaDocumentByReference(doc.category)
    doc.category = (category?.title || category?.slug || doc.category) as string
  }

  return doc
}

function documents(collection: string, options: ListOptions = {}) {
  const modules = collectionModules[collection]
  if (!modules) return []

  const docs = Object.entries(modules).map(([modulePath, raw]) => normalizeDoc(raw, canonicalCollection(collection), modulePath))
  const visibleDocs = options.draft ? docs : docs.filter((doc) => doc._status !== 'draft')
  return sortDocuments(visibleDocs, options.sort)
}

function canonicalCollection(collection: string) {
  if (collection === 'pages') return 'site-pages'
  if (collection === 'servicePages') return 'service-pages'
  if (collection === 'localSeoPages') return 'local-seo-pages'
  if (collection === 'portfolioProjects') return 'portfolio-projects'
  if (collection === 'portfolioCategories') return 'portfolio-categories'
  if (collection === 'journalPosts') return 'journal-posts'
  return collection
}

export function normalizeTinaDocument(raw: RawDoc, collection: string, modulePath = ''): PayloadDoc {
  return normalizeDoc(raw, canonicalCollection(collection), modulePath)
}

export function getTinaRelativePathBySlug(collection: string, slug: string, options: ListOptions = {}) {
  const modules = collectionModules[collection]
  if (!modules) return null

  const normalizedSlug = slug.replace(/\.html$/i, '')
  for (const [modulePath, raw] of Object.entries(modules)) {
    const doc = normalizeDoc(raw, canonicalCollection(collection), modulePath)
    if (doc._status === 'draft' && !options.draft) continue
    if (doc.slug === normalizedSlug || moduleFilename(modulePath) === normalizedSlug) return moduleRelativePath(modulePath)
  }

  return null
}

export function getTinaRelativePathByLegacyUrl(collection: string, legacyUrl: string, options: ListOptions = {}) {
  const modules = collectionModules[collection]
  if (!modules) return null

  const normalizedLegacyUrl = normalizeLegacyKey(legacyUrl)
  for (const [modulePath, raw] of Object.entries(modules)) {
    const doc = normalizeDoc(raw, canonicalCollection(collection), modulePath)
    if (doc._status === 'draft' && !options.draft) continue

    const candidates = [doc.seo?.legacyUrl, doc.legacy?.sourceFile, doc.legacy?.sourceUrl, doc.slug ? `${doc.slug}.html` : '']
    if (candidates.some((candidate) => normalizeLegacyKey(candidate) === normalizedLegacyUrl)) {
      return moduleRelativePath(modulePath)
    }
  }

  return null
}

function valueAtPath(doc: RawDoc, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as RawDoc)[key]
  }, doc)
}

function sortDocuments(docs: PayloadDoc[], sort?: string) {
  if (!sort) return docs

  const descending = sort.startsWith('-')
  const field = descending ? sort.slice(1) : sort
  const fallbackFields = ['updatedAt', 'createdAt', 'payloadId', 'id']
  const compareValues = (left: unknown, right: unknown) => {
    const leftValue = typeof left === 'string' || typeof left === 'number' ? left : ''
    const rightValue = typeof right === 'string' || typeof right === 'number' ? right : ''
    return String(leftValue).localeCompare(String(rightValue), 'de', { numeric: true })
  }

  return [...docs].sort((a, b) => {
    const left = valueAtPath(a as RawDoc, field)
    const right = valueAtPath(b as RawDoc, field)
    const compared = compareValues(left, right)
    if (compared !== 0) return descending ? -compared : compared

    for (const fallbackField of fallbackFields) {
      if (fallbackField === field) continue
      const fallbackCompared = compareValues(
        valueAtPath(a as RawDoc, fallbackField),
        valueAtPath(b as RawDoc, fallbackField),
      )
      if (fallbackCompared !== 0) return descending ? -fallbackCompared : fallbackCompared
    }

    return 0
  })
}

function normalizeLegacyKey(value?: string) {
  if (!value) return ''

  try {
    const parsed = new URL(value)
    return parsed.pathname.replace(/^\/+/, '')
  } catch {
    return value.replace(/^\/+/, '')
  }
}

function indexLegacyDoc(map: Map<string, PayloadDoc>, doc: PayloadDoc) {
  const candidates = [doc.seo?.legacyUrl, doc.legacy?.sourceFile, doc.legacy?.sourceUrl, doc.slug ? `${doc.slug}.html` : '']

  for (const candidate of candidates) {
    const key = normalizeLegacyKey(candidate)
    if (key && !map.has(key)) map.set(key, doc)
  }
}

function getTinaDocumentByReference(reference: string) {
  const normalized = reference.replaceAll('\\', '/')
  const match = normalized.match(/content\/([^/]+)\/([^/]+)\.json$/i)
  if (!match) return null

  const [, dir, filename] = match
  const collection = Object.keys(collectionModules).find((key) =>
    Object.keys(collectionModules[key]).some((modulePath) => modulePath.endsWith(`/${dir}/${filename}.json`)),
  )
  if (!collection) return null

  return documents(collection, { draft: true }).find((doc) => doc.slug === filename || doc.id === filename) || null
}

export function getTinaGlobal<T>(slug: string): T | null {
  const raw = firstModuleValue(globalModules[slug] || {})
  return raw ? (normalizeValue(raw) as T) : null
}

export function listTinaDocuments(collection: string, options: ListOptions = {}) {
  const docs = documents(collection, options)
  return typeof options.limit === 'number' && options.limit > 0 ? docs.slice(0, options.limit) : docs
}

export function getTinaBySlug(collection: string, slug: string, options: ListOptions = {}) {
  return documents(collection, options).find((doc) => doc.slug === slug) || null
}

export function getTinaByLegacyUrl(collection: string, legacyUrl: string, options: ListOptions = {}) {
  const index = getTinaLegacyUrlIndex(collection, options)
  return index.get(normalizeLegacyKey(legacyUrl)) || null
}

export function getTinaLegacyUrlIndex(collection: string, options: ListOptions = {}) {
  const map = new Map<string, PayloadDoc>()
  for (const doc of documents(collection, options)) indexLegacyDoc(map, doc)
  return map
}

export function getTinaSitePageByType(pageType: string, options: ListOptions = {}) {
  return documents('site-pages', options).find((doc) => doc.pageType === pageType) || null
}
