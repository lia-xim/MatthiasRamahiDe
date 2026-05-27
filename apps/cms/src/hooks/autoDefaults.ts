import type { CollectionBeforeValidateHook } from 'payload'

import { formatSlug } from '../fields/slug'

type DataRecord = Record<string, unknown>

type AutoDefaultsOptions = {
  collection:
    | 'journal-posts'
    | 'local-seo-pages'
    | 'portfolio-categories'
    | 'portfolio-projects'
    | 'service-pages'
    | 'site-pages'
  descriptionFields?: string[]
  imageFields?: string[]
}

const siteTitleSuffix = ' | Matthias Ramahi'

const asRecord = (value: unknown): DataRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as DataRecord) : {}

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const hasValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && typeof value !== 'undefined'
}

const getAtPath = (data: DataRecord, path: string) =>
  path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as DataRecord)[segment]
  }, data)

const cleanText = (value: unknown) =>
  asString(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const clampText = (value: string, maxLength: number) => {
  const cleaned = cleanText(value)
  if (cleaned.length <= maxLength) return cleaned
  const clipped = cleaned.slice(0, maxLength - 1)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${(lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped).trim()}...`
}

const richTextToPlainText = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''

  const node = value as { text?: unknown; children?: unknown[]; root?: unknown }
  const ownText = asString(node.text)
  const children = Array.isArray(node.children) ? node.children.map(richTextToPlainText).join(' ') : ''
  const root = node.root ? richTextToPlainText(node.root) : ''

  return [ownText, children, root].filter(Boolean).join(' ')
}

const blocksToPlainText = (blocks: unknown) => {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      const current = asRecord(block)
      return [
        current.eyebrow,
        current.headline,
        current.quote,
        current.text,
        current.body ? richTextToPlainText(current.body) : '',
        Array.isArray(current.items)
          ? current.items.map((item) => Object.values(asRecord(item)).map(cleanText).join(' ')).join(' ')
          : '',
      ]
        .map(cleanText)
        .filter(Boolean)
        .join(' ')
    })
    .filter(Boolean)
    .join(' ')
}

const firstDescription = (merged: DataRecord, fields: string[]) => {
  for (const field of fields) {
    const value = cleanText(getAtPath(merged, field))
    if (value) return value
  }

  return cleanText(blocksToPlainText(merged.blocks) || getAtPath(merged, 'legacy.extractedText') || merged.title)
}

const titleForSeo = (title: string) => {
  const withSuffix = `${title}${siteTitleSuffix}`
  if (withSuffix.length <= 70) return withSuffix
  if (title.length <= 70) return title
  return clampText(title, 70)
}

const relationCandidate = (value: unknown) => {
  if (!hasValue(value)) return undefined
  if (value && typeof value === 'object') {
    const record = value as DataRecord
    return record.id || record.value || value
  }
  return value
}

const firstGalleryImage = (gallery: unknown) => {
  if (!Array.isArray(gallery)) return undefined
  for (const item of gallery) {
    const image = relationCandidate(asRecord(item).image)
    if (image) return image
  }
  return undefined
}

const legacyCanonical = (merged: DataRecord) => {
  const legacy = asRecord(merged.legacy)
  const legacyUrl = asString(asRecord(merged.seo).legacyUrl) || asString(legacy.sourceUrl) || asString(legacy.sourceFile)
  if (!legacyUrl) return ''
  if (/^https?:\/\//i.test(legacyUrl)) return legacyUrl
  return legacyUrl.startsWith('/') ? legacyUrl : `/${legacyUrl}`
}

const routeForCollection = (collection: AutoDefaultsOptions['collection'], merged: DataRecord) => {
  const slug = asString(merged.slug) || formatSlug(merged.title)
  if (!slug) return ''

  if (collection === 'site-pages') return slug === 'home' || merged.pageType === 'home' ? '/' : `/${slug}`
  if (collection === 'portfolio-projects') return `/portfolio/${slug}`
  if (collection === 'journal-posts') return `/journal/${slug}`
  if (collection === 'portfolio-categories') return '/portfolio'
  return `/${slug}`
}

const inferServiceType = (merged: DataRecord) => {
  const haystack = `${asString(merged.serviceType)} ${asString(merged.title)} ${asString(merged.slug)}`.toLowerCase()
  if (haystack.includes('sportwagen')) return 'sportwagen'
  if (haystack.includes('oldtimer') || haystack.includes('youngtimer')) return 'oldtimer'
  if (haystack.includes('motorrad') || haystack.includes('bike')) return 'motorrad'
  if (haystack.includes('portrait') || haystack.includes('headshot') || haystack.includes('business')) return 'portrait'
  if (haystack.includes('landschaft') || haystack.includes('print')) return 'landschaft'
  if (haystack.includes('fotolabor')) return 'fotolabor'
  if (haystack.includes('grossformat')) return 'grossformatdruck'
  if (haystack.includes('werbetechnik')) return 'werbetechnik'
  if (haystack.includes('webdesign') || haystack.includes('seo')) return 'webdesign-seo'
  if (haystack.includes('video')) return 'videografie'
  if (haystack.includes('auto') || haystack.includes('fahrzeug')) return 'automotive'
  return 'other'
}

const estimateReadingTime = (merged: DataRecord) => {
  const text = [
    merged.title,
    merged.excerpt,
    merged.intro,
    blocksToPlainText(merged.blocks),
    getAtPath(merged, 'legacy.extractedText'),
  ]
    .map(cleanText)
    .filter(Boolean)
    .join(' ')

  if (!text) return undefined
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export const applyEditorialDefaults =
  (options: AutoDefaultsOptions): CollectionBeforeValidateHook =>
  ({ data, originalDoc }) => {
    const incoming = asRecord(data)
    const original = asRecord(originalDoc)
    const originalSeo = asRecord(original.seo)
    const incomingSeo = asRecord(incoming.seo)
    const originalLegacy = asRecord(original.legacy)
    const incomingLegacy = asRecord(incoming.legacy)

    const merged: DataRecord = {
      ...original,
      ...incoming,
      seo: { ...originalSeo, ...incomingSeo },
      legacy: { ...originalLegacy, ...incomingLegacy },
    }
    const next: DataRecord = { ...incoming }
    const seo: DataRecord = { ...asRecord(merged.seo) }

    const title = cleanText(merged.title)
    if (!hasValue(seo.title) && title) seo.title = titleForSeo(title)

    if (!hasValue(seo.description)) {
      const description = firstDescription(merged, options.descriptionFields || ['excerpt', 'intro'])
      if (description) seo.description = clampText(description, 168)
    }

    if (!hasValue(seo.canonicalUrl)) {
      const canonical = legacyCanonical(merged) || routeForCollection(options.collection, merged)
      if (canonical) seo.canonicalUrl = canonical
    }

    const imageFields = options.imageFields || ['coverImage', 'heroImage', 'teaserImage']
    const primaryImage =
      imageFields.map((field) => relationCandidate(merged[field])).find(Boolean) || firstGalleryImage(merged.gallery)

    if (!hasValue(seo.ogImage) && primaryImage) seo.ogImage = primaryImage

    if (!hasValue(merged.teaserImage) && primaryImage && imageFields.includes('teaserImage')) {
      next.teaserImage = primaryImage
      merged.teaserImage = primaryImage
    }

    if (Object.keys(seo).length > 0) next.seo = seo

    if (options.collection === 'journal-posts') {
      if (!hasValue(merged.publishedAt)) next.publishedAt = new Date().toISOString()
      if (!hasValue(merged.readingTime)) {
        const readingTime = estimateReadingTime(merged)
        if (readingTime) next.readingTime = readingTime
      }
    }

    if (options.collection === 'portfolio-projects' && !hasValue(merged.publishedAt) && merged._status === 'published') {
      next.publishedAt = new Date().toISOString()
    }

    if (options.collection === 'service-pages' && !hasValue(merged.serviceType)) {
      next.serviceType = inferServiceType(merged)
    }

    if (options.collection === 'local-seo-pages') {
      const city = cleanText(merged.city)
      const service = cleanText(merged.service)
      if (!hasValue(merged.targetKeyword) && city && service) next.targetKeyword = `${service} ${city}`
    }

    return next
  }
