import fs from 'node:fs'
const log = []
const patch = (p, fn) => { if (!fs.existsSync(p)) { log.push('NOFILE ' + p); return } let s = fs.readFileSync(p, 'utf8'); const o = s; s = fn(s); if (s !== o) { fs.writeFileSync(p, s); log.push('PATCHED ' + p) } else log.push('nochange ' + p) }

// copy css to public
try { fs.copyFileSync('assets/native-webdesign-seo.css', 'apps/web/public/assets/native-webdesign-seo.css'); log.push('CSS copied to public') } catch (e) { log.push('CSS copy ERR ' + e.message) }

patch('apps/web/src/lib/nativeAdoptedRouteRegistry.ts', (s) => {
  if (!s.includes("| 'webdesign-seo'")) s = s.replace("  | 'sportscar'\n", "  | 'sportscar'\n  | 'webdesign-seo'\n")
  if (!s.includes("'webdesign-seo-duesseldorf.html': 'webdesign-seo'")) s = s.replace("  'werbetechnik-duesseldorf.html': 'werbetechnik',\n", "  'werbetechnik-duesseldorf.html': 'werbetechnik',\n  'webdesign-seo-duesseldorf.html': 'webdesign-seo',\n")
  return s
})
patch('apps/web/src/components/native/NativeAdoptedPage.astro', (s) => {
  if (!s.includes('import NativeWebdesignSeoPage')) s = s.replace("import NativeWerbetechnikPage from './NativeWerbetechnikPage.astro'", "import NativeWebdesignSeoPage from './NativeWebdesignSeoPage.astro'\nimport NativeWerbetechnikPage from './NativeWerbetechnikPage.astro'")
  if (!s.includes("nativeRouteKind === 'webdesign-seo'")) s = s.replace("  ) : nativeRouteKind === 'werbetechnik' ? (\n    <NativeWerbetechnikPage />\n", "  ) : nativeRouteKind === 'werbetechnik' ? (\n    <NativeWerbetechnikPage />\n  ) : nativeRouteKind === 'webdesign-seo' ? (\n    <NativeWebdesignSeoPage />\n")
  return s
})
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
  if (/  'webdesign-seo-duesseldorf\.html': \{[\s\S]*?title: 'Webdesign & SEO Düsseldorf - Matthias Ramahi',\n  \},/.test(s)) {
    s = s.replace(/  'webdesign-seo-duesseldorf\.html': \{[\s\S]*?title: 'Webdesign & SEO Düsseldorf - Matthias Ramahi',\n  \},/, block)
  }
  return s
})
for (const f of ['apps/web/src/components/native/NativeWebdesignSeoPage.astro', 'assets/native-webdesign-seo.css', 'apps/web/public/assets/native-webdesign-seo.css', 'assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-720.webp']) log.push((fs.existsSync(f) ? 'EXISTS ' : 'MISSING ') + f)
const out = log.join('\n') + '\n'
fs.writeFileSync('.tmp/FINAL.txt', out)
process.stdout.write(out)
