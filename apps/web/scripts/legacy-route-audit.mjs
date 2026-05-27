import fs from 'node:fs/promises'
import path from 'node:path'

import { chromium } from 'playwright'

const repoRoot = path.resolve(process.cwd(), '../..')
const baseUrl = (process.env.LEGACY_AUDIT_BASE_URL || 'http://localhost:4321').replace(/\/$/, '')
const limit = Number(process.env.LEGACY_AUDIT_LIMIT || '0')
const outputPath = path.resolve(process.cwd(), '.visual-regression', 'legacy-route-audit.json')

const files = (await fs.readdir(repoRoot))
  .filter((file) => file.endsWith('.html'))
  .sort((a, b) => a.localeCompare(b))
const selectedFiles = limit > 0 ? files.slice(0, limit) : files

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const results = []

function isNavigationRace(error) {
  const message = error instanceof Error ? error.message : String(error)
  return /Execution context was destroyed|navigation/i.test(message)
}

async function settleImages() {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.evaluate(async () => {
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        const step = Math.max(500, Math.floor(window.innerHeight * 0.8))

        for (let y = 0; y <= maxScroll; y += step) {
          window.scrollTo(0, y)
          await wait(25)
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
      })
      return
    } catch (error) {
      if (!isNavigationRace(error) || attempt === 2) throw error
      await page.waitForLoadState('load', { timeout: 5000 }).catch(() => undefined)
      await page.waitForTimeout(250)
    }
  }
}

async function evaluateWithNavigationRetry(fn) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await page.evaluate(fn)
    } catch (error) {
      if (!isNavigationRace(error) || attempt === 2) throw error
      await page.waitForLoadState('load', { timeout: 5000 }).catch(() => undefined)
      await page.waitForTimeout(250)
    }
  }
}

try {
  for (const file of selectedFiles) {
    const pathname = file === 'index.html' ? '/' : `/${file}`
    const url = `${baseUrl}${pathname}`
    const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 })
    await settleImages()

    const pageResult = await evaluateWithNavigationRetry(() => {
      const brokenImages = Array.from(document.images)
        .filter((image) => {
          const hasSource = Boolean(image.currentSrc || image.getAttribute('src') || image.getAttribute('srcset') || image.dataset.src)
          return hasSource && image.complete && image.naturalWidth === 0
        })
        .map((image) => image.currentSrc || image.src)

      return {
        title: document.title,
        finalUrl: window.location.href,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        imageCount: document.images.length,
        brokenImages,
        hasTopbar: Boolean(document.querySelector('.topbar')),
        hasFooter: Boolean(document.querySelector('.mr-footer')),
        isMetaRefresh: Array.from(document.querySelectorAll('meta')).some(
          (meta) => meta.getAttribute('http-equiv')?.toLowerCase() === 'refresh',
        ),
        isNoindex: document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase().includes('noindex') || false,
      }
    })

    results.push({
      file,
      pathname,
      status: response?.status() || 0,
      ...pageResult,
    })
  }
} finally {
  await browser.close()
}

await fs.mkdir(path.dirname(outputPath), { recursive: true })
await fs.writeFile(outputPath, `${JSON.stringify(results, null, 2)}\n`)

const failed = results.filter(
  (result) => {
    const requiresSharedChrome = !result.isNoindex && !result.isMetaRefresh
    return (
      result.status !== 200 ||
      !result.title ||
      result.brokenImages.length > 0 ||
      (requiresSharedChrome && (!result.hasTopbar || !result.hasFooter))
    )
  },
)

console.log(`Legacy route audit checked ${results.length}/${files.length} HTML routes.`)
console.log(`Report written to ${outputPath}`)

if (failed.length > 0) {
  for (const result of failed.slice(0, 30)) {
    console.error(
      `${result.file}: status=${result.status}, title=${Boolean(result.title)}, topbar=${result.hasTopbar}, footer=${result.hasFooter}, brokenImages=${result.brokenImages.length}`,
    )
  }
  if (failed.length > 30) console.error(`...and ${failed.length - 30} more failing route(s).`)
  process.exit(1)
}
