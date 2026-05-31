import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.SHOT_BASE || 'http://localhost:4321'
const path = process.env.CROP_PATH || '/werbetechnik-duesseldorf.html'
const tag = process.argv[2] || 'crop'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/wtshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

async function shootSection(page, sel, name, prefix) {
  const el = await page.$(sel)
  if (!el) { console.log('MISSING', sel); return }
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await el.screenshot({ path: `${outDir}/${prefix}_${name}.png` })
  const box = await el.boundingBox()
  console.log(`${prefix} ${name}: h=${Math.round(box.height)}`)
}

// Mobile
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const mp = await m.newPage()
await mp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await mp.waitForTimeout(1500)
await shootSection(mp, '.vm-occ-sec', 'areas', `${tag}_m`)
await shootSection(mp, '.vm-flow', 'flow', `${tag}_m`)
await m.close()

// Desktop
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const dp = await d.newPage()
await dp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await dp.waitForTimeout(1200)
await shootSection(dp, '.vm-occ-sec', 'areas', `${tag}_d`)
await shootSection(dp, '.vm-flow', 'flow', `${tag}_d`)
await d.close()

await browser.close()
console.log('done', tag)
