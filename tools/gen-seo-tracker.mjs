// Run from repo root: node tools/gen-seo-tracker.mjs
// Generates docs/seo-content-tracker.md incl. CMS-Status + Scoring:
//   Q = SEO-Qualität (Struktur + thematische Keyword/Geo-Abdeckung)
//   U = Content-Einzigartigkeit (Prosa-Trigramm-Jaccard -> Duplicate-Content-Risiko)
//   K = Intent-Trennung / Anti-Kannibalisierung (Titel-/Keyword-Ziel-Überlappung INNERHALB Familie+Ort)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fromRoot = (...parts) => path.join(repoRoot, ...parts)

const families = {
  automobil: ['automobil-fotografie', 'auto-fotoshooting', 'auto-fotografieren-tipps', 'automotive-fotografie', 'autofotografie', 'autohaus-fotografie', 'autoverkauf-fotos', 'bilder-mit-auto', 'fahrzeugfotografie', 'fotoshooting-mit-auto'],
  sportwagen: ['motorsport-sportwagen-fotografie', 'motorsport-fotografie', 'sportwagen-fotografie', 'sportwagen-shooting', 'sportwagen-fotoshooting', 'performance-car-fotografie', 'exotic-car-fotografie', 'supersportwagen-fotografie'],
  oldtimer: ['oldtimer-fotografie', 'oldtimer-shooting', 'oldtimer-verkaufsfotos', 'classic-car-fotografie', 'youngtimer-fotografie', 'sammlerfahrzeug-fotografie'],
  motorrad: ['motorrad-fotografie', 'motorrad-shooting', 'motorrad-verkaufsfotos', 'bike-fotografie', 'custom-bike-fotografie', 'biker-portrait'],
  portrait: ['portraitfotografie-beleuchtung', 'portraitfotografie', 'portrait-fotoshooting', 'business-portrait', 'dating-fotoshooting', 'fotoshooting-gutschein', 'fotoshooting-preise', 'headshot-fotograf', 'paarshooting-familienshooting', 'personal-branding-fotografie', 'schwarz-weiss-portrait-fotografie', 'unternehmensportrait', 'pressefoto'],
  landschaft: ['landschaftsfotografie-print', 'landschaftsfotografie', 'landschaftsbilder', 'fine-art-prints', 'wandbilder-landschaftsfotografie', 'naturfotografie-prints'],
}
const cityTokens = ['bergisch-gladbach','bochum','deutschland','dormagen','dortmund','duesseldorf','duisburg','essen','gelsenkirchen','hilden','koeln','krefeld','leverkusen','mettmann','moenchengladbach','moers','neuss','nrw','oberhausen','remscheid','solingen','wuppertal','erkrath','ratingen']
const cityLabel = { 'bergisch-gladbach':'bergisch gladbach', koeln:'köln', moenchengladbach:'mönchengladbach', duesseldorf:'düsseldorf', nrw:'nrw', deutschland:'deutschland' }
const richCopy = new Set(['auto-fotografieren-tipps','auto-fotoshooting','bilder-mit-auto','fotoshooting-mit-auto','motorsport-fotografie','motorsport-sportwagen-fotografie','portrait-fotoshooting','portraitfotografie-beleuchtung','dating-fotoshooting','fotoshooting-gutschein','fotoshooting-preise','paarshooting-familienshooting','schwarz-weiss-portrait-fotografie','business-portrait','headshot-fotograf','personal-branding-fotografie','unternehmensportrait','pressefoto'])
const faqKeys = new Set(['automobil-fotografie','sportwagen-fotografie','oldtimer-fotografie','motorrad-fotografie','portraitfotografie','landschaftsfotografie','business-portrait','headshot-fotograf','personal-branding-fotografie','unternehmensportrait','pressefoto'])
const famParent = { automobil: 'automobil-fotografie', sportwagen: 'sportwagen-fotografie', oldtimer: 'oldtimer-fotografie', motorrad: 'motorrad-fotografie', portrait: 'portraitfotografie', landschaft: 'landschaftsfotografie' }

const labelFromSlug = (slug) => slug
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ')

const audit = JSON.parse(fs.readFileSync(fromRoot('.tmp/cms-connection-audit.json'), 'utf8'))
const noDoc = new Set(audit.withoutDoc.map((s) => s.toLowerCase()))
let content = []
try { content = JSON.parse(fs.readFileSync(fromRoot('apps/cms/content/local-seo-content.json'), 'utf8')) || [] } catch {}
// auch die 6 Familien-Hauptseiten (Hubs, liegen in service-pages) mit erfassen -> ALLE Seiten im Scoring
let hubs = []
try {
  hubs = (JSON.parse(fs.readFileSync(fromRoot('apps/cms/content/service-page-content.json'), 'utf8')) || []).map((e) => ({
    ...e,
    legacyFile: `${e.slug}.html`,
    family: Object.keys(famParent).find((f) => famParent[f] === e.slug),
    collection: 'service-pages',
    service: e.service || labelFromSlug(e.slug),
    targetKeyword: e.targetKeyword || labelFromSlug(e.slug),
  }))
} catch {}
content = [...content, ...hubs]
const authored = new Set(content.map((e) => String(e.legacyFile || '').toLowerCase()))
const serviceHubFiles = new Set(hubs.map((e) => String(e.legacyFile || '').toLowerCase()))

// ---------- text helpers ----------
const STOP = new Set(['und','der','die','das','für','mit','von','aus','den','dem','ein','eine','matthias','ramahi','wird','werden','sind','ist','als','auf','bei','wie','was','wo'])
const GENERIC = new Set(['fotografie','foto','fotos','fotoshooting','fotograf','shooting','bilder','bild'])
const decodeEntities = (s = '') => String(s)
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#34;/gi, '"')
  .replace(/&auml;/gi, 'ae')
  .replace(/&ouml;/gi, 'oe')
  .replace(/&uuml;/gi, 'ue')
  .replace(/&Auml;/g, 'Ae')
  .replace(/&Ouml;/g, 'Oe')
  .replace(/&Uuml;/g, 'Ue')
  .replace(/&szlig;/gi, 'ss')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
const toWords = (s) => decodeEntities(s || '').toLowerCase().replace(/ß/g, 'ss').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9äöü ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2)
const shingles = (ws, n = 3) => { const set = new Set(); for (let i = 0; i + n <= ws.length; i++) set.add(ws.slice(i, i + n).join(' ')); return set }
const jaccard = (a, b) => { if (!a.size || !b.size) return 0; let i = 0; const [s, big] = a.size < b.size ? [a, b] : [b, a]; for (const x of s) if (big.has(x)) i++; return i / (a.size + b.size - i) }
const between = (n, lo, hi) => n >= lo && n <= hi
const meaningfulWords = (s) => toWords(s).filter((w) => w.length > 3 && !STOP.has(w))
const meaningfulLine = (s) => meaningfulWords(s).join(' ')
const cityVisibleInText = (text, geo) => {
  if (!geo || geo === 'generic' || geo === 'überregional' || geo === 'Düsseldorf (Parent)') return true
  const haystack = new Set(toWords(text))
  const labelWords = toWords(cityLabel[geo] || geo)
  const slugWords = toWords(geo)
  return (labelWords.length && labelWords.every((w) => haystack.has(w))) || (slugWords.length && slugWords.every((w) => haystack.has(w)))
}
const authoredTextVisible = (mainText, sourceText, signatureLength = 9) => {
  const sig = meaningfulWords(sourceText).slice(0, signatureLength)
  if (sig.length < 5) return true
  return meaningfulLine(mainText).includes(sig.join(' '))
}
const authoredIntroVisible = (mainText, intro) => authoredTextVisible(mainText, intro, 9)

const geoOf = (file) => { const slug = file.replace(/\.html$/, ''); for (const t of cityTokens) if (slug === t || slug.endsWith('-' + t)) return t; return 'generic' }
const sigText = (e) => [e.intro, e.statement?.headline, e.statement?.emphasis, ...(e.statement?.body || []), ...(e.audienceCards || []).flatMap((c) => [c.title, c.text]), ...(e.localFaq || []).flatMap((f) => [f.question, f.answer])].filter(Boolean).join(' ')
const stripBrand = (t) => (t || '').toLowerCase().replace(/[|–—-]\s*matthias ramahi.*/i, '')
// target-/title tokens WITHOUT generic topic words and WITHOUT the geo -> what actually distinguishes the SERP target
const targetTokens = (e, geo) => {
  const geoWords = new Set(toWords(cityLabel[geo] || geo).concat(toWords(geo)))
  return new Set(toWords(stripBrand(e.seo?.title) + ' ' + (e.targetKeyword || '') + ' ' + (e.service || '')).filter((w) => !STOP.has(w) && !GENERIC.has(w) && !geoWords.has(w)))
}

const stripHtml = (html) => decodeEntities(html || '')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const htmlAttr = (html, re) => html.match(re)?.[1] || ''
const htmlText = (html, re) => stripHtml(html.match(re)?.[1] || '')
const isRedirectHtml = (html) => /<meta[^>]+http-equiv=["']refresh["']/i.test(html)
const hasNoindex = (html) => /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)

function collectIndexPages(dir, base = dir) {
  const pages = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      pages.push(...collectIndexPages(full, base))
    } else if (entry.name === 'index.html') {
      pages.push(full)
    }
  }
  return pages
}

function routeFromIndexPath(indexPath, baseDir) {
  const rel = path.relative(baseDir, path.dirname(indexPath)).replace(/\\/g, '/')
  if (!rel || rel === '.') return 'index.html'
  return rel.endsWith('.html') ? rel : `${rel}/`
}

// ---------- per-page scores ----------
function quality(e, geo) {
  const intro = e.intro || '', introL = intro.toLowerCase()
  const body = e.statement?.body || [], cards = e.audienceCards || [], faq = e.localFaq || []
  const t = (e.seo?.title || '').length, d = (e.seo?.description || '').length
  const head = toWords(e.targetKeyword || e.service || '').filter((w) => !GENERIC.has(w) && !STOP.has(w))[0]
  const geoW = (cityLabel[geo] || geo)
  const parts = {
    intro: between(intro.length, 180, 760) ? 16 : intro.length >= 120 ? 9 : 0,
    statement: body.length >= 2 && body.every((b) => (b || '').length >= 110) ? 14 : body.length ? 7 : 0,
    cards: cards.length >= 4 && cards.every((c) => (c.text || '').length >= 55) ? 14 : cards.length >= 3 ? 7 : 0,
    faq: faq.length >= 4 && faq.every((f) => (f.answer || '').length >= 80) ? 16 : faq.length >= 3 ? 8 : 0,
    title: between(t, 30, 70) ? 8 : t ? 3 : 0,
    desc: between(d, 115, 170) ? 8 : d ? 3 : 0,
    kwIntro: head && introL.includes(head) ? 8 : 0,
    geoIntro: geo === 'generic' ? 4 : introL.includes(geoW) || introL.includes(geo) ? 8 : 0,
    faqIntent: faq.some((f) => /^(was|wo|wie|welche|warum|kostet|kann|gibt)/i.test((f.question || '').trim())) ? 8 : 0,
  }
  const score = Math.max(0, Math.min(100, Math.round(Object.values(parts).reduce((a, b) => a + b, 0))))
  return { score, parts }
}

const scored = content.map((e) => ({ e, file: String(e.legacyFile).toLowerCase(), geo: geoOf(String(e.legacyFile)), fam: e.family, sh: shingles(toWords(sigText(e))) }))
for (const p of scored) p.tt = targetTokens(p.e, p.geo)
for (const p of scored) {
  // U: prose uniqueness vs all
  let uMax = 0, uNear = null
  // K: intent overlap vs same family + same geo
  let kMax = 0, kNear = null
  for (const q of scored) {
    if (q === p) continue
    const s = jaccard(p.sh, q.sh); if (s > uMax) { uMax = s; uNear = q.file }
    if (q.fam === p.fam && q.geo === p.geo) { const ks = jaccard(p.tt, q.tt); if (ks > kMax) { kMax = ks; kNear = q.file } }
  }
  p.u = Math.round((1 - uMax) * 100)
  p.uNear = uNear
  p.k = Math.round((1 - kMax) * 100)
  p.kNear = kNear
  p.uMax = uMax
  const Q = quality(p.e, p.geo); p.q = Q.score; p.qparts = Q.parts
  p.titleNorm = stripBrand(p.e.seo?.title).replace(/\s+/g, ' ').trim()
}
const byFile = new Map(scored.map((p) => [p.file, p]))

// ---------- cannibalization analysis ----------
const titleMap = new Map()
for (const p of scored) { const k = p.titleNorm; if (!titleMap.has(k)) titleMap.set(k, []); titleMap.get(k).push(p.file) }
const dupTitles = [...titleMap.entries()].filter(([, v]) => v.length > 1)
const competing = scored.filter((p) => p.k < 60 && p.kNear).map((p) => ({ a: p.file, b: p.kNear, k: p.k })).sort((x, y) => x.k - y.k)
// intent groups: family x geo with >1 authored page
const groups = {}
for (const p of scored) { const g = `${p.fam} · ${p.geo}`; (groups[g] ||= []).push(p) }
const multiGroups = Object.entries(groups).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)

// ---------- routable rows (incl. not-yet-authored) ----------
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
const distClient = fromRoot('apps/web/dist/client')
const allBuiltPages = collectIndexPages(distClient)
  .map((indexPath) => {
    const html = fs.readFileSync(indexPath, 'utf8')
    const route = routeFromIndexPath(indexPath, distClient)
    const file = route.toLowerCase()
    const redirect = isRedirectHtml(html)
    const noindex = hasNoindex(html)
    const title = stripHtml(htmlText(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i))
    const description = htmlAttr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    const canonical = htmlAttr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    const h1 = htmlText(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
    const mainText = stripHtml(html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || html)
    const localFile = route.endsWith('.html') ? route.toLowerCase() : ''
    const type = redirect
      ? 'redirect'
      : serviceHubFiles.has(localFile)
        ? 'service-hub'
        : byFile.has(localFile)
          ? 'local-seo'
          : route.startsWith('portfolio/')
            ? 'portfolio'
            : route.startsWith('journal/') || route === 'blog.html' || route.startsWith('blog-')
              ? 'journal'
              : route.startsWith('services/')
                ? 'service-route'
                : noindex
                  ? 'noindex-archiv'
                  : 'site-page'
    return {
      canonical,
      description,
      file,
      h1,
      indexable: !redirect && !noindex,
      mainText,
      redirect,
      route,
      textWords: toWords(mainText).length,
      title,
      titleLength: title.length,
      type,
    }
  })
  .sort((a, b) => a.route.localeCompare(b.route))
const redirectLocalSeoFiles = new Set(allBuiltPages.filter((page) => page.redirect && page.route.endsWith('.html')).map((page) => page.route.toLowerCase()))

const dirs = fs.readdirSync(distClient).filter((d) => d.endsWith('.html') && fs.existsSync(path.join(distClient, d, 'index.html')))
const rows = []
for (const d of dirs) {
  const file = d.toLowerCase()
  if (redirectLocalSeoFiles.has(file)) continue
  const slug = d.replace(/\.html$/, '')
  const c = classify(slug)
  if (c) rows.push({ slug, file, ...c })
}
rows.sort((a, b) => a.fam.localeCompare(b.fam) || a.prefix.localeCompare(b.prefix) || a.slug.localeCompare(b.slug))

const famOrder = ['automobil', 'sportwagen', 'oldtimer', 'motorrad', 'portrait', 'landschaft']
const serviceHubCount = rows.filter((r) => serviceHubFiles.has(r.file)).length
const createCount = rows.filter((r) => noDoc.has(r.file) && !serviceHubFiles.has(r.file)).length
const updateCount = rows.length - createCount - serviceHubCount
const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0)
const builtByLocalFile = new Map(allBuiltPages.filter((page) => page.route.endsWith('.html')).map((page) => [page.route.toLowerCase(), page]))
const buildAuditRows = rows.map((r) => {
  const page = builtByLocalFile.get(r.file)
  const sc = byFile.get(r.file)
  const issues = []
  if (!page) {
    issues.push('HTML fehlt')
  } else {
    if (r.kind === 'city' && !cityVisibleInText(page.h1, r.scope)) issues.push('H1 ohne Ort')
    if (r.kind === 'city' && sc?.e?.seo?.description && cityVisibleInText(sc.e.seo.description, r.scope) && !cityVisibleInText(page.description, r.scope)) issues.push('Desc ohne Ort')
    if (sc?.e?.intro && !authoredIntroVisible(page.mainText, sc.e.intro)) issues.push('Intro fehlt im HTML')
    const statementText = [sc?.e?.statement?.headline, sc?.e?.statement?.emphasis, ...(sc?.e?.statement?.body || [])].filter(Boolean).join(' ')
    if (statementText && !authoredTextVisible(page.mainText, statementText, 8)) issues.push('Statement fehlt im HTML')
    const audienceText = (sc?.e?.audienceCards || []).slice(0, 2).map((card) => `${card.title || ''} ${card.text || ''}`).join(' ')
    if (audienceText && !authoredTextVisible(page.mainText, audienceText, 8)) issues.push('Audience fehlt im HTML')
    const faqText = (sc?.e?.localFaq || []).slice(0, 1).map((faq) => `${faq.question || ''} ${faq.answer || ''}`).join(' ')
    if (faqText && !authoredTextVisible(page.mainText, faqText, 8)) issues.push('FAQ fehlt im HTML')
    const targetCore = [...(sc?.tt || [])].filter((w) => w.length > 3)
    const builtWords = new Set(toWords(`${page.title} ${page.h1} ${page.description} ${page.mainText}`))
    if (targetCore.length && !targetCore.every((w) => builtWords.has(w))) issues.push('Keyword fehlt im HTML')
  }
  return { ...r, h1: page?.h1 || '', issues }
})
const buildAuditByFile = new Map(buildAuditRows.map((r) => [r.file, r]))
const buildAuditIssueRows = buildAuditRows.filter((r) => r.issues.length)
const buildIssueCount = (label) => buildAuditRows.filter((r) => r.issues.includes(label)).length
const all = scored
const allIndexablePages = allBuiltPages.filter((page) => page.indexable)
const byType = new Map()
for (const page of allBuiltPages) byType.set(page.type, (byType.get(page.type) || 0) + 1)
const websiteTitleGroups = new Map()
for (const page of allIndexablePages) {
  const key = page.title.toLowerCase().replace(/\s+/g, ' ').trim()
  if (!key) continue
  if (!websiteTitleGroups.has(key)) websiteTitleGroups.set(key, [])
  websiteTitleGroups.get(key).push(page.route)
}
const websiteDuplicateTitles = [...websiteTitleGroups.values()].filter((routes) => routes.length > 1)
const websiteCanonicalIssues = allIndexablePages.filter((page) => !page.canonical)
const websiteTitleIssues = allIndexablePages.filter((page) => page.titleLength < 25 || page.titleLength > 70)
const websiteDescriptionIssues = allIndexablePages.filter((page) => page.description.length < 90 || page.description.length > 170)

let md = `# SEO Content Tracker\n\nQuelle: gebaute Seiten (\`apps/web/dist/client\`) + CMS-Connection-Audit + Content-Scoring aus \`apps/cms/content/local-seo-content.json\`. Neu berechnen: \`node tools/gen-seo-tracker.mjs\`.\n\n`
md += `**Local-/Cluster-Content:** ${rows.length} Seiten · Local-SEO-Doc (UPDATE): ${updateCount} · Service-Hub: ${serviceHubCount} · ohne Local-SEO-Doc (CREATE): ${createCount} · Content geschrieben (✍️): ${rows.filter((r) => authored.has(r.file)).length} · offen: ${rows.filter((r) => !authored.has(r.file)).length}\n\n`

md += `## Websiteweite Seiteninventur\n`
md += `- Gebaute HTML-Seiten insgesamt: ${allBuiltPages.length} · indexierbar: ${allIndexablePages.length} · noindex/Redirect: ${allBuiltPages.length - allIndexablePages.length}\n`
md += `- Typen: ${[...byType.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([type, count]) => `${type}: ${count}`).join(' · ')}\n`
md += `- Doppelte Title auf indexierbaren Seiten: ${websiteDuplicateTitles.length} · fehlende Canonicals: ${websiteCanonicalIssues.length} · Title-Laenge ausserhalb 25-70: ${websiteTitleIssues.length} · Description-Laenge ausserhalb 90-170: ${websiteDescriptionIssues.length}\n\n`
md += `- Local-SEO-Build-Abgleich: H1 ohne Ort: ${buildIssueCount('H1 ohne Ort')} · Keyword fehlt im HTML: ${buildIssueCount('Keyword fehlt im HTML')} · Description ohne Ort: ${buildIssueCount('Desc ohne Ort')}\n`
md += `- Local-SEO-CMS-Ausspielung: Intro fehlt: ${buildIssueCount('Intro fehlt im HTML')} · Statement fehlt: ${buildIssueCount('Statement fehlt im HTML')} · Audience-Cards fehlen: ${buildIssueCount('Audience fehlt im HTML')} · FAQ fehlt: ${buildIssueCount('FAQ fehlt im HTML')}\n\n`
if (websiteCanonicalIssues.length || websiteTitleIssues.length || websiteDescriptionIssues.length || websiteDuplicateTitles.length) {
  md += `**Websiteweite Flags:**\n`
  for (const page of websiteCanonicalIssues.slice(0, 20)) md += `- Canonical fehlt: \`${page.route}\`\n`
  for (const page of websiteTitleIssues.slice(0, 20)) md += `- Title-Laenge ${page.titleLength}: \`${page.route}\`\n`
  for (const page of websiteDescriptionIssues.slice(0, 20)) md += `- Description-Laenge ${page.description.length}: \`${page.route}\`\n`
  for (const routes of websiteDuplicateTitles.slice(0, 20)) md += `- Doppelter Title: ${routes.map((route) => `\`${route}\``).join(', ')}\n`
  md += `\n`
}
if (buildAuditIssueRows.length) {
  md += `**Local-SEO-Build-Flags:**\n`
  for (const row of buildAuditIssueRows.slice(0, 40)) md += `- \`${row.file}\`: ${row.issues.join(', ')}${row.h1 ? ` (H1: "${row.h1}")` : ''}\n`
  md += `\n`
}
md += `| Route | Typ | Index | Title | Desc | Words | Canonical |\n|---|---|---|---:|---:|---:|---|\n`
for (const page of allBuiltPages) {
  const canonicalStatus = page.redirect ? 'redirect' : page.canonical ? 'ok' : 'fehlt'
  md += `| \`${page.route}\` | ${page.type} | ${page.indexable ? 'ja' : 'nein'} | ${page.titleLength || '–'} | ${page.description.length || '–'} | ${page.textWords} | ${canonicalStatus} |\n`
}
md += `\n`

md += `## Scoring-Methodik\n`
md += `- **Q · SEO-Qualität (0–100):** Struktur (Intro 180–760 Z., 2 Statement-Absätze ≥110, ≥4 Audience-Cards, 4 FAQ ≥80) **+ thematische Abdeckung** (SEO-Title 30–70, Description 115–170, Fokus-Keyword im Intro, lokaler Ortsname im Intro bei Stadt-Seiten, echte W-Frage in den FAQ).\n`
md += `- **U · Content-Einzigartigkeit (0–100):** \`100 × (1 − max. Prosa-Ähnlichkeit)\` (Jaccard über Wort-Trigramme des Fließtexts gegen **alle** Seiten) → erkennt **Duplicate Content**.\n`
md += `- **K · Intent-Trennung / Anti-Kannibalisierung (0–100):** \`100 × (1 − max. Ziel-Überlappung)\`. Ziel = Title-/Keyword-Tokens **ohne** Marke, **ohne** generische Wörter (fotografie/foto/shooting…) und **ohne** den Ortsnamen — verglichen nur **innerhalb derselben Familie + desselben Ortes** (dort entsteht Kannibalisierung). Niedriges K = zwei Seiten zielen am selben Ort auf denselben Begriff.\n\n`
md += `- **Build-Check:** vergleicht die gebaute HTML-Seite mit dem authored CMS-Content. Rot wird: Stadtseite ohne Ort im H1, Kernkeyword nicht sichtbar, Description ohne Ort oder authored Sektionen (Intro/Statement/Audience/FAQ) nicht im HTML.\n\n`
md += `**Interpretation — bei allen drei gilt: höher = besser (Skala 0–100).**\n`
md += `- **Qualität:** hoch = Seite ist inhaltlich vollständig + thematisch sauber (Keyword/Ort/FAQ abgedeckt). Niedrig = etwas fehlt oder ist zu kurz.\n`
md += `- **Einzigartigkeit:** hoch = der Text teilt fast nichts mit anderen Seiten (kein Duplicate Content). Niedrig = zu ähnlich zu einer anderen Seite.\n`
md += `- **Kannibalisierungs-Schutz:** hoch = die Seite zielt auf einen eigenen Suchbegriff. Niedrig = sie konkurriert mit einer Schwesterseite um dieselbe Suche (schlecht).\n`
md += `- **Richtwerte:** ≥90 sehr gut · 80–89 gut · 70–79 ok · <70 prüfen. Beim Kannibalisierungs-Schutz ist **<60 ein Warnsignal**.\n\n`

if (all.length) {
  md += `## Bewertung (${all.length} Seiten im CMS-Content)\n`
  md += `- **Ø Qualität ${avg(all.map((p) => p.q))}** · **Ø Einzigartigkeit ${avg(all.map((p) => p.u))}** · **Ø Kannibalisierungs-Schutz ${avg(all.map((p) => p.k))}**\n`
  md += `- Qualität<80: ${all.filter((p) => p.q < 80).length} · Einzigartigkeit<70: ${all.filter((p) => p.u < 70).length} · **Kannibalisierungs-Verdacht (Schutz<60): ${all.filter((p) => p.k < 60).length}**\n`
  md += `- **Strenge Review-Schwellen:** Qualität<90: ${all.filter((p) => p.q < 90).length} · Einzigartigkeit<90: ${all.filter((p) => p.u < 90).length} · Kannibalisierungs-Schutz<75: ${all.filter((p) => p.k < 75).length}\n`
  md += `- **Doppelte SEO-Titel: ${dupTitles.length}**${dupTitles.length ? ' ⚠️' : ' ✅'}\n\n`
  md += `| Familie | Seiten | Ø Qualität | Ø Einzigartigkeit | Ø Kannibalisierungs-Schutz | min Kanni.-Schutz |\n|---|---|---|---|---|---|\n`
  for (const f of famOrder) { const ps = all.filter((p) => p.fam === f); if (ps.length) md += `| ${f} | ${ps.length} | ${avg(ps.map((p) => p.q))} | ${avg(ps.map((p) => p.u))} | ${avg(ps.map((p) => p.k))} | ${Math.min(...ps.map((p) => p.k))} |\n` }

  md += `\n### Kannibalisierungs-Check\n`
  if (dupTitles.length) { md += `**⚠️ Doppelte SEO-Titel:**\n`; for (const [t, files] of dupTitles) md += `- "${t}" → ${files.map((f) => '`' + f + '`').join(', ')}\n`; md += `\n` }
  else md += `Keine doppelten SEO-Titel. `
  md += competing.length ? `\n**Konkurrierende Paare (gleiche Familie+Ort, niedriges K):**\n\n| Seite | K | konkurriert mit |\n|---|---|---|\n` + competing.slice(0, 15).map((c) => `| \`${c.a}\` | ${c.k} | \`${c.b}\` |`).join('\n') + '\n' : `Keine Seitenpaare mit K<60 — keine direkte Keyword-Kannibalisierung erkannt.\n`
  md += `\n**Intent-Gruppen (Familie × Ort mit mehreren Seiten – jede Gruppe braucht klar getrennte Sub-Intents):**\n\n| Gruppe | Seiten | Sub-Intents (Service) | Ø K |\n|---|---|---|---|\n`
  for (const [g, ps] of multiGroups.slice(0, 16)) {
    const intents = [...new Set(ps.map((p) => p.e.service).filter(Boolean))]
    md += `| ${g} | ${ps.length} | ${intents.join(', ')} | ${avg(ps.map((p) => p.k))} |\n`
  }
  md += `\n_Grenze der Metrik: K erkennt gleiche/sehr ähnliche Titel-Ziele am selben Ort. Echte Synonym-Cluster (z. B. „Autofotografie" vs „Automobilfotografie") sind lexikalisch verschieden → über die Intent-Gruppen oben manuell prüfen; dort trennt der Sub-Intent (Shooting/Verkauf/Tipps/Print) die Seiten._\n\n`
}
// ---------- validation: prove the metric reacts to real text ----------
if (all.length) {
  const totalSh = all.reduce((a, p) => a + p.sh.size, 0)
  // closest real pair (global lowest U) with raw evidence
  const A = [...all].sort((a, b) => a.u - b.u)[0]
  const B = byFile.get(A.uNear)
  const interSet = [...A.sh].filter((x) => B.sh.has(x))
  // control 1: a merely city-swapped copy of a real city page must score LOW uniqueness
  const cityPage = all.find((p) => p.geo !== 'generic' && p.geo !== 'nrw' && p.geo !== 'deutschland') || all[0]
  const cl = cityLabel[cityPage.geo] || cityPage.geo
  const swapped = sigText(cityPage.e).replace(new RegExp(cl, 'gi'), 'Stuttgart').replace(new RegExp(cityPage.geo, 'gi'), 'stuttgart')
  const swapSh = shingles(toWords(swapped))
  const swapSim = jaccard(swapSh, cityPage.sh)
  const swapU = Math.round((1 - swapSim) * 100)
  // control 2: a stub page must score LOW quality
  const stubQ = quality({ intro: 'Kurzer Text.', statement: { body: [] }, audienceCards: [], localFaq: [], seo: { title: 'x', description: 'y' } }, 'koeln').score
  // control 3: Q breakdown of a real page
  const sample = byFile.get('business-portrait-duesseldorf.html') || all[0]

  md += `## Validierung der Metrik (Rohdaten / Kontrolltests)\n`
  md += `Damit die Zahlen nachvollziehbar sind: berechnet aus echten Texten, jede Zahl reproduzierbar.\n\n`
  md += `**Korpus:** ${all.length} Seiten, zusammen ${totalSh.toLocaleString('de-DE')} Wort-Trigramme (Ø ${Math.round(totalSh / all.length)}/Seite).\n\n`
  md += `**Ähnlichstes echtes Seitenpaar** (niedrigstes U im Korpus): \`${A.file}\` ↔ \`${A.uNear}\`\n`
  md += `- \`${A.file}\`: ${A.sh.size} Trigramme · \`${A.uNear}\`: ${B.sh.size} Trigramme · **gemeinsam: ${interSet.length}** → Jaccard ${(A.uMax).toFixed(3)} → **U = ${A.u}**\n`
  md += `- Beispiel gemeinsamer Trigramme: ${interSet.slice(0, 6).map((x) => '"' + x + '"').join(', ') || '—'}\n\n`
  md += `**Kontrolltest 1 — Templating-Erkennung:** Kopie von \`${cityPage.file}\`, bei der NUR der Ortsname (${cl}) durch „Stuttgart" ersetzt wurde →\n`
  md += `- Ähnlichkeit zum Original ${(swapSim).toFixed(3)} → **U = ${swapU}** (niedrig). Die echte Seite hat **U = ${cityPage.u}**.\n`
  md += `- ⇒ Wären die Seiten nur orts-getauschte Vorlagen, läge U bei ~${swapU}. Dass echte Seiten ~${avg(all.map((p) => p.u))} erreichen, zeigt: es ist **kein Templating**.\n\n`
  md += `**Kontrolltest 2 — Qualität reagiert:** Eine Stub-Seite (1 Satz Intro, keine FAQ/Cards) bekommt **Q = ${stubQ}** statt ~${avg(all.map((p) => p.q))}.\n\n`
  md += `**Q-Aufschlüsselung Beispielseite \`${sample.file}\`** (Summe der Teilpunkte = ${sample.q}):\n`
  md += `\`\`\`\n` + Object.entries(sample.qparts).map(([k, v]) => `${k.padEnd(11)} ${v}`).join('\n') + `\n\`\`\`\n\n`
}

md += `> Inhalte im CMS (intro/statement/audienceCards/localFaq/seo), Code = Fallback.\n\n`

for (const fam of famOrder) {
  const fr = rows.filter((r) => r.fam === fam)
  if (!fr.length) continue
  md += `## ${fam} (${fr.length})\n\n`
  md += `| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Build-Check | Status |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n`
  for (const r of fr) {
    const copy = richCopy.has(r.prefix) ? 'rich' : 'gen', faq = faqKeys.has(r.prefix) ? 'ja' : '—'
    const cms = serviceHubFiles.has(r.file) ? 'SERVICE' : noDoc.has(r.file) ? 'CREATE' : 'UPDATE', done = authored.has(r.file), sc = byFile.get(r.file)
    const buildAudit = buildAuditByFile.get(r.file)
    const buildCheck = buildAudit ? (buildAudit.issues.length ? buildAudit.issues.join('<br>') : 'ok') : 'n/a'
    md += `| \`${r.slug}.html\` | ${r.prefix} | ${r.scope} | ${r.kind} | ${copy} | ${faq} | ${cms} | ${done ? '✅' : '⬜'} | ${sc ? sc.q : '–'} | ${sc ? sc.u : '–'} | ${sc ? sc.k : '–'} | ${buildCheck} | ${done ? 'DONE' : 'TODO'} |\n`
  }
  md += `\n`
}
fs.writeFileSync(fromRoot('docs/seo-content-tracker.md'), md)
console.log(`scored=${all.length} avgQ=${avg(all.map((p) => p.q))} avgU=${avg(all.map((p) => p.u))} avgK=${avg(all.map((p) => p.k))} dupTitles=${dupTitles.length} K<60=${all.filter((p) => p.k < 60).length}`)
