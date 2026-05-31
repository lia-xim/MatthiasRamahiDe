// Run from apps/web:  node ../../tools/gen-seo-tracker.mjs
import fs from 'node:fs'

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
const famParent = { automobil: 'automobil-fotografie', sportwagen: 'sportwagen-fotografie', oldtimer: 'oldtimer-fotografie', motorrad: 'motorrad-fotografie', portrait: 'portraitfotografie', landschaft: 'landschaftsfotografie' }

const audit = JSON.parse(fs.readFileSync('../../.tmp/cms-connection-audit.json', 'utf8'))
const noDoc = new Set(audit.withoutDoc.map((s) => s.toLowerCase()))

const prefixesByLen = Object.entries(families).flatMap(([fam, ps]) => ps.map((p) => ({ fam, p }))).sort((a, b) => b.p.length - a.p.length)
function classify(slug) {
  const m = prefixesByLen.find(({ p }) => slug === p || slug.startsWith(p + '-'))
  if (!m) return null
  const rest = slug === m.p ? '' : slug.slice(m.p.length + 1)
  let scope = 'überregional', kind = 'keyword'
  if (rest === '') { const isP = m.p === famParent[m.fam]; scope = isP ? 'Düsseldorf (Parent)' : 'überregional'; kind = isP ? 'PARENT' : 'keyword' }
  else if (cityTokens.includes(rest)) { scope = rest; kind = 'city' }
  return { fam: m.fam, prefix: m.p, scope, kind }
}

const dirs = fs.readdirSync('dist/client').filter((d) => d.endsWith('.html') && fs.existsSync(`dist/client/${d}/index.html`))
const rows = []
for (const d of dirs) {
  const slug = d.replace(/\.html$/, '')
  const c = classify(slug)
  if (c) rows.push({ slug, file: d.toLowerCase(), ...c })
}
rows.sort((a, b) => a.fam.localeCompare(b.fam) || a.prefix.localeCompare(b.prefix) || a.slug.localeCompare(b.slug))

const famOrder = ['automobil','sportwagen','oldtimer','motorrad','portrait','landschaft']
const createCount = rows.filter((r) => noDoc.has(r.file)).length
let md = `# SEO Content Tracker\n\nQuelle: gebaute Seiten (\`apps/web/dist/client\`) + CMS-Connection-Audit (\`tools/audit-cms-connections.mjs\`).\n\n`
md += `**Gesamt:** ${rows.length} Seiten · CMS-Doc vorhanden (UPDATE): ${rows.length - createCount} · ohne Doc (CREATE): ${createCount}\n\n`
md += `**Spalten:** Copy = \`rich\`/\`gen\` (Code-Fallback) · FAQ = Code-FAQ · CMS = \`UPDATE\` (Doc existiert) / \`CREATE\` (neu anlegen) · ✍️ = Content geschrieben (CMS) · Status.\n\n`
md += `> Ziel: jede Seite eigener, kreativer Text mit mehreren parallelen Keywords; Stil/Themen/Keywords variieren. Inhalte ins CMS (intro/localProof/localFaq), Code = Fallback.\n\n`

for (const fam of famOrder) {
  const fr = rows.filter((r) => r.fam === fam)
  if (!fr.length) continue
  md += `## ${fam} (${fr.length})\n\n`
  md += `| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Status |\n|---|---|---|---|---|---|---|---|---|\n`
  for (const r of fr) {
    const copy = richCopy.has(r.prefix) ? 'rich' : 'gen'
    const faq = faqKeys.has(r.prefix) ? 'ja' : '—'
    const cms = noDoc.has(r.file) ? 'CREATE' : 'UPDATE'
    md += `| \`${r.slug}.html\` | ${r.prefix} | ${r.scope} | ${r.kind} | ${copy} | ${faq} | ${cms} | ⬜ | TODO |\n`
  }
  md += `\n`
}
fs.writeFileSync('../../docs/seo-content-tracker.md', md)
console.log(`tracker: ${rows.length} rows, CREATE=${createCount}, UPDATE=${rows.length - createCount}`)
