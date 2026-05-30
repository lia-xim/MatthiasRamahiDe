import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import http from 'node:http'
import path from 'node:path'

import { chromium } from 'playwright'

const repoRoot = path.resolve(process.cwd(), '../..')
const args = process.argv.slice(2)

function option(name, fallback = '') {
  const prefix = `--${name}=`
  return (
    args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ||
    process.env[`SITE_QUALITY_${name.toUpperCase().replaceAll('-', '_')}`] ||
    fallback
  )
}

function flag(name) {
  return args.includes(`--${name}`) || process.env[`SITE_QUALITY_${name.toUpperCase().replaceAll('-', '_')}`] === 'true'
}

const targetRoot = path.resolve(repoRoot, option('target', 'apps/web/dist/client'))
const outputPath = path.resolve(process.cwd(), option('output', '.site-quality/site-quality-audit.json'))
const legacyManifestPath = path.join(repoRoot, 'docs', 'legacy-reference-manifest.json')
const providedBaseUrl = option('base-url').replace(/\/$/, '')
const routeSource = option('route-source', providedBaseUrl ? 'all' : 'build')
const routeFilter = new Set(
  option('routes')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean)
    .map(normalizeRoute),
)
const selectedViewportNames = option('viewports', 'mobile,desktop')
  .split(',')
  .map((viewport) => viewport.trim())
  .filter(Boolean)
// Performance budgets are only meaningful when each page is measured in isolation.
// Parallel browser tabs introduce CPU contention and turn harmless image/gallery work
// into false long-task failures, especially on media-heavy local SEO pages.
const concurrency = Math.max(1, Number(option('concurrency', '1')))
const auditAttempts = Math.max(1, Number(option('attempts', '2')) || 2)
const limit = Math.max(0, Number(option('limit', '0')))
const strict = flag('strict')
const skipScroll = flag('skip-scroll')
const navigationTimeoutMs = Math.max(5000, Number(option('timeout-ms', '30000')))
const settleDelayMs = Math.max(0, Number(option('settle-ms', '450')))
const allowedExternalOrigins = new Set(
  option('allowed-origins', 'https://matthiasramahi.de,https://www.matthiasramahi.de,https://cms.matthiasramahi.de')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
)

const contentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
  ['.xml', 'application/xml; charset=utf-8'],
])

const viewports = {
  desktop: {
    height: 1000,
    hasTouch: false,
    isMobile: false,
    width: 1440,
  },
  mobile: {
    deviceScaleFactor: 2,
    height: 844,
    hasTouch: true,
    isMobile: true,
    width: 390,
  },
}

const budgets = {
  clsFail: 0.05,
  clsWarn: 0.01,
  domNodesFail: 1600,
  domNodesWarn: 1000,
  longTaskMaxFailMs: 350,
  longTaskMaxWarnMs: 50,
  longTaskTotalFailMs: 600,
  longTaskTotalWarnMs: 150,
}

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function normalizeRoute(route) {
  const withSlash = route.startsWith('/') ? route : `/${route}`
  const withoutIndex = withSlash === '/index.html' ? '/' : withSlash
  return withoutIndex.length > 1 ? withoutIndex.replace(/\/+$/, '') : withoutIndex
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(fullPath)))
    else if (entry.isFile()) files.push(fullPath)
  }
  return files
}

function routeForHtmlFile(file) {
  const rel = toPosix(path.relative(targetRoot, file))
  if (rel === 'index.html') return '/'
  if (rel.endsWith('.html/index.html')) return `/${rel.replace(/\/index\.html$/, '')}`
  if (rel.endsWith('/index.html')) return `/${rel.replace(/index\.html$/, '')}`
  return `/${rel}`
}

async function buildRoutesFromDist() {
  if (!fsSync.existsSync(targetRoot)) return []
  const htmlFiles = (await walk(targetRoot)).filter((file) => path.extname(file) === '.html')
  return htmlFiles.map(routeForHtmlFile)
}

async function buildRoutesFromLegacyFiles() {
  const manifest = JSON.parse(await fs.readFile(legacyManifestPath, 'utf8'))
  return (manifest.entries || [])
    .map((entry) => entry.file)
    .filter((file) => typeof file === 'string' && file.endsWith('.html'))
    .map((file) => normalizeRoute(file))
}

async function buildRoutesFromSitemaps() {
  if (!fsSync.existsSync(targetRoot)) return []
  const sitemapFiles = (await walk(targetRoot)).filter(
    (file) => path.basename(file).startsWith('sitemap') && path.extname(file) === '.xml',
  )
  const routes = []
  for (const file of sitemapFiles) {
    const xml = await fs.readFile(file, 'utf8')
    for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) {
      try {
        const url = new URL(match[1])
        if (url.pathname.endsWith('.xml')) continue
        routes.push(normalizeRoute(url.pathname))
      } catch {
        // Ignore malformed sitemap URLs; the SEO audit reports those separately.
      }
    }
  }
  return routes
}

async function collectRoutes() {
  const sources =
    routeSource === 'all' || routeSource === 'auto'
      ? ['build', 'legacy', 'sitemap']
      : routeSource.split(',').map((source) => source.trim())
  const routes = []
  if (sources.includes('build')) routes.push(...(await buildRoutesFromDist()))
  if (sources.includes('legacy')) routes.push(...(await buildRoutesFromLegacyFiles()))
  if (sources.includes('sitemap')) routes.push(...(await buildRoutesFromSitemaps()))
  return [...new Set(routes.map(normalizeRoute))].sort((a, b) => a.localeCompare(b))
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function candidateInsideTarget(candidate) {
  const resolved = path.resolve(targetRoot, candidate)
  if (resolved === targetRoot || resolved.startsWith(`${targetRoot}${path.sep}`)) return resolved
  return ''
}

function staticFileCandidates(pathname) {
  const decoded = safeDecode(pathname.split('?')[0].split('#')[0])
  if (decoded.includes('\0')) return []
  const clean = decoded.replace(/^\/+/, '')
  if (clean.split(/[\\/]+/).includes('..')) return []
  if (!clean) return [path.join(targetRoot, 'index.html'), path.join(targetRoot, 'index.html', 'index.html')]

  const candidates = []
  const add = (candidate) => {
    const resolved = candidateInsideTarget(candidate)
    if (resolved) candidates.push(resolved)
  }

  add(clean)
  if (path.extname(clean) === '.html') add(path.join(clean, 'index.html'))
  if (!path.extname(clean)) {
    add(path.join(clean, 'index.html'))
    add(`${clean}.html`)
    add(path.join(`${clean}.html`, 'index.html'))
  }
  if (clean.endsWith('/')) add(path.join(clean, 'index.html'))
  return candidates
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findStaticFile(pathname) {
  return staticFileCandidates(pathname).find((candidate) => fsSync.existsSync(candidate) && fsSync.statSync(candidate).isFile()) || ''
}

function isFirstPartyRequest(url, baseOrigin) {
  if (url.startsWith(baseOrigin) || url.startsWith('data:')) return true
  try {
    return allowedExternalOrigins.has(new URL(url).origin)
  } catch {
    return false
  }
}

function startStaticServer() {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', 'http://127.0.0.1')
    const file = findStaticFile(requestUrl.pathname)
    if (!file) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      response.end('Not found')
      return
    }

    try {
      const body = await fs.readFile(file)
      const contentType = contentTypes.get(path.extname(file).toLowerCase()) || 'application/octet-stream'
      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-length': String(body.length),
        'content-type': contentType,
      })
      response.end(body)
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
      response.end(error instanceof Error ? error.message : 'Server error')
    }
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => server.close(done)),
      })
    })
  })
}

function failuresFor(result) {
  const failures = []
  const indexablePage = !result.isNoindex && !result.isMetaRefresh

  if (result.error) failures.push('navigation-error')
  if (result.status !== 200) failures.push(`status-${result.status}`)
  if (indexablePage && !result.title) failures.push('missing-title')
  if (indexablePage && !result.canonical) failures.push('missing-canonical')
  if (indexablePage && result.h1Count !== 1) failures.push(`h1-count-${result.h1Count}`)
  if (!result.htmlLang) failures.push('missing-html-lang')
  if (!result.hasMain && indexablePage) failures.push('missing-main')
  if (result.bodyTextLength < 120 && indexablePage) failures.push('thin-rendered-body')
  if (result.consoleErrors.length > 0) failures.push(`console-errors-${result.consoleErrors.length}`)
  if (result.pageErrors.length > 0) failures.push(`page-errors-${result.pageErrors.length}`)
  if (result.failedRequests.length > 0) failures.push(`failed-requests-${result.failedRequests.length}`)
  if (result.brokenImages.length > 0) failures.push(`broken-images-${result.brokenImages.length}`)
  if (result.missingAltImages.length > 0) failures.push(`missing-image-alt-${result.missingAltImages.length}`)
  if (result.duplicateIds.length > 0) failures.push(`duplicate-ids-${result.duplicateIds.length}`)
  if (result.cls > budgets.clsFail) failures.push(`cls-${result.cls}`)
  if (result.longTaskTotalMs > budgets.longTaskTotalFailMs) failures.push(`long-task-total-${result.longTaskTotalMs}ms`)
  if (result.longTaskMaxMs > budgets.longTaskMaxFailMs) failures.push(`long-task-max-${result.longTaskMaxMs}ms`)
  if (result.domNodes > budgets.domNodesFail) failures.push(`dom-nodes-${result.domNodes}`)

  return failures
}

function warningsFor(result) {
  const warnings = []
  if (result.cls > budgets.clsWarn) warnings.push(`cls-${result.cls}`)
  if (result.longTaskTotalMs > budgets.longTaskTotalWarnMs) warnings.push(`long-task-total-${result.longTaskTotalMs}ms`)
  if (result.longTaskMaxMs > budgets.longTaskMaxWarnMs) warnings.push(`long-task-max-${result.longTaskMaxMs}ms`)
  if (result.domNodes > budgets.domNodesWarn) warnings.push(`dom-nodes-${result.domNodes}`)
  if (result.smallTouchTargets.length > 0) warnings.push(`small-touch-targets-${result.smallTouchTargets.length}`)
  if (result.oversizedImages.length > 0) warnings.push(`oversized-images-${result.oversizedImages.length}`)
  if (result.thirdPartyRequests.length > 0) warnings.push(`third-party-requests-${result.thirdPartyRequests.length}`)
  return warnings
}

async function collectDomMetrics(page) {
  return page.evaluate(() => {
    const textOf = (node) => node?.textContent?.replace(/\s+/g, ' ').trim() || ''
    const selector =
      'a[href],button,input,select,textarea,summary,[role="button"],[role="link"],[tabindex]:not([tabindex="-1"])'
    const visibleRect = (element) => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return null
      if (rect.width <= 0 || rect.height <= 0) return null
      if (rect.right <= 0 || rect.left >= document.documentElement.scrollWidth) return null
      return rect
    }

    const idCounts = new Map()
    document.querySelectorAll('[id]').forEach((element) => {
      idCounts.set(element.id, (idCounts.get(element.id) || 0) + 1)
    })

    const duplicateIds = [...idCounts.entries()]
      .filter(([, count]) => count > 1)
      .slice(0, 20)
      .map(([id, count]) => ({ id, count }))

    const smallTouchTargets = Array.from(document.querySelectorAll(selector))
      .map((element) => {
        const rect = visibleRect(element)
        if (!rect) return null
        if (rect.width >= 44 && rect.height >= 44) return null
        return {
          height: Math.round(rect.height),
          href: element.getAttribute('href') || '',
          label: textOf(element).slice(0, 80) || element.getAttribute('aria-label') || element.tagName.toLowerCase(),
          tag: element.tagName.toLowerCase(),
          width: Math.round(rect.width),
        }
      })
      .filter(Boolean)
      .slice(0, 30)

    const images = Array.from(document.images)
    const brokenImages = images
      .filter((image) => {
        const hasSource = Boolean(image.currentSrc || image.src || image.getAttribute('srcset') || image.dataset.src)
        return hasSource && image.complete && image.naturalWidth === 0
      })
      .map((image) => ({
        alt: image.alt || '',
        src: image.currentSrc || image.src || image.getAttribute('src') || '',
      }))
      .slice(0, 30)

    const missingAltImages = images
      .filter((image) => !image.hasAttribute('alt'))
      .map((image) => image.currentSrc || image.src || image.getAttribute('src') || '')
      .slice(0, 30)

    const resourceSizeByUrl = new Map(
      performance.getEntriesByType('resource').map((entry) => [
        entry.name,
        entry.encodedBodySize || entry.transferSize || entry.decodedBodySize || 0,
      ]),
    )
    const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1)

    const oversizedImages = images
      .map((image) => {
        const rect = image.getBoundingClientRect()
        if (!image.complete || image.naturalWidth <= 0 || rect.width <= 0 || rect.height <= 0) return null
        const currentSrc = image.currentSrc || image.src
        const encodedBytes = resourceSizeByUrl.get(currentSrc) || 0
        const targetWidth = rect.width * devicePixelRatio
        const targetHeight = rect.height * devicePixelRatio
        const widthRatio = image.naturalWidth / targetWidth
        const heightRatio = image.naturalHeight / targetHeight
        const pixelRatio = Math.max(widthRatio, heightRatio)
        if (
          encodedBytes < 90 * 1024 ||
          widthRatio < 2.6 ||
          heightRatio < 2.6 ||
          image.naturalWidth < targetWidth + 300 ||
          image.naturalHeight < targetHeight + 300
        ) {
          return null
        }
        return {
          alt: image.alt || '',
          displayHeight: Math.round(rect.height),
          displayWidth: Math.round(rect.width),
          naturalHeight: image.naturalHeight,
          naturalWidth: image.naturalWidth,
          ratio: Number(pixelRatio.toFixed(2)),
          encodedKb: Math.round(encodedBytes / 1024),
          src: currentSrc,
        }
      })
      .filter(Boolean)
      .slice(0, 30)

    const navigation = performance.getEntriesByType('navigation')[0]
    const paints = Object.fromEntries(performance.getEntriesByType('paint').map((entry) => [entry.name, Math.round(entry.startTime)]))
    const qa = window.__siteQuality || { cls: 0, longTasks: [] }
    const longTasks = qa.longTasks || []
    const resourceEntries = performance.getEntriesByType('resource')
    const resourceSummary = resourceEntries.reduce(
      (summary, entry) => {
        summary.count += 1
        summary.transferSize += entry.transferSize || 0
        if (entry.initiatorType === 'img') summary.imageTransferSize += entry.transferSize || 0
        if (entry.initiatorType === 'script') summary.scriptTransferSize += entry.transferSize || 0
        if (entry.initiatorType === 'css' || entry.initiatorType === 'link') summary.styleTransferSize += entry.transferSize || 0
        return summary
      },
      { count: 0, imageTransferSize: 0, scriptTransferSize: 0, styleTransferSize: 0, transferSize: 0 },
    )

    return {
      bodyTextLength: document.body?.innerText?.replace(/\s+/g, ' ').trim().length || 0,
      brokenImages,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      cls: Number((qa.cls || 0).toFixed(4)),
      domDepth: maxDepth(document.documentElement),
      domNodes: document.querySelectorAll('*').length,
      duplicateIds,
      finalUrl: window.location.href,
      firstContentfulPaintMs: paints['first-contentful-paint'] || 0,
      firstPaintMs: paints['first-paint'] || 0,
      h1: textOf(document.querySelector('h1')).slice(0, 160),
      h1Count: document.querySelectorAll('h1').length,
      hasMain: Boolean(document.querySelector('main')),
      htmlLang: document.documentElement.getAttribute('lang') || '',
      imageCount: images.length,
      isMetaRefresh: Array.from(document.querySelectorAll('meta')).some(
        (meta) => meta.getAttribute('http-equiv')?.toLowerCase() === 'refresh',
      ),
      isNoindex: document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase().includes('noindex') || false,
      loadEventEndMs: navigation ? Math.round(navigation.loadEventEnd) : 0,
      longTaskCount: longTasks.length,
      longTaskMaxMs: Math.round(Math.max(0, ...longTasks.map((task) => task.duration || 0))),
      longTaskTotalMs: Math.round(longTasks.reduce((sum, task) => sum + (task.duration || 0), 0)),
      missingAltImages,
      oversizedImages,
      resourceSummary: {
        count: resourceSummary.count,
        imageKb: Math.round(resourceSummary.imageTransferSize / 1024),
        scriptKb: Math.round(resourceSummary.scriptTransferSize / 1024),
        styleKb: Math.round(resourceSummary.styleTransferSize / 1024),
        transferKb: Math.round(resourceSummary.transferSize / 1024),
      },
      smallTouchTargets,
      title: document.title,
    }

    function maxDepth(node) {
      if (!node?.children?.length) return 1
      return 1 + Math.max(...Array.from(node.children).map(maxDepth))
    }
  })
}

async function settleAllImages(page) {
  if (skipScroll) return

  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    const step = Math.max(500, Math.floor(window.innerHeight * 0.85))

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo(0, y)
      await wait(30)
    }

    const images = Array.from(document.images)
    for (const image of images) {
      image.loading = 'eager'
      if (image.dataset.src) image.src = image.dataset.src
      if (image.dataset.srcset) image.srcset = image.dataset.srcset
    }

    await Promise.race([
      Promise.all(
        images.map(
          (image) =>
            image.complete ||
            new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            }),
        ),
      ),
      wait(6000),
    ])

    window.scrollTo(0, 0)
  })
}

function shouldRetryAuditResult(result, check) {
  const routeHasStaticFile = Boolean(findStaticFile(check.route))
  if (!routeHasStaticFile) return false
  if (result.error || result.status === 0 || result.status === 404) return true
  return result.failedRequests.some(
    (request) =>
      request.resourceType === 'document' &&
      (request.error.includes('HTTP 404') || request.error.includes('ERR_FAILED') || request.error.includes('ERR_ABORTED')),
  )
}

async function auditCheck(context, baseUrl, check) {
  let result
  for (let attempt = 1; attempt <= auditAttempts; attempt += 1) {
    result = await auditCheckOnce(context, baseUrl, check)
    result.attempts = attempt
    if (!shouldRetryAuditResult(result, check) || attempt === auditAttempts) return result
    await sleep(450 * attempt)
  }
  return result
}

async function auditCheckOnce(context, baseUrl, check) {
  const page = await context.newPage()
  const baseOrigin = new URL(baseUrl).origin
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []
  const thirdPartyRequests = new Set()

  page.on('console', (message) => {
    const text = message.text()
    if (message.type() === 'error' && !/^Failed to load resource:/i.test(text)) consoleErrors.push(text.slice(0, 300))
  })
  page.on('pageerror', (error) => pageErrors.push(error.message.slice(0, 300)))
  page.on('request', (request) => {
    const url = request.url()
    if (!isFirstPartyRequest(url, baseOrigin)) thirdPartyRequests.add(url)
  })
  page.on('requestfailed', (request) => {
    const failure = request.failure()
    const url = request.url()
    if (failure?.errorText === 'net::ERR_ABORTED') return
    failedRequests.push({
      error: failure?.errorText || 'request failed',
      resourceType: request.resourceType(),
      url,
    })
  })
  page.on('response', (response) => {
    const status = response.status()
    const url = response.url()
    if (status < 400 || !url.startsWith(baseOrigin)) return
    failedRequests.push({
      error: `HTTP ${status}`,
      resourceType: response.request().resourceType(),
      url,
    })
  })

  try {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const response = await page.goto(`${baseUrl}${check.route}`, { timeout: navigationTimeoutMs, waitUntil: 'load' })
    await page.waitForTimeout(settleDelayMs)
    const initialMetrics = await collectDomMetrics(page)
    await settleAllImages(page)
    const settledMetrics = await collectDomMetrics(page)
    const result = {
      ...initialMetrics,
      brokenImages: settledMetrics.brokenImages,
      checkId: `${check.viewport}:${check.route}`,
      consoleErrors,
      failedRequests: failedRequests.slice(0, 20),
      missingAltImages: settledMetrics.missingAltImages,
      settledOversizedImages: settledMetrics.oversizedImages,
      pageErrors,
      route: check.route,
      status: response?.status() || 0,
      thirdPartyRequests: [...thirdPartyRequests].slice(0, 20),
      viewport: check.viewport,
    }

    result.failures = failuresFor(result)
    result.warnings = warningsFor(result)
    return result
  } catch (error) {
    const result = {
      bodyTextLength: 0,
      brokenImages: [],
      canonical: '',
      checkId: `${check.viewport}:${check.route}`,
      cls: 0,
      consoleErrors,
      domDepth: 0,
      domNodes: 0,
      duplicateIds: [],
      error: error instanceof Error ? error.message : String(error),
      failedRequests: failedRequests.slice(0, 20),
      finalUrl: '',
      h1Count: 0,
      hasMain: false,
      htmlLang: '',
      isMetaRefresh: false,
      isNoindex: false,
      longTaskMaxMs: 0,
      longTaskTotalMs: 0,
      missingAltImages: [],
      oversizedImages: [],
      pageErrors,
      route: check.route,
      settledOversizedImages: [],
      smallTouchTargets: [],
      status: 0,
      thirdPartyRequests: [...thirdPartyRequests].slice(0, 20),
      title: '',
      viewport: check.viewport,
    }
    result.failures = failuresFor(result)
    result.warnings = warningsFor(result)
    return result
  } finally {
    await page.close().catch(() => undefined)
  }
}

async function runQueue(items, worker) {
  const results = []
  let cursor = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index])
    }
  })
  await Promise.all(workers)
  return results
}

if (!providedBaseUrl && !fsSync.existsSync(targetRoot)) {
  console.error(`Build target does not exist: ${targetRoot}`)
  console.error('Run `corepack pnpm web:build` first.')
  process.exit(1)
}

let routes = await collectRoutes()
if (routeFilter.size > 0) routes = routes.filter((route) => routeFilter.has(route))
const skippedDynamicRoutes =
  !providedBaseUrl && routeFilter.size === 0 ? routes.filter((route) => !findStaticFile(route)) : []
if (skippedDynamicRoutes.length > 0) routes = routes.filter((route) => findStaticFile(route))
if (limit > 0) routes = routes.slice(0, limit)

const viewportNames = selectedViewportNames.filter((name) => viewports[name])
if (viewportNames.length === 0) {
  console.error(`No valid viewport selected. Use one of: ${Object.keys(viewports).join(', ')}`)
  process.exit(1)
}

const checks = routes.flatMap((route) => viewportNames.map((viewport) => ({ route, viewport })))
const server = providedBaseUrl
  ? {
      baseUrl: providedBaseUrl,
      close: async () => undefined,
    }
  : await startStaticServer()
const browser = await chromium.launch()

try {
  const contexts = new Map()
  for (const viewportName of viewportNames) {
    const viewport = viewports[viewportName]
    const context = await browser.newContext({
      deviceScaleFactor: viewport.deviceScaleFactor || 1,
      hasTouch: viewport.hasTouch,
      isMobile: viewport.isMobile,
      viewport: { height: viewport.height, width: viewport.width },
    })
    await context.addInitScript(() => {
      window.__siteQuality = { cls: 0, longTasks: [] }
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__siteQuality.cls += entry.value
          }
        }).observe({ buffered: true, type: 'layout-shift' })
      } catch {
        // Browser does not support layout-shift observation in this environment.
      }
      try {
        new PerformanceObserver((list) => {
          window.__siteQuality.longTasks.push(
            ...list.getEntries().map((entry) => ({
              duration: entry.duration,
              startTime: entry.startTime,
            })),
          )
        }).observe({ buffered: true, type: 'longtask' })
      } catch {
        // Browser does not support longtask observation in this environment.
      }
    })
    contexts.set(viewportName, context)
  }

  const results = await runQueue(checks, (check) => auditCheck(contexts.get(check.viewport), server.baseUrl, check))
  for (const context of contexts.values()) await context.close()

  const failures = results.flatMap((result) =>
    result.failures.map((failure) => ({ checkId: result.checkId, failure, route: result.route, viewport: result.viewport })),
  )
  const warnings = results.flatMap((result) =>
    result.warnings.map((warning) => ({ checkId: result.checkId, route: result.route, viewport: result.viewport, warning })),
  )
  const summary = {
    baseUrl: server.baseUrl,
    checks: results.length,
    failures: failures.length,
    failuresByType: countBy(failures.map((item) => item.failure.replace(/-\d+(?:\.\d+)?(?:ms)?$/, '-n'))),
    outputPath,
    routes: routes.length,
    routeSource,
    skippedDynamicRoutes,
    target: toPosix(path.relative(repoRoot, targetRoot)),
    topFailures: failures.slice(0, 40),
    topWarnings: warnings.slice(0, 40),
    viewports: viewportNames,
    warnings: warnings.length,
    warningsByType: countBy(warnings.map((item) => item.warning.replace(/-\d+(?:\.\d+)?(?:ms)?$/, '-n'))),
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify({ summary, results }, null, 2)}\n`)
  console.log(JSON.stringify(summary, null, 2))

  if (strict && failures.length > 0) process.exit(1)
} finally {
  await browser.close().catch(() => undefined)
  await server.close()
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1
    return counts
  }, {})
}
