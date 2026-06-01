import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetExtensions = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp4', '.png', '.svg', '.webm', '.webp'])
const textExtensions = new Set(['.cjs', '.css', '.html', '.js', '.json', '.mjs', '.txt', '.webmanifest', '.xml'])
// Path prefixes (relative to a prune target root) that must never be removed,
// regardless of static reference detection. Curated responsive image variants
// live here and are referenced via runtime-rendered srcset on SSR routes.
const keepPrefixes = ['assets/optimized/']
const defaultTargets = [
  path.join(repoRoot, 'apps', 'web', 'dist', 'client'),
  path.join(repoRoot, 'apps', 'web', '.vercel', 'output', 'static'),
  path.join(repoRoot, '.vercel', 'output', 'static'),
]
const extraReferenceRoots = new Map([
  [
    path.join(repoRoot, 'apps', 'web', 'dist', 'client'),
    [path.join(repoRoot, 'apps', 'web', 'dist', 'server')],
  ],
])

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

  // Match every assets//_astro path token anywhere — not only those preceded by
  // a quote/paren/=. srcset values stored as plain strings in the SSR server
  // bundle ("/a-480.webp 480w, /a-640.webp 640w, ...") otherwise only matched
  // their first entry, so the comma/space-separated variants (640/1280/...) were
  // wrongly treated as unused and pruned -> 404 for responsive srcset variants.
  // Over-matching here only keeps extra files (safe); a miss deletes a used one.
  const directAssetPattern = /(\/?(?:assets|_astro)\/[^"'`\s,)>?#]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp|css|js|json|txt|webmanifest|xml))/gi
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
  const extraReferenceFiles = []
  for (const referenceRoot of extraReferenceRoots.get(targetRoot) || []) {
    extraReferenceFiles.push(...(await walk(referenceRoot)))
  }
  const referenced = new Set()
  for (const file of [...files, ...extraReferenceFiles]) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue
    let text = ''
    try {
      text = await fs.readFile(file, 'utf8')
    } catch (error) {
      if (error?.code === 'ENOENT') continue
      throw error
    }
    for (const ref of extractReferences(text, file, targetRoot)) referenced.add(ref)
  }

  let removed = 0
  let bytes = 0
  for (const file of files) {
    if (!assetExtensions.has(path.extname(file).toLowerCase())) continue
    const rel = toPosix(path.relative(targetRoot, file))
    if (referenced.has(rel)) continue
    // Never prune curated responsive variants under assets/optimized/. They are
    // referenced almost exclusively through srcset strings rendered at runtime by
    // SSR routes, which are not reliably visible to static reference scanning of
    // the Vercel static output -> they were wrongly pruned, 404ing widths like
    // -480/-640. These files exist to be served; keeping them is the safe default.
    if (keepPrefixes.some((prefix) => rel.startsWith(prefix))) continue

    let stat
    try {
      stat = await fs.stat(file)
    } catch (error) {
      if (error?.code === 'ENOENT') continue
      throw error
    }
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
const results = []
for (const target of targets) {
  const result = await pruneTarget(target)
  if (result) results.push(result)
}

for (const result of results) {
  if (result.removed > 0) {
    console.log(`Pruned unused dist assets from ${result.target}: ${result.removed} removed (${result.mb} MB).`)
  }
}
