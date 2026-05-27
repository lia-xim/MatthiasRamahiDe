import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetDir = path.join(repoRoot, 'assets')
const minOccurrences = Number(process.env.LEGACY_INLINE_EXTRACT_MIN || 6)
const minBytes = Number(process.env.LEGACY_INLINE_EXTRACT_MIN_BYTES || 512)
const singleMinBytes = Number(process.env.LEGACY_INLINE_EXTRACT_SINGLE_MIN_BYTES || 4096)
const repeatedTotalMinBytes = Number(process.env.LEGACY_INLINE_EXTRACT_REPEATED_TOTAL_MIN_BYTES || 4096)

const categoryRules = [
  ['legacy-automobil', /(?:autohaus|autofotografie|automobil|automotive|autoverkauf|fahrzeug)/i],
  ['legacy-oldtimer', /(?:classic-car|oldtimer|sammlerfahrzeug|youngtimer)/i],
  ['legacy-sportwagen', /(?:exotic-car|performance-car|sportwagen|supersportwagen)/i],
  ['legacy-motorrad', /(?:bike|biker|custom-bike|motorrad)/i],
  ['legacy-portrait', /(?:business-portrait|headshot|personal-branding|portrait|pressefoto|unternehmensportrait)/i],
  ['legacy-landschaft', /(?:fine-art|landschaft|landschaftsbilder|naturfotografie|wandbilder)/i],
  ['legacy-service-mini', /(?:drucke|grossformatdruck|leistungen|videografie|viola|webdesign|werbetechnik)/i],
]

function hashContent(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12)
}

async function htmlFiles() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.html')
    .map((entry) => path.join(repoRoot, entry.name))
    .sort((a, b) => a.localeCompare(b))
}

function categoryFor(files, hash) {
  if (files.length === 1) {
    const slug = path
      .basename(files[0], '.html')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 72)
    return `legacy-${slug || hash}`
  }

  const names = files.map((file) => path.basename(file)).join(' ')
  const match = categoryRules.find(([, pattern]) => pattern.test(names))
  return match?.[0] || `legacy-inline-${hash}`
}

function isPlainStyle(attrs) {
  return attrs.trim() === ''
}

function isExtractableScript(attrs) {
  if (/\bsrc\s*=/i.test(attrs)) return false
  const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
  if (!type) return true
  return ['application/javascript', 'text/javascript'].includes(type)
}

function normalizeCssUrls(css) {
  return css.replace(/url\(\s*(["']?)assets\//g, 'url($1')
}

function addGroup(groups, kind, content, file) {
  if (content.trim().length < minBytes) return
  const hash = hashContent(content)
  const group = groups[kind].get(hash) || { content, files: new Set() }
  group.files.add(file)
  groups[kind].set(hash, group)
}

function collectGroups(file, html, groups) {
  for (const match of html.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)) {
    if (!isPlainStyle(match[1] || '')) continue
    addGroup(groups, 'style', match[2], file)
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1] || ''
    if (/application\/ld\+json/i.test(attrs)) continue
    if (!isExtractableScript(attrs)) continue
    addGroup(groups, 'script', match[2], file)
  }
}

function sortedExtractableGroups(groups, kind) {
  return [...groups[kind].entries()]
    .filter(
      ([, group]) =>
        group.files.size >= minOccurrences ||
        group.content.length >= singleMinBytes ||
        (group.files.size > 1 && group.content.length * group.files.size >= repeatedTotalMinBytes),
    )
    .sort(([, a], [, b]) => b.content.length * b.files.size - a.content.length * a.files.size)
}

async function writeIfChanged(file, content) {
  try {
    const current = await fs.readFile(file, 'utf8')
    if (current === content) return false
  } catch {
    // File is new.
  }
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content)
  return true
}

async function writeAssets(groups) {
  const extracted = {
    script: new Map(),
    style: new Map(),
  }
  const used = {
    script: new Set(),
    style: new Set(),
  }
  let updatedAssets = 0

  for (const kind of ['style', 'script']) {
    for (const [hash, group] of sortedExtractableGroups(groups, kind)) {
      const files = [...group.files].sort((a, b) => a.localeCompare(b))
      const base = categoryFor(files, hash)
      const name = used[kind].has(base) ? `${base}-${hash.slice(0, 8)}` : base
      used[kind].add(name)

      const extension = kind === 'style' ? 'css' : 'js'
      const href = `assets/${name}.${extension}`
      const output = kind === 'style' ? normalizeCssUrls(group.content).trim() + '\n' : group.content.trim() + '\n'
      const assetFile = path.join(assetDir, `${name}.${extension}`)
      if (await writeIfChanged(assetFile, output)) updatedAssets += 1
      extracted[kind].set(hash, href)
    }
  }

  return { extracted, updatedAssets }
}

function replaceInlineAssets(html, extracted) {
  let next = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (tag, attrs, content) => {
    if (!isPlainStyle(attrs || '')) return tag
    const href = extracted.style.get(hashContent(content))
    return href ? `<link rel="stylesheet" href="${href}" />` : tag
  })

  next = next.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs, content) => {
    attrs ||= ''
    if (/application\/ld\+json/i.test(attrs)) return tag
    if (!isExtractableScript(attrs)) return tag
    const src = extracted.script.get(hashContent(content))
    return src ? `<script src="${src}" defer></script>` : tag
  })

  return next
}

const files = await htmlFiles()
const htmlByFile = new Map()
const groups = {
  script: new Map(),
  style: new Map(),
}

for (const file of files) {
  const html = await fs.readFile(file, 'utf8')
  htmlByFile.set(file, html)
  collectGroups(file, html, groups)
}

const { extracted, updatedAssets } = await writeAssets(groups)
let updatedHtml = 0

for (const [file, html] of htmlByFile) {
  const next = replaceInlineAssets(html, extracted)
  if (next === html) continue
  await fs.writeFile(file, next)
  updatedHtml += 1
}

const extractedStyles = extracted.style.size
const extractedScripts = extracted.script.size
console.log(
  `Repeated inline assets extracted: ${extractedStyles} CSS groups, ${extractedScripts} JS groups, ${updatedHtml} HTML files updated, ${updatedAssets} assets written.`,
)
