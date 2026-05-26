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
  sizes?: Record<string, PayloadMediaSize>
}

export type PayloadLink = {
  label?: string
  href?: string
  description?: string
  platform?: string
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
    noIndex?: boolean
    ogImage?: PayloadMedia | string
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
  email?: string
  phone?: string
  locationLabel?: string
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

const apiBase = () => (import.meta.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export const configuredSiteUrl = () =>
  (import.meta.env.ASTRO_PUBLIC_SITE_URL || 'https://matthiasramahi.de').replace(/\/$/, '')

const headersFor = (draft?: boolean): HeadersInit => {
  if (!draft || !import.meta.env.PAYLOAD_PREVIEW_API_KEY) return {}

  return {
    Authorization: `users API-Key ${import.meta.env.PAYLOAD_PREVIEW_API_KEY}`,
  }
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

  try {
    const response = await fetch(url, {
      headers: headersFor(draft),
    })

    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export const toAbsolutePayloadUrl = (url?: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${apiBase()}${url.startsWith('/') ? '' : '/'}${url}`
}

export const toAbsoluteSiteUrl = (pathOrUrl?: string) => {
  if (!pathOrUrl) return configuredSiteUrl()
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${configuredSiteUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export const imageUrl = (media: PayloadMedia | string | undefined, size = 'hero') => {
  if (!media || typeof media === 'string') return ''
  const sized = media.sizes?.[size]?.url
  return toAbsolutePayloadUrl(sized || media.url)
}

export const imageDimensions = (media: PayloadMedia | string | undefined, size = 'hero') => {
  if (!media || typeof media === 'string') return {}
  const sized = media.sizes?.[size]
  return {
    width: sized?.width || media.width,
    height: sized?.height || media.height,
  }
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

  return data?.docs ?? []
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
