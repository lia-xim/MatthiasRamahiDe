import { imageDimensions, imageUrl, toAbsoluteSiteUrl, type PayloadDoc, type SiteSettings } from './payload'
import { reviews as customerReviews, reviewsAggregate } from './reviewsContent'

export type JsonLd = Record<string, unknown>

const defaultBusinessImage = '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp'
const defaultPersonImage = '/assets/optimized/matthias-ramahi-portrait-1440.webp'

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

export const isoDateTime = (value?: string | null): string | undefined => {
  if (!value) return undefined

  const normalized = value
    .trim()
    .replace(/^(\d{4}-\d{2}-\d{2})\s+/, '$1T')
    .replace(/([+-]\d{2})$/, '$1:00')
  const parsed = new Date(normalized)

  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

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
  image: toAbsoluteSiteUrl(defaultPersonImage),
  email: settings?.email,
  telephone: settings?.phone,
  sameAs: sameAsUrls(settings),
  jobTitle: 'Fotograf',
  worksFor: {
    '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Erkrath',
    addressRegion: 'NRW',
    addressCountry: 'DE',
  },
  knowsAbout: [
    'Automobilfotografie',
    'Sportwagenfotografie',
    'Oldtimerfotografie',
    'Motorradfotografie',
    'Portraitfotografie',
    'Fine-Art-Landschaftsfotografie',
  ],
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
  legalName: settings?.ownerName || 'Matthias Ramahi',
  url: toAbsoluteSiteUrl('/'),
  email: settings?.email,
  telephone: settings?.phone,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'project enquiries',
    email: settings?.email,
    telephone: settings?.phone,
    availableLanguage: ['de', 'en'],
  },
  image: imageUrl(settings?.defaultOgImage, 'hero') || toAbsoluteSiteUrl(defaultBusinessImage),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kempener Straße 44',
    postalCode: '40699',
    addressLocality: 'Erkrath',
    addressRegion: 'NRW',
    addressCountry: 'DE',
  },
  areaServed: ['Düsseldorf', 'Erkrath', 'Rheinland', 'Ruhrgebiet', 'NRW', 'Deutschland'],
  founder: {
    '@id': `${toAbsoluteSiteUrl('/')}#person`,
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Fotografie & Produktion',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automobilfotografie', url: toAbsoluteSiteUrl('/automobil-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sportwagenfotografie', url: toAbsoluteSiteUrl('/sportwagen-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oldtimerfotografie', url: toAbsoluteSiteUrl('/oldtimer-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Motorradfotografie', url: toAbsoluteSiteUrl('/motorrad-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Portraitfotografie', url: toAbsoluteSiteUrl('/portraitfotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Landschaftsfotografie & Fine-Art-Prints', url: toAbsoluteSiteUrl('/landschaftsfotografie.html') } },
    ],
  },
  priceRange: '$$',
  sameAs: sameAsUrls(settings),
})

// Echte Kundenrezensionen als Review/aggregateRating-Markup, an denselben
// #local-business-Knoten gehängt (Merge per @id, kein doppelter Entity).
// Nur ausgeben, wo das Widget auch sichtbar rendert (Google: Markup == sichtbar).
// Liefert null, solange keine echten Rezensionen gepflegt sind.
export const reviewsJsonLd = (settings?: SiteSettings | null): JsonLd | null => {
  if (!reviewsAggregate || customerReviews.length === 0) return null

  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
    name: settings?.siteName || 'Matthias Ramahi Fotografie',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviewsAggregate.ratingValue,
      reviewCount: reviewsAggregate.reviewCount,
      bestRating: reviewsAggregate.bestRating,
      worstRating: reviewsAggregate.worstRating,
    },
    review: customerReviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
    })),
  })
}

const clampedIsoDateTime = (value?: string | null): string | undefined => {
  const parsed = isoDateTime(value)
  if (!parsed) return undefined
  const now = new Date()
  return Date.parse(parsed) > now.getTime() ? now.toISOString() : parsed
}

const articleImageObject = (media?: PayloadDoc['coverImage']) => {
  const url = imageUrl(media, 'hero')
  if (!url) return undefined
  const dims = imageDimensions(media, 'hero')
  return {
    '@type': 'ImageObject',
    url: toAbsoluteSiteUrl(url),
    width: dims.width,
    height: dims.height,
  }
}

export const articleJsonLd = (doc: PayloadDoc, url: string): JsonLd => jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: doc.seo?.title || doc.title,
  description: doc.seo?.description || doc.excerpt,
  inLanguage: 'de-DE',
  image: articleImageObject(doc.seo?.ogImage || doc.coverImage),
  datePublished: clampedIsoDateTime(doc.publishedAt || doc.createdAt),
  dateModified: clampedIsoDateTime(doc.updatedAt || doc.publishedAt || doc.createdAt),
  articleSection: typeof doc.category === 'string' ? doc.category : undefined,
  keywords: Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags : undefined,
  author: {
    '@id': `${toAbsoluteSiteUrl('/')}#person`,
  },
  publisher: {
    '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': toAbsoluteSiteUrl(url),
  },
})

/** Einstiegspreis eines Shootings — Quelle der Wahrheit für Text und Markup. */
export const SHOOTING_ENTRY_PRICE_EUR = 250

/**
 * Der Preis wird nur ausgezeichnet, wo er auch sichtbar auf der Seite steht
 * (Google-Vorgabe: Markup und sichtbarer Inhalt müssen deckungsgleich sein).
 * Damit bleiben Druck-, Webdesign- und Werbetechnik-Seiten automatisch aussen vor.
 */
const statesEntryPrice = (doc: PayloadDoc): boolean =>
  [doc.localFaq, doc.faq].some(
    (list) => list?.some((entry) => entry.answer?.includes(`beginnt bei ${SHOOTING_ENTRY_PRICE_EUR} €`)) ?? false,
  )

export const serviceJsonLd = (doc: PayloadDoc, url: string): JsonLd => {
  const img = imageUrl(doc.seo?.ogImage || doc.heroImage || doc.coverImage, 'hero')
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${toAbsoluteSiteUrl(url)}#service`,
    name: doc.title,
    serviceType: doc.service || doc.serviceType || doc.targetKeyword || doc.title,
    description: doc.seo?.description || doc.intro,
    image: img ? toAbsoluteSiteUrl(img) : undefined,
    provider: {
      '@id': `${toAbsoluteSiteUrl('/')}#local-business`,
    },
    areaServed: doc.city || 'Düsseldorf / NRW',
    offers: statesEntryPrice(doc)
      ? {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: SHOOTING_ENTRY_PRICE_EUR,
          priceCurrency: 'EUR',
        },
        url: toAbsoluteSiteUrl(url),
      }
      : undefined,
    url: toAbsoluteSiteUrl(url),
  })
}

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
    author: {
      '@id': `${toAbsoluteSiteUrl('/')}#person`,
    },
    associatedMedia: images.map((item) => ({
      '@type': 'ImageObject',
      contentUrl: item.url,
      caption: item.caption,
      creator: {
        '@id': `${toAbsoluteSiteUrl('/')}#person`,
      },
      creditText: 'Matthias Ramahi',
      copyrightNotice: '© Matthias Ramahi',
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
