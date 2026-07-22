import { fallbackPortfolioProjects } from '../data/fallbackPortfolio'
import { addUrlVersion, staticAssetVersion, versionCmsMediaUrl, versionStaticAssetUrl } from './cache'
import type { CmsCta, CmsLegacyInfo, CmsLink, CmsMedia, CmsMediaSize, CmsSeo } from './cmsContentContract'
import {
  getTinaByLegacyUrl,
  getTinaBySlug,
  getTinaGlobal,
  getTinaLegacyUrlIndex,
  getTinaSitePageByType,
  listTinaDocuments,
} from './tinaContent'

export type PayloadMediaSize = CmsMediaSize
export type PayloadMedia = CmsMedia
export type PayloadLink = CmsLink
export type PayloadCta = CmsCta

export type PayloadDoc = {
  id: string
  title?: string
  slug?: string
  excerpt?: string
  intro?: string
  category?: string
  city?: string
  service?: string
  targetKeyword?: string
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
  heroSlides?: Array<{
    image?: PayloadMedia | string
    headlineLine1?: string
    headlineLine2?: string
    lead?: string
    durationSec?: number
    primaryLabel?: string
    primaryHref?: string
    secondaryLabel?: string
    secondaryHref?: string
  }>
  projectPage?: {
    galleryEyebrow?: string
    statement?: {
      quote?: string
      accent?: string
      stats?: Array<{ label?: string; text?: string }>
      buttonLabel?: string
      buttonHref?: string
    }
    context?: {
      kicker?: string
      headline?: string
      body?: Array<{ text?: string }>
    }
    perspectives?: Array<{
      label?: string
      title?: string
      text?: string
      image?: PayloadMedia | string
      bullets?: Array<{ text?: string }>
    }>
    infoCards?: Array<{ number?: string; title?: string; label?: string; href?: string }>
    relatedCards?: Array<{
      label?: string
      title?: string
      href?: string
      image?: PayloadMedia | string
    }>
    contact?: PayloadCta
  }
  proofPoints?: Array<{ label?: string; text?: string }>
  audience?: Array<{ item?: string }>
  // Strukturierte Themen-Seiten-Sektionen (ServicePages -> Tab "Themen-Sektionen"). Alle optional -> Fallback im Component.
  heroLine2?: string
  heroPanels?: Array<{ image?: PayloadMedia | string }>
  statement?: { image?: PayloadMedia | string; headline?: string; emphasis?: string; body?: Array<{ text?: string }> }
  focusSection?: { headline?: string; emphasis?: string; lead?: string }
  shootingStyles?: Array<{ image?: PayloadMedia | string; title?: string; text?: string }>
  gallerySection?: { headline?: string; lead?: string }
  portfolioTiles?: Array<{ image?: PayloadMedia | string; label?: string }>
  processSection?: { headline?: string; emphasis?: string; lead?: string }
  processSteps?: Array<{ image?: PayloadMedia | string; imageLabel?: string; title?: string; text?: string }>
  audienceSection?: { headline?: string; lead?: string }
  audienceCards?: Array<{ image?: PayloadMedia | string; number?: string; title?: string; text?: string }>
  relatedSection?: {
    headline?: string
    emphasis?: string
    lead?: string
    items?: Array<{ image?: PayloadMedia | string; title?: string; href?: string; alt?: string }>
  }
  locationLinksSection?: {
    headline?: string
    emphasis?: string
    items?: Array<{ label?: string; href?: string }>
  }
  searchLinksSection?: {
    headline?: string
    emphasis?: string
    items?: Array<{ label?: string; href?: string }>
  }
  contactSection?: { headline?: string; emphasis?: string; lead?: string; emailSubject?: string }
  faq?: Array<{ question?: string; answer?: string }>
  localFaq?: Array<{ question?: string; answer?: string }>
  // Startseiten-Sektionen (SitePages, pageType 'home'). Alle optional -> Fallback im Component.
  homeStatement?: { headline?: string; headlineEmphasis?: string; body?: Array<{ text?: string }> }
  homeChapters?: {
    headline?: string
    headlineEmphasis?: string
    intro?: string
    items?: Array<{ image?: PayloadMedia | string; title?: string; meta?: string; href?: string }>
  }
  homeSelectedWorks?: { headline?: string; headlineEmphasis?: string; intro?: string }
  homeAbout?: {
    kicker?: string
    headline?: string
    headlineEmphasis?: string
    image?: PayloadMedia | string
    body?: Array<{ text?: string }>
  }
  homeServices?: {
    headline?: string
    headlineEmphasis?: string
    intro?: string
    items?: Array<{ number?: string; title?: string; text?: string; href?: string }>
  }
  homeJournal?: {
    headline?: string
    headlineEmphasis?: string
    intro?: string
    items?: Array<{
      image?: PayloadMedia | string
      number?: string
      date?: string
      category?: string
      title?: string
      text?: string
      href?: string
    }>
  }
  // Fotografie-Uebersicht (SitePages, pageType 'photography-index'). Optional -> Fallback im Component.
  photographyIndex?: {
    clusterIntro?: Array<{ text?: string }>
    topics?: Array<{
      image?: PayloadMedia | string
      title?: string
      emphasis?: string
      text?: string
      linkLabel?: string
      href?: string
    }>
  }
  // Portfolio / Bildarchiv (SitePages, pageType 'portfolio-index'). Optional -> Fallback im Component.
  portfolioIndex?: {
    contextKicker?: string
    contextHeadline?: string
    contextBody?: Array<{ text?: string }>
    slices?: Array<{
      anchor?: string
      label?: string
      heading?: string
      lead?: string
      theme?: string
      href?: string
      linkLabel?: string
      photos?: Array<{
        image?: PayloadMedia | string
        fullImage?: PayloadMedia | string
        caption?: string
        href?: string
      }>
    }>
    archive?: {
      headline?: string
      batchSize?: number
      items?: Array<{
        image?: PayloadMedia | string
        fullImage?: PayloadMedia | string
        caption?: string
        href?: string
      }>
    }
    contact?: { subject?: string; headline?: string; lead?: string }
  }
  // Leistungs-Uebersicht (SitePages, pageType 'services-index'). Optional -> Fallback im Component.
  servicesIndex?: {
    overviewHeadline?: string
    overviewEmphasis?: string
    overviewIntro?: string
    items?: Array<{
      number?: string
      overviewLabel?: string
      headline?: string
      emphasis?: string
      text?: string
      tags?: string
      href?: string
      image1?: PayloadMedia | string
      caption1?: string
      image2?: PayloadMedia | string
      caption2?: string
    }>
    whyKicker?: string
    whyHeadline?: string
    whyEmphasis?: string
    whyLead?: string
    whyCards?: Array<{ label?: string; headline?: string; emphasis?: string; text?: string }>
  }
  // Journal-Uebersicht (SitePages, pageType 'journal-index'). Optional -> Fallback im Component.
  journalIndex?: {
    tickerItems?: Array<{ text?: string }>
    featured?: {
      kicker?: string
      headline?: string
      text?: string
      buttonLabel?: string
      buttonHref?: string
      image?: PayloadMedia | string
    }
    indexHeadline?: string
    initialVisiblePostCount?: number
    loadMoreLabel?: string
    loadStatusTemplate?: string
    filters?: Array<{ label?: string; value?: string }>
    finalCta?: {
      kicker?: string
      headline?: string
      text?: string
      primaryLabel?: string
      primaryHref?: string
      secondaryLabel?: string
      secondaryHref?: string
    }
  }
  // Ueber-mich-Seite (SitePages, pageType 'about'). Optional -> Fallback im Component.
  aboutHero?: {
    kicker?: string
    titleLine1?: string
    titleLine2?: string
    lead?: string
    image?: PayloadMedia | string
    primaryLabel?: string
    primaryHref?: string
    secondaryLabel?: string
    secondaryHref?: string
  }
  aboutStatement?: {
    headline?: string
    headlineEmphasis?: string
    lead?: string
    body?: string
    primaryLabel?: string
    primaryHref?: string
    secondaryLabel?: string
    secondaryHref?: string
  }
  aboutChapters?: {
    headline?: string
    headlineEmphasis?: string
    intro?: string
    items?: Array<{
      image?: PayloadMedia | string
      title?: string
      alt?: string
      linkLabel?: string
      href?: string
    }>
  }
  aboutSister?: {
    kicker?: string
    headline?: string
    headlineEmphasis?: string
    lead?: string
    body?: string
    buttonLabel?: string
    href?: string
    plate?: {
      tag?: string
      nameLine1?: string
      nameLine2?: string
      roles?: Array<{ label?: string }>
      location?: string
    }
  }
  aboutContact?: { subject?: string; headline?: string; lead?: string }
  relatedPages?: PayloadLink[]
  blocks?: unknown[]
  cta?: PayloadCta
  contactOverride?: PayloadCta
  seo?: CmsSeo
  legacy?: CmsLegacyInfo
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
  cacheMs?: number
  force?: boolean
  limit?: number
  depth?: number
  draft?: boolean
  sort?: string
}

type GlobalOptions = {
  cacheMs?: number
  depth?: number
  draft?: boolean
  force?: boolean
}

type FetchOptions = {
  cacheMs?: number
  force?: boolean
}

const productionSiteUrl = 'https://matthiasramahi.de'
const productionMediaUrl = 'https://cms.matthiasramahi.de'

const cachedCmsAssetMap: Array<[RegExp, string]> = [
  [/^mpissxxj-portfolio_webp_full_063-[12]-\d+x\d+\.webp$/i, '/assets/optimized/mpissxxj-portrait-480.webp'],
  [/^mpissxxj-portfolio_webp_full_063-[12]\.webp$/i, '/assets/optimized/mpissxxj-portrait-960.webp'],
  [/^assets-photos-oldtimer-stage-1920-760x507\.webp$/i, '/assets/optimized/assets-photos-oldtimer-stage-960.webp'],
  [/^assets-photos-motorrad-1920-760x1140\.webp$/i, '/assets/optimized/assets-photos-motorrad-720.webp'],
  [/^assets-photos-automobil-neon-192[01]-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-automobil-neon-480.webp'],
  [/^assets-photos-automobil-neon-192[01]\.webp$/i, '/assets/optimized/assets-photos-automobil-neon-1920.webp'],
  [/^assets-photos-automobil-sunset-192[01]-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-automobil-sunset-480.webp'],
  [/^assets-photos-automobil-sunset-192[01]\.webp$/i, '/assets/optimized/assets-photos-automobil-sunset-1920.webp'],
  [/^assets-photos-landschaft-192[01]-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-landschaft-480.webp'],
  [/^assets-photos-landschaft-192[01]\.webp$/i, '/assets/optimized/assets-photos-landschaft-1920.webp'],
  [/^assets-photos-motorrad-1920-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-motorrad-720.webp'],
  [/^assets-photos-motorrad-1920\.webp$/i, '/assets/optimized/assets-photos-motorrad-1920.webp'],
  [/^assets-photos-motorrad-ninja-road-1920-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-motorrad-ninja-road-720.webp'],
  [/^assets-photos-motorrad-ninja-road-1920\.webp$/i, '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp'],
  [/^assets-photos-motorrad-duke-1920-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-motorrad-duke-720.webp'],
  [/^assets-photos-motorrad-duke-1920\.webp$/i, '/assets/optimized/assets-photos-motorrad-duke-1920.webp'],
  [/^assets-photos-oldtimer-stage-1920-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-oldtimer-stage-640.webp'],
  [/^assets-photos-oldtimer-stage-1920\.webp$/i, '/assets/optimized/assets-photos-oldtimer-stage-1920.webp'],
  [/^portrait-warm(?:-1)?-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-portrait-warm-480.webp'],
  [/^portrait-warm(?:-1)?\.webp$/i, '/assets/optimized/assets-photos-portrait-warm-960.webp'],
  [/^portrait-blue-\d+x\d+\.webp$/i, '/assets/optimized/assets-photos-portrait-blue-720.webp'],
  [/^portrait-blue\.webp$/i, '/assets/photos/portrait-blue.webp'],
  [/^assets-portfolio-dsc3879-1920-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC3879.webp'],
  [/^assets-portfolio-dsc3879-1920\.webp$/i, '/assets/optimized/assets-portfolio-dsc3879-1920.webp'],
  [/^assets-portfolio-dsc3982-1920-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC3982.webp'],
  [/^assets-portfolio-dsc3982-1920\.webp$/i, '/assets/optimized/assets-portfolio-dsc3982-1920.webp'],
  [/^assets-portfolio-dsc3892-1920-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC3892.webp'],
  [/^assets-portfolio-dsc3892-1920\.webp$/i, '/assets/optimized/assets-portfolio-dsc3892-1920.webp'],
  [/^assets-portfolio-dsc2986-1920-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC2986.webp'],
  [/^assets-portfolio-dsc2986-1920\.webp$/i, '/assets/optimized/assets-portfolio-dsc2986-1920.webp'],
  [/^_DSC0470-Enhanced-NR-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp'],
  [/^_DSC0470-Enhanced-NR\.webp$/i, '/assets/portraits/_DSC0470-Enhanced-NR.webp'],
  [/^_DSC9301-Enhanced-NR-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp'],
  [/^_DSC9301-Enhanced-NR\.webp$/i, '/assets/portfolio/_DSC9301-Enhanced-NR.webp'],
  [/^_DSC9321-Enhanced-NR-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp'],
  [/^_DSC9321-Enhanced-NR\.webp$/i, '/assets/portfolio/_DSC9321-Enhanced-NR.webp'],
  [/^Wettberwerb_Foto5_Wunder_der_Natur2-\d+x\d+\.webp$/i, '/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp'],
  [/^Wettberwerb_Foto5_Wunder_der_Natur2\.webp$/i, '/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp'],
  [/^Wettberwerb_Foto6_Wunder_der_Natur(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp'],
  [/^20250327-DSC01550(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/20250327-DSC01550.webp'],
  [/^20250605-DSC03756(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/20250605-DSC03756.webp'],
  [/^20250605-DSC04020(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/20250605-DSC04020.webp'],
  [/^_DSC2310(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC2310.webp'],
  [/^_DSC2316(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC2316.webp'],
  [/^_DSC2345(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC2345.webp'],
  [/^_DSC2358(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC2358.webp'],
  [/^_DSC2986(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC2986.webp'],
  [/^_DSC2876_genErase \(1\)(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC2876_genErase%20%281%29.webp'],
  [/^_DSC3032_genErase \(1\)(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC3032_genErase%20%281%29.webp'],
  [/^_DSC3032_genErase \(2\)(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC3032_genErase%20%282%29.webp'],
  [/^_DSC3892(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC3892.webp'],
  [/^_DSC3878(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC3878.webp'],
  [/^_DSC3908(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC3908.webp'],
  [/^_DSC3982(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC3982.webp'],
  [/^_DSC6982(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC6982.webp'],
  [/^_DSC8032(?:-\d+x\d+)?\.webp$/i, '/assets/portfolio/thumbs/_DSC8032.webp'],
  [/^catoir_ramahiinuikiim21(?:-\d+x\d+)?\.webp$/i, '/assets/services/catoir_ramahiinuikiim21-720.webp'],
  [/^portfolio_webp_full_001(?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_001.webp'],
  [/^portfolio_webp_full_004-2(?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_004-2.webp'],
  [/^portfolio_webp_full_005-[23](?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_005-2.webp'],
  [/^portfolio_webp_full_006-1(?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_006-1.webp'],
  [/^portfolio_webp_full_057-1(?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_057-1.webp'],
  [/^portfolio_webp_full_058-1(?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_058-1.webp'],
  [/^portfolio_webp_full_254(?:-\d+x\d+)?\.webp$/i, '/assets/services/portfolio_webp_full_254.webp'],
  [/^Catoir_Ramahi-1-106-768x512-1(?:-\d+x\d+)?\.webp$/i, '/assets/services/Catoir_Ramahi-1-106-768x512-1.webp'],
  [/^Catoir_Ramahi-1-32-768x512-1(?:-\d+x\d+)?\.webp$/i, '/assets/services/Catoir_Ramahi-1-32-768x512-1.webp'],
  [/^fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced(?:-\d+x\d+)?\.webp$/i, '/assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp'],
  [/^screencapture-gr-knospe-de-2025-10-02-23_10_04(?:-scaled)?(?:-\d+x\d+)?\.webp$/i, '/assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-720.webp'],
]

export const cachedCmsAssetPath = (url?: string) => {
  if (!url) return ''
  let file = url.split('#')[0].split('?')[0].split('/').pop() || ''
  try {
    file = decodeURIComponent(file)
  } catch {
    // Keep the original filename if it is not safely decodable.
  }
  file = file.replace(/&#34;$/i, '').trim()
  return cachedCmsAssetMap.find(([pattern]) => pattern.test(file))?.[1] || ''
}

const assetWidthFromUrl = (url: string) => {
  const file = (url.split('/').pop() || '').split('?')[0].split('#')[0]
  const explicitWidth = file.match(/-(360|480|640|720|760|960|1100|1280|1920|2048|2560)\.(?:avif|jpe?g|png|webp)$/i)?.[1]
  if (explicitWidth) return Number(explicitWidth)
  if (url.includes('/thumbs/')) return 720
  if (url.includes('/marquee/')) return 720
  if (url.includes('/assets/services/')) return 768
  return 0
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

const legacyUrlIndexCache = new Map<string, Promise<Map<string, PayloadDoc>>>()
const localStaticAssetRe = /^\/?(?:assets|uploads)\//i
const localUploadAssetRe = /^\/?uploads\//i

export const cmsContentSource = () =>
  String(process.env.ASTRO_CONTENT_SOURCE ?? import.meta.env.ASTRO_CONTENT_SOURCE ?? 'tina').trim().toLowerCase()

const shouldReadTinaContent = () => ['tina', 'auto'].includes(cmsContentSource())

const numberFromEnv = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export const liveCmsCacheMs = () =>
  numberFromEnv(import.meta.env.ASTRO_LIVE_CMS_CACHE_MS ?? process.env.ASTRO_LIVE_CMS_CACHE_MS, 0)

export const liveCmsFetchOptions = <T extends object>(options: T = {} as T): T & { cacheMs: number; force: true } => ({
  ...options,
  cacheMs: (options as FetchOptions).cacheMs ?? liveCmsCacheMs(),
  force: true,
})

export function clearPayloadRuntimeCache() {
  legacyUrlIndexCache.clear()
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

type MediaUrlOptions = {
  allowOriginal?: boolean
  format?: 'avif' | 'raster'
  mapCachedAssets?: boolean
}

const shouldMapCachedAssets = (options?: Pick<MediaUrlOptions, 'mapCachedAssets'>) => options?.mapCachedAssets !== false

const mediaPublicBase = () => {
  const configured =
    process.env.ASTRO_PUBLIC_MEDIA_BASE_URL ||
    process.env.PUBLIC_MEDIA_BASE_URL ||
    import.meta.env.ASTRO_PUBLIC_MEDIA_BASE_URL ||
    import.meta.env.PUBLIC_MEDIA_BASE_URL ||
    (import.meta.env.PROD ? productionMediaUrl : '')
  const clean = String(configured || '').trim().replace(/\/+$/, '')

  if (!clean) return ''
  if (import.meta.env.PROD && /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i.test(clean)) return productionMediaUrl
  return clean
}

const uploadPath = (url: string) => `/${url.replace(/^\/+/, '')}`

export const toPublicMediaUrl = (url?: string) => {
  if (!url) return ''
  const cleanUrl = String(url)

  if (/^https?:\/\//i.test(cleanUrl)) {
    try {
      const parsed = new URL(cleanUrl)
      if (/^\/uploads\//i.test(parsed.pathname)) {
        const base = mediaPublicBase()
        const knownSiteHost = ['localhost', '127.0.0.1', 'matthiasramahi.de', 'www.matthiasramahi.de'].includes(
          parsed.hostname,
        )
        if (base && knownSiteHost) {
          return addUrlVersion(`${base}${parsed.pathname}${parsed.search}${parsed.hash}`, staticAssetVersion)
        }
      }
    } catch {
      return cleanUrl
    }

    return cleanUrl
  }

  if (!localUploadAssetRe.test(cleanUrl)) return cleanUrl

  const path = uploadPath(cleanUrl)
  const base = mediaPublicBase()
  return base ? addUrlVersion(`${base}${path}`, staticAssetVersion) : versionStaticAssetUrl(path)
}

export const toAbsolutePayloadUrl = (url?: string, options: Pick<MediaUrlOptions, 'mapCachedAssets'> = {}) => {
  if (!url) return ''
  const cachedAsset = shouldMapCachedAssets(options) ? cachedCmsAssetPath(url) : ''
  if (cachedAsset) return toAbsoluteSiteUrl(versionStaticAssetUrl(cachedAsset))
  if (localUploadAssetRe.test(url)) return toPublicMediaUrl(url)
  if (localStaticAssetRe.test(url)) return toAbsoluteSiteUrl(versionStaticAssetUrl(`/${url.replace(/^\/+/, '')}`))
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      if (import.meta.env.PROD && ['localhost', '127.0.0.1'].includes(parsed.hostname)) {
        return `${mediaPublicBase() || productionMediaUrl}${parsed.pathname}${parsed.search}${parsed.hash}`
      }
    } catch {
      return url
    }
    return url
  }
  return `${mediaPublicBase() || productionMediaUrl}${url.startsWith('/') ? '' : '/'}${url}`
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

const canonicalInternalHrefAliases: Record<string, string> = {
  '/about': '/ueber-mich.html',
  '/blog': '/blog.html',
  '/contact': '/contact.html',
  '/index': '/',
  '/index.html': '/',
  '/journal': '/blog.html',
  '/kontakt': '/contact.html',
  '/leistungen': '/leistungen.html',
  '/portfolio': '/portfolio.html',
  '/services': '/leistungen.html',
  '/ueber-mich': '/ueber-mich.html',
}

const canonicalizeRootRelativeHref = (href: string) => {
  const [pathWithSearch, hash = ''] = href.split('#')
  const [rawPath, search = ''] = pathWithSearch.split('?')
  const suffix = `${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
  const path = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '')
  const lowerPath = path.toLowerCase()

  if (canonicalInternalHrefAliases[lowerPath]) return `${canonicalInternalHrefAliases[lowerPath]}${suffix}`
  if (/^\/[^/.]+$/i.test(path)) return `${path}.html${suffix}`

  return `${path || '/'}${suffix}`
}

export const toRootRelativeHref = (href?: string) => {
  if (!href) return ''
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href
  return canonicalizeRootRelativeHref(href.startsWith('/') ? href : `/${href}`)
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

export const toDisplayAssetUrl = (url?: string, options: Pick<MediaUrlOptions, 'mapCachedAssets'> = {}) => {
  if (!url) return ''
  const cachedAsset = shouldMapCachedAssets(options) ? cachedCmsAssetPath(url) : ''
  if (cachedAsset) return versionStaticAssetUrl(cachedAsset)
  if (localUploadAssetRe.test(url)) return toPublicMediaUrl(url)
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      const isKnownSiteHost = ['localhost', '127.0.0.1', 'www.matthiasramahi.de', 'matthiasramahi.de'].includes(
        parsed.hostname,
      )
      if (isKnownSiteHost && /^\/uploads\//i.test(parsed.pathname)) {
        return toPublicMediaUrl(`${parsed.pathname}${parsed.search}${parsed.hash}`)
      }
      if (isKnownSiteHost && /^\/assets\//i.test(parsed.pathname)) {
        return versionStaticAssetUrl(`${parsed.pathname}${parsed.search}${parsed.hash}`)
      }
    } catch {
      return url
    }
    return url
  }
  if (localStaticAssetRe.test(url)) return versionStaticAssetUrl(`/${url.replace(/^\/+/, '')}`)
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

const shouldPreferOriginal = (media: PayloadMedia, requestedSize: string, selectedSize?: string, allowOriginal = false) => {
  if (!allowOriginal || !media.url || !selectedSize) return false
  const requestedWidth = sizeWidths[requestedSize] || 0
  const selectedWidth = media.sizes?.[selectedSize]?.width || sizeWidths[selectedSize] || 0
  const originalWidth = media.width || 0

  return requestedWidth > 0 && selectedWidth > 0 && selectedWidth < requestedWidth * 0.7 && originalWidth > selectedWidth
}

export const imageUrl = (
  media: PayloadMedia | string | undefined,
  size = 'hero',
  options: MediaUrlOptions = {},
) => {
  if (!media) return ''
  if (typeof media === 'string') {
    if (/^https?:\/\//i.test(media)) {
      try {
        const parsed = new URL(media)
        if (/^\/uploads\//i.test(parsed.pathname)) return toPublicMediaUrl(media)
      } catch {
        return media
      }
      return toAbsoluteSiteUrl(versionStaticAssetUrl(media))
    }
    if (localUploadAssetRe.test(media)) return toPublicMediaUrl(media)
    if (localStaticAssetRe.test(media)) return toAbsoluteSiteUrl(versionStaticAssetUrl(media))
    return toAbsolutePayloadUrl(media, options)
  }
  const selected = bestSize(media, size, options.format || 'raster')
  const sized = selected ? media.sizes?.[selected]?.url : undefined
  if (shouldPreferOriginal(media, size, selected, options.allowOriginal)) {
    return versionCmsMediaUrl(toAbsolutePayloadUrl(media.url, options), media)
  }
  return versionCmsMediaUrl(toAbsolutePayloadUrl(sized || (options.allowOriginal ? media.url : undefined), options), media)
}

export const imageDisplayUrl = (
  media: PayloadMedia | string | undefined,
  size = 'hero',
  options: MediaUrlOptions = {},
) => {
  if (!media) return ''
  if (typeof media === 'string') return toDisplayAssetUrl(media, options)
  const selected = bestSize(media, size, options.format || 'raster')
  const sized = selected ? media.sizes?.[selected]?.url : undefined
  if (shouldPreferOriginal(media, size, selected, options.allowOriginal)) {
    return versionCmsMediaUrl(toDisplayAssetUrl(media.url, options), media)
  }
  return versionCmsMediaUrl(toDisplayAssetUrl(sized || (options.allowOriginal ? media.url : undefined), options), media)
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
  options: Pick<MediaUrlOptions, 'mapCachedAssets'> = {},
) => {
  if (!media || typeof media === 'string') return ''

  const seen = new Set<string>()

  return sizes
    .map((size) => {
      const selected = bestSize(media, size, format)
      const url = selected ? media.sizes?.[selected]?.url : undefined
      const displayUrl = url ? versionCmsMediaUrl(toDisplayAssetUrl(url, options), media) : ''
      if (!selected || !displayUrl || seen.has(displayUrl)) return ''
      if (
        format === 'avif' &&
        (!/\.avif(?:[?#]|$)/i.test(displayUrl) || /^https:\/\/cms\.matthiasramahi\.de\/api\/media\/file\//i.test(displayUrl))
      ) {
        return ''
      }
      seen.add(displayUrl)
      return `${displayUrl} ${assetWidthFromUrl(displayUrl) || sizeWidths[selected] || sizeWidths[size] || 1600}w`
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
  options: FetchOptions = {},
): Promise<T | null> {
  void collection
  void params
  void draft
  void options
  return null
}

export async function getGlobal<T>(slug: string, options: GlobalOptions = {}): Promise<T | null> {
  if (shouldReadTinaContent()) {
    const tinaGlobal = getTinaGlobal<T>(slug)
    return tinaGlobal
  }

  void options
  return null
}

export const getSiteSettings = (options: GlobalOptions = {}) => getGlobal<SiteSettings>('site-settings', options)
export const getNavigation = (options: GlobalOptions = {}) => getGlobal<NavigationGlobal>('navigation', options)
export const getFooter = (options: GlobalOptions = {}) => getGlobal<FooterGlobal>('footer', options)
export const getGlobalCtas = (options: GlobalOptions = {}) => getGlobal<GlobalCtas>('global-ctas', options)

export async function listDocuments(collection: string, options: ListOptions = {}): Promise<PayloadDoc[]> {
  if (shouldReadTinaContent()) {
    const tinaDocs = listTinaDocuments(collection, options)
    if (tinaDocs.length > 0) return tinaDocs
  }

  if (collection === 'portfolio-projects') {
    return [...(fallbackPortfolioProjects as unknown as PayloadDoc[])]
  }

  return []
}

export async function getBySlug(collection: string, slug: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  if (shouldReadTinaContent()) {
    const tinaDoc = getTinaBySlug(collection, slug, options)
    if (tinaDoc) return tinaDoc
  }

  if (collection === 'portfolio-projects') {
    return (fallbackPortfolioProjects as unknown as readonly PayloadDoc[]).find((project) => project.slug === slug) ?? null
  }

  return null
}

export async function getByLegacyUrl(collection: string, legacyUrl: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  if (shouldReadTinaContent()) {
    const tinaDoc = getTinaByLegacyUrl(collection, legacyUrl, options)
    return tinaDoc
  }

  return null
}

const normalizeLegacyKey = (value?: string) => {
  if (!value) return ''

  try {
    const parsed = new URL(value)
    return parsed.pathname.replace(/^\/+/, '')
  } catch {
    return value.replace(/^\/+/, '')
  }
}

export async function getLegacyUrlIndex(collection: string, options: ListOptions = {}): Promise<Map<string, PayloadDoc>> {
  if (shouldReadTinaContent()) {
    const tinaIndex = getTinaLegacyUrlIndex(collection, options)
    return tinaIndex
  }

  const cacheKey = `${collection}:${options.depth ?? 2}:${options.limit ?? 500}:${options.draft ? 'draft' : 'published'}:${options.force ? 'force' : 'default'}:${options.cacheMs ?? 0}`
  const cached = legacyUrlIndexCache.get(cacheKey)
  if (cached) return cached

  const request = Promise.resolve(new Map<string, PayloadDoc>())

  legacyUrlIndexCache.set(cacheKey, request)
  return request
}

export async function getByLegacyUrlFromIndex(
  collection: string,
  legacyUrl: string,
  options: ListOptions = {},
): Promise<PayloadDoc | null> {
  const index = await getLegacyUrlIndex(collection, options)
  return index.get(normalizeLegacyKey(legacyUrl)) ?? null
}

export async function getSitePageByType(pageType: string, options: ListOptions = {}): Promise<PayloadDoc | null> {
  if (shouldReadTinaContent()) {
    const tinaDoc = getTinaSitePageByType(pageType, options)
    return tinaDoc
  }

  return null
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
