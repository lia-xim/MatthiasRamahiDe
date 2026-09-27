#!/usr/bin/env node
// Erzeugt kleine Kontaktbogen-Vorschaubilder für die Startseite.
//
// Quelle: die sechs Portfolio-Auswahlen (apps/web/content/portfolio-projects/portfolio-auswahl-*.json).
// Ziel:   assets/optimized/contact/<name>-{400,800}.webp  (committete Artefakte, wie die übrigen optimized-Varianten)
//         apps/web/src/data/homeContactSheet.json         (Maße + Varianten je Quellbild)
//
// Die Startseite rendert die Serien live aus dem CMS. Bilder ohne Eintrag in der JSON
// fallen auf CMS-Größen bzw. das Original zurück — nach Galerie-Änderungen im CMS
// dieses Skript erneut laufen lassen:  node tools/build-home-contact-sheet.mjs

import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const require = createRequire(path.join(repoRoot, 'tools', 'package.json'))
const sharp = require('sharp')

const projectsDir = path.join(repoRoot, 'apps', 'web', 'content', 'portfolio-projects')
const outDir = path.join(repoRoot, 'assets', 'optimized', 'contact')
const dataPath = path.join(repoRoot, 'apps', 'web', 'src', 'data', 'homeContactSheet.json')
const widths = [400, 800]
const slugs = ['automobil', 'sportwagen', 'oldtimer', 'motorrad', 'portrait', 'landschaft'].map(
  (topic) => `portfolio-auswahl-${topic}`,
)

const sourceFile = (url) => {
  const clean = decodeURIComponent(url.split('?')[0])
  if (clean.startsWith('/uploads/')) return path.join(repoRoot, 'apps', 'web', 'public', clean)
  if (clean.startsWith('/assets/')) return path.join(repoRoot, clean)
  return null
}

const variantName = (url) =>
  path
    .basename(decodeURIComponent(url.split('?')[0]), path.extname(url.split('?')[0]))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

await fs.mkdir(outDir, { recursive: true })
const images = {}

for (const slug of slugs) {
  const project = JSON.parse(await fs.readFile(path.join(projectsDir, `${slug}.json`), 'utf8'))
  const urls = [...new Set((project.gallery || []).map((item) => item.image).filter(Boolean))]

  for (const url of urls) {
    if (images[url]) continue
    const file = sourceFile(url)
    if (!file) continue
    try {
      await fs.access(file)
    } catch {
      console.warn(`skip (missing): ${url}`)
      continue
    }

    const meta = await sharp(file).metadata()
    const name = variantName(url)
    const variants = []
    for (const width of widths) {
      const target = Math.min(width, meta.width || width)
      const outFile = path.join(outDir, `${name}-${width}.webp`)
      const info = await sharp(file)
        .rotate()
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: width <= 400 ? 70 : 66, effort: 6 })
        .toFile(outFile)
      variants.push({ url: `/assets/optimized/contact/${name}-${width}.webp`, width: info.width, height: info.height, bytes: info.size })
    }
    images[url] = { width: meta.width, height: meta.height, variants }
    console.log(`${slug}: ${url} → ${variants.map((v) => `${v.width}w/${Math.round(v.bytes / 1024)}KB`).join(', ')}`)
  }
}

// Bereichs-Raster der Startseite: Bilder ohne CMS-Größen (reine /assets-Pfade) bekommen ebenfalls Varianten.
const home = JSON.parse(await fs.readFile(path.join(repoRoot, 'apps', 'web', 'content', 'pages', 'home.json'), 'utf8'))
for (const item of home.homeChapters?.items || []) {
  const url = item.image
  if (!url || images[url] || !url.startsWith('/assets/')) continue
  const file = sourceFile(url)
  const meta = await sharp(file).metadata()
  const name = variantName(url)
  const variants = []
  for (const width of [480, 960]) {
    const outFile = path.join(outDir, `${name}-${width}.webp`)
    const info = await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 70, effort: 6 }).toFile(outFile)
    variants.push({ url: `/assets/optimized/contact/${name}-${width}.webp`, width: info.width, height: info.height, bytes: info.size })
  }
  images[url] = { width: meta.width, height: meta.height, variants }
  console.log(`chapter: ${url} → ${variants.map((v) => `${v.width}w/${Math.round(v.bytes / 1024)}KB`).join(', ')}`)
}

await fs.writeFile(
  dataPath,
  `${JSON.stringify({ generatedBy: 'tools/build-home-contact-sheet.mjs', images }, null, 2)}\n`,
)
console.log(`\n${Object.keys(images).length} Bilder → ${path.relative(repoRoot, dataPath)}`)
