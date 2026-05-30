import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto('http://localhost:4322/automobil-fotografie.html', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1000)
await page.evaluate(async () => { await new Promise((r)=>{let y=0;const s=()=>{y+=500;window.scrollTo(0,y);if(y<document.body.scrollHeight)setTimeout(s,80);else r()};s()}) })
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600)
for (const [sel,name] of [['.ki','ki'],['.rl','rl']]) {
  const el = await page.$(sel); if(!el){console.log('MISS',sel);continue}
  await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500)
  const b = await el.boundingBox(); console.log(name,'h=',Math.round(b.height))
  await el.screenshot({ path: `${outDir}/auto_${name}.png` })
}
await browser.close()
