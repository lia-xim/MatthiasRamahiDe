import { chromium } from 'playwright'
const slugs = ['dior','byredo','chanel-fassade','montblanc-booth','diptyque','montblanc-cart','riani','flamingo','pedestals']
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } })
const cells = slugs.map(s => `<figure style="margin:0"><img src="http://localhost:4321/assets/services/werbetechnik/${s}.webp" style="width:100%;display:block"><figcaption style="font:12px monospace;padding:4px">${s}</figcaption></figure>`).join('')
await page.setContent(`<style>body{margin:0;background:#111;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;color:#fff}</style>${cells}`)
await page.waitForTimeout(1500)
await page.screenshot({ path: 'C:/Users/matth/Documents/MatthiasRamahiDe/.tmp/wtshots/tiles_montage.png', fullPage: true })
await browser.close()
console.log('done')
