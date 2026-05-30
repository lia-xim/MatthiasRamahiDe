import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.SHOT_BASE || 'http://localhost:4322'
const path = '/automobil-fotografie.html'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1200)
await page.evaluate(async () => { await new Promise((r)=>{let y=0;const s=()=>{y+=500;window.scrollTo(0,y);if(y<document.body.scrollHeight)setTimeout(s,80);else r()};s()}) })
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)

for (const [sel, name] of [['.st-pull', 'stpull'], ['.sw', 'sw'], ['.bg', 'bg']]) {
  const el = await page.$(sel)
  if (!el) { console.log('MISSING', sel); continue }
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const box = await el.boundingBox()
  console.log(name, 'height=', Math.round(box.height))
  await el.screenshot({ path: `${outDir}/auto_${name}.png` })
}
await browser.close()
console.log('done')
