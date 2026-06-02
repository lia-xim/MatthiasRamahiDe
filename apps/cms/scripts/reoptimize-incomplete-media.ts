import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'
import { reoptimizeMedia } from '../src/lib/mediaReoptimize'
import { isMediaQualityPreset, type MediaQualityPreset } from '../src/lib/mediaQuality'

/**
 * Re-runs the full Payload upload pipeline (all imageSizes + enrichMedia hook)
 * for media whose responsive variants are incomplete — e.g. legacy fast-import
 * uploads that only carry the 360px `thumb`. Unlike regenerate-hero-media-derivatives,
 * which only recompresses variant files that already exist, this re-processes the
 * ORIGINAL via `payload.update({ filePath })`, so missing size records are created.
 *
 * Detection: a doc is "incomplete" when it lacks a usable `card` (1100px) WebP
 * variant while its original is large enough to produce one — exactly the case
 * where the website falls back to serving the full-resolution original.
 *
 * Env:
 *   REOPT_DRY_RUN=true    list candidates, write nothing
 *   REOPT_LIMIT=<n>       only process the first n candidates (safe staged runs)
 *   REOPT_IDS=1,2,3       only process these specific ids (overrides detection)
 *   REOPT_PRESET=eco      quality preset to apply (eco|standard|maximal, default standard)
 *   REOPT_ALL=true        process every media doc (e.g. to apply a new global preset)
 */

type MediaSizeDoc = { url?: string | null; width?: number | null; filename?: string | null }
type MediaDoc = {
  id: string | number
  filename?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, MediaSizeDoc | undefined> | null
}

const CARD_WIDTH = 1100
const dryRun = process.env.REOPT_DRY_RUN === 'true'
const processAll = process.env.REOPT_ALL === 'true'
const limit = process.env.REOPT_LIMIT ? Number(process.env.REOPT_LIMIT) : undefined
const preset: MediaQualityPreset = isMediaQualityPreset(process.env.REOPT_PRESET) ? process.env.REOPT_PRESET : 'standard'
const forcedIds = (process.env.REOPT_IDS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const variantCount = (doc: MediaDoc) =>
  doc.sizes ? Object.values(doc.sizes).filter((size) => size && size.url).length : 0

const isIncomplete = (doc: MediaDoc) => {
  const hasCard = Boolean(doc.sizes?.card?.url)
  const originalWidth = doc.width || 0
  // Large enough to deserve a card variant, but it is missing -> oversized/original is served.
  return !hasCard && originalWidth >= CARD_WIDTH * 0.6
}

async function findAllMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  const docs: MediaDoc[] = []
  let page = 1
  let totalPages = 1
  do {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      draft: true,
      limit: 100,
      overrideAccess: true,
      page,
    })
    docs.push(...(result.docs as MediaDoc[]))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)
  return docs
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const mediaDir = path.resolve(process.cwd(), 'media')
  const all = await findAllMedia(cms)

  let candidates = forcedIds.length
    ? all.filter((doc) => forcedIds.includes(String(doc.id)))
    : processAll
      ? all
      : all.filter(isIncomplete)

  candidates.sort((a, b) => Number(a.id) - Number(b.id))
  if (typeof limit === 'number' && Number.isFinite(limit)) candidates = candidates.slice(0, limit)

  console.log(`Medien gesamt: ${all.length}`)
  console.log(`Zu verarbeiten: ${candidates.length} (Qualitaetsstufe: ${preset})`)
  if (dryRun) console.log('Dry-run aktiv: Es werden keine Dateien geschrieben.')

  let reprocessed = 0
  let missingSource = 0
  let failed = 0

  for (const doc of candidates) {
    const before = variantCount(doc)
    const sourcePath = doc.filename ? path.resolve(mediaDir, doc.filename) : ''
    const fileExists = Boolean(sourcePath && fs.existsSync(sourcePath))

    if (!fileExists) {
      missingSource += 1
      console.warn(`  [${doc.id}] Originaldatei fehlt: ${doc.filename}`)
      continue
    }

    if (dryRun) {
      console.log(`  [dry-run] ${doc.id} ${doc.filename} (${doc.width}x${doc.height}) Varianten ${before} -> wuerde neu verarbeitet`)
      reprocessed += 1
      continue
    }

    try {
      const result = await reoptimizeMedia(cms, doc.id, { preset, mediaDir })
      if (result.ok) {
        console.log(`  [${doc.id}] ${doc.filename}: Varianten ${before} -> ${result.after.variantCount}${result.recompressed ? ` (+${result.recompressed} neu komprimiert)` : ''}`)
        reprocessed += 1
      } else {
        failed += 1
        console.error(`  [${doc.id}] uebersprungen: ${result.reason}`)
      }
    } catch (error) {
      failed += 1
      console.error(`  [${doc.id}] FEHLER:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('Reoptimierung fertig.')
  console.log(`Neu verarbeitet: ${reprocessed}`)
  console.log(`Originaldatei fehlt: ${missingSource}`)
  console.log(`Fehlgeschlagen: ${failed}`)
} catch (error) {
  printPayloadScriptError(error, 'Unvollstaendige Medien reoptimieren')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
