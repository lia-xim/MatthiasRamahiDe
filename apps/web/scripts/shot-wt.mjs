import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.SHOT_BASE || 'http://localhost:4321'
const path = process.argv[2] || '/werbetechnik-duesseldorf.html'
const tag = process.argv[3] || 'before'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/wtshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

async function full(page) {
  await page.evaluate(async () => {
    await new Promise((r) => { let y=0; const s=()=>{y+=500;window.scrollTo(0,y);if(y<document.body.scrollHeight)setTimeout(s,90);else r()}; s() })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(700)
}

async function measure(page, label) {
  const m = await page.evaluate(() => {
    const hero = document.querySelector('.hero, .sp-hero')
    return {
      vw: window.innerWidth,
      vh: window.innerHeight,
      heroH: hero ? Math.round(hero.getBoundingClientRect().height) : null,
      heroSel: hero ? hero.className : null,
      pageH: document.body.scrollHeight,
    }
  })
  console.log(`[${label}] vw=${m.vw} vh=${m.vh} heroH=${m.heroH} (hero=vh? ${m.heroH===m.vh}) pageH=${m.pageH} ~screens=${(m.pageH/m.vh).toFixed(2)} hero=${m.heroSel}`)
  return m
}

// Mobile 390
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const mp = await m.newPage()
await mp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await mp.waitForTimeout(2200)
await measure(mp, 'M390')
await mp.screenshot({ path: `${outDir}/${tag}_m390_hero.png`, fullPage: false })
await full(mp)
await mp.screenshot({ path: `${outDir}/${tag}_m390_full.png`, fullPage: true })
await m.close()

// Desktop 1440
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const dp = await d.newPage()
await dp.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
await dp.waitForTimeout(1500)
await measure(dp, 'D1440')
await dp.screenshot({ path: `${outDir}/${tag}_d1440_hero.png`, fullPage: false })
await full(dp)
await dp.screenshot({ path: `${outDir}/${tag}_d1440_full.png`, fullPage: true })
await d.close()

await browser.close()
console.log('done', tag)
