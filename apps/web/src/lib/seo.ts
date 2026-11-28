import siteChromeContent from '../data/siteChromeContent'
import { imageDimensions, imageUrl, toAbsoluteSiteUrl, type PayloadDoc, type SiteSettings } from './payload'
import { googleReviewUrl, reviews as customerReviews, reviewsAggregate } from './reviewsContent'

export type JsonLd = Record<string, unknown>

const defaultBusinessImage = '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp'
const defaultPersonImage = '/assets/optimized/matthias-ramahi-portrait-1440.webp'

export const toCanonicalSiteUrl = (pathOrUrl?: string): string => {
  const absolute = toAbsoluteSiteUrl(pathOrUrl)
  try {
    const parsed = new URL(absolute)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return absolute.split('#')[0].split('?')[0]
  }
}

const areaServedDisplayNames: Record<string, string> = {
  aachen: 'Aachen',
  bergischesland: 'Bergisches Land',
  'bergisches-land': 'Bergisches Land',
  bochum: 'Bochum',
  bonn: 'Bonn',
  bottrop: 'Bottrop',
  deutschland: 'Deutschland',
  dormagen: 'Dormagen',
  dortmund: 'Dortmund',
  duesseldorf: 'Düsseldorf',
  düsseldorf: 'Düsseldorf',
  duisburg: 'Duisburg',
  erkrath: 'Erkrath',
  essen: 'Essen',
  gelsenkirchen: 'Gelsenkirchen',
  haan: 'Haan',
  hagen: 'Hagen',
  hamm: 'Hamm',
  herne: 'Herne',
  hilden: 'Hilden',
  koeln: 'Köln',
  köln: 'Köln',
  krefeld: 'Krefeld',
  langenfeld: 'Langenfeld',
  leverkusen: 'Leverkusen',
  meerbusch: 'Meerbusch',
  mettmann: 'Mettmann',
  moenchengladbach: 'Mönchengladbach',
  mönchengladbach: 'Mönchengladbach',
  monheim: 'Monheim am Rhein',
  'monheim-am-rhein': 'Monheim am Rhein',
  muelheim: 'Mülheim an der Ruhr',
  'muelheim-an-der-ruhr': 'Mülheim an der Ruhr',
  muenster: 'Münster',
  münster: 'Münster',
  neuss: 'Neuss',
  nrw: 'Nordrhein-Westfalen',
  'nordrhein-westfalen': 'Nordrhein-Westfalen',
  oberhausen: 'Oberhausen',
  ratingen: 'Ratingen',
  recklinghausen: 'Recklinghausen',
  remscheid: 'Remscheid',
  rheinland: 'Rheinland',
  ruhrgebiet: 'Ruhrgebiet',
  solingen: 'Solingen',
  velbert: 'Velbert',
  wuppertal: 'Wuppertal',
}

export const normalizeAreaServed = (value?: string | null): string => {
  const trimmed = value?.trim()
  if (!trimmed) return 'Düsseldorf / NRW'
  const key = trimmed.toLocaleLowerCase('de-DE').replace(/\s+/g, '-')
  if (areaServedDisplayNames[key]) return areaServedDisplayNames[key]
  if (trimmed === trimmed.toLocaleLowerCase('de-DE')) {
    return trimmed
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toLocaleUpperCase('de-DE') + part.slice(1))
      .join(' ')
  }
  return trimmed
}

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

const sameAsUrls = (settings?: SiteSettings | null) => {
  const candidates = [
    settings?.instagramUrl || siteChromeContent.siteSettings.instagramUrl,
    googleReviewUrl,
  ]
  const unique = new Set<string>()
  for (const url of candidates) {
    if (!url || !/^https?:\/\//i.test(url)) continue
    if (/^https:\/\/(?:www\.)?instagram\.com\/?$/i.test(url)) continue
    unique.add(url)
  }
  return Array.from(unique)
}

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
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${toCanonicalSiteUrl('/')}#local-business`,
  name: settings?.siteName || 'Matthias Ramahi Fotografie',
  legalName: settings?.ownerName || 'Matthias Ramahi',
  url: toCanonicalSiteUrl('/'),
  email: settings?.email || siteChromeContent.siteSettings.email,
  telephone: settings?.phone || siteChromeContent.siteSettings.phone,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'project enquiries',
    email: settings?.email || siteChromeContent.siteSettings.email,
    telephone: settings?.phone || siteChromeContent.siteSettings.phone,
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
  areaServed: [
    { '@type': 'City', name: 'Düsseldorf' },
    { '@type': 'City', name: 'Erkrath' },
    { '@type': 'AdministrativeArea', name: 'Rheinland' },
    { '@type': 'AdministrativeArea', name: 'Ruhrgebiet' },
    { '@type': 'AdministrativeArea', name: 'Nordrhein-Westfalen' },
    { '@type': 'Country', name: 'Deutschland' },
  ],
  founder: {
    '@id': `${toCanonicalSiteUrl('/')}#person`,
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Fotografie & Produktion',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automobilfotografie', url: toCanonicalSiteUrl('/automobil-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sportwagenfotografie', url: toCanonicalSiteUrl('/sportwagen-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oldtimerfotografie', url: toCanonicalSiteUrl('/oldtimer-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Motorradfotografie', url: toCanonicalSiteUrl('/motorrad-fotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Portraitfotografie', url: toCanonicalSiteUrl('/portraitfotografie.html') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Landschaftsfotografie & Fine-Art-Prints', url: toCanonicalSiteUrl('/landschaftsfotografie.html') } },
    ],
  },
  priceRange: '€€ (ab 250 €)',
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
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${toCanonicalSiteUrl('/')}#local-business`,
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

const imageLicenseMetadata = () => ({
  creator: {
    '@id': `${toCanonicalSiteUrl('/')}#person`,
  },
  creditText: 'Matthias Ramahi',
  copyrightNotice: '© Matthias Ramahi',
  license: toCanonicalSiteUrl('/impressum.html'),
  acquireLicensePage: toAbsoluteSiteUrl('/contact.html#anfrage'),
})

const articleImageObject = (media?: PayloadDoc['coverImage']) => {
  const url = imageUrl(media, 'hero')
  if (!url) return undefined
  const dims = imageDimensions(media, 'hero')
  const absoluteUrl = toAbsoluteSiteUrl(url)
  return {
    '@type': 'ImageObject',
    url: absoluteUrl,
    contentUrl: absoluteUrl,
    width: dims.width,
    height: dims.height,
    ...imageLicenseMetadata(),
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
  const canonicalUrl = toCanonicalSiteUrl(url)
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: doc.title,
    serviceType: doc.service || doc.serviceType || doc.targetKeyword || doc.title,
    description: doc.seo?.description || doc.intro,
    image: img ? toAbsoluteSiteUrl(img) : undefined,
    provider: {
      '@id': `${toCanonicalSiteUrl('/')}#local-business`,
    },
    areaServed: normalizeAreaServed(doc.city),
    offers: statesEntryPrice(doc)
      ? {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: SHOOTING_ENTRY_PRICE_EUR,
          priceCurrency: 'EUR',
        },
        url: canonicalUrl,
      }
      : undefined,
    url: canonicalUrl,
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

  const canonicalUrl = toCanonicalSiteUrl(options.url)

  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${canonicalUrl}#gallery`,
    name: options.name,
    url: canonicalUrl,
    author: {
      '@id': `${toCanonicalSiteUrl('/')}#person`,
    },
    associatedMedia: images.map((item) => ({
      '@type': 'ImageObject',
      contentUrl: toAbsoluteSiteUrl(item.url),
      caption: item.caption,
      ...imageLicenseMetadata(),
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
