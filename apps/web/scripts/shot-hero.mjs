import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.SHOT_BASE || 'http://localhost:4321'
const path = process.argv[2] || '/sportwagen-fotografie.html'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

// Mobile: capture the hero at 3 focus phases (auto-cycle ~11s)
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const mp = await m.newPage()
await mp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await mp.waitForTimeout(1500)
for (const [label, wait] of [['focus1', 800], ['focus2', 3700], ['focus3', 3700]]) {
  await mp.waitForTimeout(wait)
  await mp.screenshot({ path: `${outDir}/swh_${label}.png`, fullPage: false })
}
await m.close()

// Desktop: confirm unchanged
const d = await browser.newContext({ viewport: { width: 1366, height: 860 } })
const dp = await d.newPage()
await dp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await dp.waitForTimeout(1800)
await dp.screenshot({ path: `${outDir}/swh_desktop.png`, fullPage: false })
await d.close()

await browser.close()
console.log('done')
