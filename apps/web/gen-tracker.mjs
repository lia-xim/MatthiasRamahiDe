import fs from 'node:fs'

const distDir = 'dist/client'
const families = {
  automobil: ['automobil-fotografie', 'auto-fotoshooting', 'auto-fotografieren-tipps', 'automotive-fotografie', 'autofotografie', 'autohaus-fotografie', 'autoverkauf-fotos', 'bilder-mit-auto', 'fahrzeugfotografie', 'fotoshooting-mit-auto'],
  sportwagen: ['motorsport-sportwagen-fotografie', 'motorsport-fotografie', 'sportwagen-fotografie', 'sportwagen-shooting', 'sportwagen-fotoshooting', 'performance-car-fotografie', 'exotic-car-fotografie', 'supersportwagen-fotografie'],
  oldtimer: ['oldtimer-fotografie', 'oldtimer-shooting', 'oldtimer-verkaufsfotos', 'classic-car-fotografie', 'youngtimer-fotografie', 'sammlerfahrzeug-fotografie'],
  motorrad: ['motorrad-fotografie', 'motorrad-shooting', 'motorrad-verkaufsfotos', 'bike-fotografie', 'custom-bike-fotografie', 'biker-portrait'],
  portrait: ['portraitfotografie-beleuchtung', 'portraitfotografie', 'portrait-fotoshooting', 'business-portrait', 'dating-fotoshooting', 'fotoshooting-gutschein', 'fotoshooting-preise', 'headshot-fotograf', 'paarshooting-familienshooting', 'personal-branding-fotografie', 'schwarz-weiss-portrait-fotografie', 'unternehmensportrait', 'pressefoto'],
  landschaft: ['landschaftsfotografie-print', 'landschaftsfotografie', 'landschaftsbilder', 'fine-art-prints', 'wandbilder-landschaftsfotografie', 'naturfotografie-prints'],
}
const cityTokens = ['bergisch-gladbach','bochum','deutschland','dormagen','dortmund','duesseldorf','duisburg','essen','gelsenkirchen','hilden','koeln','krefeld','leverkusen','mettmann','moenchengladbach','moers','neuss','nrw','oberhausen','remscheid','solingen','wuppertal','erkrath','ratingen']
const richCopy = new Set(['auto-fotografieren-tipps','auto-fotoshooting','bilder-mit-auto','fotoshooting-mit-auto','motorsport-fotografie','motorsport-sportwagen-fotografie','portrait-fotoshooting','portraitfotografie-beleuchtung','dating-fotoshooting','fotoshooting-gutschein','fotoshooting-preise','paarshooting-familienshooting','schwarz-weiss-portrait-fotografie','business-portrait','headshot-fotograf','personal-branding-fotografie','unternehmensportrait','pressefoto'])
const faqKeys = new Set(['automobil-fotografie','sportwagen-fotografie','oldtimer-fotografie','motorrad-fotografie','portraitfotografie','landschaftsfotografie','business-portrait','headshot-fotograf','personal-branding-fotografie','unternehmensportrait','pressefoto'])

const allPrefixes = Object.entries(families).flatMap(([fam, ps]) => ps.map((p) => ({ fam, p })))
const prefixesByLen = [...allPrefixes].sort((a, b) => b.p.length - a.p.length)

function classify(slug) {
  const m = prefixesByLen.find(({ p }) => slug === p || slug.startsWith(p + '-'))
  if (!m) return null
  const rest = slug === m.p ? '' : slug.slice(m.p.length + 1)
  const city = cityTokens.includes(rest) ? rest : (rest === '' ? '' : (cityTokens.includes(slug.split('-').slice(-1)[0]) ? slug.split('-').slice(-1)[0] : null))
  // scope detection: trailing city token
  let scope = 'überregional/keyword'
  let kind = 'keyword'
  if (rest === '') { scope = (m.p === famParent[m.fam]) ? 'Düsseldorf (Parent)' : 'überregional'; kind = (m.p === famParent[m.fam]) ? 'PARENT' : 'keyword' }
  else if (cityTokens.includes(rest)) { scope = rest; kind = 'city' }
  return { fam: m.fam, prefix: m.p, scope, kind }
}
const famParent = { automobil: 'automobil-fotografie', sportwagen: 'sportwagen-fotografie', oldtimer: 'oldtimer-fotografie', motorrad: 'motorrad-fotografie', portrait: 'portraitfotografie', landschaft: 'landschaftsfotografie' }

const dirs = fs.readdirSync(distDir).filter((d) => d.endsWith('.html') && fs.existsSync(`${distDir}/${d}/index.html`))
const rows = []
for (const d of dirs) {
  const slug = d.replace(/\.html$/, '')
  const c = classify(slug)
  if (!c) continue
  rows.push({ slug, ...c })
}
rows.sort((a, b) => (a.fam.localeCompare(b.fam)) || a.prefix.localeCompare(b.prefix) || a.slug.localeCompare(b.slug))

const famOrder = ['automobil','sportwagen','oldtimer','motorrad','portrait','landschaft']
let md = `# SEO Content Tracker\n\nStand: angelegt automatisch. Quelle: gebaute Seiten in \`apps/web/dist/client\`.\n\n**Spalten:** Code-Copy = \`rich\` (handgeschrieben) / \`generiert\` (simpleKeywordCopy). FAQ = Code-FAQ vorhanden. CMS = CMS-\`intro\`/\`localFaq\`/\`localProof\` befüllt. Status = TODO / WIP / DONE.\n\n> Ziel: jede Seite eigener, kreativer Text mit mehreren parallelen Keywords. Bei steigender Zahl: Schreibstil, Themen und Keyword-Sets variieren. Inhalte gehören ins CMS (Code = Fallback).\n\n`
md += `**Gesamt:** ${rows.length} Seiten\n\n`

for (const fam of famOrder) {
  const fr = rows.filter((r) => r.fam === fam)
  if (!fr.length) continue
  md += `## ${fam} (${fr.length})\n\n`
  md += `| Seite | Prefix | Scope | Typ | Code-Copy | FAQ | CMS | Status | Notiz |\n|---|---|---|---|---|---|---|---|---|\n`
  for (const r of fr) {
    const code = richCopy.has(r.prefix) ? 'rich' : 'generiert'
    const faq = faqKeys.has(r.prefix) ? 'ja' : '—'
    md += `| \`${r.slug}.html\` | ${r.prefix} | ${r.scope} | ${r.kind} | ${code} | ${faq} | ⬜ | TODO | |\n`
  }
  md += `\n`
}
fs.mkdirSync('../../docs', { recursive: true })
fs.writeFileSync('../../docs/seo-content-tracker.md', md)
console.log(`wrote docs/seo-content-tracker.md with ${rows.length} rows`)
