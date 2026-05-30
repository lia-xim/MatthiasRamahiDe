import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.SHOT_BASE || 'http://localhost:4321'
const path = process.argv[2] || '/fotografie.html'
const slug = path.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
const page = await ctx.newPage()
await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2000)

// Report any element wider than the viewport (horizontal-overflow culprits)
const overflowers = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const out = []
  document.querySelectorAll('main *').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width > vw + 1 || r.right > vw + 1) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 40),
        w: Math.round(r.width),
        left: Math.round(r.left),
        right: Math.round(r.right),
      })
    }
  })
  return { vw, out: out.slice(0, 25) }
})
console.log('viewport', overflowers.vw)
console.log('OVERFLOWERS', JSON.stringify(overflowers.out, null, 1))

// Viewport screenshots scrolled to each topic image (what the user actually sees)
const topics = await page.$$('.topic')
for (let i = 0; i < Math.min(topics.length, 2); i++) {
  const frame = await topics[i].$('.topic-frame')
  if (!frame) continue
  await frame.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${outDir}/${slug}__vp_topic${i + 1}.png`, fullPage: false })
}

await browser.close()
console.log('done')
