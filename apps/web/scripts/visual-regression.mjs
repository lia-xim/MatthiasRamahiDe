import fs from 'node:fs/promises'
import path from 'node:path'

import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const baseUrl = (process.env.VISUAL_BASE_URL || 'http://localhost:4321').replace(/\/$/, '')
const outputDir = path.resolve(process.cwd(), '.visual-regression')
const maxMismatchRatio = Number(process.env.VISUAL_MAX_MISMATCH_RATIO || '0.02')
const warmupDelayMs = Number(process.env.VISUAL_WARMUP_DELAY_MS || '1400')
const screenshotDelayMs = Number(process.env.VISUAL_SCREENSHOT_DELAY_MS || '1000')

const pages = [
  {
    name: 'home',
    legacyPath: '/legacy-baseline/',
    componentPath: '/',
  },
  {
    name: 'portfolio',
    legacyPath: '/legacy-baseline/portfolio',
    componentPath: '/portfolio.html',
  },
  {
    name: 'services',
    legacyPath: '/legacy-baseline/leistungen',
    componentPath: '/leistungen.html',
  },
  {
    name: 'about',
    legacyPath: '/legacy-baseline/ueber-mich',
    componentPath: '/ueber-mich.html',
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
  },
  {
    name: 'journal-detail',
    legacyPath: '/legacy-baseline/blog-automotive-fotografie-duesseldorf',
    componentPath: '/blog-automotive-fotografie-duesseldorf.html',
  },
  {
    name: 'automotive-service',
    legacyPath: '/legacy-baseline/automobil-fotografie-duesseldorf',
    componentPath: '/automobil-fotografie-duesseldorf.html',
  },
  {
    name: 'portrait-service',
    legacyPath: '/legacy-baseline/portraitfotografie-duesseldorf',
    componentPath: '/portraitfotografie-duesseldorf.html',
  },
  {
    name: 'local-seo',
    legacyPath: '/legacy-baseline/automobil-fotografie-koeln',
    componentPath: '/automobil-fotografie-koeln.html',
  },
]

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

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

    await Promise.all(
      images.map(
        (image) =>
          image.complete ||
          new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true })
            image.addEventListener('error', resolve, { once: true })
          }),
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
      .querySelectorAll('.post, .production-shot, .bg-tile, .reveal, .pd-frame')
      .forEach((element) => element.classList.add('visible', 'is-in'))
  })
}

async function stabilizeForScreenshot(page) {
  await page.evaluate(() => {
    document.querySelectorAll('astro-dev-toolbar').forEach((element) => element.remove())

    let style = document.getElementById('visual-regression-stabilizer')
    if (!style) {
      style = document.createElement('style')
      style.id = 'visual-regression-stabilizer'
      document.head.appendChild(style)
    }

    style.textContent = `
      astro-dev-toolbar { display: none !important; }
      img[loading="lazy"] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
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
      .pd-frame {
        clip-path: none !important;
      }
    `

    for (const image of document.images) {
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

  return {
    mismatchRatio: ratio,
    mismatched,
    name: pageConfig.name,
    viewport: viewport.name,
  }
}

const browser = await chromium.launch()
const page = await browser.newPage()
const results = []

try {
  for (const pageConfig of pages) {
    for (const viewport of viewports) {
      results.push(await comparePair(page, pageConfig, viewport))
    }
  }
} finally {
  await browser.close()
}

const failed = results.filter((result) => result.mismatchRatio > maxMismatchRatio)

for (const result of results) {
  const percent = (result.mismatchRatio * 100).toFixed(3)
  console.log(`${result.name}/${result.viewport}: ${percent}% mismatch (${result.mismatched} pixels)`)
}

console.log(`Screenshots written to ${outputDir}`)

if (failed.length > 0) {
  console.error(`Visual regression failed: ${failed.length} comparison(s) exceeded ${maxMismatchRatio * 100}% mismatch.`)
  process.exit(1)
}
