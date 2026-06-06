import {
  getBySlug,
  getLegacyBackedDoc,
  imageAlt,
  imageDimensions,
  imageDisplayUrl,
  imageSrcset,
  liveCmsFetchOptions,
  toDisplayAssetUrl,
  type PayloadDoc,
  type PayloadMedia,
} from './payload'
import { localSeoParentLegacyFiles, type LocalSeoLayoutFamily } from './localSeoLayoutFamilies'
import { splitHeroTitleLines } from './heroTitleLines'

type ImageSequenceBlock = {
  blockType?: string
  headline?: string
  items?: Array<{
    caption?: string
    image?: PayloadMedia | string
  }>
}

export type FamilyVisualFallback = {
  alt: string
  full?: string
  height?: number
  mobile?: string
  src: string
  width?: number
}

export type FamilyVisualSlot = Required<Pick<FamilyVisualFallback, 'alt' | 'src'>> & {
  cssFull: string
  cssMobile: string
  cssSrc: string
  full: string
  height: number
  mobile: string
  srcset: string
  width: number
}

type FamilyHeroCopyFallback = {
  lead: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  titleLines: string[]
}

export type FamilyHeroCopy = FamilyHeroCopyFallback

const serviceSlugByFamily: Record<LocalSeoLayoutFamily, string> = {
  automobil: 'automobil-fotografie',
  landschaft: 'landschaftsfotografie',
  motorrad: 'motorrad-fotografie',
  oldtimer: 'oldtimer-fotografie',
  portrait: 'portraitfotografie',
  sportwagen: 'sportwagen-fotografie',
}

const serviceTypeByFamily: Record<LocalSeoLayoutFamily, string> = {
  automobil: 'automotive',
  landschaft: 'landschaft',
  motorrad: 'motorrad',
  oldtimer: 'oldtimer',
  portrait: 'portrait',
  sportwagen: 'sportwagen',
}

const portfolioProjectSlugByFamily: Record<LocalSeoLayoutFamily, string> = {
  automobil: 'portfolio-auswahl-automobil',
  landschaft: 'portfolio-auswahl-landschaft',
  motorrad: 'portfolio-auswahl-motorrad',
  oldtimer: 'portfolio-auswahl-oldtimer',
  portrait: 'portfolio-auswahl-portrait',
  sportwagen: 'portfolio-auswahl-sportwagen',
}

const isPayloadDoc = (value: unknown): value is PayloadDoc =>
  Boolean(value && typeof value === 'object' && 'id' in (value as Record<string, unknown>))

const isPayloadMedia = (value: unknown): value is PayloadMedia =>
  Boolean(value && typeof value === 'object' && ('url' in (value as Record<string, unknown>) || 'sizes' in (value as Record<string, unknown>)))

const mediaKey = (media: PayloadMedia | string | undefined) => {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || media.id || media.title || ''
}

const cssUrl = (url: string) => (url.startsWith('http') || url.startsWith('/') ? url : `/${url}`)

const textValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const cachedCmsMedia: Array<[RegExp, string]> = [
  [/assets-portfolio-dsc3879-1920-760x507\.webp$/i, '/assets/portfolio/thumbs/_DSC3879.webp'],
  [/assets-portfolio-dsc3879-1920(?:-1920x1280)?\.webp$/i, '/assets/optimized/assets-portfolio-dsc3879-1920.webp'],
  [/assets-portfolio-dsc3982-1920-760x507\.webp$/i, '/assets/portfolio/thumbs/_DSC3982.webp'],
  [/assets-portfolio-dsc3982-1920(?:-1920x1280)?\.webp$/i, '/assets/optimized/assets-portfolio-dsc3982-1920.webp'],
  [/assets-photos-automobil-neon-1920\.webp$/i, '/assets/optimized/assets-photos-automobil-neon-1920.webp'],
  [/assets-photos-oldtimer-stage-1920(?:-1920x1280)?\.webp$/i, '/assets/optimized/assets-photos-oldtimer-stage-1920.webp'],
]

function cachedCmsMediaUrl(url: string) {
  const match = cachedCmsMedia.find(([pattern]) => pattern.test(url))
  return match ? match[1] : url
}

export async function getFamilyVisualSourceDoc(
  family: LocalSeoLayoutFamily,
  doc: PayloadDoc | null | undefined,
  _legacyFile: string,
  _defaultLegacyFile: string,
) {
  const canonical = (doc?.canonicalServicePage || null) as PayloadDoc | number | string | null
  const slug = serviceSlugByFamily[family]
  const portfolioSlug = portfolioProjectSlugByFamily[family]
  const [bySlug, legacyBackedDoc, portfolioProject] = await Promise.all([
    getBySlug('service-pages', slug, liveCmsFetchOptions({ depth: 2, cacheMs: 0 })),
    getLegacyBackedDoc(localSeoParentLegacyFiles[family], liveCmsFetchOptions({ depth: 2, cacheMs: 0 })),
    getBySlug('portfolio-projects', portfolioSlug, liveCmsFetchOptions({ depth: 2, cacheMs: 0 })),
  ])
  const pageCandidates = [doc, isPayloadDoc(canonical) ? canonical : null, bySlug, legacyBackedDoc]
  const authoredHeroCandidate = pageCandidates.find(hasAuthoredHeroVisual)
  if (authoredHeroCandidate) return authoredHeroCandidate

  const richPageCandidate = pageCandidates.find((candidate) => visualCount(candidate) >= 2)

  if (richPageCandidate) return richPageCandidate
  if (visualCount(portfolioProject) >= 2) return portfolioProject

  return pageCandidates.find(Boolean) || portfolioProject
}

function collectMedia(doc: PayloadDoc | null | undefined) {
  const visuals: Array<{ caption?: string; media: PayloadMedia | string }> = []
  const seen = new Set<string>()

  const add = (media: PayloadMedia | string | undefined, caption?: string) => {
    if (!media) return
    const key = mediaKey(media)
    if (!key || seen.has(key)) return
    seen.add(key)
    visuals.push({ caption, media })
  }

  for (const slide of doc?.heroSlides || []) {
    add(slide.image, slide.headlineLine1 || slide.headlineLine2 || slide.lead || doc?.title)
  }

  for (const panel of doc?.heroPanels || []) add(panel.image, doc?.title)
  add(doc?.heroImage, doc?.title)
  add(doc?.coverImage, doc?.title)
  add(doc?.teaserImage, doc?.title)

  for (const item of doc?.gallery || []) add(item.image, item.caption || doc?.title)
  for (const item of doc?.shootingStyles || []) add(item.image, item.title || doc?.title)
  for (const item of doc?.portfolioTiles || []) add(item.image, item.label || doc?.title)
  for (const item of doc?.audienceCards || []) add(item.image, item.title || doc?.title)
  for (const item of doc?.projectPage?.perspectives || []) add(item.image, item.title || doc?.title)
  for (const item of doc?.projectPage?.relatedCards || []) add(item.image, item.title || doc?.title)

  for (const block of (doc?.blocks || []) as ImageSequenceBlock[]) {
    if (block?.blockType !== 'imageSequence') continue
    for (const item of block.items || []) add(item.image, item.caption || block.headline)
  }

  return visuals
}

const visualCount = (doc: PayloadDoc | null | undefined) => collectMedia(doc).length

const hasAuthoredHeroVisual = (doc: PayloadDoc | null | undefined) =>
  Boolean(doc?.heroSlides?.length || doc?.heroPanels?.length)

const firstHeroSlide = (doc: PayloadDoc | null | undefined, visualDoc: PayloadDoc | null | undefined) => {
  const candidates = [doc, visualDoc]

  for (const candidate of candidates) {
    for (const slide of candidate?.heroSlides || []) {
      if (
        textValue(slide.headlineLine1) ||
        textValue(slide.headlineLine2) ||
        textValue(slide.lead) ||
        textValue(slide.primaryHref) ||
        textValue(slide.primaryLabel) ||
        textValue(slide.secondaryHref) ||
        textValue(slide.secondaryLabel)
      ) {
        return slide
      }
    }
  }

  return null
}

export function familyHeroCopy(
  doc: PayloadDoc | null | undefined,
  visualDoc: PayloadDoc | null | undefined,
  fallback: FamilyHeroCopyFallback,
): FamilyHeroCopy {
  const slide = firstHeroSlide(doc, visualDoc)
  const authoredTitleLines = [textValue(slide?.headlineLine1), textValue(slide?.headlineLine2)]
    .filter(Boolean)
    .flatMap((line) => splitHeroTitleLines(line))

  return {
    lead: textValue(slide?.lead) || textValue(doc?.intro) || fallback.lead,
    primaryHref: textValue(slide?.primaryHref) || fallback.primaryHref,
    primaryLabel: textValue(slide?.primaryLabel) || fallback.primaryLabel,
    secondaryHref: textValue(slide?.secondaryHref) || fallback.secondaryHref,
    secondaryLabel: textValue(slide?.secondaryLabel) || fallback.secondaryLabel,
    titleLines: authoredTitleLines.length ? authoredTitleLines : fallback.titleLines,
  }
}

const fallbackSlot = (fallback: FamilyVisualFallback): FamilyVisualSlot => {
  const full = toDisplayAssetUrl(fallback.full || fallback.src)
  const mobile = toDisplayAssetUrl(fallback.mobile || fallback.src)
  const src = toDisplayAssetUrl(fallback.src)
  const width = fallback.width || 1600
  const height = fallback.height || 1067

  return {
    alt: fallback.alt,
    cssFull: cssUrl(full),
    cssMobile: cssUrl(mobile),
    cssSrc: cssUrl(src),
    full,
    height,
    mobile,
    src,
    srcset: '',
    width,
  }
}

export function familyVisualSlots(
  doc: PayloadDoc | null | undefined,
  fallbacks: FamilyVisualFallback[],
  /**
   * Pro Slot ein explizites CMS-Medium (z. B. aus shootingStyles[i].image,
   * portfolioTiles[i].image, audienceCards[i].image). Hat Vorrang vor der
   * positionalen Hero-/Teaser-/imageSequence-Auflösung. `undefined` an einer
   * Position lässt den bisherigen Wert (positional bzw. Fallback) unverändert.
   */
  overrides?: Array<PayloadMedia | string | undefined>,
): FamilyVisualSlot[] {
  const mediaItems = collectMedia(doc)

  return fallbacks.map((fallback, index) => {
    const mediaItem = mediaItems[index]
    const fallbackValue = fallbackSlot(fallback)
    const media = overrides?.[index] ?? mediaItem?.media

    if (!media) return fallbackValue

    if (!isPayloadMedia(media)) {
      const mediaUrl = cachedCmsMediaUrl(toDisplayAssetUrl(media))
      return {
        ...fallbackValue,
        cssFull: cssUrl(mediaUrl),
        cssMobile: cssUrl(mediaUrl),
        cssSrc: cssUrl(mediaUrl),
        full: mediaUrl,
        mobile: mediaUrl,
        src: mediaUrl,
      }
    }

    const full = imageDisplayUrl(media, 'wide', { allowOriginal: true, mapCachedAssets: false }) || fallbackValue.full
    const src = imageDisplayUrl(media, 'card', { allowOriginal: true, mapCachedAssets: false }) || full
    const mobile = imageDisplayUrl(media, 'mobile', { allowOriginal: true, mapCachedAssets: false }) || src
    const dimensions = imageDimensions(media, 'card')

    return {
      alt: imageAlt(media, mediaItem?.caption || fallback.alt),
      cssFull: cssUrl(full),
      cssMobile: cssUrl(mobile),
      cssSrc: cssUrl(src),
      full,
      height: dimensions.height || media.height || fallbackValue.height,
      mobile,
      src,
      srcset: imageSrcset(media, ['mobile', 'card', 'hero', 'wide'], 'raster', { mapCachedAssets: false }) || '',
      width: dimensions.width || media.width || fallbackValue.width,
    }
  })
}

export const localSeoFamilyServiceType = (family: LocalSeoLayoutFamily) => serviceTypeByFamily[family]
