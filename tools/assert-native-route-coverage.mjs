import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const defaultRepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function quotedStrings(value = '') {
  return [...value.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1])
}

function extractArray(source, name) {
  const match = source.match(new RegExp(`(?:export\\s+)?const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*(?:as\\s+const)?`, 'm'))
  return match ? quotedStrings(match[1]) : []
}

function extractSet(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*new\\s+Set\\(\\[([\\s\\S]*?)\\]\\)`, 'm'))
  return new Set(match ? quotedStrings(match[1]) : [])
}

function extractObjectKeyValues(source, name) {
  const match = source.match(new RegExp(`(?:export\\s+)?const\\s+${name}[\\s\\S]*?=\\s*\\{([\\s\\S]*?)\\}\\s*(?:as\\s+const)?`, 'm'))
  const entries = []
  if (!match) return entries

  for (const [, key, value] of match[1].matchAll(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)) {
    entries.push([key, value])
  }

  return entries
}

function extractHtmlObjectKeys(source, name) {
  const start = source.indexOf(name)
  const section = start >= 0 ? source.slice(start) : source
  return new Set([...section.matchAll(/['"]([^'"]+\.html)['"]\s*:/g)].map((match) => match[1]))
}

function extractLocalSeoPrefixes(source) {
  const prefixes = new Set()
  for (const match of source.matchAll(/prefixes:\s*\[([\s\S]*?)\]/g)) {
    for (const prefix of quotedStrings(match[1])) prefixes.add(prefix)
  }
  return prefixes
}

function isLocalSeoRoute(file, adoptedFiles, localSeoPrefixes) {
  if (!file.endsWith('.html') || adoptedFiles.has(file)) return false
  const slug = file.replace(/\.html$/i, '')
  return [...localSeoPrefixes].some((prefix) => slug.startsWith(prefix))
}

function generatedLocalSeoFiles(adoptedRoutes, localSeoFamilies) {
  const cityTokens = extractArray(localSeoFamilies, 'localSeoCityTokens')
  const fullScopePrefixes = extractArray(adoptedRoutes, 'fullScopeLocalSeoPrefixes')
  const duesseldorfPrefixes = extractArray(adoptedRoutes, 'duesseldorfScopedKeywordPrefixes')
  const standaloneFiles = extractArray(adoptedRoutes, 'standaloneKeywordFiles')
  const specialFiles = extractArray(adoptedRoutes, 'specialScopedKeywordFiles')
  const fullScopeFiles = fullScopePrefixes.flatMap((prefix) => [
    `${prefix}.html`,
    ...cityTokens.map((scope) => `${prefix}-${scope}.html`),
  ])
  const duesseldorfFiles = duesseldorfPrefixes.map((prefix) => `${prefix}-duesseldorf.html`)

  return [...fullScopeFiles, ...duesseldorfFiles, ...standaloneFiles, ...specialFiles]
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1)
}

export async function auditNativeRouteCoverage(options = {}) {
  const repoRoot = options.repoRoot || defaultRepoRoot
  const read = (relativePath) => fs.readFile(path.join(repoRoot, relativePath), 'utf8')
  const manifest = JSON.parse(await read('docs/legacy-reference-manifest.json'))
  const [adoptedRoutes, nativeRegistry, journalContent, serviceContent, conceptContent, localSeoFamilies] =
    await Promise.all([
      read('apps/web/src/lib/adoptedRoutes.ts'),
      read('apps/web/src/lib/nativeAdoptedRouteRegistry.ts'),
      read('apps/web/src/lib/journalArticleContent.ts'),
      read('apps/web/src/lib/serviceDetailContent.ts'),
      read('apps/web/src/lib/conceptArchiveContent.ts'),
      read('apps/web/src/lib/localSeoLayoutFamilies.ts'),
    ])

  const frozenFiles = new Set((manifest.entries || []).map((entry) => entry.file))
  const adoptedFiles = new Set(extractArray(adoptedRoutes, 'adoptedLegacyFiles'))
  const redirectEntries = extractObjectKeyValues(adoptedRoutes, 'legacyRedirectTargets')
  const redirects = new Map(redirectEntries)
  const routeModelFiles = new Set([
    'index.html',
    ...adoptedFiles,
    ...redirects.keys(),
    ...generatedLocalSeoFiles(adoptedRoutes, localSeoFamilies),
  ])
  const exactRouteKinds = new Map(extractObjectKeyValues(nativeRegistry, 'exactRouteKinds'))
  const photographyOverviewFiles = extractSet(nativeRegistry, 'photographyOverviewFiles')
  const legalFiles = extractSet(nativeRegistry, 'legalFiles')
  const journalFiles = new Set(quotedStrings(journalContent).filter((value) => value.endsWith('.html')))
  const serviceFiles = extractHtmlObjectKeys(serviceContent, 'nativeServiceDetailPages')
  const conceptFiles = extractHtmlObjectKeys(conceptContent, 'conceptArchivePages')
  const localSeoPrefixes = extractLocalSeoPrefixes(localSeoFamilies)

  const nativeKindFor = (file) => {
    const normalized = (file || '').replace(/^\/+/, '').toLowerCase()
    if (!normalized) return null
    if (exactRouteKinds.has(normalized)) return exactRouteKinds.get(normalized)
    if (photographyOverviewFiles.has(normalized)) return 'photography-overview'
    if (legalFiles.has(normalized)) return 'legal'
    if (journalFiles.has(normalized)) return 'journal-detail'
    if (serviceFiles.has(normalized)) return 'service-detail'
    if (conceptFiles.has(normalized)) return 'concept'
    if (isLocalSeoRoute(normalized, adoptedFiles, localSeoPrefixes)) return 'local-seo'
    return null
  }

  const failures = []
  const nativeCounts = new Map()
  let redirectCount = 0

  for (const file of [...frozenFiles].sort((a, b) => a.localeCompare(b))) {
    if (!routeModelFiles.has(file)) failures.push(`Frozen root HTML file is not present in the Astro native route model: ${file}`)
  }

  for (const file of [...routeModelFiles].sort((a, b) => a.localeCompare(b))) {
    if (!frozenFiles.has(file)) failures.push(`Astro native route model contains an HTML file outside the frozen manifest: ${file}`)
  }

  for (const file of [...frozenFiles].sort((a, b) => a.localeCompare(b))) {
    if (redirects.has(file)) {
      redirectCount += 1
      continue
    }

    const kind = nativeKindFor(file)
    if (kind) {
      increment(nativeCounts, kind)
      continue
    }

    failures.push(`Frozen root HTML file has no native renderer or redirect: ${file}`)
  }

  for (const file of [...adoptedFiles].sort((a, b) => a.localeCompare(b))) {
    if (!frozenFiles.has(file)) failures.push(`Adopted route is not present in the frozen legacy manifest: ${file}`)
    if (!nativeKindFor(file)) failures.push(`Adopted route has no native renderer kind: ${file}`)
  }

  for (const [source, target] of [...redirects.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!frozenFiles.has(source)) failures.push(`Redirect source is not present in the frozen legacy manifest: ${source}`)
    if (!frozenFiles.has(target)) failures.push(`Redirect target is not present in the frozen legacy manifest: ${source} -> ${target}`)
    if (!nativeKindFor(target)) failures.push(`Redirect target has no native renderer kind: ${source} -> ${target}`)
  }

  return {
    failures,
    frozenFiles: frozenFiles.size,
    nativeFiles: [...nativeCounts.values()].reduce((sum, count) => sum + count, 0),
    redirectFiles: redirectCount,
    routeModelFiles: routeModelFiles.size,
    nativeCounts: Object.fromEntries([...nativeCounts.entries()].sort(([a], [b]) => a.localeCompare(b))),
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const result = await auditNativeRouteCoverage()

  if (result.failures.length > 0) {
    console.error('Native route coverage audit failed:')
    for (const failure of result.failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  console.log(
    `Native route coverage passed: ${result.frozenFiles}/${result.frozenFiles} frozen HTML files covered and ${result.routeModelFiles}/${result.frozenFiles} route-model files matched (${result.nativeFiles} native, ${result.redirectFiles} redirects).`,
  )
}
