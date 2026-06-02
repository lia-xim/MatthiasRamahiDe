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
  // Smaller files, still clean for web. ~30-40% lighter than Standard.
  eco: {
    thumb: { webp: 78, avif: 55 },
    mobile: { webp: 80, avif: 60 },
    card: { webp: 82, avif: 62 },
    hero: { webp: 84, avif: 66 },
    wide: { webp: 84, avif: 66 },
  },
  // Current production tuning. Balanced quality/size.
  standard: {
    thumb: { webp: 84, avif: 62 },
    mobile: { webp: 88, avif: 70 },
    card: { webp: 90, avif: 74 },
    hero: { webp: 94, avif: 80 },
    wide: { webp: 94, avif: 80 },
  },
  // Near-lossless for portfolio-grade detail. Noticeably larger files.
  maximal: {
    thumb: { webp: 90, avif: 72 },
    mobile: { webp: 92, avif: 78 },
    card: { webp: 95, avif: 82 },
    hero: { webp: 97, avif: 86 },
    wide: { webp: 97, avif: 88 },
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
