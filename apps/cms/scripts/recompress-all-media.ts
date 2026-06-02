import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'
import sharp from 'sharp'

/**
 * Bulk re-compresses the existing responsive variant FILES in place (stable
 * filenames -> the live site serves the smaller files immediately, no rebuild,
 * no broken URLs) and updates the corresponding `sizes_*_filesize` columns so
 * the CMS optimization panel stays accurate. The 360px `thumb` (a centre crop)
 * is intentionally left untouched.
 *
 * Quality is chosen via PRESET=eco|standard|maximal (default eco) so the same
 * script can be re-run at a higher quality if the editor wants more detail.
 *
 * Env:
 *   PRESET=eco            quality preset (eco|standard|maximal)
 *   RECOMPRESS_DRY_RUN=true   only report, write nothing
 *   RECOMPRESS_LIMIT=n    process only first n media (for a quick sample)
 */

type Tier = 'mobile' | 'card' | 'hero' | 'wide'
type Profile = Record<Tier, { webp: number; avif: number }>

const PROFILES: Record<string, Profile> = {
  eco: {
    mobile: { webp: 80, avif: 56 },
    card: { webp: 80, avif: 56 },
    hero: { webp: 76, avif: 52 },
    wide: { webp: 73, avif: 50 },
  },
  standard: {
    mobile: { webp: 86, avif: 64 },
    card: { webp: 86, avif: 66 },
    hero: { webp: 84, avif: 64 },
    wide: { webp: 82, avif: 62 },
  },
  maximal: {
    mobile: { webp: 92, avif: 76 },
    card: { webp: 92, avif: 78 },
    hero: { webp: 90, avif: 76 },
    wide: { webp: 90, avif: 74 },
  },
}

const VARIANTS: { fileCol: string; sizeCol: string; tier: Tier; fmt: 'webp' | 'avif'; width: number }[] = [
  { fileCol: 'sizes_mobile_filename', sizeCol: 'sizes_mobile_filesize', tier: 'mobile', fmt: 'webp', width: 760 },
  { fileCol: 'sizes_card_filename', sizeCol: 'sizes_card_filesize', tier: 'card', fmt: 'webp', width: 1100 },
  { fileCol: 'sizes_hero_filename', sizeCol: 'sizes_hero_filesize', tier: 'hero', fmt: 'webp', width: 1920 },
  { fileCol: 'sizes_wide_filename', sizeCol: 'sizes_wide_filesize', tier: 'wide', fmt: 'webp', width: 2560 },
  { fileCol: 'sizes_mobile_avif_filename', sizeCol: 'sizes_mobile_avif_filesize', tier: 'mobile', fmt: 'avif', width: 760 },
  { fileCol: 'sizes_card_avif_filename', sizeCol: 'sizes_card_avif_filesize', tier: 'card', fmt: 'avif', width: 1100 },
  { fileCol: 'sizes_hero_avif_filename', sizeCol: 'sizes_hero_avif_filesize', tier: 'hero', fmt: 'avif', width: 1920 },
  { fileCol: 'sizes_wide_avif_filename', sizeCol: 'sizes_wide_avif_filesize', tier: 'wide', fmt: 'avif', width: 2560 },
]

const presetName = (process.env.PRESET || 'eco').toLowerCase()
const profile = PROFILES[presetName] || PROFILES.eco
const dryRun = process.env.RECOMPRESS_DRY_RUN === 'true'
const limit = process.env.RECOMPRESS_LIMIT ? Number(process.env.RECOMPRESS_LIMIT) : undefined
// Optional: only process specific tiers, e.g. TIERS=hero,wide (covers webp + avif).
const onlyTiers = (process.env.TIERS || '')
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean)

const mediaDir = path.resolve(process.cwd(), 'media')
const safeJoin = (filename: string) => {
  const resolved = path.resolve(mediaDir, filename)
  if (resolved !== mediaDir && !resolved.startsWith(`${mediaDir}${path.sep}`)) throw new Error(`Unsafe path: ${filename}`)
  return resolved
}
const mb = (bytes: number) => (bytes / 1048576).toFixed(2)

async function main() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  const pool = (payload.db as unknown as { pool: { query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> } }).pool

  const cols = ['id', 'filename', ...VARIANTS.map((v) => v.fileCol)].join(', ')
  const { rows } = await pool.query(`SELECT ${cols} FROM media ORDER BY id`)
  const targets = typeof limit === 'number' ? rows.slice(0, limit) : rows

  console.log(`Preset: ${presetName}  | Medien: ${targets.length}${dryRun ? '  (DRY-RUN)' : ''}`)

  let processed = 0
  let variantsDone = 0
  let bytesBefore = 0
  let bytesAfter = 0
  let missingSource = 0

  for (const row of targets) {
    if (!row.filename) continue
    const sourcePath = safeJoin(String(row.filename))
    if (!fs.existsSync(sourcePath)) {
      missingSource += 1
      continue
    }

    const updates: { col: string; size: number }[] = []

    for (const v of VARIANTS) {
      if (onlyTiers.length && !onlyTiers.includes(v.tier)) continue
      const filename = row[v.fileCol]
      if (!filename) continue
      const targetPath = safeJoin(String(filename))
      if (targetPath === sourcePath || !fs.existsSync(targetPath)) continue

      const before = fs.statSync(targetPath).size
      bytesBefore += before

      if (dryRun) {
        bytesAfter += before
        variantsDone += 1
        continue
      }

      const quality = v.fmt === 'webp' ? profile[v.tier].webp : profile[v.tier].avif
      const tempPath = `${targetPath}.${process.pid}.tmp`
      const pipeline = sharp(sourcePath)
        .rotate()
        .resize({ kernel: sharp.kernel.lanczos3, width: v.width, withoutEnlargement: true })

      if (v.fmt === 'webp') {
        await pipeline.webp({ effort: 5, quality, smartSubsample: true }).toFile(tempPath)
      } else {
        await pipeline.avif({ effort: 4, quality }).toFile(tempPath)
      }

      const after = fs.statSync(tempPath).size
      await fsp.rename(tempPath, targetPath)
      bytesAfter += after
      updates.push({ col: v.sizeCol, size: after })
      variantsDone += 1
    }

    if (!dryRun && updates.length > 0) {
      const setSql = updates.map((u, i) => `${u.col} = $${i + 1}`).join(', ')
      await pool.query(`UPDATE media SET ${setSql} WHERE id = $${updates.length + 1}`, [
        ...updates.map((u) => u.size),
        row.id,
      ])
    }

    processed += 1
    if (processed % 50 === 0) console.log(`  ... ${processed}/${targets.length}`)
  }

  await payload.destroy()

  console.log('Fertig.')
  console.log(`Medien verarbeitet: ${processed}`)
  console.log(`Varianten neu komprimiert: ${variantsDone}`)
  console.log(`Originaldatei fehlte: ${missingSource}`)
  console.log(`Gesamt vorher: ${mb(bytesBefore)} MB -> nachher: ${mb(bytesAfter)} MB  (${bytesBefore > 0 ? Math.round((1 - bytesAfter / bytesBefore) * 100) : 0}% kleiner)`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Recompress fehlgeschlagen:', error)
    process.exit(1)
  })
