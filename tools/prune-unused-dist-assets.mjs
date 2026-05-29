import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetExtensions = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp4', '.png', '.svg', '.webm', '.webp'])
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.txt', '.webmanifest', '.xml'])
const defaultTargets = [
  path.join(repoRoot, 'apps', 'web', 'dist', 'client'),
  path.join(repoRoot, 'apps', 'web', '.vercel', 'output', 'static'),
  path.join(repoRoot, '.vercel', 'output', 'static'),
]

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function decodePath(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const files = []
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(fullPath)))
    else if (entry.isFile()) files.push(fullPath)
  }
  return files
}

function normalizeReference(value, sourceFile, targetRoot) {
  if (!value || /^(?:data:|mailto:|tel:|#|javascript:)/i.test(value)) return ''

  let clean = value.split('#')[0].split('?')[0].trim()
  if (!clean) return ''

  if (/^https?:\/\//i.test(clean)) {
    try {
      clean = new URL(clean).pathname
    } catch {
      return ''
    }
  }

  clean = decodePath(clean)
  if (clean.startsWith('/')) return toPosix(path.posix.normalize(clean.replace(/^\/+/, '')))
  if (/^(?:assets|_astro)\//.test(clean)) return toPosix(path.posix.normalize(clean))

  const resolved = path.resolve(path.dirname(sourceFile), clean)
  if (resolved === targetRoot || !resolved.startsWith(`${targetRoot}${path.sep}`)) return ''
  return toPosix(path.relative(targetRoot, resolved))
}

function extractReferences(text, sourceFile, targetRoot) {
  const refs = new Set()
  const add = (value) => {
    const ref = normalizeReference(value, sourceFile, targetRoot)
    if (ref) refs.add(ref)
  }

  const attrPattern = /\b(?:src|href|poster|content|data-full)=["']([^"']+)["']/g
  let match
  while ((match = attrPattern.exec(text))) add(match[1])

  const srcsetPattern = /\bsrcset=["']([^"']+)["']/g
  while ((match = srcsetPattern.exec(text))) {
    for (const candidate of match[1].split(',')) add(candidate.trim().split(/\s+/)[0])
  }

  const directAssetPattern = /(?:["'(`=]|^)(\/?(?:assets|_astro)\/[^"'`\s,)>?#]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp|css|js|json|txt|webmanifest|xml))/gi
  while ((match = directAssetPattern.exec(text))) add(match[1])

  const urlPattern = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^'")]+))\s*\)/g
  while ((match = urlPattern.exec(text))) add(match[1] || match[2] || match[3])

  return refs
}

async function removeEmptyDirs(dir) {
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.isDirectory()) await removeEmptyDirs(path.join(dir, entry.name))
  }

  try {
    if ((await fs.readdir(dir)).length === 0) await fs.rmdir(dir)
  } catch {
    // Ignore races or non-empty directories.
  }
}

async function pruneTarget(targetRoot) {
  if (!(await exists(targetRoot))) return null

  const files = await walk(targetRoot)
  const referenced = new Set()
  for (const file of files) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue
    const text = await fs.readFile(file, 'utf8')
    for (const ref of extractReferences(text, file, targetRoot)) referenced.add(ref)
  }

  let removed = 0
  let bytes = 0
  for (const file of files) {
    if (!assetExtensions.has(path.extname(file).toLowerCase())) continue
    const rel = toPosix(path.relative(targetRoot, file))
    if (referenced.has(rel)) continue

    const stat = await fs.stat(file)
    await fs.rm(file, { force: true })
    removed += 1
    bytes += stat.size
  }

  await removeEmptyDirs(targetRoot)

  return {
    removed,
    mb: Number((bytes / 1024 / 1024).toFixed(2)),
    target: toPosix(path.relative(repoRoot, targetRoot)),
  }
}

const argTargets = process.argv.filter((arg) => arg.startsWith('--target=')).map((arg) => path.resolve(repoRoot, arg.slice('--target='.length)))
const targets = argTargets.length > 0 ? argTargets : defaultTargets
const results = (await Promise.all(targets.map(pruneTarget))).filter(Boolean)

for (const result of results) {
  if (result.removed > 0) {
    console.log(`Pruned unused dist assets from ${result.target}: ${result.removed} removed (${result.mb} MB).`)
  }
}
