import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'
import sharp from 'sharp'

import { printPayloadScriptError } from './lib/errors'

type RelationId = string | number

type MediaSizeDoc = {
  filename?: string | null
  width?: number | null
  height?: number | null
  filesize?: number | null
  url?: string | null
}

type MediaDoc = {
  id: RelationId
  filename?: string | null
  featured?: boolean | null
  sizes?: Record<string, MediaSizeDoc | undefined> | null
  usagePurpose?: string[] | null
}

type PageDoc = Record<string, unknown> & {
  blocks?: unknown[]
  coverImage?: unknown
  gallery?: Array<{ image?: unknown } | null>
  heroImage?: unknown
  heroSlides?: Array<{ image?: unknown } | null>
  seo?: {
    ogImage?: unknown
  }
  teaserImage?: unknown
}

type TargetSpec = {
  format: 'avif' | 'webp'
  quality: number
  width: number
}

const mediaDerivativeTargets: Record<string, TargetSpec> = {
  card: { format: 'webp', quality: 88, width: 1100 },
  cardAvif: { format: 'avif', quality: 70, width: 1100 },
  hero: { format: 'webp', quality: 92, width: 1920 },
  heroAvif: { format: 'avif', quality: 74, width: 1920 },
  wide: { format: 'webp', quality: 92, width: 2560 },
  wideAvif: { format: 'avif', quality: 74, width: 2560 },
}

const pageCollections = ['site-pages', 'service-pages', 'local-seo-pages', 'portfolio-projects', 'journal-posts'] as const
const dryRun = process.env.HERO_DERIVATIVES_DRY_RUN === 'true'
const shouldBackup = process.env.HERO_DERIVATIVE_BACKUP !== 'false'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

const relationIdFor = (value: unknown): RelationId | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return undefined
}

const addRelationId = (ids: Set<string>, value: unknown) => {
  const id = relationIdFor(value)
  if (typeof id !== 'undefined') ids.add(String(id))
}

const collectImageFields = (ids: Set<string>, value: unknown) => {
  if (!value) return
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageFields(ids, item))
    return
  }
  if (typeof value !== 'object') return

  const record = value as Record<string, unknown>
  addRelationId(ids, record.image)
  addRelationId(ids, record.media)

  for (const child of Object.values(record)) {
    if (Array.isArray(child)) collectImageFields(ids, child)
  }
}

const humanBytes = (bytes?: number) => {
  if (!Number.isFinite(bytes) || !bytes) return '-'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const inside = (baseDir: string, filename: string) => {
  const resolved = path.resolve(baseDir, filename)
  if (resolved !== baseDir && !resolved.startsWith(`${baseDir}${path.sep}`)) {
    throw new Error(`Unsicherer Media-Pfad: ${filename}`)
  }
  return resolved
}

async function findAllDocs<T>(payload: Awaited<ReturnType<typeof getPayload>>, collection: string, depth = 0) {
  const docs: T[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = (await payload.find({
      collection,
      depth,
      draft: true,
      limit: 100,
      overrideAccess: true,
      page,
    } as never)) as unknown as { docs?: T[]; totalPages?: number }

    docs.push(...(result.docs || []))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return docs
}

function collectHeroMediaFromPage(ids: Set<string>, doc: PageDoc) {
  addRelationId(ids, doc.coverImage)
  addRelationId(ids, doc.heroImage)
  addRelationId(ids, doc.teaserImage)
  addRelationId(ids, doc.seo?.ogImage)

  for (const slide of doc.heroSlides || []) addRelationId(ids, slide?.image)
  for (const item of doc.gallery || []) addRelationId(ids, item?.image)
  collectImageFields(ids, doc.blocks)
}

async function collectHeroMediaIds(payload: Awaited<ReturnType<typeof getPayload>>) {
  const ids = new Set<string>()

  for (const collection of pageCollections) {
    const docs = await findAllDocs<PageDoc>(payload, collection, 2)
    for (const doc of docs) collectHeroMediaFromPage(ids, doc)
  }

  const mediaDocs = await findAllDocs<MediaDoc>(payload, 'media', 0)
  for (const media of mediaDocs) {
    const purposes = Array.isArray(media.usagePurpose) ? media.usagePurpose : []
    if (media.featured || purposes.includes('hero') || purposes.includes('social')) {
      ids.add(String(media.id))
    }
  }

  return ids
}

async function statSize(filePath: string) {
  try {
    return (await fsp.stat(filePath)).size
  } catch {
    return undefined
  }
}

async function regenerateTarget(sourcePath: string, targetPath: string, spec: TargetSpec, backupDir: string) {
  const before = await statSize(targetPath)
  const tempPath = `${targetPath}.${process.pid}.tmp`

  if (shouldBackup && before) {
    await fsp.mkdir(backupDir, { recursive: true })
    await fsp.copyFile(targetPath, path.join(backupDir, path.basename(targetPath)))
  }

  const pipeline = sharp(sourcePath)
    .rotate()
    .resize({
      kernel: sharp.kernel.lanczos3,
      width: spec.width,
      withoutEnlargement: true,
    })

  if (spec.format === 'webp') {
    await pipeline.webp({ effort: 6, quality: spec.quality, smartSubsample: true }).toFile(tempPath)
  } else {
    await pipeline.avif({ effort: 7, quality: spec.quality }).toFile(tempPath)
  }

  const after = await statSize(tempPath)
  await fsp.rename(tempPath, targetPath)
  return { after, before }
}

async function regenerateMedia(mediaDir: string, backupDir: string, media: MediaDoc) {
  if (!media.filename) return { missingSource: 1, regenerated: 0, skipped: 0 }

  const sourcePath = inside(mediaDir, media.filename)
  if (!fs.existsSync(sourcePath)) return { missingSource: 1, regenerated: 0, skipped: 0 }

  const seenTargets = new Set<string>()
  let regenerated = 0
  let skipped = 0

  for (const [sizeName, spec] of Object.entries(mediaDerivativeTargets)) {
    const filename = media.sizes?.[sizeName]?.filename
    if (!filename) {
      skipped += 1
      continue
    }

    const targetPath = inside(mediaDir, filename)
    if (targetPath === sourcePath || seenTargets.has(targetPath)) {
      skipped += 1
      continue
    }
    seenTargets.add(targetPath)

    if (dryRun) {
      const currentSize = await statSize(targetPath)
      console.log(`[dry-run] ${media.id} ${sizeName}: ${path.basename(targetPath)} aktuell ${humanBytes(currentSize)}`)
      regenerated += 1
      continue
    }

    const { after, before } = await regenerateTarget(sourcePath, targetPath, spec, backupDir)
    console.log(`${media.id} ${sizeName}: ${path.basename(targetPath)} ${humanBytes(before)} -> ${humanBytes(after)}`)
    regenerated += 1
  }

  return { missingSource: 0, regenerated, skipped }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const mediaDir = path.resolve(process.cwd(), 'media')
  const backupDir = path.join(mediaDir, '_quality-backups', new Date().toISOString().replace(/[:.]/g, '-'))
  const ids = await collectHeroMediaIds(cms)

  let regenerated = 0
  let skipped = 0
  let missingSource = 0

  console.log(`Hero-/Featured-Medien gefunden: ${ids.size}`)
  if (dryRun) console.log('Dry-run aktiv: Es werden keine Dateien geschrieben.')
  if (!dryRun && shouldBackup) console.log(`Backups: ${backupDir}`)

  for (const id of ids) {
    const media = (await cms.findByID({
      collection: 'media',
      id,
      overrideAccess: true,
    } as never)) as MediaDoc

    const result = await regenerateMedia(mediaDir, backupDir, media)
    regenerated += result.regenerated
    skipped += result.skipped
    missingSource += result.missingSource
  }

  console.log('Hero-Media-Derivate fertig.')
  console.log(`Regeneriert: ${regenerated}`)
  console.log(`Uebersprungen: ${skipped}`)
  console.log(`Originaldatei fehlt: ${missingSource}`)
} catch (error) {
  printPayloadScriptError(error, 'Hero-Media-Derivate regenerieren')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
