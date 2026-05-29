import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const previewImages = {
  'assets/optimized/assets-photos-automobil-neon-1920.webp': ['assets/optimized/assets-photos-automobil-neon-960.webp', 960, 640],
  'assets/optimized/assets-photos-automobil-sunset-1920.webp': ['assets/optimized/assets-photos-automobil-sunset-960.webp', 960, 640],
  'assets/optimized/assets-photos-landschaft-1920.webp': ['assets/optimized/assets-photos-landschaft-720.webp', 720, 1080],
  'assets/optimized/assets-photos-motorrad-1920.webp': ['assets/optimized/assets-photos-motorrad-720.webp', 720, 1080],
  'assets/optimized/assets-photos-motorrad-duke-1920.webp': ['assets/optimized/assets-photos-motorrad-duke-720.webp', 720, 1280],
  'assets/optimized/assets-photos-motorrad-ninja-road-1920.webp': ['assets/optimized/assets-photos-motorrad-ninja-road-720.webp', 720, 1080],
  'assets/optimized/assets-photos-oldtimer-stage-1920.webp': ['assets/optimized/assets-photos-oldtimer-stage-960.webp', 960, 640],
  'assets/photos/portrait-blue.webp': ['assets/optimized/assets-photos-portrait-blue-720.webp', 720, 900],
  'assets/photos/portrait-warm.webp': ['assets/optimized/assets-photos-portrait-warm-720.webp', 720, 1152],
  'assets/optimized/assets-photos-portrait-warm-1920.webp': ['assets/optimized/assets-photos-portrait-warm-720.webp', 720, 1152],

  'assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp': ['assets/portfolio/thumbs/20250327-DSC01550.webp', 720, 1090],
  'assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp': ['assets/portfolio/thumbs/20250414-DSC00341.webp', 720, 1080],
  'assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp': ['assets/portfolio/thumbs/20250605-DSC03756.webp', 720, 1080],
  'assets/optimized/assets-portfolio-20250605-dsc03793-1920.webp': ['assets/portfolio/thumbs/20250605-DSC03793.webp', 720, 960],
  'assets/optimized/assets-portfolio-20250605-dsc03816-1920.webp': ['assets/portfolio/thumbs/20250605-DSC03816.webp', 720, 960],
  'assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp': ['assets/portfolio/thumbs/20250605-DSC03978.webp', 720, 960],
  'assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp': ['assets/portfolio/thumbs/20250605-DSC04020.webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc2310-1920.webp': ['assets/portfolio/thumbs/_DSC2310.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc2316-1920.webp': ['assets/portfolio/thumbs/_DSC2316.webp', 720, 450],
  'assets/optimized/assets-portfolio-dsc2329-1920.webp': ['assets/portfolio/thumbs/_DSC2329.webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc2345-1920.webp': ['assets/portfolio/thumbs/_DSC2345.webp', 720, 576],
  'assets/optimized/assets-portfolio-dsc2358-1920.webp': ['assets/portfolio/thumbs/_DSC2358.webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc2744-1920.webp': ['assets/portfolio/thumbs/_DSC2744.webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc2762-1920.webp': ['assets/portfolio/thumbs/_DSC2762.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc2788-1-1920.webp': ['assets/portfolio/thumbs/_DSC2788 (1).webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc2861-1-1920.webp': ['assets/portfolio/thumbs/_DSC2861 (1).webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc2876-generase-1-1920.webp': ['assets/portfolio/thumbs/_DSC2876_genErase (1).webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc2986-1920.webp': ['assets/portfolio/thumbs/_DSC2986.webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp': ['assets/portfolio/thumbs/_DSC3032_genErase (1).webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp': ['assets/portfolio/thumbs/_DSC3032_genErase (2).webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc3878-1920.webp': ['assets/portfolio/thumbs/_DSC3878.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc3879-1920.webp': ['assets/portfolio/thumbs/_DSC3879.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc3892-1920.webp': ['assets/portfolio/thumbs/_DSC3892.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc3908-1920.webp': ['assets/portfolio/thumbs/_DSC3908.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc3982-1920.webp': ['assets/portfolio/thumbs/_DSC3982.webp', 720, 480],
  'assets/optimized/assets-portfolio-dsc6982-1920.webp': ['assets/portfolio/thumbs/_DSC6982.webp', 720, 1080],
  'assets/optimized/assets-portfolio-dsc8032-1920.webp': ['assets/portfolio/thumbs/_DSC8032.webp', 720, 900],
  'assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp': [
    'assets/portfolio/thumbs/Wettberwerb_Foto10_Wunder_der_natur.webp',
    720,
    448,
  ],
  'assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp': [
    'assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp',
    720,
    471,
  ],
  'assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp': [
    'assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp',
    720,
    520,
  ],

  'assets/optimized/assets-portraits-20250327-dsc01550-1920.webp': ['assets/portfolio/thumbs/20250327-DSC01550.webp', 720, 1090],
  'assets/optimized/assets-portraits-20250605-dsc04020-1920.webp': ['assets/portfolio/thumbs/20250605-DSC04020.webp', 720, 1080],
  'assets/optimized/assets-portraits-dsc2310-1920.webp': ['assets/portfolio/thumbs/_DSC2310.webp', 720, 480],
  'assets/optimized/assets-portraits-dsc2329-1920.webp': ['assets/portfolio/thumbs/_DSC2329.webp', 720, 1080],
  'assets/optimized/assets-portraits-dsc2358-1920.webp': ['assets/portfolio/thumbs/_DSC2358.webp', 720, 1080],
  'assets/optimized/assets-portraits-dsc2744-1920.webp': ['assets/portfolio/thumbs/_DSC2744.webp', 720, 1080],
  'assets/optimized/assets-portraits-dsc2986-1920.webp': ['assets/portfolio/thumbs/_DSC2986.webp', 720, 1080],
  'assets/optimized/assets-portraits-dsc3878-1920.webp': ['assets/portfolio/thumbs/_DSC3878.webp', 720, 480],
  'assets/optimized/assets-portraits-dsc3908-1920.webp': ['assets/portfolio/thumbs/_DSC3908.webp', 720, 480],
  'assets/portraits/_DSC0470-Enhanced-NR.webp': ['assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', 720, 1152],
  'assets/portraits/_DSC9301-Enhanced-NR.webp': ['assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', 720, 900],
  'assets/portraits/_DSC9321-Enhanced-NR.webp': ['assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', 720, 1080],
}

const sourceFolders = ['assets/portfolio', 'assets/portraits']
const thumbnailFolder = 'assets/portfolio/thumbs'

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

async function fileExists(relativePath) {
  try {
    await fs.access(path.join(repoRoot, relativePath))
    return true
  } catch {
    return false
  }
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function attrValue(tag, name) {
  return tag.match(new RegExp(`\\s${name}=(["'])([^"']+)\\1`, 'i'))?.[2] || ''
}

function upsertAttr(tag, name, value) {
  const escaped = escapeAttr(value)
  const pattern = new RegExp(`(\\s${name}=)(["'])[^"']*\\2`, 'i')
  if (pattern.test(tag)) return tag.replace(pattern, `$1"${escaped}"`)
  return tag.replace(/\s*\/?>$/, (end) => ` ${name}="${escaped}"${end.trim() === '/>' ? ' />' : '>'}`)
}

function normalizeImgTag(tag) {
  return tag.replace(/\s\/\s+(?=(?:alt|decoding|height|loading|src|srcset|width|data-[\w-]+)=)/gi, ' ')
}

function localPath(value) {
  return value.replace(/^\/+/, '')
}

function replacementFor(value, replacements) {
  return replacements.get(localPath(value))
}

async function buildReplacements() {
  const replacements = new Map()

  for (const [source, [preview, width, height]] of Object.entries(previewImages)) {
    if (await fileExists(preview)) replacements.set(source, { preview, width, height })
  }

  const thumbs = await fs.readdir(path.join(repoRoot, thumbnailFolder)).catch(() => [])
  for (const name of thumbs) {
    if (!name.endsWith('.webp')) continue
    const existing = Object.values(previewImages).find(([preview]) => preview.endsWith(`/${name}`))
    if (!existing) continue
    const [, width, height] = existing
    for (const sourceFolder of sourceFolders) {
      const source = `${sourceFolder}/${name}`
      if (await fileExists(source)) replacements.set(source, { preview: `${thumbnailFolder}/${name}`, width, height })
    }
  }

  return replacements
}

async function rootHtmlFiles() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.html')
    .map((entry) => path.join(repoRoot, entry.name))
    .sort((a, b) => a.localeCompare(b))
}

function optimizeImgTag(tag, replacements) {
  let next = normalizeImgTag(tag)
  const attrs = ['src', 'data-src']
  const fullSource = attrs.map((attr) => attrValue(next, attr)).find((value) => replacementFor(value, replacements))
  if (!fullSource) return next

  const replacement = replacementFor(fullSource, replacements)
  const hadDataFull = Boolean(attrValue(next, 'data-full'))

  for (const attr of attrs) {
    const value = attrValue(next, attr)
    const attrReplacement = replacementFor(value, replacements)
    if (!attrReplacement) continue
    next = upsertAttr(next, attr, attrReplacement.preview)
  }

  if (!hadDataFull) next = upsertAttr(next, 'data-full', localPath(fullSource))
  next = upsertAttr(next, 'width', String(replacement.width))
  next = upsertAttr(next, 'height', String(replacement.height))
  return next
}

function replaceHeavyRefs(html, replacements) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => optimizeImgTag(tag, replacements))
}

const replacements = await buildReplacements()
const files = await rootHtmlFiles()
let updated = 0

for (const file of files) {
  const before = await fs.readFile(file, 'utf8')
  const after = replaceHeavyRefs(before, replacements)
  if (after === before) continue
  await fs.writeFile(file, after)
  updated += 1
}

console.log(`Legacy gallery images mapped to lightweight previews in ${updated} files.`)
