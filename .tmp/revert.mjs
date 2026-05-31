import fs from 'node:fs'
const log = []
const patch = (p, fn) => { if (!fs.existsSync(p)) { log.push('NOFILE ' + p); return } let s = fs.readFileSync(p, 'utf8'); const o = s; s = fn(s); if (s !== o) { fs.writeFileSync(p, s); log.push('PATCHED ' + p) } else log.push('nochange ' + p) }
const rm = (p) => { try { if (fs.existsSync(p)) { fs.rmSync(p); log.push('DELETED ' + p) } else log.push('absent ' + p) } catch (e) { log.push('rm ERR ' + p + ' ' + e.message) } }

// 1) Registry: drop the bespoke route kind so the file falls back to 'service-detail'
patch('apps/web/src/lib/nativeAdoptedRouteRegistry.ts', (s) => {
  s = s.replace("  | 'webdesign-seo'\n", '')
  s = s.replace("  'webdesign-seo-duesseldorf.html': 'webdesign-seo',\n", '')
  return s
})

// 2) Dispatcher: remove import + branch
patch('apps/web/src/components/native/NativeAdoptedPage.astro', (s) => {
  s = s.replace("import NativeWebdesignSeoPage from './NativeWebdesignSeoPage.astro'\n", '')
  s = s.replace("  ) : nativeRouteKind === 'webdesign-seo' ? (\n    <NativeWebdesignSeoPage />\n", '')
  return s
})

// 3) serviceDetailContent: replace screenshot-as-hero with a clean dark image + fix typo
patch('apps/web/src/lib/serviceDetailContent.ts', (s) => {
  s = s.replace(
    "      image: asset('assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-scaled.webp'),\n      alt: 'Website Screenshot — Webdesign Düsseldorf',\n      width: 1814,\n      height: 2560,",
    "      image: asset('assets/optimized/assets-photos-automobil-sunset-1920.webp'),\n      alt: 'Cineastische dunkle Aufnahme — Webdesign & SEO Düsseldorf',\n      width: 1920,\n      height: 1280,"
  )
  s = s.replace('für Marken, Marken und Mittelstand im Rheinland.', 'für Marken und Mittelstand im Rheinland.')
  return s
})

// 4) Remove bespoke files (no longer used)
rm('apps/web/src/components/native/NativeWebdesignSeoPage.astro')
rm('assets/native-webdesign-seo.css')
rm('apps/web/public/assets/native-webdesign-seo.css')

// status
for (const f of ['apps/web/src/components/native/NativeWebdesignSeoPage.astro', 'assets/native-webdesign-seo.css']) log.push((fs.existsSync(f) ? 'STILL ' : 'gone  ') + f)
log.push('registry has webdesign-seo: ' + (fs.readFileSync('apps/web/src/lib/nativeAdoptedRouteRegistry.ts', 'utf8').includes('webdesign-seo') ? 'YES(bad)' : 'no(good)'))
log.push('serviceDetail still has screencapture for webdesign: ' + (/screencapture-gr-knospe[\s\S]*?webdesign|webdesign[\s\S]{0,400}screencapture/.test(fs.readFileSync('apps/web/src/lib/serviceDetailContent.ts','utf8')) ? 'maybe-check' : 'no'))
const out = log.join('\n') + '\n'
fs.writeFileSync('.tmp/REVERT.txt', out)
process.stdout.write(out)
