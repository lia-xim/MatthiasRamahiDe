import process from 'node:process'

const args = process.argv.slice(2)
const option = (name, fallback = '') => {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback
}

const baseUrl = option('base-url', process.env.SEO_CLUSTER_BASE_URL || '').replace(/\/$/, '')
if (!baseUrl) {
  console.error('Usage: node tools/assert-seo-cluster-contract.mjs --base-url=http://127.0.0.1:4321')
  process.exit(2)
}

const families = [
  {
    key: 'automobil',
    parent: '/automobil-fotografie.html',
    duesseldorf: '/automobil-fotografie-duesseldorf.html',
    nrw: '/automobil-fotografie-nrw.html',
    child: '/automobil-fotografie-mettmann.html',
    intent: '/automotive-fotografie.html',
    duesseldorfIntent: '/automotive-fotografie-duesseldorf.html',
    proof: '/portfolio/portfolio-auswahl-automobil',
  },
  {
    key: 'sportwagen',
    parent: '/sportwagen-fotografie.html',
    duesseldorf: '/sportwagen-fotografie-duesseldorf.html',
    nrw: '/sportwagen-fotografie-nrw.html',
    child: '/sportwagen-fotografie-mettmann.html',
    intent: '/performance-car-fotografie.html',
    duesseldorfIntent: '/performance-car-fotografie-duesseldorf.html',
    proof: '/portfolio/portfolio-auswahl-sportwagen',
  },
  {
    key: 'oldtimer',
    parent: '/oldtimer-fotografie.html',
    duesseldorf: '/oldtimer-fotografie-duesseldorf.html',
    nrw: '/oldtimer-fotografie-nrw.html',
    child: '/oldtimer-fotografie-mettmann.html',
    intent: '/classic-car-fotografie.html',
    duesseldorfIntent: '/classic-car-fotografie-duesseldorf.html',
    proof: '/portfolio/portfolio-auswahl-oldtimer',
  },
  {
    key: 'motorrad',
    parent: '/motorrad-fotografie.html',
    duesseldorf: '/motorrad-fotografie-duesseldorf.html',
    nrw: '/motorrad-fotografie-nrw.html',
    child: '/motorrad-fotografie-mettmann.html',
    intent: '/custom-bike-fotografie.html',
    duesseldorfIntent: '/custom-bike-fotografie-duesseldorf.html',
    proof: '/portfolio/portfolio-auswahl-motorrad',
  },
  {
    key: 'portrait',
    parent: '/portraitfotografie.html',
    duesseldorf: '/portraitfotografie-duesseldorf.html',
    nrw: '/portraitfotografie-nrw.html',
    child: '/portraitfotografie-mettmann.html',
    intent: '/personal-branding-fotografie.html',
    duesseldorfIntent: '/personal-branding-fotografie-duesseldorf.html',
    proof: '/portfolio/portfolio-auswahl-portrait',
  },
  {
    key: 'landschaft',
    parent: '/landschaftsfotografie.html',
    duesseldorf: '/landschaftsfotografie-duesseldorf.html',
    nrw: '/landschaftsfotografie-nrw.html',
    child: '/landschaftsfotografie-mettmann.html',
    intent: '/fine-art-prints-landschaft.html',
    duesseldorfIntent: '',
    proof: '/portfolio/portfolio-auswahl-landschaft',
  },
]

const guides = [
  '/auto-fotografieren-tipps.html',
  '/portraitfotografie-beleuchtung.html',
]

const failures = []
const rows = []
const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/
const internalOrigins = new Set([
  new URL(baseUrl).origin,
  'https://matthiasramahi.de',
  'https://www.matthiasramahi.de',
])

const normalizeHref = (href, sourcePath) => {
  try {
    const url = new URL(href, `${baseUrl}${sourcePath}`)
    return internalOrigins.has(url.origin) ? (url.pathname || '/') : ''
  } catch {
    return ''
  }
}

const anchorPaths = (html, sourcePath) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
    .map((match) => normalizeHref(match[1], sourcePath))
    .filter(Boolean)

const requireCondition = (condition, details) => {
  if (!condition) failures.push(details)
}

const attributeValue = (html, name) =>
  html.match(new RegExp(`<body\\b[^>]*\\b${name}="([^"]+)"`, 'i'))?.[1] || ''

const jsonLdItems = (html) =>
  [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap((match) => {
      try {
        const value = JSON.parse(match[1])
        return Array.isArray(value?.['@graph']) ? value['@graph'] : [value]
      } catch {
        return []
      }
    })

const xmlText = async (path) => {
  const response = await fetch(`${baseUrl}${path}`)
  const text = await response.text()
  requireCondition(response.status === 200, {
    type: 'sitemap-status',
    path,
    expected: 200,
    actual: response.status,
  })
  return text
}

async function sitemapUrlEntries() {
  const indexXml = await xmlText('/sitemap.xml')
  const sitemapPaths = [...indexXml.matchAll(/<loc>([^<]+\.xml)<\/loc>/g)]
    .map((match) => normalizeHref(match[1], '/sitemap.xml'))
    .filter((path) => path && path !== '/sitemap.xml')
  const byPath = new Map()

  for (const sitemapPath of sitemapPaths) {
    const xml = await xmlText(sitemapPath)
    for (const match of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
      const path = normalizeHref(match[1], sitemapPath)
      if (path) byPath.set(path, { lastmod: match[2] || '', sitemapPath })
    }
  }

  return byPath
}

async function readPage(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' })
  const html = await response.text()
  requireCondition(response.status === 200, {
    type: 'status',
    path,
    expected: 200,
    actual: response.status,
  })
  return { html, status: response.status }
}

for (const family of families) {
  const roles = [
    ['pillar', family.parent, [family.duesseldorf, family.nrw], false],
    ['duesseldorf-hub', family.duesseldorf, [family.parent, family.nrw], true],
    ['nrw-hub', family.nrw, [family.parent, family.duesseldorf], true],
    ['child', family.child, [family.parent, family.duesseldorf, family.nrw], false],
    ['intent', family.intent, [family.parent, family.duesseldorf, family.nrw], false],
  ]
  const deutschlandPath = family.duesseldorf.replace('-duesseldorf.html', '-deutschland.html')

  for (const [role, path, requiredPaths, expectsCrossFamilyCluster] of roles) {
    const { html, status } = await readPage(path)
    const links = anchorPaths(html, path)
    const curatedLinkCount = [...html.matchAll(/class="mr-cities__cell"/g)].length
    const hasCrossFamilyCluster = html.includes('mr-photo-cluster')

    requireCondition(links.includes(family.proof), {
      type: 'missing-proof-link',
      family: family.key,
      role,
      path,
      expected: family.proof,
    })
    requireCondition(requiredPaths.every((requiredPath) => links.includes(requiredPath)), {
      type: 'missing-role-link',
      family: family.key,
      role,
      path,
      missing: requiredPaths.filter((requiredPath) => !links.includes(requiredPath)),
    })
    requireCondition(curatedLinkCount >= 6, {
      type: 'insufficient-curated-links',
      family: family.key,
      role,
      path,
      actual: curatedLinkCount,
      minimum: 6,
    })
    requireCondition(html.includes('data-contact-section'), {
      type: 'missing-contact-section',
      family: family.key,
      role,
      path,
    })
    requireCondition(hasCrossFamilyCluster === expectsCrossFamilyCluster, {
      type: 'cross-family-cluster-role',
      family: family.key,
      role,
      path,
      expected: expectsCrossFamilyCluster,
      actual: hasCrossFamilyCluster,
    })
    requireCondition(!links.includes(deutschlandPath), {
      type: 'deprioritized-deutschland-link',
      family: family.key,
      role,
      path,
      href: deutschlandPath,
    })
    if (role === 'pillar') {
      requireCondition(links.includes(family.intent), {
        type: 'missing-generic-pillar-intent',
        family: family.key,
        path,
        expected: family.intent,
      })
      if (family.duesseldorfIntent) {
        requireCondition(!links.includes(family.duesseldorfIntent), {
          type: 'unexpected-duesseldorf-intent-on-pillar',
          family: family.key,
          path,
          unexpected: family.duesseldorfIntent,
        })
      }
    }

    rows.push({
      family: family.key,
      role,
      path,
      status,
      curatedLinkCount,
      crossFamilyCluster: hasCrossFamilyCluster,
    })
  }

  const proofPage = await readPage(family.proof)
  const proofLinks = anchorPaths(proofPage.html, family.proof)
  requireCondition(proofLinks.includes(family.duesseldorf), {
    type: 'missing-proof-to-service-link',
    family: family.key,
    path: family.proof,
    expected: family.duesseldorf,
  })

  const deutschlandResponse = await fetch(`${baseUrl}${deutschlandPath}`, { redirect: 'manual' })
  requireCondition(deutschlandResponse.status === 308, {
    type: 'deutschland-family-redirect-status',
    family: family.key,
    path: deutschlandPath,
    expected: 308,
    actual: deutschlandResponse.status,
  })
  requireCondition(deutschlandResponse.headers.get('location') === family.duesseldorf, {
    type: 'deutschland-family-redirect-target',
    family: family.key,
    path: deutschlandPath,
    expected: family.duesseldorf,
    actual: deutschlandResponse.headers.get('location'),
  })
}

const sitemapEntries = await sitemapUrlEntries()

for (const path of guides) {
  const { html } = await readPage(path)
  const structuredData = jsonLdItems(html)
  const types = structuredData.map((item) => item?.['@type']).filter(Boolean)
  const article = structuredData.find((item) => item?.['@type'] === 'Article')
  requireCondition(types.includes('Article'), {
    type: 'missing-article-schema',
    path,
    actualTypes: types,
  })
  requireCondition(!types.includes('Service'), {
    type: 'unexpected-service-schema',
    path,
    actualTypes: types,
  })
  requireCondition(html.includes('class="mr-guide"'), {
    type: 'missing-practical-guide',
    path,
  })
  requireCondition(isoDateTimePattern.test(article?.datePublished || ''), {
    type: 'invalid-article-date-published',
    path,
    actual: article?.datePublished,
  })
  requireCondition(isoDateTimePattern.test(article?.dateModified || ''), {
    type: 'invalid-article-date-modified',
    path,
    actual: article?.dateModified,
  })
  requireCondition(article?.dateModified?.slice(0, 10) === sitemapEntries.get(path)?.lastmod, {
    type: 'article-sitemap-lastmod-mismatch',
    path,
    articleDateModified: article?.dateModified,
    sitemapLastmod: sitemapEntries.get(path)?.lastmod,
  })
}

const analytics = await readPage('/assets/analytics.js')
for (const dimension of ['pageFamily', 'pageRole', 'projectType']) {
  requireCondition(analytics.html.includes(dimension), {
    type: 'missing-analytics-dimension',
    path: '/assets/analytics.js',
    dimension,
  })
}
for (const unsafePattern of [
  "track('contact-phone', { href:",
  "track('contact-email', { href:",
  "track('contact-whatsapp', { href:",
  "track('social-click', { network: network, href:",
  "track('outbound-link', { domain: host, href:",
]) {
  requireCondition(!analytics.html.includes(unsafePattern), {
    type: 'analytics-sensitive-href',
    path: '/assets/analytics.js',
    unsafePattern,
  })
}
requireCondition(analytics.html.includes('data-page-family'), {
  type: 'analytics-route-taxonomy-not-server-owned',
  path: '/assets/analytics.js',
})

const sitemapPaths = [...sitemapEntries.keys()]
const renderedPages = new Map()
const familyRoleCounts = new Map()
const batchSize = 12

for (let offset = 0; offset < sitemapPaths.length; offset += batchSize) {
  const batch = sitemapPaths.slice(offset, offset + batchSize)
  const results = await Promise.all(batch.map(async (path) => {
    const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' })
    return {
      familyHeader: response.headers.get('x-cms-layout-family') || '',
      html: await response.text(),
      path,
      status: response.status,
    }
  }))

  for (const result of results) {
    requireCondition(result.status === 200, {
      type: 'sitemap-page-status',
      path: result.path,
      expected: 200,
      actual: result.status,
    })
    renderedPages.set(result.path, result.html)

    if (!result.familyHeader) continue
    const pageFamily = attributeValue(result.html, 'data-page-family')
    const pageRole = attributeValue(result.html, 'data-page-role')
    requireCondition(pageFamily === result.familyHeader, {
      type: 'analytics-family-mismatch',
      path: result.path,
      expected: result.familyHeader,
      actual: pageFamily,
    })
    requireCondition(pageRole && pageRole !== 'other', {
      type: 'analytics-role-mismatch',
      path: result.path,
      actual: pageRole,
    })
    familyRoleCounts.set(pageFamily, (familyRoleCounts.get(pageFamily) || 0) + 1)
  }
}

const sitemapPathSet = new Set(sitemapPaths)
const graph = new Map()
const inboundCounts = new Map(sitemapPaths.map((path) => [path, 0]))
for (const [sourcePath, html] of renderedPages) {
  const targets = [...new Set(anchorPaths(html, sourcePath).filter((path) => sitemapPathSet.has(path)))]
  graph.set(sourcePath, targets)
  for (const target of targets) {
    if (target !== sourcePath) inboundCounts.set(target, (inboundCounts.get(target) || 0) + 1)
  }
}

const depths = new Map([['/', 0]])
const queue = ['/']
while (queue.length > 0) {
  const source = queue.shift()
  const depth = depths.get(source)
  for (const target of graph.get(source) || []) {
    if (depths.has(target)) continue
    depths.set(target, depth + 1)
    queue.push(target)
  }
}

const orphanPaths = sitemapPaths.filter((path) => path !== '/' && (inboundCounts.get(path) || 0) === 0)
const unreachablePaths = sitemapPaths.filter((path) => !depths.has(path))
const deepPaths = sitemapPaths
  .map((path) => ({ depth: depths.get(path), path }))
  .filter((entry) => typeof entry.depth === 'number' && entry.depth > 3)

requireCondition(orphanPaths.length === 0, {
  type: 'sitemap-orphans',
  paths: orphanPaths,
})
requireCondition(unreachablePaths.length === 0, {
  type: 'sitemap-unreachable',
  paths: unreachablePaths,
})
requireCondition(deepPaths.length === 0, {
  type: 'sitemap-click-depth',
  maximum: 3,
  paths: deepPaths,
})

const result = {
  baseUrl,
  checkedFamilyRolePages: rows.length,
  checkedProofPages: families.length,
  checkedGuides: guides.length,
  checkedSitemapPages: sitemapPaths.length,
  familyRoleCounts: Object.fromEntries(familyRoleCounts),
  maximumClickDepth: Math.max(...depths.values()),
  orphanPaths,
  unreachablePaths,
  failures,
  rows,
}

console.log(JSON.stringify(result, null, 2))
process.exit(failures.length ? 1 : 0)
