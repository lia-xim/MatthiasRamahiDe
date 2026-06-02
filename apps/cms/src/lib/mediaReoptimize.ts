import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import type { Payload } from 'payload'
import sharp from 'sharp'

import { getMediaOptimizationStatus, type MediaLike, type OptimizationStatus } from './mediaOptimizationStatus'
import { resolveMediaQualityProfile, type MediaQualityPreset, type TierQuality } from './mediaQuality'

type MediaSizeDoc = { url?: string | null; width?: number | null; filename?: string | null }
type MediaDoc = MediaLike & {
  id: string | number
  filename?: string | null
  sizes?: Record<string, MediaSizeDoc | undefined> | null
}

// Width-based variants are recompressed in place to honor the quality dial.
// `thumb`/`thumbAvif` are a 360px centre crop and intentionally left untouched.
const RECOMPRESS_TARGETS: Record<string, { tier: keyof ReturnType<typeof resolveMediaQualityProfile>; format: 'webp' | 'avif'; width: number }> = {
  mobile: { tier: 'mobile', format: 'webp', width: 760 },
  card: { tier: 'card', format: 'webp', width: 1100 },
  hero: { tier: 'hero', format: 'webp', width: 1920 },
  wide: { tier: 'wide', format: 'webp', width: 2560 },
  mobileAvif: { tier: 'mobile', format: 'avif', width: 760 },
  cardAvif: { tier: 'card', format: 'avif', width: 1100 },
  heroAvif: { tier: 'hero', format: 'avif', width: 1920 },
  wideAvif: { tier: 'wide', format: 'avif', width: 2560 },
}

const mediaDirDefault = () => path.resolve(process.cwd(), 'media')

const safeJoin = (baseDir: string, filename: string) => {
  const resolved = path.resolve(baseDir, filename)
  if (resolved !== baseDir && !resolved.startsWith(`${baseDir}${path.sep}`)) {
    throw new Error(`Unsicherer Media-Pfad: ${filename}`)
  }
  return resolved
}

const qualityFor = (tier: TierQuality, format: 'webp' | 'avif') => (format === 'webp' ? tier.webp : tier.avif)

async function recompressVariantsInPlace(doc: MediaDoc, preset: MediaQualityPreset, mediaDir: string) {
  if (!doc.filename) return 0
  const sourcePath = safeJoin(mediaDir, doc.filename)
  if (!fs.existsSync(sourcePath)) return 0 // S3 / remote storage: skip in-place recompress

  const profile = resolveMediaQualityProfile(preset)
  let recompressed = 0

  for (const [sizeName, target] of Object.entries(RECOMPRESS_TARGETS)) {
    const filename = doc.sizes?.[sizeName]?.filename
    if (!filename) continue

    const targetPath = safeJoin(mediaDir, filename)
    if (targetPath === sourcePath || !fs.existsSync(targetPath)) continue

    const quality = qualityFor(profile[target.tier], target.format)
    const tempPath = `${targetPath}.${process.pid}.tmp`
    const pipeline = sharp(sourcePath)
      .rotate()
      .resize({ kernel: sharp.kernel.lanczos3, width: target.width, withoutEnlargement: true })

    if (target.format === 'webp') {
      await pipeline.webp({ effort: 6, quality, smartSubsample: true }).toFile(tempPath)
    } else {
      await pipeline.avif({ effort: 7, quality }).toFile(tempPath)
    }
    await fsp.rename(tempPath, targetPath)
    recompressed += 1
  }

  return recompressed
}

export type ReoptimizeResult = {
  id: string | number
  ok: boolean
  preset: MediaQualityPreset
  before: OptimizationStatus
  after: OptimizationStatus
  recompressed: number
  reason?: string
}

/**
 * Re-runs the full upload pipeline for one media doc (regenerating any missing
 * responsive variants + blur placeholder), then recompresses the width-based
 * variants in place to the requested quality preset. Same ID is preserved, so
 * every page that references the image keeps working.
 */
export async function reoptimizeMedia(
  payload: Payload,
  id: string | number,
  options: { preset?: MediaQualityPreset; mediaDir?: string } = {},
): Promise<ReoptimizeResult> {
  const preset: MediaQualityPreset = options.preset || 'standard'
  const mediaDir = options.mediaDir || mediaDirDefault()

  const before = (await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true })) as MediaDoc
  if (!before?.filename) {
    const status = getMediaOptimizationStatus(before || {})
    return { id, ok: false, preset, before: status, after: status, recompressed: 0, reason: 'Kein Dateiname am Medium.' }
  }

  const sourcePath = safeJoin(mediaDir, before.filename)
  if (!fs.existsSync(sourcePath)) {
    const status = getMediaOptimizationStatus(before)
    return { id, ok: false, preset, before: status, after: status, recompressed: 0, reason: 'Originaldatei nicht gefunden.' }
  }

  // 1. Regenerate the full variant set + blur via Payload's own upload pipeline.
  const regenerated = (await payload.update({
    collection: 'media',
    id,
    filePath: sourcePath,
    data: {},
    overrideAccess: true,
  })) as MediaDoc

  // 2. Apply the quality dial to the width-based variants (no-op for 'standard').
  let recompressed = 0
  if (preset !== 'standard') {
    recompressed = await recompressVariantsInPlace(regenerated, preset, mediaDir)
  }

  return {
    id,
    ok: true,
    preset,
    before: getMediaOptimizationStatus(before),
    after: getMediaOptimizationStatus(regenerated),
    recompressed,
  }
}
