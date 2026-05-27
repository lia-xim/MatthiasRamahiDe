import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targetArg = process.argv.find((arg) => arg.startsWith('--target='))?.slice('--target='.length)
const targetRoot = path.resolve(repoRoot, targetArg || path.join('apps', 'web', 'dist', 'client'))
const assetExtensions = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp4', '.png', '.svg', '.webm', '.webp'])
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.txt', '.xml'])

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function rel(file) {
  return toPosix(path.relative(targetRoot, file))
}

function kb(bytes) {
  return Math.round(bytes / 1024)
}

function mb(bytes) {
  return Number((bytes / 1024 / 1024).toFixed(2))
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12)
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

function decodePath(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function normalizeRef(value) {
  if (!value || /^(?:data:|mailto:|tel:|#|javascript:)/i.test(value)) return ''
  let clean = value.split('#')[0].split('?')[0]
  if (/^https?:\/\//i.test(clean)) {
    try {
      clean = new URL(clean).pathname
    } catch {
      return ''
    }
  }
  clean = clean.replace(/^\/+/, '')
  clean = decodePath(clean)
  return toPosix(path.posix.normalize(clean))
}

function extractRefs(text) {
  const refs = new Set()
  const attrPattern = /\b(?:src|href|poster|content|data-full)=["']([^"']+)["']/g
  let match
  while ((match = attrPattern.exec(text))) {
    const ref = normalizeRef(match[1])
    if (ref) refs.add(ref)
  }

  const srcsetPattern = /\bsrcset=["']([^"']+)["']/g
  while ((match = srcsetPattern.exec(text))) {
    for (const candidate of match[1].split(',')) {
      const ref = normalizeRef(candidate.trim().split(/\s+/)[0])
      if (ref) refs.add(ref)
    }
  }

  const directAssetPattern = /(?:["'(`=]|^)(assets\/[^"'`\s,)>?#]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp|css|js|json|txt|xml))/gi
  while ((match = directAssetPattern.exec(text))) {
    const ref = normalizeRef(match[1])
    if (ref) refs.add(ref)
  }

  const urlPattern = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^'")]+))\s*\)/g
  while ((match = urlPattern.exec(text))) {
    const ref = normalizeRef(match[1] || match[2] || match[3])
    if (ref) refs.add(ref)
  }

  return refs
}

function inlineStats(html) {
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1])
  const scripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/application\/ld\+json/i.test(match[0]))
    .map((match) => match[1])
  return {
    scriptBytes: scripts.reduce((sum, item) => sum + item.length, 0),
    scripts,
    styleBytes: styles.reduce((sum, item) => sum + item.length, 0),
    styles,
  }
}

function duplicateImages(html) {
  const counts = new Map()
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const srcMatch = match[0].match(/(?:^|\s)src\s*=\s*(["'])([^"']+)\1/i)
    if (!srcMatch) continue
    const src = normalizeRef(srcMatch[2])
    if (!src) continue
    counts.set(src, (counts.get(src) || 0) + 1)
  }
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1)
  return {
    duplicateSrcs: duplicates.length,
    repeatedImgTags: duplicates.reduce((sum, [, count]) => sum + count - 1, 0),
    totalImgTags: [...counts.values()].reduce((sum, count) => sum + count, 0),
    uniqueImgSrcs: counts.size,
  }
}

const files = await walk(targetRoot)
const fileStats = await Promise.all(files.map(async (file) => ({ file, size: (await fs.stat(file)).size })))
const totalBytes = fileStats.reduce((sum, item) => sum + item.size, 0)

const byExtension = new Map()
for (const item of fileStats) {
  const ext = path.extname(item.file).toLowerCase() || '[none]'
  byExtension.set(ext, (byExtension.get(ext) || 0) + item.size)
}

const referenced = new Set()
const htmlPages = []
const inlineGroups = {
  script: new Map(),
  style: new Map(),
}

for (const item of fileStats) {
  const ext = path.extname(item.file).toLowerCase()
  if (!textExtensions.has(ext)) continue
  const text = await fs.readFile(item.file, 'utf8')
  for (const ref of extractRefs(text)) referenced.add(ref)

  if (ext !== '.html') continue
  const inline = inlineStats(text)
  const duplicates = duplicateImages(text)
  htmlPages.push({
    duplicateSrcs: duplicates.duplicateSrcs,
    htmlKb: kb(item.size),
    imgTags: duplicates.totalImgTags,
    inlineScriptKb: kb(inline.scriptBytes),
    inlineStyleKb: kb(inline.styleBytes),
    repeatedImgTags: duplicates.repeatedImgTags,
    url: rel(item.file),
  })
  for (const style of inline.styles) {
    const key = hash(style)
    const group = inlineGroups.style.get(key) || { bytes: style.length, count: 0, samples: [] }
    group.count += 1
    if (group.samples.length < 3) group.samples.push(rel(item.file))
    inlineGroups.style.set(key, group)
  }
  for (const script of inline.scripts) {
    const key = hash(script)
    const group = inlineGroups.script.get(key) || { bytes: script.length, count: 0, samples: [] }
    group.count += 1
    if (group.samples.length < 3) group.samples.push(rel(item.file))
    inlineGroups.script.set(key, group)
  }
}

const assets = fileStats.filter((item) => assetExtensions.has(path.extname(item.file).toLowerCase()))
const unusedAssets = assets.filter((item) => !referenced.has(rel(item.file)) && rel(item.file) !== 'favicon.svg')
const repeatedInlineGroups = [...inlineGroups.style.values(), ...inlineGroups.script.values()]
  .filter((group) => group.count > 1 && group.bytes > 512)
  .sort((a, b) => b.bytes * b.count - a.bytes * a.count)

const report = {
  target: toPosix(path.relative(repoRoot, targetRoot)),
  totalMb: mb(totalBytes),
  fileCount: fileStats.length,
  byExtensionKb: Object.fromEntries([...byExtension.entries()].sort((a, b) => b[1] - a[1]).map(([ext, bytes]) => [ext, kb(bytes)])),
  largestAssets: assets
    .sort((a, b) => b.size - a.size)
    .slice(0, 15)
    .map((item) => ({ file: rel(item.file), kb: kb(item.size) })),
  largestHtmlPages: htmlPages
    .sort((a, b) => b.htmlKb - a.htmlKb)
    .slice(0, 15)
    .map(({ url, htmlKb, inlineStyleKb, inlineScriptKb, imgTags, repeatedImgTags }) => ({
      url,
      htmlKb,
      inlineStyleKb,
      inlineScriptKb,
      imgTags,
      repeatedImgTags,
    })),
  repeatedInlineGroups: repeatedInlineGroups.slice(0, 15).map((group) => ({
    count: group.count,
    kbEach: kb(group.bytes),
    samples: group.samples,
  })),
  duplicateImagePages: htmlPages
    .filter((page) => page.repeatedImgTags > 0)
    .sort((a, b) => b.repeatedImgTags - a.repeatedImgTags)
    .slice(0, 15)
    .map(({ url, imgTags, uniqueImgSrcs, duplicateSrcs, repeatedImgTags }) => ({
      url,
      imgTags,
      uniqueImgSrcs,
      duplicateSrcs,
      repeatedImgTags,
    })),
  unusedAssets: {
    count: unusedAssets.length,
    mb: mb(unusedAssets.reduce((sum, item) => sum + item.size, 0)),
    largest: unusedAssets
      .sort((a, b) => b.size - a.size)
      .slice(0, 15)
      .map((item) => ({ file: rel(item.file), kb: kb(item.size) })),
  },
}

console.log(JSON.stringify(report, null, 2))
