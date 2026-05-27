import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'assets', 'optimized')
const SITE = 'https://matthiasramahi.de'
const THRESHOLD_BYTES = 450 * 1024

const mediaExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const sourceImageExtensions = ['.jpg', '.jpeg', '.png']

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function rootHtmlFiles() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

function rootMediaFiles() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && mediaExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

function referencedRootMedia() {
  const html = rootHtmlFiles().map((file) => fs.readFileSync(path.join(ROOT, file), 'utf8')).join('\n')
  return rootMediaFiles().filter((file) => html.includes(file))
}

async function referencedLocalImages() {
  const refs = new Set()
  for (const file of rootHtmlFiles()) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8')
    for (const match of html.matchAll(/\b(?:src|href|content)=["']([^"']+\.(?:jpg|jpeg|png|webp))(?:[#?][^"']*)?["']/gi)) {
      let ref = match[1]
      if (/^https?:\/\//i.test(ref)) {
        if (!ref.startsWith(`${SITE}/`)) continue
        ref = ref.slice(`${SITE}/`.length)
      }
      if (ref.startsWith('/') || ref.startsWith('data:') || ref.startsWith('assets/optimized/')) continue
      const source = await ensureWebpCompanion(ref)
      if (!source.startsWith(ROOT) || !fs.existsSync(source)) continue
      if (!mediaExtensions.has(path.extname(source).toLowerCase())) continue
      refs.add(ref)
    }
  }
  return [...refs].sort((a, b) => a.localeCompare(b))
}

async function ensureWebpCompanion(ref) {
  const source = path.join(ROOT, ref)
  if (fs.existsSync(source)) return source
  if (path.extname(ref).toLowerCase() !== '.webp') return source

  const withoutExtension = ref.replace(/\.webp$/i, '')
  for (const extension of sourceImageExtensions) {
    const original = path.join(ROOT, `${withoutExtension}${extension}`)
    if (!fs.existsSync(original)) continue
    fs.mkdirSync(path.dirname(source), { recursive: true })
    await sharp(original)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(source)
    return source
  }

  return source
}

async function ensureOptimized(file) {
  const source = path.join(ROOT, file)
  const stat = fs.statSync(source)
  if (stat.size < THRESHOLD_BYTES) return null

  await fs.promises.mkdir(OUT_DIR, { recursive: true })
  const targetName = `${slugify(file.replace(/[\\/]/g, '-'))}-1920.webp`
  const target = path.join(OUT_DIR, targetName)
  const needsWrite = !fs.existsSync(target) || fs.statSync(target).mtimeMs < stat.mtimeMs

  if (needsWrite) {
    await sharp(source)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(target)
  }

  return {
    from: file,
    to: `assets/optimized/${targetName}`,
    sourceBytes: stat.size,
    targetBytes: fs.statSync(target).size,
  }
}

function writeFileWithRetry(filePath, content) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      fs.writeFileSync(filePath, content, 'utf8')
      return
    } catch (error) {
      if (attempt === 3) throw error
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150)
    }
  }
}

function rewriteReferences(mapping) {
  let changedFiles = 0
  for (const file of rootHtmlFiles()) {
    const fullPath = path.join(ROOT, file)
    let html = fs.readFileSync(fullPath, 'utf8')
    const before = html

    for (const item of mapping) {
      const from = escapeRegExp(item.from)
      html = html.replace(new RegExp(`${escapeRegExp(SITE)}/${from}`, 'g'), `${SITE}/${item.to}`)
      html = html.replace(new RegExp(`(?<!optimized/)${from}`, 'g'), item.to)
    }

    if (html !== before) {
      writeFileWithRetry(fullPath, html)
      changedFiles += 1
    }
  }
  return changedFiles
}

const mapping = []
const targets = new Set([...referencedRootMedia(), ...(await referencedLocalImages())])
for (const file of targets) {
  const item = await ensureOptimized(file)
  if (item) mapping.push(item)
}

const changedFiles = rewriteReferences(mapping)
const savedBytes = mapping.reduce((total, item) => total + Math.max(0, item.sourceBytes - item.targetBytes), 0)

writeFileWithRetry(
  path.join(OUT_DIR, 'manifest.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      items: mapping,
      savedBytes,
    },
    null,
    2,
  ),
  'utf8',
)

console.log(
  JSON.stringify(
    {
      optimized: mapping.length,
      changedFiles,
      savedMb: Number((savedBytes / 1024 / 1024).toFixed(2)),
      items: mapping.map((item) => ({
        from: item.from,
        to: item.to,
        beforeKb: Math.round(item.sourceBytes / 1024),
        afterKb: Math.round(item.targetBytes / 1024),
      })),
    },
    null,
    2,
  ),
)
