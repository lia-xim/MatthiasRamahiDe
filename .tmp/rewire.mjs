import fs from 'node:fs'
const log = []
const patch = (p, fn) => { if (!fs.existsSync(p)) { log.push('NOFILE ' + p); return } let s = fs.readFileSync(p, 'utf8'); const o = s; s = fn(s); if (s !== o) { fs.writeFileSync(p, s); log.push('PATCHED ' + p) } else log.push('nochange ' + p) }

// CSS to public
try { fs.copyFileSync('assets/native-webdesign-seo.css', 'apps/web/public/assets/native-webdesign-seo.css'); log.push('CSS copied to public') } catch (e) { log.push('CSS copy ERR ' + e.message) }

// 1) Registry: add bespoke kind + mapping (idempotent)
patch('apps/web/src/lib/nativeAdoptedRouteRegistry.ts', (s) => {
  if (!s.includes("| 'webdesign-seo'")) s = s.replace("  | 'sportscar'\n", "  | 'sportscar'\n  | 'webdesign-seo'\n")
  if (!s.includes("'webdesign-seo-duesseldorf.html': 'webdesign-seo'")) s = s.replace("  'werbetechnik-duesseldorf.html': 'werbetechnik',\n", "  'werbetechnik-duesseldorf.html': 'werbetechnik',\n  'webdesign-seo-duesseldorf.html': 'webdesign-seo',\n")
  return s
})

// 2) Dispatcher: import + branch
patch('apps/web/src/components/native/NativeAdoptedPage.astro', (s) => {
  if (!s.includes('import NativeWebdesignSeoPage')) s = s.replace("import NativeWerbetechnikPage from './NativeWerbetechnikPage.astro'", "import NativeWebdesignSeoPage from './NativeWebdesignSeoPage.astro'\nimport NativeWerbetechnikPage from './NativeWerbetechnikPage.astro'")
  if (!s.includes("nativeRouteKind === 'webdesign-seo'")) s = s.replace("  ) : nativeRouteKind === 'werbetechnik' ? (\n    <NativeWerbetechnikPage />\n", "  ) : nativeRouteKind === 'werbetechnik' ? (\n    <NativeWerbetechnikPage />\n  ) : nativeRouteKind === 'webdesign-seo' ? (\n    <NativeWebdesignSeoPage />\n")
  return s
})

// 3) Chrome: bespoke (native-home.js for shader + own css)
patch('apps/web/src/lib/adoptedPageChrome.ts', (s) => {
  const block = `  'webdesign-seo-duesseldorf.html': {
    current: 'leistungen',
    description:
      'Webdesign und SEO in Düsseldorf: moderne Websites, lokale Sichtbarkeit, Performance, Bildsprache, Landingpages und suchmaschinenfreundliche Struktur.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    preloadImages: ['/assets/optimized/assets-photos-automobil-sunset-1920.webp'],
    scripts: ['/assets/native-home.js', ...siteChromeScript],
    stylesheets: [...sharedStyles, '/assets/native-webdesign-seo.css'],
    title: 'Webdesign & SEO Düsseldorf - Matthias Ramahi',
  },`
  s = s.replace(/  'webdesign-seo-duesseldorf\.html': \{[\s\S]*?title: 'Webdesign & SEO Düsseldorf - Matthias Ramahi',\n  \},/, block)
  return s
})

for (const f of ['apps/web/src/components/native/NativeWebdesignSeoPage.astro', 'assets/native-webdesign-seo.css', 'apps/web/public/assets/native-webdesign-seo.css']) log.push((fs.existsSync(f) ? 'EXISTS ' : 'MISSING ') + f)
const reg = fs.readFileSync('apps/web/src/lib/nativeAdoptedRouteRegistry.ts', 'utf8')
log.push('registry maps webdesign-seo: ' + (reg.includes("'webdesign-seo-duesseldorf.html': 'webdesign-seo'") ? 'yes' : 'NO'))
const disp = fs.readFileSync('apps/web/src/components/native/NativeAdoptedPage.astro', 'utf8')
log.push('dispatcher branch: ' + (disp.includes("nativeRouteKind === 'webdesign-seo'") ? 'yes' : 'NO'))
const chr = fs.readFileSync('apps/web/src/lib/adoptedPageChrome.ts', 'utf8')
log.push('chrome native-home.js+own css: ' + (/'webdesign-seo-duesseldorf\.html'[\s\S]*?native-webdesign-seo\.css/.test(chr) ? 'yes' : 'NO'))
const out = log.join('\n') + '\n'
fs.writeFileSync('.tmp/REWIRE.txt', out)
process.stdout.write(out)
