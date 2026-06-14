#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function argValue(name) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : ''
}

const uploadsRoot = path.resolve(argValue('uploads-dir') || path.join(repoRoot, 'apps', 'web', 'public', 'uploads'))
const generatedRoot = path.resolve(argValue('generated-dir') || path.join(uploadsRoot, 'generated'))
const outputPath = path.resolve(
  argValue('out') || path.join(repoRoot, 'apps', 'web', 'src', 'data', 'tinaGeneratedMediaManifest.json'),
)
const force = process.argv.includes('--force')
const dryRun = process.argv.includes('--dry-run')

const imageExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.tif', '.tiff', '.webp'])
const skippedTopLevelDirs = new Set(['generated', 'payload'])

const variants = [
  { key: 'thumb', width: 360, height: 360, format: 'webp', quality: 78, fit: 'cover' },
  { key: 'thumbAvif', width: 360, height: 360, format: 'avif', quality: 55, fit: 'cover' },
  { key: 'mobile', width: 760, format: 'webp', quality: 82 },
  { key: 'mobileAvif', width: 760, format: 'avif', quality: 60 },
  { key: 'card', width: 1100, format: 'webp', quality: 86 },
  { key: 'cardAvif', width: 1100, format: 'avif', quality: 68 },
  { key: 'hero', width: 1920, format: 'webp', quality: 88 },
  { key: 'heroAvif', width: 1920, format: 'avif', quality: 72 },
  { key: 'wide', width: 2560, format: 'webp', quality: 90 },
  { key: 'wideAvif', width: 2560, format: 'avif', quality: 74 },
]

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function encodePublicPath(filePath) {
  return toPosix(filePath)
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

function publicUrl(relativeToUploads) {
  return `/uploads/${encodePublicPath(relativeToUploads)}`
}

function generatedUrl(relativeToGenerated) {
  return publicUrl(`generated/${relativeToGenerated}`)
}

function slugSegment(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80)
}

function outputBaseFor(relativeFile) {
  const parsed = path.posix.parse(relativeFile)
  const hash = crypto.createHash('sha1').update(relativeFile).digest('hex').slice(0, 10)
  const safeDirs = parsed.dir
    ? parsed.dir
        .split('/')
        .map((segment) => slugSegment(segment) || 'upload')
        .join('/')
    : ''
  const safeName = slugSegment(parsed.name) || 'image'
  const dir = safeDirs ? `${safeDirs}/${safeName}-${hash}` : `${safeName}-${hash}`
  return { dir, name: safeName }
}

function orientationFor(width, height) {
  if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) return null
  const ratio = width / height
  if (ratio > 2.05) return 'panorama'
  if (ratio > 1.12) return 'landscape'
  if (ratio < 0.88) return 'portrait'
  return 'square'
}

function hexFromPixel(pixel) {
  return `#${[pixel[0], pixel[1], pixel[2]].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function mimeTypeFor(format) {
  const normalized = String(format || '').toLowerCase()
  if (normalized === 'jpg' || normalized === 'jpeg') return 'image/jpeg'
  if (normalized === 'tif' || normalized === 'tiff') return 'image/tiff'
  return normalized ? `image/${normalized}` : null
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function walkImages(dir, root = dir) {
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const files = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dir, entry.name)
    const relative = toPosix(path.relative(root, fullPath))
    const topLevel = relative.split('/')[0]

    if (entry.isDirectory()) {
      if (dir === root && skippedTopLevelDirs.has(entry.name)) continue
      if (skippedTopLevelDirs.has(topLevel)) continue
      files.push(...(await walkImages(fullPath, root)))
      continue
    }

    if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath)
  }
  return files
}

async function needsWrite(sourcePath, targetPath) {
  if (force) return true
  const [sourceStat, targetStat] = await Promise.all([
    fs.stat(sourcePath),
    fs.stat(targetPath).catch((error) => {
      if (error?.code === 'ENOENT') return null
      throw error
    }),
  ])
  return !targetStat || targetStat.mtimeMs < sourceStat.mtimeMs
}

async function generateVariant(sourcePath, relativeFile, sourceMetadata, variant) {
  const { dir, name } = outputBaseFor(relativeFile)
  const extension = variant.format === 'avif' ? 'avif' : 'webp'
  const outputFilename = `${name}-${variant.width}.${extension}`
  const outputRelative = `${dir}/${outputFilename}`
  const outputPathForVariant = path.join(generatedRoot, outputRelative)

  if (!dryRun && (await needsWrite(sourcePath, outputPathForVariant))) {
    await fs.mkdir(path.dirname(outputPathForVariant), { recursive: true })

    let pipeline = sharp(sourcePath)
      .rotate()
      .resize({
        width: variant.width,
        height: variant.height,
        fit: variant.fit || 'inside',
        withoutEnlargement: true,
      })

    if (variant.format === 'avif') {
      pipeline = pipeline.avif({ quality: variant.quality, effort: 6 })
    } else {
      pipeline = pipeline.webp({ quality: variant.quality, effort: 5, smartSubsample: true })
    }

    await pipeline.toFile(outputPathForVariant)
  }

  const metadata = dryRun
    ? {
        width: Math.min(sourceMetadata.width || variant.width, variant.width),
        height: sourceMetadata.height || null,
        format: variant.format,
      }
    : await sharp(outputPathForVariant).metadata()
  const fileStat = dryRun ? { size: 0 } : await fs.stat(outputPathForVariant)

  return {
    filename: toPosix(path.relative(uploadsRoot, outputPathForVariant)),
    url: generatedUrl(outputRelative),
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    mimeType: mimeTypeFor(metadata.format || variant.format),
    filesize: fileStat.size,
  }
}

async function dominantColor(sourcePath) {
  const { data } = await sharp(sourcePath)
    .rotate()
    .resize(1, 1, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return hexFromPixel(data)
}

async function blurDataUrl(sourcePath) {
  const blur = await sharp(sourcePath)
    .rotate()
    .resize({ width: 24, withoutEnlargement: true })
    .webp({ quality: 35, effort: 4 })
    .toBuffer()
  return `data:image/webp;base64,${blur.toString('base64')}`
}

async function optimizeImage(filePath) {
  const relativeFile = toPosix(path.relative(uploadsRoot, filePath))
  const sourceStat = await fs.stat(filePath)
  const sourceMetadata = await sharp(filePath).metadata()
  const sizes = {}

  for (const variant of variants) {
    sizes[variant.key] = await generateVariant(filePath, relativeFile, sourceMetadata, variant)
  }

  return {
    id: `tina-upload:${relativeFile}`,
    source: 'tina-upload',
    title: path.parse(relativeFile).name,
    alt: null,
    caption: null,
    filename: relativeFile,
    url: publicUrl(relativeFile),
    width: sourceMetadata.width ?? null,
    height: sourceMetadata.height ?? null,
    mimeType: mimeTypeFor(sourceMetadata.format),
    filesize: sourceStat.size,
    focalX: null,
    focalY: null,
    dominantColor: await dominantColor(filePath),
    blurDataUrl: await blurDataUrl(filePath),
    orientation: orientationFor(sourceMetadata.width, sourceMetadata.height),
    updatedAt: sourceStat.mtime.toISOString(),
    createdAt: sourceStat.birthtime.toISOString(),
    sizes,
    files: {
      referenced: [relativeFile, ...Object.values(sizes).map((size) => size.filename).filter(Boolean)],
      available: [relativeFile, ...Object.values(sizes).map((size) => size.filename).filter(Boolean)],
      missing: [],
    },
  }
}

if (!(await exists(uploadsRoot))) await fs.mkdir(uploadsRoot, { recursive: true })

const images = (await walkImages(uploadsRoot)).sort()
const items = []
const failures = []

for (const imagePath of images) {
  try {
    items.push(await optimizeImage(imagePath))
    console.log(`Optimized Tina upload: ${toPosix(path.relative(repoRoot, imagePath))}`)
  } catch (error) {
    failures.push({ file: toPosix(path.relative(repoRoot, imagePath)), message: error?.message || String(error) })
    console.error(`Failed Tina upload optimization: ${failures.at(-1).file}: ${failures.at(-1).message}`)
  }
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: {
    uploadsRoot: toPosix(path.relative(repoRoot, uploadsRoot)),
    generatedRoot: toPosix(path.relative(repoRoot, generatedRoot)),
  },
  stats: {
    scannedUploads: images.length,
    optimizedUploads: items.length,
    failedUploads: failures.length,
    generatedFiles: items.reduce((sum, item) => sum + Object.keys(item.sizes || {}).length, 0),
  },
  failures,
  items,
}

if (!dryRun) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

console.log('Tina upload optimizer complete')
console.log(`Output: ${outputPath}`)
console.log(`Scanned uploads: ${manifest.stats.scannedUploads}`)
console.log(`Optimized uploads: ${manifest.stats.optimizedUploads}`)
console.log(`Failed uploads: ${manifest.stats.failedUploads}`)

if (failures.length > 0) process.exit(1)
