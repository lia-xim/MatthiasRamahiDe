import fs from 'node:fs'

const CMS = 'https://cms.matthiasramahi.de'
const norm = (s) => (s || '').replace(/^\/+/, '').toLowerCase()

// 1) Fetch all local-seo-pages docs
const res = await fetch(`${CMS}/api/local-seo-pages?limit=1000&depth=0&draft=false`, { headers: { Accept: 'application/json' } })
const data = await res.json()
const docs = data.docs || []
console.log(`CMS local-seo-pages docs: totalDocs=${data.totalDocs} fetched=${docs.length}`)

// 2) Build legacy-key -> docs map (resolution keys on seo.legacyUrl AND legacy.sourceFile)
const keyToDocs = new Map()
const addKey = (k, doc) => { if (!k) return; const kk = norm(k); if (!keyToDocs.has(kk)) keyToDocs.set(kk, []); keyToDocs.get(kk).push(doc) }
for (const d of docs) {
  addKey(d.seo?.legacyUrl, d)
  addKey(d.legacy?.sourceFile, d)
  // slug fallback (extensionless route) — also index slug+.html for cross-check
  if (d.slug) addKey(`${d.slug}.html`, d)
}

// 3) Detect collisions: a key resolving to >1 distinct doc id
const collisions = []
for (const [k, ds] of keyToDocs) {
  const ids = [...new Set(ds.map((d) => d.id))]
  if (ids.length > 1) collisions.push({ key: k, ids })
}

// 4) Route list from built dist
const dirs = fs.readdirSync('dist/client').filter((d) => d.endsWith('.html') && fs.existsSync(`dist/client/${d}/index.html`))
const famPrefix = /^(automobil-fotografie|auto-fotoshooting|auto-fotografieren-tipps|automotive-fotografie|autofotografie|autohaus-fotografie|autoverkauf-fotos|bilder-mit-auto|fahrzeugfotografie|fotoshooting-mit-auto|motorsport-sportwagen-fotografie|motorsport-fotografie|sportwagen-fotografie|sportwagen-shooting|sportwagen-fotoshooting|performance-car-fotografie|exotic-car-fotografie|supersportwagen-fotografie|oldtimer-fotografie|oldtimer-shooting|oldtimer-verkaufsfotos|classic-car-fotografie|youngtimer-fotografie|sammlerfahrzeug-fotografie|motorrad-fotografie|motorrad-shooting|motorrad-verkaufsfotos|bike-fotografie|custom-bike-fotografie|biker-portrait|portraitfotografie|portrait-fotoshooting|business-portrait|dating-fotoshooting|fotoshooting-gutschein|fotoshooting-preise|headshot-fotograf|paarshooting-familienshooting|personal-branding-fotografie|schwarz-weiss-portrait-fotografie|unternehmensportrait|pressefoto|landschaftsfotografie|landschaftsbilder|fine-art-prints|wandbilder-landschaftsfotografie|naturfotografie-prints)/
const routeFiles = dirs.filter((d) => famPrefix.test(d))

// 5) For each route, is there a connected doc?
const noDoc = []
const hasDoc = []
for (const f of routeFiles) {
  const key = norm(f)
  if (keyToDocs.has(key)) hasDoc.push(f)
  else noDoc.push(f)
}

// 6) Orphan docs (key has no matching route) — only count legacyUrl/sourceFile keys
const routeSet = new Set(routeFiles.map(norm))
const orphanDocs = docs.filter((d) => {
  const keys = [d.seo?.legacyUrl, d.legacy?.sourceFile, d.slug ? `${d.slug}.html` : null].map(norm).filter(Boolean)
  return !keys.some((k) => routeSet.has(k))
})

console.log(`\nRoute SEO pages (dist): ${routeFiles.length}`)
console.log(`  with CMS doc: ${hasDoc.length}`)
console.log(`  WITHOUT CMS doc (not connected): ${noDoc.length}`)
console.log(`Collisions (one key -> multiple docs): ${collisions.length}`)
console.log(`Orphan docs (no matching route): ${orphanDocs.length}`)

const report = {
  totalDocs: data.totalDocs,
  routePages: routeFiles.length,
  withDoc: hasDoc.length,
  withoutDoc: noDoc,
  collisions,
  orphanDocs: orphanDocs.map((d) => ({ id: d.id, slug: d.slug, legacyUrl: d.seo?.legacyUrl, sourceFile: d.legacy?.sourceFile })),
}
fs.writeFileSync('../../.tmp/cms-connection-audit.json', JSON.stringify(report, null, 2))
console.log('\n--- pages WITHOUT doc (first 40) ---')
console.log(noDoc.slice(0, 40).join('\n'))
console.log('\n--- collisions ---')
console.log(JSON.stringify(collisions.slice(0, 20), null, 2))
console.log('\nFull report: .tmp/cms-connection-audit.json')
