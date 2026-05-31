import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:4399'
const OUT = '.tmp/faqshots'
fs.mkdirSync(OUT, { recursive: true })

const targets = [
  { name: 'automobil', path: '/automobil-fotografie.html' },
  { name: 'business', path: '/business-portrait-duesseldorf.html' },
]
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await chromium.launch()
for (const t of targets) {
  for (const v of viewports) {
    const page = await browser.newPage()
    await page.setViewportSize({ width: v.width, height: v.height })
    await page.goto(`${BASE}${t.path}`, { waitUntil: 'load', timeout: 30000 })
    await page.waitForTimeout(700)
    const faq = page.locator('.fam-faq').first()
    const count = await faq.count()
    if (!count) { console.log(`NO .fam-faq on ${t.name}`); await page.close(); continue }
    await faq.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await faq.screenshot({ path: `${OUT}/${t.name}_${v.name}.png` })
    console.log(`OK ${t.name} ${v.name}`)
    await page.close()
  }
}
await browser.close()
console.log('done')
