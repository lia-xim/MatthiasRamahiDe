/**
 * Pure, dependency-free helper that derives a human-readable optimization status
 * from a Media document. Shared by the admin list cell, the edit-view panel and
 * the reoptimize endpoint so the verdict is computed identically everywhere.
 */

export type MediaSizeLike = { url?: string | null; width?: number | null; filesize?: number | null }
export type MediaLike = {
  width?: number | null
  height?: number | null
  filesize?: number | null
  blurDataUrl?: string | null
  sizes?: Record<string, MediaSizeLike | undefined> | null
}

export type OptimizationLevel = 'optimized' | 'incomplete' | 'unoptimized' | 'small-original'

export type OptimizationStatus = {
  level: OptimizationLevel
  label: string
  color: string
  hint: string
  variantCount: number
  expectedFullSet: boolean
  largestVariantWidth: number
  servesOriginal: boolean
  missingBlur: boolean
}

const CARD_WIDTH = 1100
// Below this original width, serving the original is fine — no large variant is needed.
const SMALL_ORIGINAL_WIDTH = 900

const ALL_SIZE_KEYS = [
  'thumb',
  'mobile',
  'card',
  'hero',
  'wide',
  'thumbAvif',
  'mobileAvif',
  'cardAvif',
  'heroAvif',
  'wideAvif',
] as const

const sizeEntries = (media: MediaLike) =>
  ALL_SIZE_KEYS.map((key) => media.sizes?.[key]).filter((size): size is MediaSizeLike => Boolean(size && size.url))

export const getMediaOptimizationStatus = (media: MediaLike): OptimizationStatus => {
  const entries = sizeEntries(media)
  const variantCount = entries.length
  const largestVariantWidth = entries.reduce((max, size) => Math.max(max, size.width || 0), 0)
  const originalWidth = media.width || 0
  const hasCard = Boolean(media.sizes?.card?.url)
  const hasCardAvif = Boolean(media.sizes?.cardAvif?.url)
  const missingBlur = !media.blurDataUrl

  // The website falls back to the full-resolution original when no usable display
  // variant exists for the requested slot.
  const servesOriginal = !hasCard && originalWidth > Math.max(largestVariantWidth, SMALL_ORIGINAL_WIDTH)

  let level: OptimizationLevel
  if (hasCard && hasCardAvif) {
    level = 'optimized'
  } else if (originalWidth > 0 && originalWidth < SMALL_ORIGINAL_WIDTH) {
    level = 'small-original'
  } else if (servesOriginal || variantCount <= 1) {
    level = 'unoptimized'
  } else {
    level = 'incomplete'
  }

  const map: Record<OptimizationLevel, { label: string; color: string; hint: string }> = {
    optimized: {
      label: 'Optimiert',
      color: '#1f9d55',
      hint: 'Vollstaendige responsive Varianten (WebP + AVIF) vorhanden.',
    },
    incomplete: {
      label: 'Unvollstaendig',
      color: '#d97706',
      hint: 'Einige Groessen oder das AVIF-Format fehlen. Neu optimieren empfohlen.',
    },
    unoptimized: {
      label: 'Nicht optimiert',
      color: '#dc2626',
      hint: 'Kein passendes Derivat - die Website liefert das volle Original aus. Bitte neu optimieren.',
    },
    'small-original': {
      label: 'Klein / Original ok',
      color: '#6b7280',
      hint: 'Original ist klein genug, eine grosse Variante ist nicht noetig.',
    },
  }

  return {
    level,
    ...map[level],
    variantCount,
    expectedFullSet: level === 'optimized',
    largestVariantWidth,
    servesOriginal,
    missingBlur,
  }
}
