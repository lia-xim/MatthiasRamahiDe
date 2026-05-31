import fs from 'node:fs'
const outFile = process.argv[2]
const contentPath = 'apps/cms/content/local-seo-content.json'
const dec = (v) => {
  if (typeof v !== 'string') return v
  let s = v, prev
  do { prev = s; s = s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&#x2F;/gi, '/') } while (s !== prev)
  return s
}
const walk = (o) => Array.isArray(o) ? o.map(walk) : (o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)])) : dec(o))
const batch = JSON.parse(fs.readFileSync(outFile, 'utf8')).result.map(walk)
const existing = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
const byFile = new Map(existing.map((e) => [e.legacyFile, e]))
let added = 0, updated = 0
for (const e of batch) { if (byFile.has(e.legacyFile)) updated++; else added++; byFile.set(e.legacyFile, e) }
const merged = [...byFile.values()]
fs.writeFileSync(contentPath, JSON.stringify(merged, null, 2))
// integrity checks
let entities = 0, badFaq = 0, badCards = 0, longDesc = 0
for (const x of merged) {
  if (/&amp;|&lt;|&gt;/.test(JSON.stringify(x))) entities++
  if ((x.localFaq || []).length < 3) badFaq++
  if ((x.audienceCards || []).length < 4) badCards++
  if ((x.seo?.description || '').length > 170) longDesc++
}
console.log(`batch=${batch.length} added=${added} updated=${updated} total=${merged.length}`)
console.log(`integrity: entities-remaining=${entities} faq<3=${badFaq} cards<4=${badCards} desc>170=${longDesc}`)
