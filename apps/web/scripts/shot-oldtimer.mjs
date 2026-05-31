import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const base = process.env.SHOT_BASE || 'http://localhost:4321'
const path = '/oldtimer-fotografie.html'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
for (const [w,h,tag,mobile] of [[390,844,'m',true],[1440,900,'d',false]]) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor: mobile?2:1, isMobile:mobile, hasTouch:mobile })
  const page = await ctx.newPage()
  await page.goto(`${base}${path}`, { waitUntil:'networkidle', timeout:60000 })
  await page.waitForTimeout(1200)
  const hero = await page.$('.hero-mp, .hero')
  const hh = hero ? Math.round((await hero.boundingBox()).height) : 0
  const total = await page.evaluate(()=>document.body.scrollHeight)
  console.log(`${tag} ${w}x${h}: heroH=${hh} vh=${h} total=${total}`)
  await page.screenshot({ path:`${outDir}/old_before_hero_${tag}.png` })
  await page.evaluate(async () => { await new Promise((r)=>{let y=0;const s=()=>{y+=600;window.scrollTo(0,y);if(y<document.body.scrollHeight)setTimeout(s,60);else r()};s()}) })
  await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(500)
  await page.screenshot({ path:`${outDir}/old_before_full_${tag}.png`, fullPage:true })
  await ctx.close()
}
await browser.close(); console.log('done')
