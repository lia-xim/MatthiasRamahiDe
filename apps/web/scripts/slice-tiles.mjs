import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'

const dir = 'C:/Users/matth/.claude/image-cache/bf8bca61-f27f-4900-856f-ccfcbfbd8f5b/'
const out = 'C:/Users/matth/Documents/MatthiasRamahiDe/apps/web/public/assets/services/werbetechnik/'
mkdirSync(out, { recursive: true })

// 5x3 grid; [r,c] 0-based. Curated for variety + recognizability.
const picks = [
  { file: '3.png', r: 1, c: 1, slug: 'dior' },
  { file: '3.png', r: 1, c: 3, slug: 'byredo' },
  { file: '3.png', r: 0, c: 4, slug: 'chanel-fassade' },
  { file: '3.png', r: 1, c: 0, slug: 'montblanc-booth' },
  { file: '3.png', r: 0, c: 1, slug: 'diptyque' },
  { file: '3.png', r: 2, c: 0, slug: 'montblanc-cart' },
  { file: '4.png', r: 1, c: 2, slug: 'riani' },
  { file: '4.png', r: 0, c: 2, slug: 'flamingo' },
  { file: '4.png', r: 0, c: 3, slug: 'pedestals' },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 2200, height: 1000 } })
const byFile = {}
for (const p of picks) (byFile[p.file] ??= []).push(p)

for (const [file, ps] of Object.entries(byFile)) {
  const b64src = readFileSync(dir + file).toString('base64')
  await page.setContent(`<style>*{margin:0;padding:0}</style><img id="i" src="data:image/png;base64,${b64src}">`)
  await page.waitForSelector('#i')
  const data = await page.evaluate(async ({ ps, cols, rows }) => {
    const img = document.getElementById('i')
    await img.decode()
    const tw = img.naturalWidth / cols
    const th = img.naturalHeight / rows
    return ps.map((p) => {
      const cv = document.createElement('canvas')
      cv.width = Math.round(tw)
      cv.height = Math.round(th)
      const ctx = cv.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, p.c * tw, p.r * th, tw, th, 0, 0, cv.width, cv.height)
      return { slug: p.slug, url: cv.toDataURL('image/webp', 0.88), w: cv.width, h: cv.height }
    })
  }, { ps, cols: 5, rows: 3 })
  for (const d of data) {
    writeFileSync(out + d.slug + '.webp', Buffer.from(d.url.split(',')[1], 'base64'))
    console.log('wrote', d.slug, d.w + 'x' + d.h)
  }
}
await browser.close()
console.log('done')
