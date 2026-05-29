import { constants } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(repoRoot, 'apps', 'web', 'public')
const assetSource = path.join(repoRoot, 'assets')
const assetTarget = path.join(publicRoot, 'assets')
const includeRootReferenceFiles = process.env.SYNC_INCLUDE_ROOT_REFERENCE_HTML === 'true'
const mediaExtensions = new Set([
  '.avif',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.mp4',
  '.png',
  '.svg',
  '.webm',
  '.webmanifest',
  '.webp',
])
const assetReferenceExtensions = new Set([...mediaExtensions, '.css', '.js', '.json', '.txt', '.xml'])
const rootReferenceTextExtensions = new Set(['.html', '.css', '.js', '.xml', '.txt', '.webmanifest'])
const appSourceReferenceExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
])
const assetTextReferenceExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml'])
const copiedAssetPaths = new Set()

let copied = 0
let skipped = 0
let bytes = 0
let removed = 0
let removedHtml = 0

async function exists(filePath) {
  try {
    await fs.access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function shouldCopy(source, target) {
  const sourceStat = await fs.stat(source)
  try {
    const targetStat = await fs.stat(target)
    return sourceStat.size !== targetStat.size || sourceStat.mtimeMs > targetStat.mtimeMs + 1000
  } catch {
    return true
  }
}

async function copyFile(source, target) {
  if (!(await shouldCopy(source, target))) {
    skipped += 1
    return
  }

  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.copyFile(source, target)
  const sourceStat = await fs.stat(source)
  await fs.utimes(target, sourceStat.atime, sourceStat.mtime)
  copied += 1
  bytes += sourceStat.size
}

async function removePublicRootHtml() {
  let publicEntries = []
  try {
    publicEntries = await fs.readdir(publicRoot, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of publicEntries) {
    if (!entry.isFile()) continue
    if (path.extname(entry.name).toLowerCase() !== '.html') continue
    await fs.rm(path.join(publicRoot, entry.name), { force: true })
    removed += 1
    removedHtml += 1
  }
}

async function copyDirectory(sourceDir, targetDir, referencedAssets = null) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })
  await fs.mkdir(targetDir, { recursive: true })

  for (const entry of entries) {
    const source = path.join(sourceDir, entry.name)
    const target = path.join(targetDir, entry.name)
    if (entry.isDirectory()) {
      await copyDirectory(source, target, referencedAssets)
    } else if (entry.isFile()) {
      if (referencedAssets) {
        const relativeAssetPath = toAssetReference(source)
        if (!referencedAssets.has(relativeAssetPath)) {
          continue
        }
        copiedAssetPaths.add(relativeAssetPath)
      }
      await copyFile(source, target)
    }
  }
}

async function syncRootMedia() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  const referencedRootMedia = await rootMediaReferencedBySite(entries)

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).toLowerCase()
    if (!mediaExtensions.has(ext)) continue
    if (!referencedRootMedia.has(entry.name)) continue
    await copyFile(path.join(repoRoot, entry.name), path.join(publicRoot, entry.name))
  }

  await removeUnreferencedRootMedia(entries, referencedRootMedia)
}

async function rootMediaReferencedBySite(entries) {
  const rootMedia = entries
    .filter((entry) => entry.isFile() && mediaExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)

  const searchFiles = []
  if (includeRootReferenceFiles) searchFiles.push(...rootTextReferenceFiles(entries))
  searchFiles.push(...(await collectTextFiles(path.join(repoRoot, 'apps', 'web', 'src'), appSourceReferenceExtensions)))

  const haystackParts = []
  for (const file of searchFiles) {
    try {
      haystackParts.push(await fs.readFile(file, 'utf8'))
    } catch {
      // Ignore binary or unreadable artifacts during the sync scan.
    }
  }
  const haystack = haystackParts.join('\n')

  return new Set(rootMedia.filter((file) => haystack.includes(file)))
}

async function collectTextFiles(dir, extensions = assetTextReferenceExtensions) {
  const files = []
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['.git', 'dist', 'node_modules'].includes(entry.name)) continue
      files.push(...(await collectTextFiles(fullPath, extensions)))
    } else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath)
    }
  }
  return files
}

async function assetsReferencedBySite(entries) {
  const searchFiles = []
  if (includeRootReferenceFiles) searchFiles.push(...rootTextReferenceFiles(entries))

  searchFiles.push(...(await collectTextFiles(path.join(repoRoot, 'apps', 'web', 'src'), appSourceReferenceExtensions)))

  const referenced = new Set()
  const visitedFiles = new Set()
  const queuedAssetText = new Set()
  let cursor = 0

  while (cursor < searchFiles.length) {
    const file = searchFiles[cursor]
    cursor += 1
    if (visitedFiles.has(file)) continue
    visitedFiles.add(file)

    try {
      const text = await fs.readFile(file, 'utf8')
      for (const assetPath of extractAssetReferences(text, file)) {
        referenced.add(assetPath)
        const sourcePath = assetSourcePath(assetPath)
        if (!sourcePath || queuedAssetText.has(sourcePath)) continue
        queuedAssetText.add(sourcePath)
        searchFiles.push(sourcePath)
      }
    } catch {
      // Ignore binary or unreadable artifacts during the sync scan.
    }
  }

  return referenced
}

function rootTextReferenceFiles(entries) {
  return entries
    .filter((entry) => entry.isFile() && rootReferenceTextExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(repoRoot, entry.name))
}

function assetSourcePath(assetPath) {
  const extension = path.extname(assetPath).toLowerCase()
  if (!assetTextReferenceExtensions.has(extension)) return null
  const cleanPath = assetPath.replace(/^assets\//, '')
  const sourcePath = path.resolve(assetSource, cleanPath)
  if (sourcePath !== assetSource && !sourcePath.startsWith(`${assetSource}${path.sep}`)) return null
  return sourcePath
}

function extractAssetReferences(text, filePath) {
  const matches = new Set()
  const attributePattern = /\b(?:src|href|poster|content|data-full)=["']([^"']+)["']/g
  let match
  while ((match = attributePattern.exec(text))) {
    const value = match[1].trim()
    if (value.startsWith('assets/')) {
      addAssetReference(matches, value)
    } else {
      const assetIndex = value.indexOf('/assets/')
      if (assetIndex >= 0) {
        addAssetReference(matches, value.slice(assetIndex + 1))
      }
    }
  }

  const srcsetPattern = /\bsrcset=["']([^"']+)["']/g
  while ((match = srcsetPattern.exec(text))) {
    for (const candidate of match[1].split(',')) {
      const value = candidate.trim().split(/\s+/)[0]
      if (value?.startsWith('assets/')) addAssetReference(matches, value)
    }
  }

  const directAssetPattern =
    /(?:["'(`=]|^)(\/?assets\/[^"'`,>?#\r\n]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp|css|js|json|txt|xml))/gi
  while ((match = directAssetPattern.exec(text))) {
    addAssetReference(matches, match[1])
  }

  const urlPattern = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^'")]+))\s*\)/g
  const relativeDir = path.relative(assetSource, path.dirname(filePath))
  while ((match = urlPattern.exec(text))) {
    const url = (match[1] || match[2] || match[3] || '').trim()
    if (!url || url.startsWith('data:') || url.startsWith('http') || url.startsWith('/')) continue
    if (url.startsWith('assets/')) {
      addAssetReference(matches, url)
      continue
    }
    if (!relativeDir.startsWith('..')) {
      addAssetReference(matches, path.posix.join('assets', toPosix(relativeDir), url))
    }
  }

  return matches
}

function addAssetReference(matches, reference) {
  const normalized = normalizeAssetReference(reference)
  const extension = path.extname(normalized).toLowerCase()
  if (!assetReferenceExtensions.has(extension)) return
  matches.add(normalized)
}

function normalizeAssetReference(reference) {
  const clean = reference.split('#')[0].split('?')[0].replace(/^\/+/, '')
  let decoded = clean
  try {
    decoded = decodeURIComponent(clean)
  } catch {
    decoded = clean
  }
  return toPosix(path.posix.normalize(decoded))
}

function toAssetReference(filePath) {
  return normalizeAssetReference(`assets/${toPosix(path.relative(assetSource, filePath))}`)
}

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

async function removeUnreferencedRootMedia(entries, referencedRootMedia) {
  const rootMediaNames = new Set(
    entries
      .filter((entry) => entry.isFile() && mediaExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name),
  )

  try {
    const publicEntries = await fs.readdir(publicRoot, { withFileTypes: true })
    for (const entry of publicEntries) {
      if (!entry.isFile()) continue
      if (!rootMediaNames.has(entry.name)) continue
      if (referencedRootMedia.has(entry.name)) continue
      await fs.rm(path.join(publicRoot, entry.name), { force: true })
      removed += 1
    }
  } catch {
    // Public root may not exist yet; copy steps above will create it.
  }
}

async function removeUnreferencedPublicAssets(dir, referencedAssets) {
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await removeUnreferencedPublicAssets(fullPath, referencedAssets)
      const remaining = await fs.readdir(fullPath)
      if (remaining.length === 0) {
        await fs.rmdir(fullPath)
      }
      continue
    }
    if (!entry.isFile()) continue
    const relativeAssetPath = normalizeAssetReference(`assets/${toPosix(path.relative(assetTarget, fullPath))}`)
    if (referencedAssets.has(relativeAssetPath)) continue
    await fs.rm(fullPath, { force: true })
    removed += 1
  }
}

if (!(await exists(assetSource))) {
  throw new Error(`Assets folder not found: ${assetSource}`)
}

await fs.mkdir(publicRoot, { recursive: true })
const rootEntries = await fs.readdir(repoRoot, { withFileTypes: true })
const referencedAssets = await assetsReferencedBySite(rootEntries)
await copyDirectory(assetSource, assetTarget, referencedAssets)
await removeUnreferencedPublicAssets(assetTarget, referencedAssets)
await syncRootMedia()
await removePublicRootHtml()

const copiedMb = (bytes / 1024 / 1024).toFixed(2)
const missingAssets = [...referencedAssets].filter((assetPath) => !copiedAssetPaths.has(assetPath))
console.log(
  `Public asset sync complete: ${copied} copied (${copiedMb} MB), ${skipped} unchanged, ${copiedAssetPaths.size}/${referencedAssets.size} referenced assets present, ${removedHtml} public HTML removed, ${removed} stale files removed.`,
)
if (missingAssets.length > 0) {
  console.warn(`Missing referenced assets: ${missingAssets.slice(0, 20).join(', ')}${missingAssets.length > 20 ? ', ...' : ''}`)
}
