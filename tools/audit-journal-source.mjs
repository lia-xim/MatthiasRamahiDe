import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const repoRoot = process.cwd()
const contentDir = path.join(repoRoot, 'apps', 'web', 'content', 'journal-posts')
const adoptedRoutesPath = path.join(repoRoot, 'apps', 'web', 'src', 'lib', 'adoptedRoutes.ts')
const strict = process.argv.includes('--strict')
const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.json')).sort()
const documents = await Promise.all(
  files.map(async (file) => ({ file, document: JSON.parse(await fs.readFile(path.join(contentDir, file), 'utf8')) })),
)

const adoptedRoutesText = await fs.readFile(adoptedRoutesPath, 'utf8')
const redirectMapMatch = adoptedRoutesText.match(/export const legacyRedirectTargets = \{([\s\S]*?)\} as const/)
const redirectedLegacyFiles = new Set(
  redirectMapMatch ? [...redirectMapMatch[1].matchAll(/['"]([^'"]+)['"]\s*:/g)].map((match) => match[1].toLowerCase()) : [],
)

const postMetaByLegacy = new Map()
for (const { file, document } of documents) {
  const pubMs = Date.parse(document.publishedAt || '')
  const entry = { file, status: document.status, publishedAt: document.publishedAt || '', pubMs }
  const keys = [
    document.legacy?.sourceFile,
    document.seo?.legacyUrl,
    document.slug ? `blog-${document.slug}.html` : '',
    `blog-${file.replace(/\.json$/i, '')}.html`,
  ]
  for (const key of keys) {
    const normalized = String(key || '').replace(/^\/+/, '').toLowerCase()
    if (normalized) postMetaByLegacy.set(normalized, entry)
  }
}

const placeholderArtifactRe = /\b(?:SEO-Cluster|Lorem ipsum|TODO)\b/i

const collectDocumentInternalHrefs = (document) => {
  const hrefs = []
  const blocks = Array.isArray(document.blocks) ? document.blocks : []
  for (const block of blocks) {
    if (block?._template === 'textBlock' && typeof block.body === 'string') {
      for (const match of block.body.matchAll(/\[([^\]\n]+)\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)\)/g)) {
        hrefs.push(match[2])
      }
    }
    if (block?._template === 'linkList' && Array.isArray(block.links)) {
      for (const link of block.links) {
        if (typeof link?.href === 'string') hrefs.push(link.href)
      }
    }
  }
  for (const collection of [document.relatedPages, document.links]) {
    if (!Array.isArray(collection)) continue
    for (const item of collection) {
      if (typeof item?.href === 'string') hrefs.push(item.href)
    }
  }
  return hrefs
}

const normalizeInternalHtmlTarget = (rawHref) => {
  let candidate = String(rawHref || '').trim()
  if (!candidate || candidate.startsWith('#') || /^(?:mailto:|tel:)/i.test(candidate)) return ''
  const ownOriginMatch = candidate.match(/^https?:\/\/(?:www\.)?matthiasramahi\.de(\/.*)?$/i)
  if (ownOriginMatch) {
    candidate = ownOriginMatch[1] || '/'
  } else if (/^https?:\/\//i.test(candidate)) {
    return ''
  }
  return candidate.replace(/^\/+/, '').split(/[?#]/)[0].toLowerCase()
}

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
  const faqBlocks = blocks.filter((block) => block?._template === 'faqBlock' && Array.isArray(block.items) && block.items.length > 0)
  const ctaBlocks = blocks.filter((block) => block?._template === 'ctaBlock')
  const linkLists = blocks.filter((block) => block?._template === 'linkList' && Array.isArray(block.links) && block.links.length > 0)
  imageBlocks += mediaBlocks.length
  imageItems += mediaBlocks.reduce((sum, block) => sum + (Array.isArray(block.items) ? block.items.length : 0), 0)

  const isActive = document.status === 'published' || document.status === 'scheduled'
  if (isActive) {
    const seoTitle = String(document.seo?.title || '')
    const seoDesc = String(document.seo?.description || '')
    if (seoTitle.length > 60) failures.push(`${file}: seo.title zu lang (${seoTitle.length} > 60)`)
    if (seoDesc.length > 160) failures.push(`${file}: seo.description zu lang (${seoDesc.length} > 160)`)

    const visibleText = JSON.stringify({
      title: document.title,
      excerpt: document.excerpt,
      coverAlt: document.coverAlt,
      seoTitle,
      seoDesc,
      blocks,
    })
    const artifactMatch = visibleText.match(placeholderArtifactRe)
    if (artifactMatch) failures.push(`${file}: Platzhalter/Migrationsrest im Text gefunden (${artifactMatch[0]})`)

    const sourcePubMs = Date.parse(document.publishedAt || '')
    for (const rawHref of collectDocumentInternalHrefs(document)) {
      const targetFile = normalizeInternalHtmlTarget(rawHref)
      if (!targetFile) continue
      if (redirectedLegacyFiles.has(targetFile)) {
        failures.push(`${file}: interner Link zeigt auf 308-Redirect (${targetFile})`)
      }
      if (targetFile.startsWith('blog-')) {
        const targetPost = postMetaByLegacy.get(targetFile)
        if (!targetPost) {
          failures.push(`${file}: verlinkt auf nicht vorhandenen Artikel (${targetFile})`)
        } else if (targetPost.status === 'draft') {
          failures.push(`${file}: verlinkt auf Entwurf (${targetFile})`)
        } else if (document.status === 'published' && targetPost.status !== 'published') {
          failures.push(`${file}: Live-Artikel verlinkt auf zukuenftigen Artikel (${targetFile})`)
        } else if (
          document.status === 'scheduled' &&
          !Number.isNaN(sourcePubMs) &&
          !Number.isNaN(targetPost.pubMs) &&
          targetPost.pubMs > sourcePubMs
        ) {
          failures.push(`${file}: verlinkt auf spaeter geplanten Artikel (${targetFile}, ${targetPost.publishedAt})`)
        }
      }
    }

    if (textBlocks.length < 3) warnings.push(`${file}: nur ${textBlocks.length} Textbloecke`)
    if (mediaBlocks.length === 0) warnings.push(`${file}: kein Bild innerhalb des Artikels`)
    if (faqBlocks.length === 0) warnings.push(`${file}: kein FAQ-Block`)
    if (ctaBlocks.length === 0) warnings.push(`${file}: kein CTA-Block`)
    if (linkLists.length === 0) warnings.push(`${file}: keine LinkList`)
    if (!document.coverAlt || String(document.coverAlt).trim().length < 15) {
      warnings.push(`${file}: Cover Alt-Text fehlt oder zu kurz`)
    }
  }
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
