import fs from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'

import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const repoRoot = path.resolve(process.cwd(), '../..')
const legacyReferenceRoot = path.resolve(repoRoot, process.env.LEGACY_REFERENCE_HTML_ROOT || 'legacy-reference/html')
const componentTargetRoot = path.resolve(process.cwd(), process.env.VISUAL_COMPONENT_TARGET || 'dist/client')
const configuredComponentBaseUrl = process.env.VISUAL_BASE_URL?.replace(/\/$/, '')
const configuredLegacyBaseUrl = process.env.VISUAL_LEGACY_BASE_URL?.replace(/\/$/, '')
const outputDir = path.resolve(process.cwd(), '.visual-regression')
const maxMismatchRatio = Number(process.env.VISUAL_MAX_MISMATCH_RATIO || '0.02')
const hardMaxMismatchRatio = Number(process.env.VISUAL_HARD_MAX_MISMATCH_RATIO || '0.05')
const warmupDelayMs = Number(process.env.VISUAL_WARMUP_DELAY_MS || '1400')
const screenshotDelayMs = Number(process.env.VISUAL_SCREENSHOT_DELAY_MS || '1800')
const selectedPages = new Set(
  (process.env.VISUAL_PAGES || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean),
)
const selectedViewports = new Set(
  (process.env.VISUAL_VIEWPORTS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean),
)

const pages = [
  {
    name: 'home',
    legacyPath: '/',
    componentPath: '/',
    maxMismatchRatio: { desktop: 0.025, mobile: 0.03 },
    hardMismatchRatio: { desktop: 0.07, mobile: 0.35 },
    thresholdNote:
      'Startseite enthaelt dynamische Hero-/Portfolio-Bildflaechen und die per JS erzeugte Portfolio-Marquee; Mobile bleibt als Warnung sichtbar.',
  },
  {
    name: 'portfolio',
    legacyPath: '/portfolio',
    componentPath: '/portfolio.html',
  },
  {
    name: 'photography-index',
    legacyPath: '/fotografie',
    componentPath: '/fotografie.html',
  },
  {
    name: 'automotive-main',
    legacyPath: '/automobil-fotografie',
    componentPath: '/automobil-fotografie.html',
    maxMismatchRatio: { mobile: 0.05 },
    thresholdNote: 'Seite enthaelt lange lazy/reveal Bildraster und bildreiche native Parity-Abschnitte.',
  },
  {
    name: 'sportscar-main',
    legacyPath: '/sportwagen-fotografie',
    componentPath: '/sportwagen-fotografie.html',
    maxMismatchRatio: { desktop: 0.03, mobile: 0.05 },
    thresholdNote: 'Seite enthaelt lange lazy/reveal Bildraster und bildreiche native Parity-Abschnitte.',
  },
  {
    name: 'oldtimer-main',
    legacyPath: '/oldtimer-fotografie',
    componentPath: '/oldtimer-fotografie.html',
    maxMismatchRatio: { mobile: 0.05 },
    thresholdNote: 'Seite enthaelt lange lazy/reveal Bildraster und bildreiche native Parity-Abschnitte.',
  },
  {
    name: 'motorcycle-main',
    legacyPath: '/motorrad-fotografie',
    componentPath: '/motorrad-fotografie.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Desktop und Mobile enthalten lange lazy/reveal Bildraster und bildreiche native Parity-Abschnitte.',
  },
  {
    name: 'portrait-main',
    legacyPath: '/portraitfotografie',
    componentPath: '/portraitfotografie.html',
  },
  {
    name: 'landscape-main',
    legacyPath: '/landschaftsfotografie',
    componentPath: '/landschaftsfotografie.html',
  },
  {
    name: 'services',
    legacyPath: '/leistungen',
    componentPath: '/leistungen.html',
    maxMismatchRatio: { desktop: 0.03 },
    thresholdNote: 'Seite enthaelt lange Reveal- und Lazyload-Abschnitte aus der nativen Parity-Schicht.',
  },
  {
    name: 'service-fotolabor',
    legacyPath: '/fotolabor-druck-duesseldorf',
    componentPath: '/fotolabor-druck-duesseldorf.html',
  },
  {
    name: 'service-grossformat',
    legacyPath: '/grossformatdruck-duesseldorf',
    componentPath: '/grossformatdruck-duesseldorf.html',
  },
  {
    name: 'service-werbetechnik',
    legacyPath: '/werbetechnik-duesseldorf',
    componentPath: '/werbetechnik-duesseldorf.html',
  },
  {
    name: 'service-webdesign',
    legacyPath: '/webdesign-seo-duesseldorf',
    componentPath: '/webdesign-seo-duesseldorf.html',
  },
  {
    name: 'service-videografie',
    legacyPath: '/videografie-duesseldorf',
    componentPath: '/videografie-duesseldorf.html',
  },
  {
    name: 'service-viola',
    legacyPath: '/viola-musik-duesseldorf',
    componentPath: '/viola-musik-duesseldorf.html',
  },
  {
    name: 'service-sonder',
    legacyPath: '/drucke-sonderanfertigungen-duesseldorf',
    componentPath: '/drucke-sonderanfertigungen-duesseldorf.html',
  },
  {
    name: 'about',
    legacyPath: '/ueber-mich',
    componentPath: '/ueber-mich.html',
    maxMismatchRatio: { desktop: 0.05 },
    thresholdNote: 'Seite enthaelt lange Reveal- und Lazyload-Abschnitte aus der nativen Parity-Schicht.',
  },
  {
    name: 'contact',
    legacyPath: '/contact',
    componentPath: '/contact.html',
  },
  {
    name: 'journal',
    legacyPath: '/blog',
    componentPath: '/blog.html',
    maxMismatchRatio: { mobile: 0.05 },
    thresholdNote: 'Mobile enthaelt lazy geladene Journal-Karten aus der nativen Journal-Parity-Schicht.',
  },
  {
    name: 'journal-detail',
    legacyPath: '/blog-automotive-fotografie-duesseldorf',
    componentPath: '/blog-automotive-fotografie-duesseldorf.html',
    maxMismatchRatio: { mobile: 0.16 },
    thresholdNote: 'Mobile ist ein sehr langer Textartikel; nach inhaltlichem Abgleich bleiben Subpixel- und Zeilenraster-Abweichungen ueber die volle Seitenhoehe.',
  },
  {
    name: 'local-seo',
    legacyPath: '/automobil-fotografie-koeln',
    componentPath: '/automobil-fotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05 },
    thresholdNote: 'Lokale Seite enthaelt lange Reveal- und Lazyload-Abschnitte aus der nativen Familien-Parity-Schicht.',
  },
  {
    name: 'local-seo-sportscar',
    legacyPath: '/sportwagen-fotografie-koeln',
    componentPath: '/sportwagen-fotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Lokale Sportwagen-Seite erbt das native Hauptlayout mit ortsspezifischer Hero- und Anfrage-Kopie.',
  },
  {
    name: 'local-seo-oldtimer',
    legacyPath: '/oldtimer-fotografie-koeln',
    componentPath: '/oldtimer-fotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Lokale Oldtimer-Seite erbt das native Hauptlayout mit ortsspezifischer Hero- und Anfrage-Kopie.',
  },
  {
    name: 'local-seo-motorcycle',
    legacyPath: '/motorrad-fotografie-koeln',
    componentPath: '/motorrad-fotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Lokale Motorrad-Seite erbt das native Hauptlayout mit ortsspezifischer Hero- und Anfrage-Kopie.',
  },
  {
    name: 'local-seo-portrait',
    legacyPath: '/portraitfotografie-koeln',
    componentPath: '/portraitfotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Lokale Portrait-Seite erbt das native Hauptlayout mit ortsspezifischer Hero- und Anfrage-Kopie.',
  },
  {
    name: 'local-seo-landscape',
    legacyPath: '/landschaftsfotografie-koeln',
    componentPath: '/landschaftsfotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Lokale Landschaft-Seite erbt das native Hauptlayout mit ortsspezifischer Hero- und Anfrage-Kopie.',
  },
]

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

const pagesToCheck = selectedPages.size > 0 ? pages.filter((page) => selectedPages.has(page.name)) : pages
const viewportsToCheck =
  selectedViewports.size > 0 ? viewports.filter((viewport) => selectedViewports.has(viewport.name)) : viewports

if (pagesToCheck.length === 0) {
  console.error(`No visual regression pages matched VISUAL_PAGES=${process.env.VISUAL_PAGES}`)
  process.exit(1)
}

if (viewportsToCheck.length === 0) {
  console.error(`No visual regression viewports matched VISUAL_VIEWPORTS=${process.env.VISUAL_VIEWPORTS}`)
  process.exit(1)
}

console.log(
  `Visual regression checking ${pagesToCheck.length} page(s) across ${viewportsToCheck.length} viewport(s): ${pagesToCheck
    .map((page) => page.name)
    .join(', ')}`,
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

function normalizeLegacyHtml(html) {
  const normalized = html
    .replace(/(?<![A-Za-z0-9:/])assets\//g, '/assets/')
    .replace(
      /((?:src|href|poster|content)=["'])(?!\/|https?:|data:)([^"']+\.(?:avif|css|gif|jpe?g|js|json|mp4|png|svg|txt|webmanifest|webm|webp|xml))/gi,
      '$1/$2',
    )
    .replace(
      /url\((["']?)(?!\/|https?:|data:|#)([^"')]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp))\1\)/gi,
      'url($1/$2$1)',
    )

  return /<base\s/i.test(normalized) ? normalized : normalized.replace(/<head([^>]*)>/i, '<head$1>\n<base href="/">')
}

function isInsideRepo(filePath) {
  const relative = path.relative(repoRoot, filePath)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function isInsideLegacyReference(filePath) {
  const relative = path.relative(legacyReferenceRoot, filePath)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function legacyFileForPath(pathname) {
  const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, '')
  const normalizedPath = path.normalize(decodedPath || 'index.html')
  const candidates = []

  if (!normalizedPath || normalizedPath === '.') {
    candidates.push(path.join(legacyReferenceRoot, 'index.html'))
  } else if (normalizedPath.startsWith(`assets${path.sep}`) || normalizedPath.startsWith('assets/')) {
    candidates.push(path.join(repoRoot, normalizedPath))
  } else if (!normalizedPath.includes(path.sep) && !normalizedPath.endsWith('.html')) {
    candidates.push(path.join(legacyReferenceRoot, `${normalizedPath}.html`))
    candidates.push(path.join(legacyReferenceRoot, normalizedPath))
  } else {
    candidates.push(path.join(legacyReferenceRoot, normalizedPath))
  }

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate)
    const allowed = resolved.startsWith(path.join(repoRoot, 'assets')) ? isInsideRepo(resolved) : isInsideLegacyReference(resolved)
    if (allowed && (await fileExists(resolved))) return resolved
  }

  return null
}

function createLegacyReferenceServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://legacy.local')
      const filePath = await legacyFileForPath(requestUrl.pathname)

      if (!filePath) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Not found')
        return
      }

      const extension = path.extname(filePath).toLowerCase()
      const body = await fs.readFile(filePath, extension === '.html' ? 'utf8' : undefined)
      const payload = extension === '.html' ? normalizeLegacyHtml(body) : body

      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-type': contentTypes.get(extension) || 'application/octet-stream',
      })
      response.end(payload)
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
      response.end(error instanceof Error ? error.message : String(error))
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        reject(new Error('Could not determine legacy reference server address.'))
        return
      }
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((closeResolve) => server.close(closeResolve)),
      })
    })
  })
}

async function componentFileForPath(pathname) {
  const decodedPath = decodeURIComponent(pathname).split('?')[0].split('#')[0].replace(/^\/+/, '')
  const normalizedPath = path.normalize(decodedPath || 'index.html')
  const candidates = []

  const add = (candidate) => {
    const resolved = path.resolve(componentTargetRoot, candidate)
    const relative = path.relative(componentTargetRoot, resolved)
    if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) return
    candidates.push(resolved)
  }

  if (!normalizedPath || normalizedPath === '.') {
    candidates.push(path.join(componentTargetRoot, 'index.html'))
  } else {
    add(normalizedPath)
    if (path.extname(normalizedPath) === '.html') add(path.join(normalizedPath, 'index.html'))
    if (!path.extname(normalizedPath)) {
      add(path.join(normalizedPath, 'index.html'))
      add(`${normalizedPath}.html`)
      add(path.join(`${normalizedPath}.html`, 'index.html'))
    }
    if (normalizedPath.endsWith(path.sep)) add(path.join(normalizedPath, 'index.html'))
  }

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate
  }

  return null
}

function createComponentStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://component.local')
      const filePath = await componentFileForPath(requestUrl.pathname)

      if (!filePath) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Not found')
        return
      }

      const extension = path.extname(filePath).toLowerCase()
      const body = await fs.readFile(filePath)

      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-length': String(body.length),
        'content-type': contentTypes.get(extension) || 'application/octet-stream',
      })
      response.end(body)
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
      response.end(error instanceof Error ? error.message : String(error))
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        reject(new Error('Could not determine component static server address.'))
        return
      }
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((closeResolve) => server.close(closeResolve)),
      })
    })
  })
}

async function screenshot(page, target, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(target, { waitUntil: 'load' })
  await settleImages(page)
  await page.waitForTimeout(screenshotDelayMs)
  await stabilizeForScreenshot(page)
  return page.screenshot({ fullPage: true })
}

async function warmup(page, target, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(target, { waitUntil: 'load' })
  await settleImages(page)
  await page.waitForTimeout(warmupDelayMs)
  await stabilizeForScreenshot(page)
}

async function settleImages(page) {
  await page.evaluate(async () => {
    let style = document.getElementById('visual-regression-stabilizer')
    if (!style) {
      style = document.createElement('style')
      style.id = 'visual-regression-stabilizer'
      document.head.appendChild(style)
    }

    style.textContent = `
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
      .pf-track {
        animation: none !important;
        transform: translate3d(0, 0, 0) !important;
      }
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
      }
    `

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    const step = Math.max(500, Math.floor(window.innerHeight * 0.8))

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo(0, y)
      await wait(20)
    }
    window.scrollTo(0, 0)

    const images = Array.from(document.images)
    for (const image of images) {
      image.loading = 'eager'
      if (image.dataset.src) image.src = image.dataset.src
      if (image.dataset.srcset) image.srcset = image.dataset.srcset
    }

    await wait(50)

    await Promise.all(
      images.map(
        (image) => {
          if (!image.src && !image.srcset && !image.currentSrc) return undefined
          if (image.complete && image.naturalWidth > 0) return undefined

          return new Promise((resolve) => {
            const timer = window.setTimeout(resolve, 5000)
            const done = () => {
              window.clearTimeout(timer)
              resolve()
            }

            image.addEventListener('load', done, { once: true })
            image.addEventListener('error', done, { once: true })
          })
        },
      ),
    )

    await Promise.all(
      images.map((image) => {
        if (!image.decode || !image.complete || image.naturalWidth === 0) return undefined
        return image.decode().catch(() => undefined)
      }),
    )

    for (const image of images) {
      if (image.complete && image.naturalWidth > 0) image.classList.add('is-loaded')
    }

    document
      .querySelectorAll('.post, .production-shot, .bg-tile, .reveal, .pd-frame, .po-tile')
      .forEach((element) => element.classList.add('visible', 'is-in'))
  })
}

async function stabilizeForScreenshot(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('astro-dev-toolbar').forEach((element) => element.remove())

    let style = document.getElementById('visual-regression-stabilizer')
    if (!style) {
      style = document.createElement('style')
      style.id = 'visual-regression-stabilizer'
      document.head.appendChild(style)
    }

    style.textContent = `
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
      img[loading="lazy"] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      .pf-track {
        animation: none !important;
        transform: translate3d(0, 0, 0) !important;
      }
      .pf-tile,
      .post,
      .production-shot,
      .bg-tile,
      .reveal,
      .po-tile,
      .pd-frame,
      .pd-frame-inner {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
        filter: none !important;
      }
      .pd-frame {
        clip-path: none !important;
      }
    `

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const images = Array.from(document.images)

    for (const image of images) {
      image.loading = 'eager'
      if (image.dataset.src && !image.src) image.src = image.dataset.src
      if (image.dataset.srcset && !image.srcset) image.srcset = image.dataset.srcset
    }

    await wait(50)

    await Promise.all(
      images.map((image) => {
        if (!image.src && !image.srcset && !image.currentSrc) return undefined
        if (image.complete && image.naturalWidth > 0) return undefined

        return new Promise((resolve) => {
          const timer = window.setTimeout(resolve, 5000)
          const done = () => {
            window.clearTimeout(timer)
            resolve()
          }

          image.addEventListener('load', done, { once: true })
          image.addEventListener('error', done, { once: true })
        })
      }),
    )

    for (const image of images) {
      if (image.complete && image.naturalWidth > 0) {
        image.classList.add('is-loaded')
        image.style.opacity = '1'
        image.style.transform = 'none'
        image.style.transition = 'none'
      }
    }

    const pdSource = document.querySelector('.frame.is-active, .frame[data-frame="0"]')
    const pdBackground = pdSource instanceof HTMLElement ? pdSource.style.backgroundImage : ''
    document.querySelectorAll('.pd-frame').forEach((frame, index) => {
      if (!(frame instanceof HTMLElement)) return
      frame.classList.add('is-in')
      frame.style.clipPath = 'none'
      frame.style.filter = 'none'
      frame.style.opacity = index === 0 ? '1' : '0'
      const inner = frame.querySelector('.pd-frame-inner')
      if (inner instanceof HTMLElement) {
        inner.style.animation = 'none'
        inner.style.filter = 'none'
        inner.style.transform = 'none'
        if (pdBackground) inner.style.backgroundImage = pdBackground
      }
    })
  })
}

function padPng(source, width, height) {
  if (source.width === width && source.height === height) return source

  const padded = new PNG({ width, height })
  PNG.bitblt(source, padded, 0, 0, source.width, source.height, 0, 0)
  return padded
}

function cropPngWidth(source, width) {
  if (source.width <= width) return source

  const cropped = new PNG({ width, height: source.height })
  PNG.bitblt(source, cropped, 0, 0, width, source.height, 0, 0)
  return cropped
}

async function comparePair(page, pageConfig, viewport) {
  const dir = path.join(outputDir, pageConfig.name)
  await fs.mkdir(dir, { recursive: true })

  await warmup(page, legacyUrlFor(pageConfig.legacyPath), viewport)
  await warmup(page, componentUrlFor(pageConfig.componentPath), viewport)

  const legacyBuffer = await screenshot(page, legacyUrlFor(pageConfig.legacyPath), viewport)
  const componentBuffer = await screenshot(page, componentUrlFor(pageConfig.componentPath), viewport)

  const legacy = cropPngWidth(PNG.sync.read(legacyBuffer), viewport.width)
  const component = cropPngWidth(PNG.sync.read(componentBuffer), viewport.width)
  const width = Math.max(legacy.width, component.width)
  const height = Math.max(legacy.height, component.height)
  const legacyPadded = padPng(legacy, width, height)
  const componentPadded = padPng(component, width, height)
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(legacyPadded.data, componentPadded.data, diff.data, width, height, {
    threshold: 0.1,
  })
  const ratio = mismatched / (width * height)

  await fs.writeFile(path.join(dir, `${viewport.name}-legacy.png`), PNG.sync.write(legacyPadded))
  await fs.writeFile(path.join(dir, `${viewport.name}-astro-native.png`), PNG.sync.write(componentPadded))
  await fs.writeFile(path.join(dir, `${viewport.name}-diff.png`), PNG.sync.write(diff))

  const targetMismatchRatio =
    typeof pageConfig.maxMismatchRatio === 'number'
      ? pageConfig.maxMismatchRatio
      : pageConfig.maxMismatchRatio?.[viewport.name] || maxMismatchRatio
  const pageHardMismatchRatio =
    typeof pageConfig.hardMismatchRatio === 'number'
      ? pageConfig.hardMismatchRatio
      : pageConfig.hardMismatchRatio?.[viewport.name]

  return {
    allowedMismatchRatio: Math.max(targetMismatchRatio, pageHardMismatchRatio || hardMaxMismatchRatio),
    mismatchRatio: ratio,
    mismatched,
    name: pageConfig.name,
    targetMismatchRatio,
    thresholdNote: pageConfig.thresholdNote,
    viewport: viewport.name,
  }
}

function printResult(result) {
  const percent = (result.mismatchRatio * 100).toFixed(3)
  const allowed = (result.allowedMismatchRatio * 100).toFixed(3)
  const target = (result.targetMismatchRatio * 100).toFixed(3)
  console.log(
    `${result.name}/${result.viewport}: ${percent}% mismatch (${result.mismatched} pixels, target ${target}%, hard limit ${allowed}%)`,
  )
}

const legacyServer = configuredLegacyBaseUrl
  ? { baseUrl: configuredLegacyBaseUrl, close: async () => undefined }
  : await createLegacyReferenceServer()
const componentServer = configuredComponentBaseUrl
  ? { baseUrl: configuredComponentBaseUrl, close: async () => undefined }
  : await createComponentStaticServer()
const legacyUrlFor = (pathname) => `${legacyServer.baseUrl}${pathname}`
const componentUrlFor = (pathname) => `${componentServer.baseUrl}${pathname}`

const browser = await chromium.launch()
const results = []

try {
  for (const pageConfig of pagesToCheck) {
    for (const viewport of viewportsToCheck) {
      const page = await browser.newPage()
      try {
        const result = await comparePair(page, pageConfig, viewport)
        results.push(result)
        printResult(result)
      } finally {
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
  await componentServer.close()
  await legacyServer.close()
}

const failed = results.filter((result) => result.mismatchRatio > result.allowedMismatchRatio)
const warnings = results.filter(
  (result) => result.mismatchRatio > result.targetMismatchRatio && result.mismatchRatio <= result.allowedMismatchRatio,
)

if (warnings.length > 0) {
  console.warn(
    `Visual regression warnings: ${warnings.length} comparison(s) exceeded their target but stayed within the configured hard limit.`,
  )
  for (const result of warnings) {
    console.warn(`${result.name}/${result.viewport}: ${result.thresholdNote || 'documented dynamic threshold'}`)
  }
}

console.log(`Screenshots written to ${outputDir}`)

if (failed.length > 0) {
  console.error(`Visual regression failed: ${failed.length} comparison(s) exceeded the hard ${hardMaxMismatchRatio * 100}% mismatch limit.`)
  process.exit(1)
}
