#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()

function argValue(name) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : ''
}

function latestMigrationOutputDir() {
  const outputsDir = path.join(repoRoot, 'outputs')
  if (!fs.existsSync(outputsDir)) return ''

  return fs
    .readdirSync(outputsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('payload-tina-migration-'))
    .map((entry) => path.join(outputsDir, entry.name))
    .sort()
    .at(-1)
}

const migrationDir = path.resolve(argValue('migration-dir') || latestMigrationOutputDir() || '')
const exportDir = path.resolve(argValue('export-dir') || path.join(migrationDir, 'payload-export'))
const mediaDocsPath = path.resolve(argValue('media-docs') || path.join(exportDir, 'collections', 'media.raw.json'))
const mediaFilesPath = path.resolve(argValue('media-files') || path.join(exportDir, 'media-files.manifest.json'))
const generatedManifestPath = path.resolve(
  argValue('generated-manifest') || path.join(repoRoot, 'apps', 'web', 'src', 'data', 'tinaGeneratedMediaManifest.json'),
)
const outputPath = path.resolve(argValue('out') || path.join(repoRoot, 'apps', 'web', 'src', 'data', 'tinaMediaManifest.json'))
const publicPathPrefix = `/${(argValue('public-path') || 'uploads/payload').replace(/^\/+|\/+$/g, '')}`

if (!fs.existsSync(mediaDocsPath)) {
  console.error(`Media collection export not found: ${mediaDocsPath}`)
  process.exit(1)
}

if (!fs.existsSync(mediaFilesPath)) {
  console.error(`Media files manifest not found: ${mediaFilesPath}`)
  process.exit(1)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readOptionalJson(filePath) {
  if (!fs.existsSync(filePath)) return null
  return readJson(filePath)
}

function encodePublicPath(filePath) {
  return filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

function publicUrl(filename) {
  if (!filename) return ''
  return `${publicPathPrefix}/${encodePublicPath(filename)}`
}

function fileNameFromUrl(url) {
  if (!url) return ''
  const clean = String(url).split('#')[0].split('?')[0]
  const file = clean.split('/').pop() || ''
  try {
    return decodeURIComponent(file)
  } catch {
    return file
  }
}

function decodeKey(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function normalizeSize(size) {
  if (!size) return null
  const filename = size.filename || fileNameFromUrl(size.url)
  return {
    filename,
    url: publicUrl(filename),
    width: size.width ?? null,
    height: size.height ?? null,
    mimeType: size.mimeType ?? null,
    filesize: size.filesize ?? null,
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

const mediaDocs = readJson(mediaDocsPath)
const mediaFiles = readJson(mediaFilesPath)
const generatedManifest = readOptionalJson(generatedManifestPath)
const fileByPath = new Map(mediaFiles.map((file) => [file.path, file]))

const payloadItems = mediaDocs.map((doc) => {
  const originalFilename = doc.filename || fileNameFromUrl(doc.url)
  const sizes = Object.fromEntries(
    Object.entries(doc.sizes || {})
      .map(([name, size]) => [name, normalizeSize(size)])
      .filter(([, size]) => Boolean(size?.filename)),
  )
  const referencedFiles = unique([
    originalFilename,
    doc.thumbnailURL ? fileNameFromUrl(doc.thumbnailURL) : '',
    ...Object.values(sizes).map((size) => size.filename),
  ])
  const availableFiles = referencedFiles.filter((filename) => fileByPath.has(filename))
  const missingFiles = referencedFiles.filter((filename) => !fileByPath.has(filename))

  return {
    id: String(doc.id),
    source: 'payload',
    title: doc.title ?? null,
    alt: doc.alt ?? null,
    caption: doc.caption ?? null,
    filename: originalFilename,
    url: publicUrl(originalFilename),
    width: doc.width ?? null,
    height: doc.height ?? null,
    mimeType: doc.mimeType ?? null,
    filesize: doc.filesize ?? null,
    focalX: doc.focalX ?? null,
    focalY: doc.focalY ?? null,
    dominantColor: doc.dominantColor ?? null,
    blurDataUrl: doc.blurDataUrl ?? null,
    orientation: doc.orientation ?? null,
    category: doc.category ?? null,
    tags: doc.tags ?? [],
    imageType: doc.imageType ?? [],
    visualTone: doc.visualTone ?? [],
    usagePurpose: doc.usagePurpose ?? [],
    usageNotes: doc.usageNotes ?? null,
    legacySourcePath: doc.legacySourcePath ?? null,
    updatedAt: doc.updatedAt ?? null,
    createdAt: doc.createdAt ?? null,
    sizes,
    files: {
      referenced: referencedFiles,
      available: availableFiles,
      missing: missingFiles,
    },
  }
})

const generatedItems = Array.isArray(generatedManifest?.items)
  ? generatedManifest.items.map((item) => ({ ...item, source: item.source || 'tina-upload' }))
  : []
const items = [...payloadItems, ...generatedItems]
const referenced = new Set(payloadItems.flatMap((item) => item.files.referenced))

function pathKeysFromUrl(url) {
  if (!url) return []
  const clean = decodeKey(String(url).split('#')[0].split('?')[0])
  const withoutSlash = clean.replace(/^\/+/, '')
  const withoutUploads = withoutSlash.replace(/^uploads\//, '')
  return unique([clean, withoutSlash, withoutUploads, path.posix.basename(withoutUploads)])
}

function itemFilenameKeys(item) {
  const filename = item.filename ? decodeKey(String(item.filename)) : ''
  return unique([
    item.id,
    filename,
    filename ? path.posix.basename(filename) : '',
    ...pathKeysFromUrl(item.url),
    item.url,
  ])
}

function buildIndex(getKeys) {
  const index = {}
  items.forEach((item, position) => {
    for (const key of unique(getKeys(item))) {
      index[key] = position
    }
  })
  return index
}

const indexes = {
  byId: buildIndex((item) => [item.id]),
  byFilename: buildIndex(itemFilenameKeys),
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: {
    migrationDir: path.relative(repoRoot, migrationDir).replaceAll(path.sep, '/'),
    mediaDocs: path.relative(repoRoot, mediaDocsPath).replaceAll(path.sep, '/'),
    mediaFiles: path.relative(repoRoot, mediaFilesPath).replaceAll(path.sep, '/'),
    generatedManifest: fs.existsSync(generatedManifestPath)
      ? path.relative(repoRoot, generatedManifestPath).replaceAll(path.sep, '/')
      : null,
  },
  target: {
    publicPathPrefix,
    filesystemRoot: `apps/web/public${publicPathPrefix}`,
  },
  stats: {
    mediaDocuments: mediaDocs.length,
    generatedUploads: generatedItems.length,
    totalMediaItems: items.length,
    exportedFiles: mediaFiles.length,
    referencedFiles: referenced.size,
    availableReferencedFiles: payloadItems.reduce((sum, item) => sum + item.files.available.length, 0),
    missingReferencedFiles: payloadItems.reduce((sum, item) => sum + item.files.missing.length, 0),
    unreferencedExportedFiles: mediaFiles.filter((file) => !referenced.has(file.path)).length,
  },
  indexes,
  items,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log('Tina media manifest complete')
console.log(`Output: ${outputPath}`)
console.log(`Media documents: ${manifest.stats.mediaDocuments}`)
console.log(`Generated Tina uploads: ${manifest.stats.generatedUploads}`)
console.log(`Referenced files: ${manifest.stats.referencedFiles}`)
console.log(`Missing referenced files: ${manifest.stats.missingReferencedFiles}`)
console.log(`Unreferenced exported files: ${manifest.stats.unreferencedExportedFiles}`)
