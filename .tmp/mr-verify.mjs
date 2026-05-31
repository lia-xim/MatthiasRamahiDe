import { chromium } from 'playwright'
import fs from 'node:fs'

const URL = 'https://matthiasramahi.de/motorrad-fotografie.html'
const OUT = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
fs.mkdirSync(OUT, { recursive: true })

const viewports = [
  { name: '390', width: 390, height: 844, dpr: 3, mobile: true },
  { name: '430', width: 430, height: 932, dpr: 3, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 2, mobile: false },
]

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const results = []
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
  })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2500)
  const m = await page.evaluate(() => {
    const img = document.querySelector('.hero-mr__image')
    const acts = [...document.querySelectorAll('.hero-mr__actions a')].map((a) => Math.round(a.getBoundingClientRect().height))
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      heroCurrentSrc: img ? img.currentSrc.split('/').pop() : null,
      heroNatural: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
      heroRenderW: img ? Math.round(img.getBoundingClientRect().width) : null,
      ctaHeights: acts,
    }
  })
  m.overflow = m.scrollWidth - m.innerWidth
  m.viewport = vp.name
  results.push(m)
  await page.screenshot({ path: `${OUT}/mr-${vp.name}-hero.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 880) } })
  await ctx.close()
}
await browser.close()
fs.writeFileSync(`${OUT}/metrics.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results))
