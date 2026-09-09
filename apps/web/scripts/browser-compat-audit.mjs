import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium, firefox, webkit } from 'playwright'

const base = process.env.COMPAT_BASE_URL || 'http://127.0.0.1:4321'
const output = new URL('../../../.tmp/browser-compat/', import.meta.url)
await fs.mkdir(output, { recursive: true })
const results = []
for (const engine of [chromium, firefox, webkit]) {
  if (process.env.COMPAT_ENGINE && process.env.COMPAT_ENGINE !== engine.name()) continue
  const browser = await engine.launch()
  try {
    for (const [width, height, dpr] of [[1440, 1000, 1], [2560, 1440, 2], [5120, 1440, 1], [390, 844, 3]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(base, { waitUntil: 'networkidle' })
      assert.notEqual(await page.locator('.hero').evaluate(el => getComputedStyle(el).cursor), 'none')
      if (width > 1080) {
        const toggle = page.locator('.topbar__group-toggle')
        await toggle.hover()
        const box = await toggle.boundingBox()
        // Stop in the old hover gap long enough for the menu to close if broken.
        await page.mouse.move(box.x + box.width / 2, box.y + box.height + 7, { steps: 12 })
        await page.waitForTimeout(400)
        const last = page.locator('.topbar__submenu a').last()
        assert(await last.isVisible(), 'Dropdown closes while crossing its gap')
        const target = new URL(await last.getAttribute('href'), base).pathname
        const item = await last.boundingBox()
        await page.mouse.move(item.x + item.width / 2, item.y + item.height / 2, { steps: 25 })
        await page.mouse.click(item.x + item.width / 2, item.y + item.height / 2)
        await page.waitForURL(url => url.pathname === target)
        await page.goto(base)
        await toggle.focus()
        await page.keyboard.press(engine.name() === 'webkit' ? 'ArrowDown' : 'Tab')
        assert(await page.locator('.topbar__submenu').evaluate(el => el.contains(document.activeElement)))
        await page.keyboard.press('Escape')
        assert.equal(await page.locator('.topbar__submenu').evaluate(el => getComputedStyle(el).visibility), 'hidden')
        assert(await toggle.evaluate(el => document.activeElement === el))
        await page.keyboard.press('ArrowDown')
        assert(await page.locator('.topbar__submenu').evaluate(el => el.contains(document.activeElement)))
      } else {
        await page.locator('.topbar__menu').click()
        assert(await page.locator('#mobile-menu').evaluate(el => el.classList.contains('is-open')))
        await page.keyboard.press('Escape')
      }
      await page.goto(`${base}/portfolio.html`, { waitUntil: 'networkidle' })
      await page.locator('#archive').scrollIntoViewIfNeeded()
      const layout = await page.locator('#pfArchiveGrid').evaluate(async grid => {
        const rects = () => [...grid.querySelectorAll('.pf-photo')].map(el => {
          const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]
        })
        const before = rects()
        await Promise.all([...grid.querySelectorAll('img')].map(async img => {
          img.loading = 'eager'; try { await img.decode() } catch {}
        }))
        return {
          before, after: rects(),
          broken: [...grid.querySelectorAll('img')].filter(img => !img.naturalWidth).length,
          gap: parseFloat(getComputedStyle(grid.firstElementChild).gap),
          groups: [...grid.children].map(group => ({
            closing: group.classList.contains('pf-archive__group--closing'),
            items: [...group.children].map(el => {
              const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, height: r.height }
            }),
          })),
        }
      })
      assert.equal(layout.broken, 0)
      assert.deepEqual(layout.before, layout.after, 'Image decoding shifts the archive')
      assert(layout.gap >= 16)
      for (const group of layout.groups) {
        if (group.closing) {
          const [, , portrait, top, bottom] = group.items
          assert(Math.abs(portrait.y - top.y) < 1)
          assert(Math.abs(portrait.y + portrait.height - bottom.y - bottom.height) < 1)
          assert(Math.abs(top.x - bottom.x) < 1)
          assert(top.x > portrait.x)
          assert(Math.abs(bottom.y - top.y - top.height - layout.gap) < 1)
          continue
        }
        const columns = width > 1080 ? 4 : 2
        group.items.forEach((item, index) => {
          assert(Math.abs(item.y - group.items[Math.floor(index / columns) * columns].y) < 1)
          assert(Math.abs(item.height - group.items[0].height) < 1)
        })
      }
      await page.locator('#archive').evaluate(el => window.scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }))
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await page.screenshot({ path: new URL(`${engine.name()}-${width}.png`, output).pathname.replace(/^\/(\w:)/, '$1'), scale: 'css' })
      const first = page.locator('[data-archive-item]').first()
      await first.focus()
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => document.querySelector('#pfViewer').classList.contains('is-open'))
      assert.equal(await page.evaluate(() => document.activeElement.id), 'pfClose')
      await page.keyboard.press('Shift+Tab')
      assert.equal(await page.evaluate(() => document.activeElement.id), 'pfNext')
      await page.locator('#pfNext').click()
      await page.keyboard.press('Escape')
      assert(await first.evaluate(el => el === document.activeElement))
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
      await page.waitForTimeout(200)
      // Below-fold content may settle after the first scroll. Continue scrolling
      // to verify that the final bottom remains reachable.
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
      await page.waitForTimeout(200)
      const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, remaining: document.documentElement.scrollHeight - innerHeight - scrollY }))
      assert(dimensions.scroll <= dimensions.width, 'Horizontal overflow')
      assert(dimensions.remaining < 2, `Page bottom unreachable: ${JSON.stringify(dimensions)}`)
      assert.deepEqual(errors, [], 'Browser runtime errors')
      results.push({ engine: engine.name(), width, height, dpr, photos: layout.after.length, gap: layout.gap, status: 'PASS' })
      console.log(JSON.stringify(results.at(-1)))
      await context.close()
    }
  } finally { await browser.close() }
}
await fs.writeFile(new URL('results.json', output), JSON.stringify(results, null, 2))
