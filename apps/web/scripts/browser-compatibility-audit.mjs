import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium, firefox, webkit } from 'playwright'

const origin = process.env.COMPAT_URL || 'http://localhost:4321'
const output = path.resolve(process.env.COMPAT_OUTPUT || '.site-quality/compatibility')
await fs.mkdir(output, { recursive: true })
const routes = new Set(['/'])
async function sitemap(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Sitemap ${url}: ${response.status}`)
  const xml = await response.text()
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const target = new URL(match[1])
    if (target.pathname.endsWith('.xml')) await sitemap(origin + target.pathname)
    else routes.add(target.pathname)
  }
}
await sitemap(origin + '/sitemap.xml')
const selected = process.env.COMPAT_ROUTES?.split(',') || [...routes]
const sizes = process.env.COMPAT_WIDTHS?.split(',').map(Number) || [390, 1920]
const results = []
const engines = { chromium, firefox, webkit, chrome: { launch: () => chromium.launch({ channel: 'chrome' }) }, edge: { launch: () => chromium.launch({ channel: 'msedge' }) } }
const selectedEngines = process.env.COMPAT_ENGINES?.split(',') || ['chromium', 'firefox', 'webkit']
console.log(`Auditing ${selected.length} routes at ${sizes.join(', ')} CSS px in ${selectedEngines.join(', ')}`)
async function auditViewport(engine, width) {
  const launcher = engines[engine]
  const browser = await launcher.launch()
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  let errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width, height: width < 800 ? 844 : 1080 })
  for (const route of selected) {
    errors = []
    try {
      const response = await page.goto(origin + route, { waitUntil: 'load', timeout: 45000 })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(100)
      const top = await page.evaluate(() => {
        const visible = el => el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[aria-hidden="true"], .sr-only')
        const header = [...document.querySelectorAll('.topbar > *')].filter(visible).map(el => {
          const r = el.getBoundingClientRect()
          return { name: el.className, left: r.left, right: r.right, size: getComputedStyle(el).fontSize }
        })
        const overlaps = header.filter((a, i) => header.slice(i + 1).some(b => a.left < b.right - 1 && a.right > b.left + 1))
        const overflowingText = [...document.querySelectorAll('main p, main h1, main h2, main h3, main label, footer a')].filter(visible).filter(el => {
          const r = el.getBoundingClientRect()
          // Horizontal galleries intentionally keep later cards offscreen;
          // their end reachability and text widths are checked separately.
          for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            if (['auto', 'scroll'].includes(getComputedStyle(parent).overflowX) && parent.scrollWidth > parent.clientWidth + 3) return false
          }
          return r.left < -2 || r.right > innerWidth + 2 || (el.scrollWidth > el.clientWidth + 3 && el.clientWidth > 0)
        }).slice(0, 12).map(el => ({ tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 75) }))
        return { title: document.title, h1: !!document.querySelector('h1'), stylesheet: !!document.querySelector('link[href*="site-readability"]'), header, overlaps, overflowingText, overflow: document.documentElement.scrollWidth > innerWidth + 2 }
      })
      // Lazy images and reveals can extend the page after the first scroll.
      for (let attempt = 0; attempt < 4; attempt++) {
        await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
        await page.waitForTimeout(150)
      }
      const bottom = await page.evaluate(() => ({ reachable: scrollY + innerHeight >= document.documentElement.scrollHeight - 4, footer: !!document.querySelector('footer') }))
      let menu = null
      if (await page.locator('.topbar__menu').isVisible()) {
        await page.locator('.topbar__menu').click()
        const opened = await page.locator('#mobile-menu').getAttribute('aria-hidden') === 'false'
        await page.keyboard.press('Escape')
        menu = { opened, closed: await page.locator('#mobile-menu').getAttribute('aria-hidden') === 'true' }
      }
      if (route === '/') {
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.screenshot({ path: path.join(output, `${engine}-${width}.png`) })
      }
      const galleries = await page.evaluate(async () => {
        const failures = []
        for (const el of document.querySelectorAll('main *')) {
          if (!['auto', 'scroll'].includes(getComputedStyle(el).overflowX) || el.scrollWidth <= el.clientWidth + 3) continue
          el.scrollTo({ left: el.scrollWidth, behavior: 'instant' })
          await new Promise(resolve => requestAnimationFrame(resolve))
          const last = [...el.children].filter(child => child.getBoundingClientRect().width > 0).at(-1)
          if (last && last.getBoundingClientRect().right > el.getBoundingClientRect().right + 4) failures.push(`${el.className}: end unreachable`)
          for (const text of el.querySelectorAll('p,h2,h3')) {
            if (text.clientWidth > 0 && text.scrollWidth > text.clientWidth + 3) failures.push(`${el.className}: text overflow`)
          }
          el.scrollTo({ left: 0, behavior: 'instant' })
        }
        return failures
      })
      results.push({ engine, version: browser.version(), width, route, status: response.status(), ...top, bottom, menu, galleries, errors: [...errors] })
    } catch (error) { results.push({ engine, width, route, failure: error.message }) }
    if (results.length % 30 === 0) {
      console.log(`Checked ${results.length} page/viewport/engine combinations`)
      await fs.writeFile(path.join(output, 'progress.json'), JSON.stringify(results))
    }
  }
  await browser.close()
}
const jobs = selectedEngines.flatMap(engine => sizes.map(width => [engine, width]))
await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, async () => {
  while (jobs.length) await auditViewport(...jobs.shift())
}))
const failures = results.filter(r => r.failure || r.status !== 200 || !r.h1 || !r.stylesheet || r.overflow || r.overlaps.length || r.overflowingText.length || r.errors.length || r.galleries.length || !r.bottom.reachable || (r.menu && (!r.menu.opened || !r.menu.closed)))
await fs.writeFile(path.join(output, 'report.json'), JSON.stringify({ origin, routes: selected.length, checks: results.length, failures, results }, null, 2))
console.log(JSON.stringify({ routes: selected.length, checks: results.length, failures: failures.length, report: path.join(output, 'report.json') }))
process.exitCode = failures.length ? 1 : 0
