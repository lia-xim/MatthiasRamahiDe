import fs from 'node:fs/promises'
import path from 'node:path'

import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const baseUrl = (process.env.VISUAL_BASE_URL || 'http://localhost:4321').replace(/\/$/, '')
const outputDir = path.resolve(process.cwd(), '.visual-regression')
const maxMismatchRatio = Number(process.env.VISUAL_MAX_MISMATCH_RATIO || '0.02')
const hardMaxMismatchRatio = Number(process.env.VISUAL_HARD_MAX_MISMATCH_RATIO || '0.05')
const warmupDelayMs = Number(process.env.VISUAL_WARMUP_DELAY_MS || '1400')
const screenshotDelayMs = Number(process.env.VISUAL_SCREENSHOT_DELAY_MS || '1000')
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
    legacyPath: '/legacy-baseline/',
    componentPath: '/',
    maxMismatchRatio: { desktop: 0.025, mobile: 0.03 },
    thresholdNote: 'Startseite enthaelt die dynamisch per JS erzeugte Portfolio-Marquee.',
  },
  {
    name: 'portfolio',
    legacyPath: '/legacy-baseline/portfolio',
    componentPath: '/portfolio.html',
  },
  {
    name: 'photography-index',
    legacyPath: '/legacy-baseline/fotografie',
    componentPath: '/fotografie.html',
  },
  {
    name: 'automotive-main',
    legacyPath: '/legacy-baseline/automobil-fotografie',
    componentPath: '/automobil-fotografie.html',
    maxMismatchRatio: { mobile: 0.05 },
    thresholdNote: 'Mobile enthaelt lange lazy/reveal Bildraster mit Legacy-JS.',
  },
  {
    name: 'sportscar-main',
    legacyPath: '/legacy-baseline/sportwagen-fotografie',
    componentPath: '/sportwagen-fotografie.html',
    maxMismatchRatio: { desktop: 0.03, mobile: 0.05 },
    thresholdNote: 'Seite enthaelt lange lazy/reveal Bildraster mit Legacy-JS.',
  },
  {
    name: 'oldtimer-main',
    legacyPath: '/legacy-baseline/oldtimer-fotografie',
    componentPath: '/oldtimer-fotografie.html',
    maxMismatchRatio: { mobile: 0.05 },
    thresholdNote: 'Mobile enthaelt lange lazy/reveal Bildraster mit Legacy-JS.',
  },
  {
    name: 'motorcycle-main',
    legacyPath: '/legacy-baseline/motorrad-fotografie',
    componentPath: '/motorrad-fotografie.html',
    maxMismatchRatio: { desktop: 0.05, mobile: 0.05 },
    thresholdNote: 'Desktop und Mobile enthalten lange lazy/reveal Bildraster mit Legacy-JS.',
  },
  {
    name: 'portrait-main',
    legacyPath: '/legacy-baseline/portraitfotografie',
    componentPath: '/portraitfotografie.html',
  },
  {
    name: 'landscape-main',
    legacyPath: '/legacy-baseline/landschaftsfotografie',
    componentPath: '/landschaftsfotografie.html',
  },
  {
    name: 'services',
    legacyPath: '/legacy-baseline/leistungen',
    componentPath: '/leistungen.html',
    maxMismatchRatio: { desktop: 0.03 },
    thresholdNote: 'Desktop enthaelt Legacy-Reveal- und Lazyload-Abschnitte.',
  },
  {
    name: 'service-fotolabor',
    legacyPath: '/legacy-baseline/fotolabor-druck-duesseldorf',
    componentPath: '/fotolabor-druck-duesseldorf.html',
  },
  {
    name: 'service-grossformat',
    legacyPath: '/legacy-baseline/grossformatdruck-duesseldorf',
    componentPath: '/grossformatdruck-duesseldorf.html',
  },
  {
    name: 'service-werbetechnik',
    legacyPath: '/legacy-baseline/werbetechnik-duesseldorf',
    componentPath: '/werbetechnik-duesseldorf.html',
  },
  {
    name: 'service-webdesign',
    legacyPath: '/legacy-baseline/webdesign-seo-duesseldorf',
    componentPath: '/webdesign-seo-duesseldorf.html',
  },
  {
    name: 'service-videografie',
    legacyPath: '/legacy-baseline/videografie-duesseldorf',
    componentPath: '/videografie-duesseldorf.html',
  },
  {
    name: 'service-viola',
    legacyPath: '/legacy-baseline/viola-musik-duesseldorf',
    componentPath: '/viola-musik-duesseldorf.html',
  },
  {
    name: 'service-sonder',
    legacyPath: '/legacy-baseline/drucke-sonderanfertigungen-duesseldorf',
    componentPath: '/drucke-sonderanfertigungen-duesseldorf.html',
  },
  {
    name: 'about',
    legacyPath: '/legacy-baseline/ueber-mich',
    componentPath: '/ueber-mich.html',
    maxMismatchRatio: { desktop: 0.05 },
    thresholdNote: 'Desktop enthaelt Legacy-Reveal- und Lazyload-Abschnitte.',
  },
  {
    name: 'contact',
    legacyPath: '/legacy-baseline/contact',
    componentPath: '/contact.html',
  },
  {
    name: 'journal',
    legacyPath: '/legacy-baseline/blog',
    componentPath: '/blog.html',
    maxMismatchRatio: { mobile: 0.05 },
    thresholdNote: 'Mobile enthaelt lazy geladene Journal-Karten aus Legacy-JS/CSS.',
  },
  {
    name: 'journal-detail',
    legacyPath: '/legacy-baseline/blog-automotive-fotografie-duesseldorf',
    componentPath: '/blog-automotive-fotografie-duesseldorf.html',
  },
  {
    name: 'local-seo',
    legacyPath: '/legacy-baseline/automobil-fotografie-koeln',
    componentPath: '/automobil-fotografie-koeln.html',
    maxMismatchRatio: { desktop: 0.05 },
    thresholdNote: 'Lokale Legacy-Seite enthaelt lange Reveal- und Lazyload-Abschnitte.',
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

const urlFor = (pathname) => `${baseUrl}${pathname}`

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

async function comparePair(page, pageConfig, viewport) {
  const dir = path.join(outputDir, pageConfig.name)
  await fs.mkdir(dir, { recursive: true })

  await warmup(page, urlFor(pageConfig.legacyPath), viewport)
  await warmup(page, urlFor(pageConfig.componentPath), viewport)

  const legacyBuffer = await screenshot(page, urlFor(pageConfig.legacyPath), viewport)
  const componentBuffer = await screenshot(page, urlFor(pageConfig.componentPath), viewport)

  const legacy = PNG.sync.read(legacyBuffer)
  const component = PNG.sync.read(componentBuffer)
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
  await fs.writeFile(path.join(dir, `${viewport.name}-componentized.png`), PNG.sync.write(componentPadded))
  await fs.writeFile(path.join(dir, `${viewport.name}-diff.png`), PNG.sync.write(diff))

  const targetMismatchRatio =
    typeof pageConfig.maxMismatchRatio === 'number'
      ? pageConfig.maxMismatchRatio
      : pageConfig.maxMismatchRatio?.[viewport.name] || maxMismatchRatio

  return {
    allowedMismatchRatio: Math.max(targetMismatchRatio, hardMaxMismatchRatio),
    mismatchRatio: ratio,
    mismatched,
    name: pageConfig.name,
    targetMismatchRatio,
    thresholdNote: pageConfig.thresholdNote,
    viewport: viewport.name,
  }
}

const browser = await chromium.launch()
const page = await browser.newPage()
const results = []

try {
  for (const pageConfig of pagesToCheck) {
    for (const viewport of viewportsToCheck) {
      results.push(await comparePair(page, pageConfig, viewport))
    }
  }
} finally {
  await browser.close()
}

const failed = results.filter((result) => result.mismatchRatio > result.allowedMismatchRatio)
const warnings = results.filter(
  (result) => result.mismatchRatio > result.targetMismatchRatio && result.mismatchRatio <= result.allowedMismatchRatio,
)

for (const result of results) {
  const percent = (result.mismatchRatio * 100).toFixed(3)
  const allowed = (result.allowedMismatchRatio * 100).toFixed(3)
  const target = (result.targetMismatchRatio * 100).toFixed(3)
  console.log(`${result.name}/${result.viewport}: ${percent}% mismatch (${result.mismatched} pixels, target ${target}%, hard limit ${allowed}%)`)
}

if (warnings.length > 0) {
  console.warn(`Visual regression warnings: ${warnings.length} comparison(s) exceeded the ${maxMismatchRatio * 100}% target but stayed within the hard ${hardMaxMismatchRatio * 100}% limit.`)
  for (const result of warnings) {
    console.warn(`${result.name}/${result.viewport}: ${result.thresholdNote || 'documented dynamic threshold'}`)
  }
}

console.log(`Screenshots written to ${outputDir}`)

if (failed.length > 0) {
  console.error(`Visual regression failed: ${failed.length} comparison(s) exceeded the hard ${hardMaxMismatchRatio * 100}% mismatch limit.`)
  process.exit(1)
}
