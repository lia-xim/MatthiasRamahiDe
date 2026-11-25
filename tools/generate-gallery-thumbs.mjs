#!/usr/bin/env node

import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(path.join(repoRoot, 'tools', 'package.json'))
const sharp = require('sharp')

const outDir = path.join(repoRoot, 'assets', 'optimized', 'grid')
const dataOutPath = path.join(repoRoot, 'apps', 'web', 'src', 'data', 'localResponsiveThumbs.ts')
const force = process.argv.includes('--force')

const scanFiles = [
  'apps/web/src/components/native/NativeAutomobilPhotographyPage.astro',
  'apps/web/src/components/native/NativeSportwagenPhotographyPage.astro',
  'apps/web/src/components/native/NativeOldtimerPhotographyPage.astro',
  'apps/web/src/components/native/NativeMotorradPhotographyPage.astro',
  'apps/web/src/components/native/NativePortraitPhotographyPage.astro',
  'apps/web/src/components/native/NativeLandschaftPhotographyPage.astro',
  'apps/web/src/components/native/NativeHomePage.astro',
  'apps/web/src/components/native/NativePortfolioIndexPage.astro',
  'apps/web/src/components/native/NativePhotographyPage.astro',
  'apps/web/src/components/native/NativeJournalIndexPage.astro',
  'apps/web/src/components/native/NativeJournalArticleLegacyUrlPage.astro',
  'apps/web/src/pages/portfolio/[slug].astro',
  'apps/web/src/lib/portfolioIndexContent.ts',
  'apps/web/src/lib/nativeContent.ts',
  'apps/web/src/lib/journalIndexContent.ts',
  'apps/web/src/lib/journalArticleContent.ts',
]

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function slugify(input) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function collectSourceAssets() {
  const candidates = new Set()

  // All local portraits & landscapes referenced or available in local dirs
  for (const dir of ['assets/portraits', 'assets/landscape', 'assets/portfolio', 'assets/photos']) {
    const abs = path.join(repoRoot, dir)
    if (!(await exists(abs))) continue
    const entries = await fs.readdir(abs, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !/\.webp$/i.test(entry.name)) continue
      candidates.add(`/${dir}/${entry.name}`)
    }
  }

  // Also scan templates for any /assets/optimized/... references (1920/1280/etc., excluding /grid/)
  const assetRe = /\/?assets\/(?:portraits|landscape|portfolio|photos|optimized)\/[^"'`\s),?#]+\.webp/gi
  for (const rel of scanFiles) {
    const abs = path.join(repoRoot, rel)
    if (!(await exists(abs))) continue
    const txt = await fs.readFile(abs, 'utf8')
    let match
    while ((match = assetRe.exec(txt))) {
      let clean = match[0].replace(/^\/+/, '')
      if (clean.startsWith('assets/optimized/grid/') || clean.includes('/thumbs/')) continue
      candidates.add(`/${clean}`)
    }
  }

  return [...candidates].sort()
}

await fs.mkdir(outDir, { recursive: true })
const sources = await collectSourceAssets()
const entries = {}
let generated = 0
let skipped = 0
let totalInBytes = 0
let total480Bytes = 0
let total760Bytes = 0

for (const webPath of sources) {
  const relFile = webPath.replace(/^\/+/, '')
  const absSource = path.join(repoRoot, relFile)
  if (!(await exists(absSource))) continue

  const stat = await fs.stat(absSource)
  totalInBytes += stat.size

  const parsed = path.posix.parse(relFile)
  const dirTag = slugify(parsed.dir.replace(/^assets\/?/, ''))
  const baseTag = slugify(parsed.name.replace(/-(?:1920|1280|960|720|640|480)$/i, ''))
  const safeBase = [dirTag, baseTag].filter(Boolean).join('-')

  const out480Name = `${safeBase}-480.webp`
  const out760Name = `${safeBase}-760.webp`
  const out480Abs = path.join(outDir, out480Name)
  const out760Abs = path.join(outDir, out760Name)

  const meta = await sharp(absSource).metadata()
  const origWidth = meta.width || 1600
  const origHeight = meta.height || 1067

  const need480 = force || !(await exists(out480Abs))
  const need760 = force || !(await exists(out760Abs))

  if (need480) {
    await sharp(absSource)
      .rotate()
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5, smartSubsample: true })
      .toFile(out480Abs)
    generated++
  } else {
    skipped++
  }

  if (need760) {
    await sharp(absSource)
      .rotate()
      .resize({ width: 760, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5, smartSubsample: true })
      .toFile(out760Abs)
    generated++
  } else {
    skipped++
  }

  total480Bytes += (await fs.stat(out480Abs)).size
  total760Bytes += (await fs.stat(out760Abs)).size

  entries[webPath] = {
    w480: `/assets/optimized/grid/${out480Name}`,
    w760: `/assets/optimized/grid/${out760Name}`,
    width: origWidth,
    height: origHeight,
  }
  entries[`/assets/optimized/grid/${out480Name}`] = entries[webPath]
  entries[`/assets/optimized/grid/${out760Name}`] = entries[webPath]

  // If this is a portfolio full-size photo, also map its legacy thumb path to the same crisp responsive pair
  if (webPath.startsWith('/assets/portfolio/') && !webPath.includes('/thumbs/')) {
    const thumbAlias = `/assets/portfolio/thumbs/${path.posix.basename(webPath)}`
    entries[thumbAlias] = entries[webPath]
  }
}

const tsLines = [
  '// Auto-generated by tools/generate-gallery-thumbs.mjs — do not edit by hand.',
  'import { versionStaticAssetSrcset, versionStaticAssetUrl } from \'../lib/cache\'',
  '',
  'export type LocalThumbEntry = {',
  '  w480: string',
  '  w760: string',
  '  width: number',
  '  height: number',
  '}',
  '',
  'export const localResponsiveThumbs: Record<string, LocalThumbEntry> = ' + JSON.stringify(entries, null, 2),
  '',
  'function normalizeKey(raw: string): string {',
  '  const noQuery = raw.split(\'#\')[0].split(\'?\')[0].trim()',
  '  let decoded = noQuery',
  '  try {',
  '    decoded = decodeURIComponent(noQuery)',
  '  } catch {',
  '    decoded = noQuery',
  '  }',
  '  return decoded.startsWith(\'/\') ? decoded : `/${decoded}`',
  '}',
  '',
  'export function lookupLocalThumb(raw?: string | null): LocalThumbEntry | undefined {',
  '  if (!raw || /^https?:\\/\\//i.test(raw) || raw.startsWith(\'data:\')) return undefined',
  '  return localResponsiveThumbs[normalizeKey(raw)]',
  '}',
  '',
  'export function localResponsiveImage(raw: string, fallbackWidth = 1600, fallbackHeight = 1067) {',
  '  const normalized = normalizeKey(raw)',
  '  const thumb = lookupLocalThumb(normalized)',
  '  if (!thumb) {',
  '    const versioned = versionStaticAssetUrl(normalized)',
  '    return {',
  '      src: versioned,',
  '      mobile: versioned,',
  '      srcset: \'\',',
  '      full: versioned,',
  '      width: fallbackWidth,',
  '      height: fallbackHeight,',
  '    }',
  '  }',
  '  const w480Url = versionStaticAssetUrl(thumb.w480)',
  '  const w760Url = versionStaticAssetUrl(thumb.w760)',
  '  const fullUrl = versionStaticAssetUrl(normalized)',
  '  const srcset = versionStaticAssetSrcset(`${thumb.w480} 480w, ${thumb.w760} 760w`) || \'\'',
  '  return {',
  '    src: w760Url,',
  '    mobile: w480Url,',
  '    srcset,',
  '    full: fullUrl,',
  '    width: thumb.width,',
  '    height: thumb.height,',
  '  }',
  '}',
  '',
]

await fs.writeFile(dataOutPath, tsLines.join('\n'), 'utf8')

const avgInKb = Math.round(totalInBytes / Math.max(sources.length, 1) / 1024)
const avg480Kb = Math.round(total480Bytes / Math.max(sources.length, 1) / 1024)
const avg760Kb = Math.round(total760Bytes / Math.max(sources.length, 1) / 1024)
console.log(
  `Gallery thumbs ready: ${sources.length} sources -> ${generated} generated, ${skipped} cached. Avg size: ${avgInKb}KB -> ${avg480Kb}KB (480w) / ${avg760Kb}KB (760w)`,
)
