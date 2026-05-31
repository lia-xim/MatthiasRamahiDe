import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const outDir = 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/mobshots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
for (const [w,h,tag,mobile] of [[390,844,'m',true],[1440,900,'d',false]]) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor: mobile?2:1, isMobile:mobile, hasTouch:mobile })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4321/webdesign-seo-duesseldorf.html', { waitUntil:'networkidle', timeout:60000 })
  await page.waitForTimeout(1000)
  const total = await page.evaluate(()=>document.body.scrollHeight)
  // list section classes
  const secs = await page.evaluate(()=>Array.from(document.querySelectorAll('main > section, main > *[class]')).slice(0,40).map(s=>s.tagName.toLowerCase()+'.'+(s.className||'').toString().split(' ')[0]))
  console.log(`${tag} ${w}x${h}: total=${total}`)
  if(tag==='m') console.log('SECTIONS:', JSON.stringify(secs))
  await page.evaluate(async () => { await new Promise((r)=>{let y=0;const s=()=>{y+=600;window.scrollTo(0,y);if(y<document.body.scrollHeight)setTimeout(s,50);else r()};s()}) })
  await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(400)
  await page.screenshot({ path:`${outDir}/webseo_${tag}.png`, fullPage:true })
  await ctx.close()
}
await browser.close(); console.log('done')
