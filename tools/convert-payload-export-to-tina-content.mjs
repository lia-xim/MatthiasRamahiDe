#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()

function argValue(name) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : ''
}

function latestMigrationOutputDir() {
  const outputsDir = path.join(repoRoot, 'outputs')
  if (!fs.existsSync(outputsDir)) return ''

  return fs
    .readdirSync(outputsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('payload-tina-migration-'))
    .map((entry) => path.join(outputsDir, entry.name))
    .sort()
    .at(-1)
}

const migrationDir = path.resolve(argValue('migration-dir') || latestMigrationOutputDir() || '')
const exportDir = path.resolve(argValue('export-dir') || path.join(migrationDir, 'payload-export'))
const contentRoot = path.resolve(argValue('content-root') || path.join(repoRoot, 'apps', 'web', 'content'))
const mediaManifestPath = path.resolve(
  argValue('media-manifest') || path.join(repoRoot, 'apps', 'web', 'src', 'data', 'tinaMediaManifest.json'),
)

if (!fs.existsSync(exportDir)) {
  console.error(`Payload export directory not found: ${exportDir}`)
  process.exit(1)
}

if (!fs.existsSync(mediaManifestPath)) {
  console.error(`Tina media manifest not found: ${mediaManifestPath}`)
  process.exit(1)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function slugifyFilename(value, fallback) {
  return String(value || fallback || 'untitled')
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

function cleanDirectory(dir) {
  fs.mkdirSync(dir, { recursive: true })
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === '.gitkeep') continue
    if (entry.name.endsWith('.json')) fs.rmSync(path.join(dir, entry.name))
  }
}

function lexicalText(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(lexicalText).filter(Boolean).join('\n\n')
  if (typeof value !== 'object') return ''

  const text = typeof value.text === 'string' ? value.text : ''
  const children = lexicalText(value.children)
  const root = lexicalText(value.root)
  return [text, children, root].filter(Boolean).join(children && text ? ' ' : '')
}

const imageKeys = new Set(['defaultOgImage', 'fullImage', 'heroImage', 'image', 'ogImage', 'teaserImage', 'coverImage'])

const mediaManifest = readJson(mediaManifestPath)
const mediaById = new Map((mediaManifest.items || []).map((item) => [String(item.id), item]))
const mediaByFilename = new Map((mediaManifest.items || []).filter((item) => item.filename).map((item) => [item.filename, item]))

function mediaUrlFromRef(value) {
  if (!value) return value
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    return mediaById.get(String(value))?.url || null
  }
  if (typeof value === 'string') {
    const filename = value.split('#')[0].split('?')[0].split('/').pop() || value
    return mediaByFilename.get(filename)?.url || value
  }
  if (typeof value === 'object') {
    return mediaById.get(String(value.id))?.url || mediaByFilename.get(value.filename)?.url || value.url || null
  }
  return value
}

function transformBlock(block) {
  if (!block || typeof block !== 'object') return block
  const blockType = block.blockType || block._template
  const next = transformValue(block, { insideBlock: true })

  delete next.blockType
  delete next.blockName
  delete next.id

  if (blockType) next._template = blockType
  if (blockType === 'textBlock' && block.body && typeof block.body === 'object') next.body = lexicalText(block.body)
  return pruneEmpty(next)
}

function transformValue(value, context = {}) {
  if (Array.isArray(value)) {
    return value.map((item) => transformValue(item, context)).filter((item) => typeof item !== 'undefined')
  }
  if (!value || typeof value !== 'object') return value

  const next = {}
  for (const [key, entry] of Object.entries(value)) {
    if (key === '_status') {
      next.status = entry
      continue
    }
    if (key === '_texts' || key === 'thumbnailURL') continue
    if (key === 'id' && context.nested) continue

    if (key === 'blocks' && Array.isArray(entry)) {
      next.blocks = entry.map(transformBlock)
      continue
    }

    if (imageKeys.has(key)) {
      next[key] = mediaUrlFromRef(entry)
      continue
    }

    next[key] = transformValue(entry, { nested: true })
  }

  return pruneEmpty(next)
}

function pruneEmpty(value) {
  if (Array.isArray(value)) return value.map(pruneEmpty).filter((entry) => typeof entry !== 'undefined')
  if (!value || typeof value !== 'object') return value

  const entries = Object.entries(value)
    .map(([key, entry]) => [key, pruneEmpty(entry)])
    .filter(([, entry]) => entry !== null && typeof entry !== 'undefined')

  return Object.fromEntries(entries)
}

function makeReferenceMap(collectionFile) {
  const docs = readJson(path.join(exportDir, 'collections', collectionFile))
  return new Map(docs.map((doc) => [String(doc.id), slugifyFilename(doc.slug || doc.title, doc.id)]))
}

const servicePageFileById = makeReferenceMap('service-pages.raw.json')
const portfolioCategoryFileById = makeReferenceMap('portfolio-categories.raw.json')

function transformDoc(doc, collectionName) {
  const next = transformValue(doc)
  delete next.id
  if (doc.id != null) next.payloadId = String(doc.id)

  if (doc._status && !next.status) next.status = doc._status

  if (collectionName === 'localSeoPages' && doc.canonicalServicePage) {
    const filename = servicePageFileById.get(String(doc.canonicalServicePage))
    if (filename) next.canonicalServicePage = `content/service-pages/${filename}.json`
  }

  if (collectionName === 'portfolioProjects' && doc.category) {
    const categoryId = typeof doc.category === 'object' ? doc.category.id : doc.category
    const filename = portfolioCategoryFileById.get(String(categoryId))
    if (filename) next.category = `content/portfolio-categories/${filename}.json`
  }

  return pruneEmpty(next)
}

const collectionJobs = [
  { collectionName: 'pages', file: 'site-pages.raw.json', outDir: 'pages' },
  { collectionName: 'servicePages', file: 'service-pages.raw.json', outDir: 'service-pages' },
  { collectionName: 'localSeoPages', file: 'local-seo-pages.raw.json', outDir: 'local-seo-pages' },
  { collectionName: 'portfolioCategories', file: 'portfolio-categories.raw.json', outDir: 'portfolio-categories' },
  { collectionName: 'portfolioProjects', file: 'portfolio-projects.raw.json', outDir: 'portfolio-projects' },
  { collectionName: 'journalPosts', file: 'journal-posts.raw.json', outDir: 'journal-posts' },
]

const summary = {}

for (const job of collectionJobs) {
  const sourcePath = path.join(exportDir, 'collections', job.file)
  if (!fs.existsSync(sourcePath)) {
    summary[job.collectionName] = { skipped: true, reason: `Missing ${job.file}` }
    continue
  }

  const targetDir = path.join(contentRoot, job.outDir)
  cleanDirectory(targetDir)
  const docs = readJson(sourcePath)

  for (const doc of docs) {
    const filename = slugifyFilename(doc.slug || doc.title, doc.id)
    writeJson(path.join(targetDir, `${filename}.json`), transformDoc(doc, job.collectionName))
  }

  summary[job.collectionName] = { documents: docs.length, outDir: path.relative(repoRoot, targetDir).replaceAll(path.sep, '/') }
}

const globalsPath = path.join(exportDir, 'globals.raw.json')
if (fs.existsSync(globalsPath)) {
  const globals = readJson(globalsPath)
  const globalTargets = {
    'site-settings': ['globals/site-settings/site-settings.json', 'siteSettings'],
    navigation: ['globals/navigation/navigation.json', 'navigation'],
    'global-ctas': ['globals/global-ctas/global-ctas.json', 'globalCtas'],
    footer: ['globals/footer/footer.json', 'footer'],
  }

  for (const [slug, [relativePath, collectionName]] of Object.entries(globalTargets)) {
    if (!globals[slug]) continue
    writeJson(path.join(contentRoot, relativePath), transformDoc(globals[slug], collectionName))
    summary[collectionName] = { documents: 1, outDir: path.dirname(`apps/web/content/${relativePath}`) }
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: path.relative(repoRoot, exportDir).replaceAll(path.sep, '/'),
  contentRoot: path.relative(repoRoot, contentRoot).replaceAll(path.sep, '/'),
  summary,
}

writeJson(path.join(contentRoot, 'tina-import-manifest.json'), manifest)

console.log('Payload export converted to Tina content')
console.log(`Content root: ${contentRoot}`)
for (const [name, result] of Object.entries(summary)) {
  if (result.skipped) console.log(`- ${name}: skipped (${result.reason})`)
  else console.log(`- ${name}: ${result.documents}`)
}
