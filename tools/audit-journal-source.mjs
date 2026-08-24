import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const repoRoot = process.cwd()
const contentDir = path.join(repoRoot, 'apps', 'web', 'content', 'journal-posts')
const strict = process.argv.includes('--strict')
const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.json')).sort()
const documents = await Promise.all(
  files.map(async (file) => ({ file, document: JSON.parse(await fs.readFile(path.join(contentDir, file), 'utf8')) })),
)

const failures = []
const warnings = []
const seenSlugs = new Map()
const seenCanonicals = new Map()
const seenLegacyUrls = new Map()
const heroUsage = new Map()
const categoryCounts = new Map()
let imageBlocks = 0
let imageItems = 0

const duplicate = (map, value, file, label) => {
  if (!value) return
  if (map.has(value)) failures.push(`${label} doppelt: ${value} (${map.get(value)}, ${file})`)
  else map.set(value, file)
}

for (const { file, document } of documents) {
  for (const field of ['title', 'slug', 'category', 'publishedAt', 'excerpt', 'coverImage', 'status']) {
    if (!document[field]) failures.push(`${file}: Pflichtfeld ${field} fehlt`)
  }
  for (const field of ['title', 'description', 'focusKeyword', 'searchIntent', 'canonicalUrl', 'legacyUrl', 'ogImage']) {
    if (!document.seo?.[field]) failures.push(`${file}: SEO-Feld ${field} fehlt`)
  }

  duplicate(seenSlugs, document.slug, file, 'Slug')
  duplicate(seenCanonicals, document.seo?.canonicalUrl, file, 'Canonical')
  duplicate(seenLegacyUrls, document.seo?.legacyUrl, file, 'Legacy-URL')

  const category = document.category || 'ohne-kategorie'
  categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
  if (document.coverImage) heroUsage.set(document.coverImage, (heroUsage.get(document.coverImage) || 0) + 1)

  const blocks = Array.isArray(document.blocks) ? document.blocks : []
  const textBlocks = blocks.filter((block) => block?._template === 'textBlock')
  const mediaBlocks = blocks.filter((block) => block?._template === 'imageSequence')
  imageBlocks += mediaBlocks.length
  imageItems += mediaBlocks.reduce((sum, block) => sum + (Array.isArray(block.items) ? block.items.length : 0), 0)

  if (textBlocks.length < 3) warnings.push(`${file}: nur ${textBlocks.length} Textbloecke`)
  if (mediaBlocks.length === 0) warnings.push(`${file}: kein Bild innerhalb des Artikels`)
  if (!document.coverAlt) warnings.push(`${file}: Cover Alt-Text fehlt`)
}

const duplicateHeroes = [...heroUsage.entries()].filter(([, count]) => count > 1)
const result = {
  sourceOfTruth: 'apps/web/content/journal-posts/*.json',
  documents: documents.length,
  published: documents.filter(({ document }) => document.status === 'published').length,
  categories: Object.fromEntries([...categoryCounts.entries()].sort()),
  imageBlocks,
  imageItems,
  duplicateHeroes: Object.fromEntries(duplicateHeroes),
  failures,
  warnings,
}

console.log(JSON.stringify(result, null, 2))
if (failures.length > 0 || (strict && warnings.length > 0)) process.exitCode = 1
