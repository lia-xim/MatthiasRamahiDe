import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import path from 'node:path'

import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const repoRoot = path.resolve(process.cwd(), '../..')
const payloadUploadsDir = path.resolve(process.cwd(), 'public/uploads/payload')
const args = process.argv.slice(2).filter((arg) => arg !== '--')

function option(name, fallback = '') {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || process.env[`CMS_PARITY_${name.toUpperCase().replaceAll('-', '_')}`] || fallback
}

function flag(name) {
  return args.includes(`--${name}`) || process.env[`CMS_PARITY_${name.toUpperCase().replaceAll('-', '_')}`] === 'true'
}

const payloadPort = Number(option('payload-port', '4331'))
const tinaPort = Number(option('tina-port', '4332'))
const payloadBaseUrl = option('payload-base-url').replace(/\/$/, '')
const tinaBaseUrl = option('tina-base-url').replace(/\/$/, '')
const routeSource = option('route-source', 'sitemap')
const outputDir = path.resolve(process.cwd(), option('output-dir', `.cms-parity/${new Date().toISOString().replace(/[:.]/g, '-')}`))
const outputPath = path.join(outputDir, 'cms-parity-report.json')
const selectedViewports = option('viewports', 'mobile,desktop')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
const routeFilter = new Set(
  option('routes')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean)
    .map(normalizeRoute),
)
const limit = Math.max(0, Number(option('limit', '0')))
const concurrency = Math.max(1, Number(option('concurrency', '1')))
const timeoutMs = Math.max(5000, Number(option('timeout-ms', '45000')))
const settleMs = Math.max(0, Number(option('settle-ms', '450')))
const maxMismatchRatio = Number(option('max-mismatch-ratio', '0.025'))
const hardMismatchRatio = Number(option('hard-mismatch-ratio', '0.08'))
const screenshotMode = option('screenshots', 'failures')
const screenshotLimit = Math.max(0, Number(option('screenshot-limit', '40')))
const checkBatchSize = Math.max(0, Number(option('check-batch-size', '0')))
const strict = flag('strict')
const failOnWarnings = flag('fail-on-warnings')

const viewports = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function normalizeRoute(route) {
  const clean = String(route || '').trim()
  if (!clean) return '/'
  let pathname = clean
  try {
    if (/^https?:\/\//i.test(clean)) pathname = new URL(clean).pathname
  } catch {
    pathname = clean
  }
  const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  const withoutIndex = withSlash === '/index.html' ? '/' : withSlash.replace(/\/index\.html$/i, '/')
  return withoutIndex.length > 1 ? withoutIndex.replace(/\/+$/, '') : withoutIndex
}

function routeSlug(route, viewport) {
  const clean = route === '/' ? 'home' : route.replace(/^\/+/, '').replace(/[^a-z0-9._-]+/gi, '-').replace(/-+/g, '-')
  return `${viewport}-${clean || 'home'}`
}

function textHash(value) {
  return createHash('sha1').update(normalizeText(value)).digest('hex')
}

function normalizeComparableMediaUrl(value) {
  if (!value) return ''
  try {
    const parsed = new URL(value, 'https://matthiasramahi.de')
    const pathname = decodeURIComponent(parsed.pathname)
    const filename = pathname.split('/').filter(Boolean).pop() || pathname
    const mediaPath = pathname.toLowerCase()
    if (
      mediaPath.includes('/api/media/file/') ||
      mediaPath.includes('/uploads/payload/') ||
      mediaPath.includes('/uploads/generated/')
    ) {
      return `media:${filename}|m=${parsed.searchParams.get('m') || ''}`
    }

    parsed.searchParams.delete('v')
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return String(value)
  }
}

function contentTypeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.avif') return 'image/avif'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.svg') return 'image/svg+xml'
  if (ext === '.webp') return 'image/webp'
  return 'application/octet-stream'
}

function mirroredPayloadMediaPath(value) {
  try {
    const parsed = new URL(value)
    if (parsed.hostname !== 'cms.matthiasramahi.de' || !parsed.pathname.includes('/api/media/file/')) return ''
    const filename = decodeURIComponent(parsed.pathname.split('/api/media/file/').pop() || '')
    if (!filename || filename.includes('/') || filename.includes('\\')) return ''
    return path.join(payloadUploadsDir, filename)
  } catch {
    return ''
  }
}

async function registerPayloadMediaMirror(context) {
  await context.route(/^https:\/\/cms\.matthiasramahi\.de\/api\/media\/file\//i, async (route) => {
    const filePath = mirroredPayloadMediaPath(route.request().url())
    if (!filePath || !fsSync.existsSync(filePath)) {
      await route.continue()
      return
    }

    await route.fulfill({
      contentType: contentTypeForFile(filePath),
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=31536000, immutable',
      },
      path: filePath,
    })
  })
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function quoteArg(arg) {
  return /^[A-Za-z0-9_./:@=-]+$/.test(arg) ? arg : `"${String(arg).replace(/"/g, '\\"')}"`
}

function formatCommand(command, commandArgs) {
  return [command, ...commandArgs].map(quoteArg).join(' ')
}

function spawnCommand(command, commandArgs, options) {
  if (process.platform !== 'win32') return spawn(command, commandArgs, options)
  return spawn(formatCommand(command, commandArgs), { ...options, shell: true })
}

async function stopProcessTree(child) {
  if (!child || child.exitCode != null) return

  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
      killer.once('exit', resolve)
      killer.once('error', resolve)
      setTimeout(resolve, 5000)
    })
    return
  }

  child.kill('SIGTERM')
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 2500)
    child.once('exit', () => {
      clearTimeout(timer)
      resolve()
    })
  })
  if (child.exitCode == null) child.kill('SIGKILL')
}

function startAstroServer({ label, port, source }) {
  const command = 'corepack'
  const commandArgs = ['pnpm', 'exec', 'astro', 'dev', '--host', '127.0.0.1', '--port', String(port)]
  const logs = []
  const child = spawnCommand(command, commandArgs, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ASTRO_CONTENT_SOURCE: source,
      ASTRO_PUBLIC_SITE_URL: process.env.ASTRO_PUBLIC_SITE_URL || 'https://matthiasramahi.de',
      ASTRO_PUBLIC_MEDIA_BASE_URL: process.env.ASTRO_PUBLIC_MEDIA_BASE_URL || 'https://cms.matthiasramahi.de',
      NO_COLOR: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  const capture = (chunk) => {
    logs.push(String(chunk))
    while (logs.length > 120) logs.shift()
  }
  child.stdout.on('data', capture)
  child.stderr.on('data', capture)

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    child,
    label,
    logs,
    stop: async () => {
      await stopProcessTree(child)
    },
  }
}

async function waitForServer(server) {
  const startedAt = Date.now()
  let lastError = ''
  while (Date.now() - startedAt < 90_000) {
    if (server.child?.exitCode != null) {
      throw new Error(`${server.label} server exited early with ${server.child.exitCode}\n${server.logs.join('')}`)
    }
    try {
      const response = await fetch(`${server.baseUrl}/`, { redirect: 'manual' })
      if (response.status < 500) return
      lastError = `HTTP ${response.status}`
    } catch (error) {
      lastError = error?.message || String(error)
    }
    await sleep(650)
  }
  throw new Error(`Timed out waiting for ${server.label} at ${server.baseUrl}: ${lastError}\n${server.logs.join('')}`)
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchText(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  return response.text()
}

async function collectRoutes(baseUrl) {
  if (routeFilter.size > 0) return [...routeFilter]
  if (routeSource === 'routes') return []

  const seenSitemaps = new Set()
  const routes = new Set()

  async function visitSitemap(pathname) {
    const url = /^https?:\/\//i.test(pathname) ? pathname : `${baseUrl}${pathname}`
    if (seenSitemaps.has(url)) return
    seenSitemaps.add(url)

    const xml = await fetchText(url)
    for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) {
      const loc = match[1].trim()
      let parsed
      try {
        parsed = new URL(loc)
      } catch {
        continue
      }
      if (parsed.pathname.endsWith('.xml')) {
        await visitSitemap(`${parsed.pathname}${parsed.search}`)
      } else {
        routes.add(normalizeRoute(parsed.pathname))
      }
    }
  }

  await visitSitemap('/sitemap.xml')
  const routeList = [...routes].sort((a, b) => a.localeCompare(b))
  return limit > 0 ? routeList.slice(0, limit) : routeList
}

function padPng(source, width, height) {
  if (source.width === width && source.height === height) return source
  const padded = new PNG({ width, height })
  PNG.bitblt(source, padded, 0, 0, source.width, source.height, 0, 0)
  return padded
}

function comparePngs(aBuffer, bBuffer) {
  const a = PNG.sync.read(aBuffer)
  const b = PNG.sync.read(bBuffer)
  const width = Math.max(a.width, b.width)
  const height = Math.max(a.height, b.height)
  const aPadded = padPng(a, width, height)
  const bPadded = padPng(b, width, height)
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(aPadded.data, bPadded.data, diff.data, width, height, { threshold: 0.1 })
  return {
    diffBuffer: PNG.sync.write(diff),
    height,
    mismatchRatio: mismatched / (width * height),
    mismatched,
    payloadBuffer: PNG.sync.write(aPadded),
    tinaBuffer: PNG.sync.write(bPadded),
    width,
  }
}

async function stabilizePage(page) {
  await page.waitForFunction(() => document.readyState === 'complete', { timeout: timeoutMs }).catch(() => undefined)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
      }
      astro-dev-toolbar { display: none !important; }
      .pf-track { animation: none !important; transform: translate3d(0, 0, 0) !important; }
      .pf-tile,
      .po-tile,
      .post,
      .production-shot,
      .bg-tile,
      .reveal,
      .pd-frame,
      .pd-frame-inner {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
        filter: none !important;
      }
      #hero-shader { display: none !important; }
    `,
  })
  await page.evaluate(() => {
    const escapeHtml = (value) =>
      String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

    const resetDynamicHero = () => {
      const canvas = document.getElementById('hero-shader')
      const hero = canvas?.closest('.hero')
      if (canvas && hero) {
        try {
          const slides = JSON.parse(canvas.dataset.slides || '[]')
          const firstSlide = Array.isArray(slides) ? slides[0] : null
          const image = firstSlide?.image || (canvas.dataset.imgs || '').split(',').map((item) => item.trim()).filter(Boolean)[0]
          const titleLines = Array.isArray(firstSlide?.titleLines) ? firstSlide.titleLines.filter(Boolean) : []
          if (image) {
            hero.style.setProperty('--hero-bg', `url('${image.replace(/'/g, "\\'")}')`)
            hero.style.backgroundImage = `url("${image.replace(/"/g, '\\"')}")`
          }
          const title = hero.querySelector('#hero-title')
          if (title && titleLines.length) {
            title.dataset.textIdx = '0'
            title.innerHTML = titleLines
              .map((line) => `<span class="line"><span class="word">${escapeHtml(line)}</span></span>`)
              .join('')
            title.classList.add('is-in')
          }
          const lead = hero.querySelector('#hero-lead')
          if (lead && typeof firstSlide?.lead === 'string') lead.textContent = firstSlide.lead
          const primary = hero.querySelector('[data-hero-primary]')
          if (primary && firstSlide?.primaryLabel) {
            primary.textContent = firstSlide.primaryLabel
            if (firstSlide.primaryHref) primary.setAttribute('href', firstSlide.primaryHref)
            primary.hidden = false
          }
          const secondary = hero.querySelector('[data-hero-secondary]')
          if (secondary && firstSlide?.secondaryLabel) {
            secondary.textContent = firstSlide.secondaryLabel
            if (firstSlide.secondaryHref) secondary.setAttribute('href', firstSlide.secondaryHref)
            secondary.hidden = false
          }
        } catch {
          // Dynamic hero state is best-effort in the visual audit only.
        }
      }
    }
    window.__CMS_PARITY_RESET_HERO__ = resetDynamicHero
    resetDynamicHero()

    document.querySelectorAll('.pf-spread').forEach((element) => element.classList.add('is-visible'))
    document.querySelectorAll('[data-archive-item][hidden]').forEach((element) => element.removeAttribute('hidden'))
    document
      .querySelectorAll('[data-archive-item], .pf-archive__grid .pf-photo')
      .forEach((element) => element.classList.add('is-shown'))
  })
  await page
    .waitForFunction(
      () => {
        const tracks = Array.from(document.querySelectorAll('#pfTrack1, #pfTrack2'))
        if (tracks.length === 0) return true
        return tracks.reduce((count, track) => count + track.querySelectorAll('img').length, 0) > 0
      },
      { timeout: 7000 },
    )
    .catch(() => undefined)
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const visibleEnough = (image) => {
      const rect = image.getBoundingClientRect()
      const style = getComputedStyle(image)
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight * 1.5 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
      )
    }

    const waitForImageReadiness = async (images, maxWait = 6500) => {
      const targets = Array.from(images).filter(Boolean)
      await Promise.race([
        Promise.all(
          targets.map(async (image) => {
            if (!image.complete) {
              await new Promise((resolve) => {
                image.addEventListener('load', resolve, { once: true })
                image.addEventListener('error', resolve, { once: true })
              })
            }
            if (image.complete && image.naturalWidth > 0 && typeof image.decode === 'function') {
              await image.decode().catch(() => undefined)
            }
          }),
        ),
        wait(maxWait),
      ])
    }

    const hydrateImages = () => {
      const currentImages = Array.from(document.images)
      for (const image of currentImages) {
        image.loading = 'eager'
        if (image.dataset.src) image.src = image.dataset.src
        if (image.dataset.srcset) image.srcset = image.dataset.srcset
      }
      return currentImages
    }

    const scrollThroughPage = async () => {
      const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      const step = Math.max(500, Math.floor(window.innerHeight * 0.85))
      for (let y = 0; y <= maxScroll; y += step) {
        window.scrollTo(0, y)
        await wait(30)
      }
    }

    hydrateImages()
    await waitForImageReadiness(Array.from(document.querySelectorAll('.hero-tri img, .hero-stage img, .hero img')))
    await scrollThroughPage()
    const images = hydrateImages()

    await waitForImageReadiness(images)

    await scrollThroughPage()

    document
      .querySelectorAll('.post, .production-shot, .bg-tile, .reveal, .pd-frame, .po-tile')
      .forEach((element) => element.classList.add('visible', 'is-in'))
    window.scrollTo(0, 0)
    await waitForImageReadiness(Array.from(document.images).filter(visibleEnough), 3500)
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
  await page
    .evaluate(() => {
      if (typeof window.__CMS_PARITY_RESET_HERO__ === 'function') window.__CMS_PARITY_RESET_HERO__()
    })
    .catch(() => undefined)
  await page.waitForTimeout(settleMs)
}

async function capturePage(context, baseUrl, route) {
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []

  page.on('console', (message) => {
    const text = message.text()
    if (message.type() === 'error' && !/^Failed to load resource:/i.test(text)) consoleErrors.push(text.slice(0, 300))
  })
  page.on('pageerror', (error) => pageErrors.push(error.message.slice(0, 300)))
  page.on('requestfailed', (request) => {
    const failure = request.failure()
    if (failure?.errorText === 'net::ERR_ABORTED') return
    failedRequests.push({
      error: failure?.errorText || 'request failed',
      resourceType: request.resourceType(),
      url: request.url(),
    })
  })
  page.on('response', (response) => {
    const status = response.status()
    const url = response.url()
    if (status < 400 || !url.startsWith(baseUrl)) return
    failedRequests.push({
      error: `HTTP ${status}`,
      resourceType: response.request().resourceType(),
      url,
    })
  })

  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'load', timeout: timeoutMs })
    await stabilizePage(page)
    const html = await page.content()
    const metrics = await page.evaluate(() => {
      const textOf = (node) => node?.textContent?.replace(/\s+/g, ' ').trim() || ''
      const images = Array.from(document.images)
      return {
        bodyText: document.body?.innerText || '',
        brokenImages: images
          .filter((image) => {
            const hasSource = Boolean(image.currentSrc || image.src || image.getAttribute('srcset') || image.dataset.src)
            return hasSource && image.complete && image.naturalWidth === 0
          })
          .map((image) => ({ alt: image.alt || '', src: image.currentSrc || image.src || image.getAttribute('src') || '' }))
          .slice(0, 30),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        finalUrl: window.location.href,
        h1: Array.from(document.querySelectorAll('h1')).map(textOf),
        heroImages: Array.from(document.querySelectorAll('.hero-tri img, .hero-stage img, .hero img'))
          .map((image) => ({
            complete: image.complete,
            currentSrc: image.currentSrc || '',
            naturalHeight: image.naturalHeight,
            naturalWidth: image.naturalWidth,
            src: image.getAttribute('src') || '',
          }))
          .slice(0, 12),
        hasFrameworkOverlay: Boolean(
          document.querySelector('[data-nextjs-toast], vite-error-overlay, astro-dev-toolbar, astro-island[ssr][client]'),
        ),
        hasMain: Boolean(document.querySelector('main')),
        htmlLang: document.documentElement.getAttribute('lang') || '',
        imageCount: images.length,
        jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
        missingAltImages: images
          .filter((image) => !image.hasAttribute('alt'))
          .map((image) => image.currentSrc || image.src || image.getAttribute('src') || '')
          .slice(0, 30),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
        title: document.title,
      }
    })
    const screenshot = await page.screenshot({ fullPage: true })

    return {
      consoleErrors,
      failedRequests: failedRequests.slice(0, 30),
      html,
      metrics: {
        ...metrics,
        bodyTextHash: textHash(metrics.bodyText),
        bodyTextLength: normalizeText(metrics.bodyText).length,
        bodyTextSample: normalizeText(metrics.bodyText).slice(0, 240),
        payloadMediaHostRefs: (html.match(/cms\.matthiasramahi\.de\/api\/media\/file/gi) || []).length,
        uploadRefs: (html.match(/\/uploads\/(?:payload|generated)\//gi) || []).length,
      },
      pageErrors,
      screenshot,
      status: response?.status() || 0,
    }
  } catch (error) {
    return {
      consoleErrors,
      error: error?.message || String(error),
      failedRequests: failedRequests.slice(0, 30),
      html: '',
      metrics: {},
      pageErrors,
      screenshot: null,
      status: 0,
    }
  } finally {
    await page.close().catch(() => undefined)
  }
}

function compareMetrics(payload, tina) {
  const failures = []
  const warnings = []
  const fields = ['title', 'description', 'canonical', 'htmlLang']

  if (payload.status !== 200) failures.push(`payload-status-${payload.status}`)
  if (tina.status !== 200) failures.push(`tina-status-${tina.status}`)
  if (payload.error) failures.push('payload-navigation-error')
  if (tina.error) failures.push('tina-navigation-error')
  if (tina.metrics?.payloadMediaHostRefs > 0) failures.push(`tina-payload-media-host-refs-${tina.metrics.payloadMediaHostRefs}`)
  if ((tina.metrics?.brokenImages || []).length > 0) failures.push(`tina-broken-images-${tina.metrics.brokenImages.length}`)
  if ((tina.metrics?.missingAltImages || []).length > 0) failures.push(`tina-missing-alt-${tina.metrics.missingAltImages.length}`)
  if ((tina.failedRequests || []).length > 0) failures.push(`tina-failed-requests-${tina.failedRequests.length}`)
  if ((tina.pageErrors || []).length > 0) failures.push(`tina-page-errors-${tina.pageErrors.length}`)
  if ((tina.consoleErrors || []).length > 0) failures.push(`tina-console-errors-${tina.consoleErrors.length}`)
  if (!tina.metrics?.hasMain) failures.push('tina-missing-main')
  if (!tina.metrics?.title) failures.push('tina-missing-title')
  if (!tina.metrics?.canonical) failures.push('tina-missing-canonical')
  if (!Array.isArray(tina.metrics?.h1) || tina.metrics.h1.length !== 1) failures.push(`tina-h1-count-${tina.metrics?.h1?.length || 0}`)

  for (const field of fields) {
    if (normalizeText(payload.metrics?.[field]) !== normalizeText(tina.metrics?.[field])) failures.push(`seo-mismatch-${field}`)
  }
  if (normalizeComparableMediaUrl(payload.metrics?.ogImage) !== normalizeComparableMediaUrl(tina.metrics?.ogImage)) {
    failures.push('seo-mismatch-ogImage')
  }

  if (JSON.stringify(payload.metrics?.h1 || []) !== JSON.stringify(tina.metrics?.h1 || [])) failures.push('content-mismatch-h1')
  if (payload.metrics?.bodyTextHash && tina.metrics?.bodyTextHash && payload.metrics.bodyTextHash !== tina.metrics.bodyTextHash) {
    failures.push('content-mismatch-body-text')
  }
  if ((payload.metrics?.imageCount || 0) !== (tina.metrics?.imageCount || 0)) warnings.push('image-count-diff')

  return { failures, warnings }
}

async function maybeWriteScreenshots(result, comparison, storedCount) {
  const shouldStore =
    screenshotMode === 'all' ||
    (screenshotMode === 'warnings' && (result.failures.length > 0 || result.warnings.length > 0)) ||
    (screenshotMode === 'failures' && result.failures.length > 0)

  if (!shouldStore || storedCount.count >= screenshotLimit || !comparison?.payloadBuffer || !comparison?.tinaBuffer) return

  const dir = path.join(outputDir, 'screenshots', routeSlug(result.route, result.viewport))
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'payload.png'), comparison.payloadBuffer)
  await fs.writeFile(path.join(dir, 'tina.png'), comparison.tinaBuffer)
  await fs.writeFile(path.join(dir, 'diff.png'), comparison.diffBuffer)
  result.screenshots = {
    payload: toPosix(path.relative(repoRoot, path.join(dir, 'payload.png'))),
    tina: toPosix(path.relative(repoRoot, path.join(dir, 'tina.png'))),
    diff: toPosix(path.relative(repoRoot, path.join(dir, 'diff.png'))),
  }
  storedCount.count += 1
}

async function compareRouteAttempt(contexts, route, viewportName, bases, storedCount, writeScreenshots = true) {
  const context = contexts.get(viewportName)
  const [payloadCapture, tinaCapture] = await Promise.all([
    capturePage(context, bases.payload, route),
    capturePage(context, bases.tina, route),
  ])

  let visual = null
  if (payloadCapture.screenshot && tinaCapture.screenshot) {
    const comparison = comparePngs(payloadCapture.screenshot, tinaCapture.screenshot)
    visual = {
      height: comparison.height,
      mismatchRatio: Number(comparison.mismatchRatio.toFixed(5)),
      mismatchedPixels: comparison.mismatched,
      width: comparison.width,
    }
    const metricResult = compareMetrics(payloadCapture, tinaCapture)
    const failures = [...metricResult.failures]
    const warnings = [...metricResult.warnings]
    if (comparison.mismatchRatio > hardMismatchRatio) failures.push(`visual-mismatch-${visual.mismatchRatio}`)
    else if (comparison.mismatchRatio > maxMismatchRatio) warnings.push(`visual-mismatch-${visual.mismatchRatio}`)

    const result = {
      failures,
      payload: summarizeCapture(payloadCapture),
      route,
      tina: summarizeCapture(tinaCapture),
      viewport: viewportName,
      visual,
      warnings,
    }
    if (writeScreenshots) await maybeWriteScreenshots(result, comparison, storedCount)
    return result
  }

  const metricResult = compareMetrics(payloadCapture, tinaCapture)
  return {
    failures: [...metricResult.failures, 'visual-capture-missing'],
    payload: summarizeCapture(payloadCapture),
    route,
    tina: summarizeCapture(tinaCapture),
    viewport: viewportName,
    visual,
    warnings: metricResult.warnings,
  }
}

async function compareRoute(contexts, route, viewportName, bases, storedCount) {
  const first = await compareRouteAttempt(contexts, route, viewportName, bases, storedCount, false)
  if (first.failures.length === 0 && first.warnings.length === 0) return first

  const second = await compareRouteAttempt(contexts, route, viewportName, bases, storedCount, true)
  if (second.failures.length === 0 && second.warnings.length === 0) {
    second.transientFailures = first.failures
    second.transientWarnings = first.warnings
  }
  return second
}

function summarizeCapture(capture) {
  return {
    consoleErrors: capture.consoleErrors?.slice(0, 5) || [],
    error: capture.error || '',
    failedRequests: capture.failedRequests?.slice(0, 8) || [],
    metrics: capture.metrics || {},
    pageErrors: capture.pageErrors?.slice(0, 5) || [],
    status: capture.status,
  }
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

function chunkItems(items, size) {
  if (!size || size >= items.length) return [items]
  const chunks = []
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size))
  return chunks
}

let payloadServer = null
let tinaServer = null
let bases = {
  payload: payloadBaseUrl,
  tina: tinaBaseUrl,
}

async function startManagedServers() {
  if (!payloadBaseUrl) {
    payloadServer = startAstroServer({ label: 'payload', port: payloadPort, source: 'payload' })
    await waitForServer(payloadServer)
    bases.payload = payloadServer.baseUrl
  }

  if (!tinaBaseUrl) {
    tinaServer = startAstroServer({ label: 'tina', port: tinaPort, source: 'tina' })
    await waitForServer(tinaServer)
    bases.tina = tinaServer.baseUrl
  }
}

async function stopManagedServers() {
  await Promise.all([payloadServer?.stop(), tinaServer?.stop()].filter(Boolean))
  payloadServer = null
  tinaServer = null
}

async function restartManagedServers() {
  if (payloadBaseUrl && tinaBaseUrl) return
  await stopManagedServers()
  await sleep(850)
  await startManagedServers()
}

try {
  await startManagedServers()
  const routes = await collectRoutes(bases.tina)
  if (routes.length === 0) {
    console.error('No routes selected for CMS parity audit.')
    process.exit(1)
  }

  const viewportNames = selectedViewports.filter((name) => viewports[name])
  if (viewportNames.length === 0) {
    console.error(`No valid viewport selected. Use one of: ${Object.keys(viewports).join(', ')}`)
    process.exit(1)
  }

  console.log(
    `CMS parity audit comparing ${bases.payload} -> ${bases.tina}: ${routes.length} route(s), ${viewportNames.join(', ')}`,
  )

  await fs.mkdir(outputDir, { recursive: true })
  const browser = await chromium.launch()
  const contexts = new Map()
  const storedCount = { count: 0 }

  try {
    for (const viewportName of viewportNames) {
      const viewport = viewports[viewportName]
      const context = await browser.newContext({
        deviceScaleFactor: viewport.deviceScaleFactor,
        hasTouch: viewport.hasTouch,
        isMobile: viewport.isMobile,
        reducedMotion: 'reduce',
        viewport: { height: viewport.height, width: viewport.width },
      })
      await context.addInitScript(() => {
        window.__CMS_PARITY_AUDIT__ = true
        const nativeSetInterval = window.setInterval.bind(window)
        window.setInterval = (handler, timeout = 0, ...args) => {
          const delay = Number(timeout) || 0
          if (delay >= 900) return 0
          return nativeSetInterval(handler, timeout, ...args)
        }
      })
      await registerPayloadMediaMirror(context)
      contexts.set(viewportName, context)
    }

    const checks = routes.flatMap((route) => viewportNames.map((viewport) => ({ route, viewport })))
    const checkBatches = chunkItems(checks, checkBatchSize)
    const results = []
    let completed = 0

    for (let batchIndex = 0; batchIndex < checkBatches.length; batchIndex += 1) {
      const batch = checkBatches[batchIndex]
      if (batchIndex > 0 && checkBatchSize > 0) {
        console.log(`Restarting managed CMS dev servers before batch ${batchIndex + 1}/${checkBatches.length}`)
        await restartManagedServers()
      }

      const batchResults = await runQueue(batch, async (check, localIndex) => {
        const index = completed + localIndex
        const result = await compareRoute(contexts, check.route, check.viewport, bases, storedCount)
        const state = result.failures.length > 0 ? 'FAIL' : result.warnings.length > 0 ? 'WARN' : 'PASS'
        console.log(
          `[${index + 1}/${checks.length}] ${state} ${check.viewport} ${check.route} visual=${result.visual?.mismatchRatio ?? 'n/a'} failures=${result.failures.length}`,
        )
        return result
      })

      results.push(...batchResults)
      completed += batch.length
    }

    for (const context of contexts.values()) await context.close()

    const failures = results.flatMap((result) =>
      result.failures.map((failure) => ({ failure, route: result.route, viewport: result.viewport })),
    )
    const warnings = results.flatMap((result) =>
      result.warnings.map((warning) => ({ route: result.route, viewport: result.viewport, warning })),
    )
    const summary = {
      bases,
      checkBatchSize,
      checks: results.length,
      failures: failures.length,
      failuresByType: countBy(failures.map((item) => normalizeFailureType(item.failure))),
      hardMismatchRatio,
      maxMismatchRatio,
      outputPath: toPosix(path.relative(repoRoot, outputPath)),
      routes: routes.length,
      screenshotMode,
      screenshotsStored: storedCount.count,
      topFailures: failures.slice(0, 60),
      topWarnings: warnings.slice(0, 60),
      viewports: viewportNames,
      warnings: warnings.length,
      warningsByType: countBy(warnings.map((item) => normalizeFailureType(item.warning))),
    }
    await fs.writeFile(outputPath, `${JSON.stringify({ summary, results }, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))

    if (strict && (failures.length > 0 || (failOnWarnings && warnings.length > 0))) process.exitCode = 1
  } finally {
    await browser.close().catch(() => undefined)
  }
} finally {
  await stopManagedServers()
}

function normalizeFailureType(value) {
  return value.replace(/-\d+(?:\.\d+)?$/, '-n')
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1
    return counts
  }, {})
}
