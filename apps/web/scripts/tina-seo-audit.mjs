import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

const option = (name, fallback = '') => {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback
}

const baseUrl = option('base-url').replace(/\/$/, '')
const outputPath = path.resolve(appRoot, option('output', '.cms-parity/tina-seo-audit.json'))

const collections = [
  ['pages', 'content/pages'],
  ['service-pages', 'content/service-pages'],
  ['local-seo-pages', 'content/local-seo-pages'],
  ['portfolio-projects', 'content/portfolio-projects'],
  ['journal-posts', 'content/journal-posts'],
]

const sitemapPaths = [
  '/sitemap-pages.xml',
  '/sitemap-services.xml',
  '/sitemap-local-seo.xml',
  '/sitemap-portfolio.xml',
  '/sitemap-journal.xml',
]

const overviewSlugs = new Set(['fotografie-deutschland', 'fotografie-duesseldorf', 'fotografie-nrw'])
const overviewFamilyEntryLinks = [
  '/automobil-fotografie.html',
  '/sportwagen-fotografie.html',
  '/oldtimer-fotografie.html',
  '/motorrad-fotografie.html',
  '/portraitfotografie.html',
  '/landschaftsfotografie.html',
]

const clean = (value) => String(value || '').trim()

const decodeHtml = (value = '') =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const normalizeUrl = (value) => {
  const url = new URL(value)
  url.hash = ''
  url.pathname = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '')
  return url.toString()
}

const routePath = (canonical) => new URL(canonical).pathname || '/'

const extract = (html, pattern) => decodeHtml(html.match(pattern)?.[1] || '')

const familyFor = (doc) => {
  const slug = clean(doc.slug).toLowerCase()
  const text = `${slug} ${doc.legacyUrl || ''} ${doc.targetKeyword || ''} ${doc.seo?.focusKeyword || ''} ${doc.title || ''}`.toLowerCase()

  if (/^fotografie-(deutschland|duesseldorf|nrw)$/.test(slug)) return 'fotografie-overview'
  if (/oldtimer|youngtimer|classic-car|classic car|sammlerfahrzeug/.test(text)) return 'oldtimer'
  if (/sportwagen|supersportwagen|performance-car|exotic-car|motorsport/.test(text)) return 'sportwagen'
  if (/motorrad|bike/.test(text)) return 'motorrad'
  if (/portrait|headshot|personal-branding|business|bewerbung|people|dating|paarshooting|familienshooting|fotoshooting-gutschein|fotoshooting-preise/.test(text)) return 'portrait'
  if (/landschaft|wandbilder|landscape/.test(text)) return 'landschaft'
  if (/auto|automobil|automotive|fahrzeug/.test(text)) return 'automobil'

  return 'unclassified'
}

function readDocuments() {
  const docs = []

  for (const [collection, dir] of collections) {
    const absoluteDir = path.join(appRoot, dir)
    for (const file of fs.readdirSync(absoluteDir).filter((name) => name.endsWith('.json'))) {
      const doc = JSON.parse(fs.readFileSync(path.join(absoluteDir, file), 'utf8'))
      docs.push({ collection, file, doc, label: `${collection}/${file}` })
    }
  }

  return docs
}

function pushDuplicate(map, key, label, type, issues) {
  if (!key) return
  if (map.has(key)) issues.push({ type, key, first: map.get(key), second: label })
  else map.set(key, label)
}

function auditContent(docs) {
  const issues = []
  const seenCanonical = new Map()
  const seenTitle = new Map()
  const seenFocus = new Map()
  const clusters = new Map()
  const lengthIssues = {
    longDescriptions: [],
    shortDescriptions: [],
    longTitles: [],
  }

  for (const { collection, file, doc, label } of docs) {
    const seo = doc.seo || {}

    for (const field of ['title', 'description', 'focusKeyword', 'searchIntent', 'canonicalUrl', 'ogImage']) {
      if (!clean(seo[field])) issues.push({ type: 'missing-seo-field', label, field })
    }

    if (collection === 'local-seo-pages' && !clean(doc.targetKeyword)) {
      issues.push({ type: 'missing-targetKeyword', label })
    }

    if (clean(seo.canonicalUrl)) {
      try {
        const url = new URL(seo.canonicalUrl)
        if (url.protocol !== 'https:' || url.hostname !== 'matthiasramahi.de') {
          issues.push({ type: 'invalid-canonical-host', label, canonicalUrl: seo.canonicalUrl })
        }
      } catch {
        issues.push({ type: 'invalid-canonical-url', label, canonicalUrl: seo.canonicalUrl })
      }
    }

    pushDuplicate(seenCanonical, clean(seo.canonicalUrl), label, 'duplicate-canonical', issues)
    pushDuplicate(seenTitle, clean(seo.title), label, 'duplicate-title', issues)
    pushDuplicate(seenFocus, clean(seo.focusKeyword).toLowerCase(), label, 'duplicate-focusKeyword', issues)

    if (clean(seo.description).length > 165) lengthIssues.longDescriptions.push({ label, length: clean(seo.description).length })
    if (clean(seo.description).length < 70) lengthIssues.shortDescriptions.push({ label, length: clean(seo.description).length })
    if (clean(seo.title).length > 65) lengthIssues.longTitles.push({ label, length: clean(seo.title).length })

    if (collection === 'local-seo-pages') {
      const family = familyFor(doc)
      clusters.set(family, (clusters.get(family) || 0) + 1)
      if (family === 'unclassified') issues.push({ type: 'unclassified-local-seo-cluster', label, slug: doc.slug })
    }
  }

  return {
    clusters: Object.fromEntries([...clusters.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    issueCount: issues.length + lengthIssues.longDescriptions.length + lengthIssues.shortDescriptions.length + lengthIssues.longTitles.length,
    issues,
    lengthIssues: {
      longDescriptions: lengthIssues.longDescriptions.length,
      shortDescriptions: lengthIssues.shortDescriptions.length,
      longTitles: lengthIssues.longTitles.length,
      samples: {
        longDescriptions: lengthIssues.longDescriptions.slice(0, 20),
        shortDescriptions: lengthIssues.shortDescriptions.slice(0, 20),
        longTitles: lengthIssues.longTitles.slice(0, 20),
      },
    },
  }
}

async function auditLiveMeta(docs) {
  const issues = []

  for (const { collection, file, doc, label } of docs) {
    const canonical = doc.seo?.canonicalUrl
    const response = await fetch(`${baseUrl}${routePath(canonical)}`)
    const html = await response.text()

    if (response.status !== 200) {
      issues.push({ type: 'status', label, status: response.status, path: routePath(canonical) })
      continue
    }

    const rendered = {
      title: extract(html, /<title>([^<]*)<\/title>/),
      description: extract(html, /<meta name="description" content="([^"]*)"/),
      canonical: extract(html, /<link rel="canonical" href="([^"]*)"/),
      robots: extract(html, /<meta name="robots" content="([^"]*)"/),
      ogImage: extract(html, /<meta property="og:image" content="([^"]*)"/),
    }

    if (normalizeUrl(rendered.canonical) !== normalizeUrl(canonical)) {
      issues.push({ type: 'canonical', label, expected: canonical, actual: rendered.canonical })
    }
    if (rendered.title !== decodeHtml(doc.seo?.title || '')) {
      issues.push({ type: 'title', label, expected: doc.seo?.title, actual: rendered.title })
    }
    if (rendered.description !== decodeHtml(doc.seo?.description || '')) {
      issues.push({ type: 'description', label, expected: doc.seo?.description, actual: rendered.description })
    }
    if (doc.seo?.noIndex && !/^noindex/i.test(rendered.robots)) {
      issues.push({ type: 'robots-indexing', label, expected: 'noindex', actual: rendered.robots })
    }
    if (!doc.seo?.noIndex && !/^index/i.test(rendered.robots)) {
      issues.push({ type: 'robots-indexing', label, expected: 'index', actual: rendered.robots })
    }
    if (!rendered.ogImage) issues.push({ type: 'missing-og-image', label })
  }

  return { checked: docs.length, issueCount: issues.length, issues: issues.slice(0, 100) }
}

async function auditLiveClusterLinks(docs) {
  const issues = []
  const localDocs = docs.filter((item) => item.collection === 'local-seo-pages')
  const summary = { familyPages: 0, overviewPages: 0 }

  for (const { file, doc } of localDocs) {
    const pathName = routePath(doc.seo?.canonicalUrl)
    const response = await fetch(`${baseUrl}${pathName}`)
    const html = await response.text()

    if (response.status !== 200) {
      issues.push({ file, path: pathName, status: response.status })
      continue
    }

    if (overviewSlugs.has(doc.slug)) {
      summary.overviewPages += 1
      const missingTopics = overviewFamilyEntryLinks.filter((href) => !html.includes(`href="${href}"`) && !html.includes(`href="${href.slice(1)}"`))
      if (missingTopics.length) issues.push({ file, path: pathName, type: 'overview-missing-family-entry-links', missingTopics })
      continue
    }

    summary.familyPages += 1
    const section = html.match(/<section[^>]*mr-photo-cluster[\s\S]*?<\/section>/)?.[0] || ''
    const linkCount = [...section.matchAll(/class="mr-cities__cell"/g)].length
    const hasOverview = /fotografie-(duesseldorf|nrw|deutschland)\.html/.test(section)
    if (!section || linkCount < 6 || !hasOverview) {
      issues.push({ file, path: pathName, type: 'family-cluster-links', hasClusterSection: Boolean(section), linkCount, hasOverview })
    }
  }

  return { checked: localDocs.length, ...summary, issueCount: issues.length, issues: issues.slice(0, 100) }
}

async function auditLiveSitemaps(docs) {
  const issues = []
  const sitemapStatus = []
  const sitemapUrls = new Map()
  const expected = docs
    .map(({ collection, file, doc }) => ({ collection, file, url: doc.seo?.canonicalUrl ? normalizeUrl(doc.seo.canonicalUrl) : '' }))
    .filter((entry) => entry.url)

  for (const sitemapPath of sitemapPaths) {
    const response = await fetch(`${baseUrl}${sitemapPath}`)
    const xml = await response.text()
    sitemapStatus.push({ sitemapPath, status: response.status })

    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = normalizeUrl(match[1])
      const places = sitemapUrls.get(url) || []
      places.push(sitemapPath)
      sitemapUrls.set(url, places)
    }
  }

  const missing = expected.filter((entry) => !sitemapUrls.has(entry.url))
  const duplicates = [...sitemapUrls.entries()]
    .filter(([, places]) => places.length > 1)
    .map(([url, places]) => ({ url, places }))

  if (missing.length) issues.push({ type: 'missing-sitemap-canonicals', count: missing.length, entries: missing.slice(0, 50) })
  if (duplicates.length) issues.push({ type: 'duplicate-sitemap-urls', count: duplicates.length, entries: duplicates.slice(0, 50) })
  for (const item of sitemapStatus) {
    if (item.status !== 200) issues.push({ type: 'sitemap-status', ...item })
  }

  return {
    duplicateCount: duplicates.length,
    expectedCanonicals: expected.length,
    issueCount: issues.length,
    issues,
    missingCount: missing.length,
    sitemapStatus,
    sitemapUrls: sitemapUrls.size,
  }
}

async function main() {
  const docs = readDocuments()
  const content = auditContent(docs)
  const result = {
    baseUrl: baseUrl || null,
    documents: docs.length,
    content,
    live: null,
  }

  if (baseUrl) {
    result.live = {
      clusters: await auditLiveClusterLinks(docs),
      meta: await auditLiveMeta(docs),
      sitemaps: await auditLiveSitemaps(docs),
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`)

  const liveIssueCount = result.live
    ? result.live.clusters.issueCount + result.live.meta.issueCount + result.live.sitemaps.issueCount
    : 0
  const issueCount = content.issueCount + liveIssueCount
  const summary = { ...result, issueCount, outputPath: path.relative(appRoot, outputPath).replace(/\\/g, '/') }

  console.log(JSON.stringify(summary, null, 2))
  process.exit(issueCount ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
