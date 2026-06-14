import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'

const webRoot = process.cwd()
const repoRoot = path.resolve(webRoot, '../..')
const contentRoot = path.join(webRoot, 'content')
const publicRoot = path.join(webRoot, 'public')
const outputDir = path.resolve(webRoot, '.cms-parity')
const outputPath = path.join(outputDir, 'tina-content-audit.json')
const strict = process.argv.includes('--strict')

const collectionDirs = {
  pages: 'pages',
  servicePages: 'service-pages',
  localSeoPages: 'local-seo-pages',
  portfolioCategories: 'portfolio-categories',
  portfolioProjects: 'portfolio-projects',
  journalPosts: 'journal-posts',
  siteSettings: 'globals/site-settings',
  navigation: 'globals/navigation',
  globalCtas: 'globals/global-ctas',
  footer: 'globals/footer',
}

const oldPayloadUrlPattern =
  /(cms\.matthiasramahi\.de\/api\/media\/file|cms\.matthiasramahi\.de\/uploads|localhost:3000\/api\/media)/i
const localAssetPattern = /^\/(?:assets|uploads)\//i
const tinaReferencePattern = /^content\/[^/]+\/[^/]+\.json$/i

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function relative(filePath) {
  return toPosix(path.relative(repoRoot, filePath))
}

function readJson(filePath) {
  return JSON.parse(fsSync.readFileSync(filePath, 'utf8'))
}

async function walk(dir) {
  if (!fsSync.existsSync(dir)) return []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(filePath)))
    else if (entry.isFile()) files.push(filePath)
  }
  return files
}

function cleanPublicPath(value) {
  const withoutHash = String(value).split('#')[0].split('?')[0]
  try {
    return decodeURIComponent(withoutHash)
  } catch {
    return withoutHash
  }
}

function collectStrings(value, strings = []) {
  if (typeof value === 'string') {
    strings.push(value)
    return strings
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, strings)
    return strings
  }
  if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectStrings(entry, strings)
  }
  return strings
}

function hasUsefulSeo(doc) {
  const title = doc?.seo?.title || doc?.title
  const description = doc?.seo?.description || doc?.intro || doc?.excerpt
  return Boolean(String(title || '').trim() && String(description || '').trim())
}

async function main() {
  const failures = []
  const warnings = []
  const stats = {
    collections: {},
    documents: 0,
    localAssetRefs: 0,
    oldPayloadUrlRefs: 0,
    references: 0,
  }

  const importManifestPath = path.join(contentRoot, 'tina-import-manifest.json')
  const importManifest = fsSync.existsSync(importManifestPath) ? readJson(importManifestPath) : null
  if (!importManifest) failures.push({ type: 'missing-import-manifest', file: relative(importManifestPath) })

  const adminIndexPath = path.join(publicRoot, 'admin', 'index.html')
  if (!fsSync.existsSync(adminIndexPath)) failures.push({ type: 'missing-tina-admin', file: relative(adminIndexPath) })

  const tinaConfigPath = path.join(webRoot, 'tina', 'config.ts')
  if (!fsSync.existsSync(tinaConfigPath)) failures.push({ type: 'missing-tina-config', file: relative(tinaConfigPath) })

  const mediaManifestPath = path.join(webRoot, 'src', 'data', 'tinaMediaManifest.json')
  const mediaManifest = fsSync.existsSync(mediaManifestPath) ? readJson(mediaManifestPath) : null
  if (!mediaManifest) {
    failures.push({ type: 'missing-media-manifest', file: relative(mediaManifestPath) })
  } else if (Number(mediaManifest.stats?.missingReferencedFiles || 0) > 0) {
    failures.push({
      type: 'media-manifest-missing-files',
      missingReferencedFiles: mediaManifest.stats.missingReferencedFiles,
    })
  }

  const generatedManifestPath = path.join(webRoot, 'src', 'data', 'tinaGeneratedMediaManifest.json')
  const generatedManifest = fsSync.existsSync(generatedManifestPath) ? readJson(generatedManifestPath) : null
  if (!generatedManifest) {
    warnings.push({ type: 'missing-generated-media-manifest', file: relative(generatedManifestPath) })
  } else if (Number(generatedManifest.stats?.failedUploads || 0) > 0 || generatedManifest.failures?.length) {
    failures.push({
      type: 'generated-media-failures',
      failedUploads: generatedManifest.stats?.failedUploads || 0,
      failures: generatedManifest.failures?.slice(0, 20) || [],
    })
  }

  for (const [collectionName, dirName] of Object.entries(collectionDirs)) {
    const dir = path.join(contentRoot, dirName)
    const files = (await walk(dir)).filter((file) => file.endsWith('.json') && !file.endsWith('tina-import-manifest.json'))
    const expected = importManifest?.summary?.[collectionName]?.documents
    const slugs = new Map()
    let seoReady = 0

    stats.collections[collectionName] = { documents: files.length, expected: expected ?? null }
    stats.documents += files.length

    if (typeof expected === 'number' && expected !== files.length) {
      failures.push({ type: 'collection-count-mismatch', collection: collectionName, expected, actual: files.length })
    }

    for (const file of files) {
      let doc
      try {
        doc = readJson(file)
      } catch (error) {
        failures.push({ type: 'invalid-json', file: relative(file), error: error.message })
        continue
      }

      const slug = String(doc.slug || path.basename(file, '.json'))
      if (slugs.has(slug)) {
        failures.push({ type: 'duplicate-slug', collection: collectionName, slug, files: [relative(slugs.get(slug)), relative(file)] })
      }
      slugs.set(slug, file)

      if (['pages', 'servicePages', 'localSeoPages', 'journalPosts', 'portfolioProjects'].includes(collectionName)) {
        if (hasUsefulSeo(doc)) seoReady += 1
        else warnings.push({ type: 'seo-content-incomplete', collection: collectionName, file: relative(file), slug })
      }

      for (const value of collectStrings(doc)) {
        if (oldPayloadUrlPattern.test(value)) {
          stats.oldPayloadUrlRefs += 1
          failures.push({ type: 'old-payload-url-ref', file: relative(file), value: value.slice(0, 220) })
        }

        if (tinaReferencePattern.test(value)) {
          stats.references += 1
          const referencePath = path.join(contentRoot, value.replace(/^content\//, ''))
          if (!fsSync.existsSync(referencePath)) failures.push({ type: 'missing-tina-reference', file: relative(file), value })
        }

        if (localAssetPattern.test(value)) {
          stats.localAssetRefs += 1
          const publicPath = cleanPublicPath(value)
          const assetPath = path.join(publicRoot, publicPath.replace(/^\/+/, ''))
          if (!fsSync.existsSync(assetPath)) failures.push({ type: 'missing-local-asset', file: relative(file), value })
        }
      }
    }

    if (seoReady > 0) stats.collections[collectionName].seoReady = seoReady
  }

  const summary = {
    adminReady: fsSync.existsSync(adminIndexPath),
    checks: {
      collections: Object.keys(collectionDirs).length,
      documents: stats.documents,
      localAssetRefs: stats.localAssetRefs,
      references: stats.references,
    },
    failures: failures.length,
    media: mediaManifest?.stats || null,
    outputPath: relative(outputPath),
    warnings: warnings.length,
  }

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify({ summary, stats, failures, warnings }, null, 2)}\n`)

  console.log(JSON.stringify(summary, null, 2))
  if (failures.length > 0 || (strict && warnings.length > 0)) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
