import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_ORIGIN = 'https://matthiasramahi.de'
const DEFAULT_ROUTES = [
  '/',
  '/fotografie.html',
  '/portfolio.html',
  '/automobil-fotografie-duesseldorf.html',
  '/sportwagen-fotografie-duesseldorf.html',
  '/oldtimer-fotografie-duesseldorf.html',
  '/motorrad-fotografie-duesseldorf.html',
  '/portraitfotografie-duesseldorf.html',
  '/landschaftsfotografie-duesseldorf.html',
  '/contact.html',
]

const args = process.argv.slice(2)
const origin = normalizeOrigin(option('origin', process.env.WARMUP_ORIGIN || DEFAULT_ORIGIN))
const sitemapUrl = absoluteUrl(option('sitemap', `${origin}/sitemap.xml`), origin)
const routes = option('routes')
  .split(',')
  .map((route) => route.trim())
  .filter(Boolean)
const concurrency = Math.max(1, Number(option('concurrency', '6')))
const timeoutMs = Math.max(1000, Number(option('timeout-ms', '15000')))
const retries = Math.max(0, Number(option('retries', '1')))
const limit = Math.max(0, Number(option('limit', '0')))
const assetMode = option('asset-mode', 'critical')
const outputPath = option('output', '')
const dryRun = flag('dry-run')
const strict = !flag('no-strict')

const userAgent = option('user-agent', 'MatthiasRamahiCacheWarmup/1.0')
const warmedAt = new Date().toISOString()

function option(name, fallback = '') {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback
}

function flag(name) {
  return args.includes(`--${name}`)
}

function normalizeOrigin(value) {
  return value.replace(/\/+$/, '')
}

function absoluteUrl(value, base) {
  return new URL(value, base).href
}

function sameOrigin(url) {
  try {
    return new URL(url).origin === origin
  } catch {
    return false
  }
}

function unique(values) {
  return [...new Set(values)]
}

async function fetchText(url) {
  const result = await fetchUrl(url)
  if (!result.ok) throw new Error(`Failed to fetch ${url}: HTTP ${result.status}`)
  return result.text
}

async function collectSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return []
  seen.add(url)

  const xml = await fetchText(url)
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim())
  if (/<sitemapindex[\s>]/i.test(xml)) {
    const nested = await Promise.all(
      locs
        .filter((loc) => loc.endsWith('.xml'))
        .map((loc) => collectSitemapUrls(absoluteUrl(loc, origin), seen)),
    )
    return nested.flat()
  }

  return locs.filter((loc) => !loc.endsWith('.xml') && sameOrigin(loc))
}

async function discoverPageUrls() {
  if (routes.length > 0) return routes.map((route) => absoluteUrl(route, origin))

  try {
    const sitemapUrls = await collectSitemapUrls(sitemapUrl)
    if (sitemapUrls.length > 0) return sitemapUrls
  } catch (error) {
    console.warn(`Sitemap discovery failed, falling back to core routes: ${error.message}`)
  }

  return DEFAULT_ROUTES.map((route) => absoluteUrl(route, origin))
}

async function fetchUrl(url) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, {
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'user-agent': userAgent,
        },
        redirect: 'follow',
        signal: controller.signal,
      })
      const contentType = response.headers.get('content-type') || ''
      const body = await response.arrayBuffer()
      clearTimeout(timer)
      const text = contentType.includes('text/') || contentType.includes('xml') || contentType.includes('json')
        ? new TextDecoder().decode(body)
        : ''
      return {
        bytes: body.byteLength,
        cache: response.headers.get('x-vercel-cache') || '',
        contentType,
        ok: response.ok,
        status: response.status,
        text,
        url,
      }
    } catch (error) {
      clearTimeout(timer)
      lastError = error
    }
  }

  return {
    bytes: 0,
    cache: '',
    contentType: '',
    error: lastError?.message || 'request failed',
    ok: false,
    status: 0,
    text: '',
    url,
  }
}

function collectAssets(html, pageUrl) {
  if (assetMode === 'none') return []

  const candidates = []
  for (const match of html.matchAll(/\b(?:href|src|poster)=["']([^"']+)["']/gi)) {
    candidates.push(...expandCandidate(match[1], pageUrl))
  }
  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    const srcset = match[1]
      .split(',')
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean)
    for (const src of srcset) candidates.push(...expandCandidate(src, pageUrl))
  }

  return unique(candidates.filter((url) => shouldWarmAsset(url)))
}

function expandCandidate(value, pageUrl) {
  if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) return []
  try {
    return [new URL(value, pageUrl).href]
  } catch {
    return []
  }
}

function shouldWarmAsset(url) {
  if (!sameOrigin(url)) return false
  const pathname = new URL(url).pathname.toLowerCase()
  if (assetMode === 'all') return /\.(css|js|mjs|json|webmanifest|ico|svg|png|jpe?g|webp|avif|mp4|webm|woff2?)$/.test(pathname)
  return /\.(css|js|mjs|json|webmanifest|ico|svg)$/.test(pathname) || pathname.includes('/assets/site-chrome')
}

async function runQueue(items, worker) {
  const results = []
  let cursor = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index], index)
    }
  })
  await Promise.all(workers)
  return results
}

const allPageUrls = unique(await discoverPageUrls())
const pageUrls = limit > 0 ? allPageUrls.slice(0, limit) : allPageUrls

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, origin, pages: pageUrls.length, pageUrls }, null, 2))
  process.exit(0)
}

const discoveredAssets = new Set()
const pageResults = await runQueue(pageUrls, async (url) => {
  const result = await fetchUrl(url)
  if (result.ok && result.text) {
    for (const asset of collectAssets(result.text, result.url)) discoveredAssets.add(asset)
  }
  return compactResult(result)
})

const assetUrls = [...discoveredAssets].sort()
const assetResults = await runQueue(assetUrls, async (url) => compactResult(await fetchUrl(url)))

const failures = [...pageResults, ...assetResults].filter((result) => !result.ok)
const summary = {
  assetMode,
  assets: assetResults.length,
  failures: failures.length,
  origin,
  pages: pageResults.length,
  warmedAt,
}
const report = { summary, failures, pages: pageResults, assets: assetResults }

if (outputPath) {
  await fs.mkdir(path.dirname(path.resolve(outputPath)), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`)
}

console.log(JSON.stringify(summary, null, 2))
if (failures.length > 0) {
  console.error(JSON.stringify(failures.slice(0, 20), null, 2))
  if (strict) process.exit(1)
}

function compactResult(result) {
  return {
    bytes: result.bytes,
    cache: result.cache,
    contentType: result.contentType,
    error: result.error || '',
    ok: result.ok,
    status: result.status,
    url: result.url,
  }
}
