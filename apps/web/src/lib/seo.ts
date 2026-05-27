import { imageUrl, toAbsoluteSiteUrl, type PayloadDoc, type SiteSettings } from './payload'

export type JsonLd = Record<string, unknown>

const defaultBusinessImage = '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp'

const compactJsonLd = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const items = value.map((item) => compactJsonLd(item)).filter((item) => item !== undefined)
    return items.length > 0 ? items : undefined
  }

  if (!value || typeof value !== 'object') {
    if (value === undefined || value === null || value === '') return undefined
    return value
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, item]) => [key, compactJsonLd(item)] as const)
    .filter(([, item]) => item !== undefined)

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

const jsonLd = (value: JsonLd): JsonLd => compactJsonLd(value) as JsonLd

const sameAsUrls = (settings?: SiteSettings | null) =>
  [settings?.instagramUrl].filter((url): url is string => {
    if (!url || !/^https?:\/\//i.test(url)) return false
    return !/^https:\/\/(?:www\.)?instagram\.com\/?$/i.test(url)
  })

export const personJsonLd = (settings?: SiteSettings | null): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${toAbsoluteSiteUrl('/')}#person`,
  name: settings?.ownerName || 'Matthias Ramahi',
  url: toAbsoluteSiteUrl('/'),
  email: settings?.email,
  telephone: settings?.phone,
  sameAs: sameAsUrls(settings),
  jobTitle: 'Fotograf',
})

export const webSiteJsonLd = (settings?: SiteSettings | null): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${toAbsoluteSiteUrl('/')}#website`,
  name: settings?.siteName || 'Matthias Ramahi Fotografie',
  url: toAbsoluteSiteUrl('/'),
  inLanguage: 'de-DE',
  publisher: {
    '@id': `${toAbsoluteSiteUrl('/')}#person`,
  },
})

export const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteSiteUrl(item.url),
  })),
})

export const localBusinessJsonLd = (settings?: SiteSettings | null): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
  name: settings?.siteName || 'Matthias Ramahi Fotografie',
  url: toAbsoluteSiteUrl('/'),
  email: settings?.email,
  telephone: settings?.phone,
  image: imageUrl(settings?.defaultOgImage, 'hero') || toAbsoluteSiteUrl(defaultBusinessImage),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Duesseldorf',
    addressRegion: 'NRW',
    addressCountry: 'DE',
  },
  areaServed: ['Duesseldorf', 'NRW', 'Deutschland'],
  founder: {
    '@id': `${toAbsoluteSiteUrl('/')}#person`,
  },
  priceRange: '$$',
  sameAs: sameAsUrls(settings),
})

export const articleJsonLd = (doc: PayloadDoc, url: string): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: doc.seo?.title || doc.title,
  description: doc.seo?.description || doc.excerpt,
  image: imageUrl(doc.seo?.ogImage || doc.coverImage, 'hero'),
  datePublished: doc.publishedAt,
  dateModified: doc.updatedAt,
  author: {
    '@id': `${toAbsoluteSiteUrl('/')}#person`,
  },
  publisher: {
    '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
  },
  mainEntityOfPage: toAbsoluteSiteUrl(url),
})

export const serviceJsonLd = (doc: PayloadDoc, url: string): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: doc.title,
  description: doc.seo?.description || doc.intro,
  provider: {
    '@type': 'LocalBusiness',
    '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
    name: 'Matthias Ramahi Fotografie',
  },
  areaServed: doc.city || 'Duesseldorf / NRW',
  url: toAbsoluteSiteUrl(url),
})

export const faqJsonLd = (items?: Array<{ question?: string; answer?: string }>): JsonLd | null => {
  const questions = (items ?? []).filter((item) => item.question && item.answer)
  if (questions.length === 0) return null

  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })
}

export const imageGalleryJsonLd = (
  items: Array<{ image?: unknown; caption?: string }> = [],
  options: { name: string; url: string },
): JsonLd | null => {
  const images = items
    .map((item) => ({
      url: imageUrl(item.image as Parameters<typeof imageUrl>[0], 'hero'),
      caption: item.caption,
    }))
    .filter((item) => item.url)

  if (images.length === 0) return null

  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${toAbsoluteSiteUrl(options.url)}#gallery`,
    name: options.name,
    url: toAbsoluteSiteUrl(options.url),
    associatedMedia: images.map((item) => ({
      '@type': 'ImageObject',
      contentUrl: item.url,
      caption: item.caption,
    })),
  })
}

export const itemListJsonLd = (
  items: Array<{ name?: string; url?: string }>,
  options: { name: string; url: string },
): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${toAbsoluteSiteUrl(options.url)}#item-list`,
  name: options.name,
  url: toAbsoluteSiteUrl(options.url),
  itemListElement: items
    .filter((item) => item.name && item.url)
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: toAbsoluteSiteUrl(item.url),
    })),
})
