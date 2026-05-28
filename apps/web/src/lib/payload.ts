import { fallbackPortfolioProjects } from '../data/fallbackPortfolio'

export type PayloadMediaSize = {
  url?: string
  width?: number
  height?: number
  mimeType?: string
  filesize?: number
}

export type PayloadMedia = {
  id: string
  title?: string
  alt?: string
  caption?: string
  url?: string
  width?: number
  height?: number
  focalX?: number
  focalY?: number
  dominantColor?: string
  blurDataUrl?: string
  sizes?: Record<string, PayloadMediaSize>
}

export type PayloadLink = {
  label?: string
  href?: string
  description?: string
  platform?: string
  openInNewTab?: boolean
  rel?: string
  seoPurpose?: string
}

export type PayloadCta = {
  label?: string
  href?: string
  headline?: string
  text?: string
  buttonLabel?: string
  emailSubject?: string
}

export type PayloadDoc = {
  id: string
  title?: string
  slug?: string
  excerpt?: string
  intro?: string
  category?: string
  city?: string
  service?: string
  serviceType?: string
  pageType?: string
  presentationMode?: string
  publishedAt?: string
  updatedAt?: string
  _status?: 'draft' | 'published'
  coverImage?: PayloadMedia | string
  heroImage?: PayloadMedia | string
  teaserImage?: PayloadMedia | string
  gallery?: Array<{ image?: PayloadMedia | string; caption?: string; role?: string }>
  proofPoints?: Array<{ label?: string; text?: string }>
  audience?: Array<{ item?: string }>
  faq?: Array<{ question?: string; answer?: string }>
  localFaq?: Array<{ question?: string; answer?: string }>
  relatedPages?: PayloadLink[]
  blocks?: unknown[]
  cta?: PayloadCta
  contactOverride?: PayloadCta
  seo?: {
    title?: string
    description?: string
    canonicalUrl?: string
    legacyUrl?: string
    noIndex?: boolean
    ogImage?: PayloadMedia | string
  }
  legacy?: {
    sourceFile?: string
    sourceUrl?: string
    migrationStatus?: string
    renderSource?: string
    renderedHeadHtml?: string
    renderedBodyHtml?: string
    afterFooterHtml?: string
    bodyClass?: string
    headerCurrent?: string
  }
  [key: string]: unknown
}

export type SiteSettings = {
  siteName?: string
  siteUrl?: string
  locale?: string
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  defaultOgImage?: PayloadMedia | string
  ownerName?: string
  email?: string
  phone?: string
  instagramUrl?: string
  footerStatement?: string
}

export type NavigationGlobal = {
  primary?: PayloadLink[]
  photographyLinks?: PayloadLink[]
  footerLinks?: PayloadLink[]
  legalLinks?: PayloadLink[]
  cta?: PayloadCta
}

export type FooterGlobal = {
  statement?: string
  statementHighlight?: string
  aboutLink?: PayloadLink
  email?: string
  phone?: string
  locationLabel?: string
  copyright?: string
  columns?: Array<{
    label?: string
    links?: PayloadLink[]
  }>
  primaryLinks?: PayloadLink[]
  serviceLinks?: PayloadLink[]
  socialLinks?: PayloadLink[]
  legalLinks?: PayloadLink[]
}

export type GlobalCtas = {
  primary?: PayloadCta
  contactModule?: PayloadCta & { eyebrow?: string }
}

type ListOptions = {
  limit?: number
  depth?: number
  draft?: boolean
  sort?: string
}

type GlobalOptions = {
  depth?: number
  draft?: boolean
}

const productionSiteUrl = 'https://matthiasramahi.de'
const productionPayloadUrl = 'https://cms.matthiasramahi.de'

const apiBase = () => {
  const configured = import.meta.env.PAYLOAD_PUBLIC_SERVER_URL || (import.meta.env.PROD ? productionPayloadUrl : 'http://localhost:3000')
  if (import.meta.env.PROD && /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i.test(configured)) return productionPayloadUrl
  return configured.replace(/\/$/, '')
}

const payloadPublicBase = () => {
  const configured = import.meta.env.PAYLOAD_PUBLIC_SERVER_URL || (import.meta.env.PROD ? productionPayloadUrl : 'http://localhost:3000')
  if (import.meta.env.PROD && /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i.test(configured)) return productionPayloadUrl
  return configured.replace(/\/$/, '')
}

const mojibakeReplacements: Array<[RegExp, string]> = [
  [/\u00C3\u00BC/g, '\u00FC'],
  [/\u00C3\u0153/g, '\u00DC'],
  [/\u00C3\u00A4/g, '\u00E4'],
  [/\u00C3\u201E/g, '\u00C4'],
  [/\u00C3\u00B6/g, '\u00F6'],
  [/\u00C3\u2013/g, '\u00D6'],
  [/\u00C3\u0178/g, '\u00DF'],
  [/\u00C3\u00A9/g, '\u00E9'],
  [/\u00E2\u20AC\u201D/g, '\u2014'],
  [/\u00E2\u20AC\u201C/g, '\u2013'],
  [/\u00E2\u20AC\u017E/g, '\u201E'],
  [/\u00E2\u20AC\u0153/g, '\u201C'],
  [/\u00E2\u20AC\u009D/g, '\u201D'],
  [/\u00E2\u20AC\u02DC/g, '\u2018'],
  [/\u00E2\u20AC\u2122/g, '\u2019'],
  [/\u00E2\u20AC\u0161/g, '\u201A'],
  [/\u00E2\u20AC\u00A6/g, '\u2026'],
  [/\u00C2\u00B7/g, '\u00B7'],
  [/\u00C2\u00A0/g, ' '],
  [/\u00C2/g, ''],
]

const cleanCmsText = (value: string) =>
  mojibakeReplacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)

const normalizePayloadValue = <T>(value: T): T => {
  if (typeof value === 'string') return cleanCmsText(value) as T
  if (Array.isArray(value)) return value.map((item) => normalizePayloadValue(item)) as T
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizePayloadValue(entry)]),
  ) as T
}

export const configuredSiteUrl = () => {
  const configured = import.meta.env.ASTRO_PUBLIC_SITE_URL || productionSiteUrl
  try {
    const url = new URL(configured)
    const isKnownSiteHost = ['localhost', '127.0.0.1', 'www.matthiasramahi.de', 'matthiasramahi.de'].includes(url.hostname)
    if (isKnownSiteHost) return productionSiteUrl
  } catch {
    if (configured.includes('localhost') || configured.includes('127.0.0.1')) return productionSiteUrl
  }
  return configured.replace(/\/$/, '')
}

const headersFor = (draft?: boolean): HeadersInit => {
  if (!draft || !import.meta.env.PAYLOAD_PREVIEW_API_KEY) return {}

  return {
    Authorization: `users API-Key ${import.meta.env.PAYLOAD_PREVIEW_API_KEY}`,
  }
}

const payloadCache = new Map<string, { expires: number; value?: unknown; promise?: Promise<unknown | null> }>()
const payloadCacheTtlMs = Number(import.meta.env.PAYLOAD_FETCH_CACHE_MS ?? (import.meta.env.DEV ? 0 : 300_000))
const payloadTimeoutMs = Number(import.meta.env.PAYLOAD_FETCH_TIMEOUT_MS || 1_500)

function cacheKeyFor(url: string, draft: boolean) {
  return `${draft ? 'draft' : 'published'}:${url}`
}

function timeoutSignal() {
  if (payloadTimeoutMs <= 0) return undefined
  return AbortSignal.timeout(payloadTimeoutMs)
}

const apiGet = async <T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  draft = false,
): Promise<T | null> => {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== 'undefined') search.set(key, String(value))
  }

  if (draft) search.set('draft', 'true')

  const query = search.toString()
  const url = `${apiBase()}${path}${query ? `?${query}` : ''}`
  const cacheable = !draft && payloadCacheTtlMs > 0
  const cacheKey = cacheable ? cacheKeyFor(url, draft) : ''

  if (cacheable) {
    const cached = payloadCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      if (cached.promise) return cached.promise as Promise<T | null>
      return (cached.value as T | null) ?? null
    }
  }

  const request = (async () => {
    const response = await fetch(url, {
      headers: headersFor(draft),
      signal: timeoutSignal(),
    })

    if (!response.ok) return null
    return normalizePayloadValue(await response.json()) as T
  })().catch(() => null)

  if (cacheable) {
    payloadCache.set(cacheKey, { expires: Date.now() + payloadCacheTtlMs, promise: request })
  }

  const value = await request
  if (cacheable) {
    payloadCache.set(cacheKey, { expires: Date.now() + payloadCacheTtlMs, value })
  }

  return value
}

export function clearPayloadRuntimeCache() {
  payloadCache.clear()
}

async function getFirstByLegacyUrl(collections: string[], legacyFile: string, options: ListOptions) {
  const docs = await Promise.all(collections.map((collection) => getByLegacyUrl(collection, legacyFile, options)))
  return docs.find(Boolean) ?? null
}

async function getFirstByLegacyUrlSequential(collections: string[], legacyFile: string, options: ListOptions) {
  for (const collection of collections) {
    const doc = await getByLegacyUrl(collection, legacyFile, options)
    if (doc) return doc
  }
  return null
}

export async function getLegacyBackedDoc(legacyFile: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  const collections = ['site-pages', 'service-pages', 'journal-posts', 'local-seo-pages', 'portfolio-projects']

  if (options.draft) {
    return getFirstByLegacyUrlSequential(collections, legacyFile, options)
  }

  try {
    return await getFirstByLegacyUrl(collections, legacyFile, options)
  } catch {
    return null
  }
}

export const toAbsolutePayloadUrl = (url?: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      if (import.meta.env.PROD && ['localhost', '127.0.0.1'].includes(parsed.hostname)) {
        return `${payloadPublicBase()}${parsed.pathname}${parsed.search}${parsed.hash}`
      }
    } catch {
      return url
    }
    return url
  }
  return `${payloadPublicBase()}${url.startsWith('/') ? '' : '/'}${url}`
}

export const toAbsoluteSiteUrl = (pathOrUrl?: string) => {
  const siteUrl = configuredSiteUrl()
  if (!pathOrUrl) return siteUrl
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const url = new URL(pathOrUrl)
      const isKnownSiteHost = ['localhost', '127.0.0.1', 'www.matthiasramahi.de', 'matthiasramahi.de'].includes(url.hostname)
      if (isKnownSiteHost) return `${siteUrl}${url.pathname}${url.search}${url.hash}`
    } catch {
      return pathOrUrl
    }
    return pathOrUrl
  }
  return `${siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export const toRootRelativeHref = (href?: string) => {
  if (!href) return ''
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href
  return href.startsWith('/') ? href : `/${href}`
}

const isExternalHref = (href?: string) => Boolean(href && /^https?:\/\//i.test(href))

export const linkAttributes = (link?: PayloadLink | null) => {
  const href = toRootRelativeHref(link?.href)
  const openInNewTab = Boolean(link?.openInNewTab || isExternalHref(href))
  const relParts = new Set<string>()

  if (link?.rel && link.rel !== 'follow') relParts.add(link.rel)
  if (openInNewTab) {
    relParts.add('noopener')
    relParts.add('noreferrer')
  }

  return {
    href,
    rel: relParts.size > 0 ? [...relParts].join(' ') : undefined,
    target: openInNewTab ? '_blank' : undefined,
  }
}

export const toDisplayAssetUrl = (url?: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      const isKnownSiteHost = ['localhost', '127.0.0.1', 'www.matthiasramahi.de', 'matthiasramahi.de'].includes(
        parsed.hostname,
      )
      if (isKnownSiteHost && /^\/assets\//i.test(parsed.pathname)) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`
      }
    } catch {
      return url
    }
    return url
  }
  if (/^\/?assets\//i.test(url)) return `/${url.replace(/^\/+/, '')}`
  return toAbsolutePayloadUrl(url)
}

export const internalSitePath = (pathOrUrl?: string) => {
  if (!pathOrUrl) return ''

  try {
    const site = new URL(configuredSiteUrl())
    const url = new URL(toAbsoluteSiteUrl(pathOrUrl))
    if (url.hostname !== site.hostname) return ''
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return ''
  }
}

const sizeWidths: Record<string, number> = {
  thumb: 360,
  thumbAvif: 360,
  mobile: 760,
  mobileAvif: 760,
  card: 1100,
  cardAvif: 1100,
  hero: 1920,
  heroAvif: 1920,
  wide: 2560,
  wideAvif: 2560,
}

const rasterFallbacks: Record<string, string[]> = {
  thumb: ['thumb', 'mobile', 'card'],
  mobile: ['mobile', 'card', 'hero', 'thumb'],
  card: ['card', 'hero', 'mobile', 'wide', 'thumb'],
  hero: ['hero', 'wide', 'card', 'mobile', 'thumb'],
  wide: ['wide', 'hero', 'card', 'mobile', 'thumb'],
}

const avifFallbacks: Record<string, string[]> = {
  thumb: ['thumbAvif', 'mobileAvif', 'cardAvif'],
  mobile: ['mobileAvif', 'cardAvif', 'heroAvif', 'thumbAvif'],
  card: ['cardAvif', 'heroAvif', 'mobileAvif', 'wideAvif', 'thumbAvif'],
  hero: ['heroAvif', 'wideAvif', 'cardAvif', 'mobileAvif', 'thumbAvif'],
  wide: ['wideAvif', 'heroAvif', 'cardAvif', 'mobileAvif', 'thumbAvif'],
}

const bestSize = (media: PayloadMedia, size: string, format: 'avif' | 'raster' = 'raster') => {
  const fallbacks = format === 'avif' ? avifFallbacks : rasterFallbacks
  const candidates = fallbacks[size] || [size]
  return candidates.find((candidate) => media.sizes?.[candidate]?.url)
}

export const imageUrl = (
  media: PayloadMedia | string | undefined,
  size = 'hero',
  options: { allowOriginal?: boolean; format?: 'avif' | 'raster' } = {},
) => {
  if (!media) return ''
  if (typeof media === 'string') {
    if (/^https?:\/\//i.test(media)) return media
    if (/^\/?assets\//i.test(media)) return toAbsoluteSiteUrl(media)
    return toAbsolutePayloadUrl(media)
  }
  const selected = bestSize(media, size, options.format || 'raster')
  const sized = selected ? media.sizes?.[selected]?.url : undefined
  return toAbsolutePayloadUrl(sized || (options.allowOriginal ? media.url : undefined))
}

export const imageDisplayUrl = (
  media: PayloadMedia | string | undefined,
  size = 'hero',
  options: { allowOriginal?: boolean; format?: 'avif' | 'raster' } = {},
) => {
  if (!media) return ''
  if (typeof media === 'string') return toDisplayAssetUrl(media)
  const selected = bestSize(media, size, options.format || 'raster')
  const sized = selected ? media.sizes?.[selected]?.url : undefined
  return toDisplayAssetUrl(sized || (options.allowOriginal ? media.url : undefined))
}

export const imageDimensions = (media: PayloadMedia | string | undefined, size = 'hero') => {
  if (!media || typeof media === 'string') return {}
  const selected = bestSize(media, size)
  const sized = selected ? media.sizes?.[selected] : undefined
  return {
    width: sized?.width || media.width,
    height: sized?.height || media.height,
  }
}

export const imageSrcset = (
  media: PayloadMedia | string | undefined,
  sizes: string[] = ['mobile', 'card', 'hero', 'wide'],
  format: 'avif' | 'raster' = 'raster',
) => {
  if (!media || typeof media === 'string') return ''

  const seen = new Set<string>()

  return sizes
    .map((size) => {
      const selected = bestSize(media, size, format)
      const url = selected ? media.sizes?.[selected]?.url : undefined
      if (!selected || !url || seen.has(url)) return ''
      seen.add(url)
      return `${toAbsolutePayloadUrl(url)} ${sizeWidths[selected] || sizeWidths[size] || 1600}w`
    })
    .filter(Boolean)
    .join(', ')
}

export const imageObjectPosition = (media: PayloadMedia | string | undefined) => {
  if (!media || typeof media === 'string') return undefined
  if (typeof media.focalX !== 'number' || typeof media.focalY !== 'number') return undefined
  return `${Math.round(media.focalX)}% ${Math.round(media.focalY)}%`
}

export const imageAlt = (media: PayloadMedia | string | undefined, fallback = '') => {
  if (!media || typeof media === 'string') return fallback
  return media.alt || media.title || fallback
}

export async function payloadFetch<T>(
  collection: string,
  params: Record<string, string | number | boolean | undefined> = {},
  draft = false,
): Promise<T | null> {
  return apiGet<T>(`/api/${collection}`, params, draft)
}

export async function getGlobal<T>(slug: string, options: GlobalOptions = {}): Promise<T | null> {
  return apiGet<T>(
    `/api/globals/${slug}`,
    {
      depth: options.depth ?? 2,
    },
    options.draft,
  )
}

export const getSiteSettings = () => getGlobal<SiteSettings>('site-settings')
export const getNavigation = () => getGlobal<NavigationGlobal>('navigation')
export const getFooter = () => getGlobal<FooterGlobal>('footer')
export const getGlobalCtas = () => getGlobal<GlobalCtas>('global-ctas')

export async function listDocuments(collection: string, options: ListOptions = {}): Promise<PayloadDoc[]> {
  const data = await payloadFetch<{ docs?: PayloadDoc[] }>(
    collection,
    {
      limit: options.limit ?? 12,
      depth: options.depth ?? 2,
      sort: options.sort,
    },
    options.draft,
  )

  const docs = data?.docs ?? []
  if (docs.length > 0) return docs

  if (collection === 'portfolio-projects') {
    return [...(fallbackPortfolioProjects as unknown as PayloadDoc[])]
  }

  return []
}

export async function getBySlug(collection: string, slug: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  const data = await payloadFetch<{ docs?: PayloadDoc[] }>(
    collection,
    {
      'where[slug][equals]': slug,
      limit: 1,
      depth: options.depth ?? 2,
    },
    options.draft,
  )

  const doc = data?.docs?.[0]
  if (doc) return doc

  if (collection === 'portfolio-projects') {
    return (fallbackPortfolioProjects as unknown as readonly PayloadDoc[]).find((project) => project.slug === slug) ?? null
  }

  return null
}

export async function getByLegacyUrl(collection: string, legacyUrl: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  const data = await payloadFetch<{ docs?: PayloadDoc[] }>(
    collection,
    {
      'where[seo.legacyUrl][equals]': legacyUrl,
      limit: 1,
      depth: options.depth ?? 2,
    },
    options.draft,
  )

  return data?.docs?.[0] ?? null
}

export async function getSitePageByType(pageType: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  const data = await payloadFetch<{ docs?: PayloadDoc[] }>(
    'site-pages',
    {
      'where[pageType][equals]': pageType,
      limit: 1,
      depth: options.depth ?? 2,
    },
    options.draft,
  )

  return data?.docs?.[0] ?? null
}

export const routeForDoc = (collection: string, doc: Pick<PayloadDoc, 'slug'>) => {
  const slug = doc.slug || ''
  if (!slug) return '/'

  if (collection === 'portfolio-projects') return `/portfolio/${slug}`
  if (collection === 'journal-posts') return `/journal/${slug}`
  if (collection === 'service-pages') return `/${slug}`
  if (collection === 'local-seo-pages') return `/${slug}`
  if (collection === 'site-pages') return slug === 'home' ? '/' : `/${slug}`

  return `/${slug}`
}
