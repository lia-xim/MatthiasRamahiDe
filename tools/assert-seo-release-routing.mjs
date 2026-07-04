import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const baseUrl = (option('base-url') || process.env.SEO_RELEASE_BASE_URL || '').replace(/\/$/, '')
const productionOrigin = 'https://matthiasramahi.de'
const requiredSitemapFiles = [
  '/sitemap-pages.xml',
  '/sitemap-local-seo.xml',
  '/sitemap-services.xml',
  '/sitemap-journal.xml',
  '/sitemap-portfolio.xml',
  '/sitemap-images.xml',
]

function option(name) {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || ''
}

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

function isLocalSeoRoute(file, adoptedFiles, localSeoPrefixes) {
  if (!file.endsWith('.html') || adoptedFiles.has(file)) return false
  const slug = file.replace(/\.html$/i, '')
  return [...localSeoPrefixes].some((prefix) => slug.startsWith(prefix))
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  return `/${pathname.replace(/^\/+/, '').replace(/\/+$/, '')}`
}

function routeForFile(file) {
  return file === 'index.html' ? '/' : `/${file}`
}

function urlForPath(pathname) {
  return `${baseUrl}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}

function productionUrlForPath(pathname) {
  return `${productionOrigin}${pathname === '/' ? '/' : pathname}`
}

async function read(relativePath) {
  return fs.readFile(path.join(repoRoot, relativePath), 'utf8')
}

async function fetchText(pathname, options = {}) {
  const response = await fetch(urlForPath(pathname), options)
  return { response, text: await response.text() }
}

function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim())
}

async function collectRouteModel() {
  const [adoptedRoutes, localSeoFamilies, conceptContent] = await Promise.all([
    read('apps/web/src/lib/adoptedRoutes.ts'),
    read('apps/web/src/lib/localSeoLayoutFamilies.ts'),
    read('apps/web/src/lib/conceptArchiveContent.ts'),
  ])

  const adoptedFiles = new Set(extractArray(adoptedRoutes, 'adoptedLegacyFiles'))
  const redirectEntries = extractObjectKeyValues(adoptedRoutes, 'legacyRedirectTargets')
  const pathRedirectEntries = extractObjectKeyValues(adoptedRoutes, 'legacyPathRedirectTargets')
  const redirectFiles = new Set(redirectEntries.map(([source]) => source))
  const conceptFiles = extractHtmlObjectKeys(conceptContent, 'conceptArchivePages')
  const localSeoPrefixes = extractLocalSeoPrefixes(localSeoFamilies)
  const routeModelFiles = new Set([
    'index.html',
    ...adoptedFiles,
    ...redirectFiles,
    ...generatedLocalSeoFiles(adoptedRoutes, localSeoFamilies),
  ])

  const expectedSitemapPaths = [...routeModelFiles]
    .filter((file) => !redirectFiles.has(file))
    .filter((file) => !conceptFiles.has(file))
    .filter((file) => file === 'index.html' || !isLocalSeoRoute(file, adoptedFiles, localSeoPrefixes) || file.endsWith('.html'))
    .map(routeForFile)
    .sort((a, b) => a.localeCompare(b))

  const forbiddenSitemapPaths = [...new Set([...redirectFiles, ...conceptFiles].map(routeForFile))].sort((a, b) =>
    a.localeCompare(b),
  )

  return {
    expectedSitemapPaths,
    forbiddenSitemapPaths,
    redirectEntries,
    pathRedirectEntries,
  }
}

async function auditSitemaps(expectedSitemapPaths, forbiddenSitemapPaths) {
  const failures = []
  const { response, text: indexXml } = await fetchText('/sitemap.xml')
  if (response.status !== 200) failures.push(`/sitemap.xml returned HTTP ${response.status}`)
  if (indexXml.includes('localhost') || indexXml.includes('127.0.0.1')) failures.push('/sitemap.xml contains a local host')

  const sitemapPaths = sitemapLocs(indexXml)
    .map((loc) => {
      try {
        return new URL(loc).pathname
      } catch {
        failures.push(`/sitemap.xml contains malformed loc: ${loc}`)
        return ''
      }
    })
    .filter(Boolean)

  for (const file of requiredSitemapFiles) {
    if (!sitemapPaths.includes(file)) failures.push(`/sitemap.xml does not list ${file}`)
  }

  const pagePaths = new Set()
  for (const sitemapPath of sitemapPaths.filter((file) => file.endsWith('.xml'))) {
    const { response: sitemapResponse, text: sitemapXml } = await fetchText(sitemapPath)
    if (sitemapResponse.status !== 200) {
      failures.push(`${sitemapPath} returned HTTP ${sitemapResponse.status}`)
      continue
    }
    if (sitemapXml.includes('localhost') || sitemapXml.includes('127.0.0.1')) failures.push(`${sitemapPath} contains a local host`)

    for (const loc of sitemapLocs(sitemapXml)) {
      try {
        const parsed = new URL(loc)
        if (parsed.pathname.endsWith('.xml')) continue
        if (parsed.origin !== productionOrigin) failures.push(`${sitemapPath} contains non-production URL ${loc}`)
        pagePaths.add(normalizePathname(parsed.pathname))
      } catch {
        failures.push(`${sitemapPath} contains malformed loc: ${loc}`)
      }
    }
  }

  const missing = expectedSitemapPaths.filter((pathname) => !pagePaths.has(normalizePathname(pathname)))
  const forbidden = forbiddenSitemapPaths.filter((pathname) => pagePaths.has(normalizePathname(pathname)))

  for (const pathname of missing) failures.push(`Sitemap missing expected canonical route ${productionUrlForPath(pathname)}`)
  for (const pathname of forbidden) failures.push(`Sitemap contains redirect/noindex route ${productionUrlForPath(pathname)}`)

  return {
    failures,
    sitemapFiles: sitemapPaths.length,
    sitemapPageUrls: pagePaths.size,
    expectedPageUrls: expectedSitemapPaths.length,
  }
}

function locationPathAndSearch(location, sourcePath) {
  try {
    const parsed = new URL(location, `${productionOrigin}${sourcePath}`)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return location
  }
}

async function auditRedirect(sourcePath, targetPath) {
  const response = await fetch(urlForPath(sourcePath), { redirect: 'manual' })
  const location = response.headers.get('location') || ''
  const actualLocation = locationPathAndSearch(location, sourcePath)
  const expectedLocation = targetPath

  if (![301, 308].includes(response.status)) {
    return `${sourcePath} should redirect to ${targetPath}, got HTTP ${response.status}`
  }

  if (actualLocation !== expectedLocation) {
    return `${sourcePath} should redirect to ${targetPath}, got ${actualLocation || '(empty location)'}`
  }

  return ''
}

async function auditRedirects(redirectEntries, pathRedirectEntries) {
  const importantAliasRedirects = [
    ['/journal', '/blog.html'],
    ['/journal/', '/blog.html'],
  ]
  const checks = [
    ...redirectEntries.map(([source, target]) => [`/${source}`, `/${target}`]),
    ...pathRedirectEntries.map(([source, target]) => [`/${source}/`, `/${target}`]),
    ...importantAliasRedirects,
  ]
  const failures = []

  for (const [source, target] of checks) {
    const failure = await auditRedirect(source, target)
    if (failure) failures.push(failure)
  }

  const queryFailure = await auditRedirect('/autofotografie/autofotografie-duesseldorf/?utm_source=seo-check', '/autofotografie-duesseldorf.html?utm_source=seo-check')
  if (queryFailure) failures.push(queryFailure)

  return { failures, checked: checks.length + 1 }
}

async function auditErrorAndRobots() {
  const failures = []
  const missingPath = `/__seo-release-missing-route-${Date.now()}`
  const missing = await fetchText(missingPath)
  if (missing.response.status !== 404) failures.push(`${missingPath} should return HTTP 404, got ${missing.response.status}`)
  if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(missing.text)) {
    failures.push('404 page is missing a noindex robots meta tag')
  }

  const robots = await fetchText('/robots.txt')
  if (robots.response.status !== 200) failures.push(`/robots.txt returned HTTP ${robots.response.status}`)
  if (!robots.text.includes(`Sitemap: ${productionOrigin}/sitemap.xml`)) {
    failures.push('/robots.txt does not point to the production sitemap URL')
  }
  if (!robots.text.includes('Disallow: /preview/')) failures.push('/robots.txt does not disallow /preview/')

  return { failures }
}

if (!baseUrl) {
  console.error('Missing --base-url=<url> or SEO_RELEASE_BASE_URL.')
  process.exit(1)
}

const routeModel = await collectRouteModel()
const [sitemapAudit, redirectAudit, errorAudit] = await Promise.all([
  auditSitemaps(routeModel.expectedSitemapPaths, routeModel.forbiddenSitemapPaths),
  auditRedirects(routeModel.redirectEntries, routeModel.pathRedirectEntries),
  auditErrorAndRobots(),
])

const failures = [...sitemapAudit.failures, ...redirectAudit.failures, ...errorAudit.failures]
const summary = {
  baseUrl,
  checkedRedirects: redirectAudit.checked,
  expectedSitemapUrls: sitemapAudit.expectedPageUrls,
  failures: failures.length,
  sitemapFiles: sitemapAudit.sitemapFiles,
  sitemapPageUrls: sitemapAudit.sitemapPageUrls,
}

console.log(JSON.stringify(summary, null, 2))

if (failures.length > 0) {
  console.error('SEO release routing audit failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
