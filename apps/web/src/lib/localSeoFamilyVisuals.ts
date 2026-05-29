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

export async function getFamilyVisualSourceDoc(
  family: LocalSeoLayoutFamily,
  doc: PayloadDoc | null | undefined,
  legacyFile: string,
  defaultLegacyFile: string,
) {
  if (legacyFile === defaultLegacyFile && doc?.serviceType) return doc

  const canonical = (doc?.canonicalServicePage || null) as PayloadDoc | number | string | null
  if (isPayloadDoc(canonical)) return canonical

  const slug = serviceSlugByFamily[family]
  const bySlug = await getBySlug('service-pages', slug, liveCmsFetchOptions({ depth: 2 }))
  if (bySlug) return bySlug

  return getLegacyBackedDoc(localSeoParentLegacyFiles[family], liveCmsFetchOptions({ depth: 2 }))
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

  add(doc?.heroImage, doc?.title)
  add(doc?.teaserImage, doc?.title)

  for (const block of (doc?.blocks || []) as ImageSequenceBlock[]) {
    if (block?.blockType !== 'imageSequence') continue
    for (const item of block.items || []) add(item.image, item.caption || block.headline)
  }

  return visuals
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
): FamilyVisualSlot[] {
  const mediaItems = collectMedia(doc)

  return fallbacks.map((fallback, index) => {
    const mediaItem = mediaItems[index]
    const fallbackValue = fallbackSlot(fallback)
    const media = mediaItem?.media

    if (!media) return fallbackValue

    if (!isPayloadMedia(media)) {
      const mediaUrl = toDisplayAssetUrl(media)
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

    const full = imageDisplayUrl(media, 'wide', { allowOriginal: true }) || fallbackValue.full
    const src = imageDisplayUrl(media, 'card', { allowOriginal: true }) || full
    const mobile = imageDisplayUrl(media, 'mobile', { allowOriginal: true }) || src
    const dimensions = imageDimensions(media, 'card')

    return {
      alt: imageAlt(media, mediaItem.caption || fallback.alt),
      cssFull: cssUrl(full),
      cssMobile: cssUrl(mobile),
      cssSrc: cssUrl(src),
      full,
      height: dimensions.height || media.height || fallbackValue.height,
      mobile,
      src,
      srcset: imageSrcset(media, ['mobile', 'card', 'hero', 'wide']) || '',
      width: dimensions.width || media.width || fallbackValue.width,
    }
  })
}

export const localSeoFamilyServiceType = (family: LocalSeoLayoutFamily) => serviceTypeByFamily[family]
