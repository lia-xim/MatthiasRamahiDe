/**
 * Global image-compression presets. The CMS exposes these as a single dial
 * ("Eco / Standard / Maximal") in Website-Einstellungen. The values mirror the
 * structure Payload's `imageSizes` expect (one WebP + one AVIF quality per width
 * tier) and are reused by the reoptimize endpoint so the dial actually takes
 * effect on existing images, not just new uploads.
 */

export type MediaQualityPreset = 'eco' | 'standard' | 'maximal'

export type TierQuality = { webp: number; avif: number }

export type MediaQualityProfile = {
  thumb: TierQuality
  mobile: TierQuality
  card: TierQuality
  hero: TierQuality
  wide: TierQuality
}

export const MEDIA_QUALITY_PROFILES: Record<MediaQualityPreset, MediaQualityProfile> = {
  // Smallest files / fastest load. Targets ~380 KB for a 2560px hero photo.
  // Kept in sync with scripts/recompress-all-media.ts.
  eco: {
    thumb: { webp: 78, avif: 54 },
    mobile: { webp: 80, avif: 56 },
    card: { webp: 80, avif: 56 },
    hero: { webp: 76, avif: 52 },
    wide: { webp: 73, avif: 50 },
  },
  // Balanced quality/size for web.
  standard: {
    thumb: { webp: 84, avif: 60 },
    mobile: { webp: 86, avif: 64 },
    card: { webp: 86, avif: 66 },
    hero: { webp: 84, avif: 64 },
    wide: { webp: 82, avif: 62 },
  },
  // Near-lossless for portfolio-grade detail. Noticeably larger files.
  maximal: {
    thumb: { webp: 88, avif: 72 },
    mobile: { webp: 92, avif: 76 },
    card: { webp: 92, avif: 78 },
    hero: { webp: 90, avif: 76 },
    wide: { webp: 90, avif: 74 },
  },
}

export const MEDIA_QUALITY_LABELS: Record<MediaQualityPreset, string> = {
  eco: 'Eco - kleinste Dateien, schnellste Ladezeit',
  standard: 'Standard - ausgewogen (empfohlen)',
  maximal: 'Maximal - hoechste Qualitaet, groessere Dateien',
}

export const isMediaQualityPreset = (value: unknown): value is MediaQualityPreset =>
  value === 'eco' || value === 'standard' || value === 'maximal'

/**
 * Default preset for NEW uploads, read once at config build time from the
 * environment. Changing the live dial in the CMS affects re-optimization
 * immediately; new uploads adopt a changed default after the next deploy.
 */
export const defaultMediaQualityPreset = (): MediaQualityPreset => {
  const fromEnv = process.env.PAYLOAD_MEDIA_QUALITY
  return isMediaQualityPreset(fromEnv) ? fromEnv : 'standard'
}

export const resolveMediaQualityProfile = (preset?: MediaQualityPreset | null): MediaQualityProfile =>
  MEDIA_QUALITY_PROFILES[isMediaQualityPreset(preset) ? preset : 'standard']
