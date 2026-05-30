import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.SHOT_BASE || 'http://localhost:4321'
const path = process.argv[2] || '/sportwagen-fotografie.html'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

async function full(page) {
  await page.evaluate(async () => {
    await new Promise((r) => { let y=0; const s=()=>{y+=500;window.scrollTo(0,y);if(y<document.body.scrollHeight)setTimeout(s,90);else r()}; s() })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
}

// Mobile
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const mp = await m.newPage()
await mp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await mp.waitForTimeout(2500)
await mp.screenshot({ path: `${outDir}/sw_m_hero.png`, fullPage: false })
await full(mp)
const mh = await mp.evaluate(() => document.body.scrollHeight)
console.log('MOBILE height(px):', mh, ' ~screens:', (mh / 844).toFixed(1))
await mp.screenshot({ path: `${outDir}/sw_m_full.png`, fullPage: true })
// scroll to bottom to catch the sticky CTA docked
await mp.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await mp.waitForTimeout(900)
await mp.screenshot({ path: `${outDir}/sw_m_bottom.png`, fullPage: false })
await m.close()

// Desktop
const d = await browser.newContext({ viewport: { width: 1366, height: 860 } })
const dp = await d.newPage()
await dp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await dp.waitForTimeout(1500)
await full(dp)
await dp.screenshot({ path: `${outDir}/sw_d_full.png`, fullPage: true })
await d.close()

await browser.close()
console.log('done')
