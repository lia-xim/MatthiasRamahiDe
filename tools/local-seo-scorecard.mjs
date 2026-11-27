#!/usr/bin/env node
// Scorecard für alle lokalen SEO-/Keyword-Seiten (apps/web/content/local-seo-pages).
// Liest nur die Felder, die die Familien-Templates tatsächlich rendern, prüft den Live-Status
// (Status-Code, Weiterleitung, robots, Sitemap) und verbindet das mit einem GSC-Export.
//
// Aufruf:
//   node tools/local-seo-scorecard.mjs --gsc "<Ordner des GSC-Performance-Exports>" [--offline]
// Ausgabe:
//   docs/seo-stadtseiten-scorecard.csv  (Semikolon, UTF-8 mit BOM für Excel)
//   docs/seo-stadtseiten-scorecard.md   (Zusammenfassung + Regeln)

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'apps/web/content/local-seo-pages')
const origin = 'https://matthiasramahi.de'
const args = process.argv.slice(2)
const arg = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? '' : args[i + 1] || ''
}
const gscDir = arg('--gsc')
const offline = args.includes('--offline')

// ---------- CSV-Helfer ----------
const parseCsv = (text) => {
  const rows = []
  let row = []
  let cell = ''
  let q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ } else if (c === '"') q = false
      else cell += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.length > 1)
}
const num = (v) => Number(String(v || '0').replace('%', '').replace(',', '.')) || 0

// ---------- GSC ----------
const gscPages = new Map()
const gscQueries = []
let gscRange = 'kein GSC-Export angegeben'
if (gscDir) {
  const pagesFile = ['Seiten.csv', 'Pages.csv'].map((f) => path.join(gscDir, f)).find(existsSync)
  const queriesFile = ['Suchanfragen.csv', 'Queries.csv'].map((f) => path.join(gscDir, f)).find(existsSync)
  const filterFile = ['Filter.csv', 'Filters.csv'].map((f) => path.join(gscDir, f)).find(existsSync)
  if (!pagesFile) throw new Error(`Keine Seiten.csv/Pages.csv in ${gscDir}`)
  for (const [url, clicks, impr, , pos] of parseCsv(readFileSync(pagesFile, 'utf8')).slice(1)) {
    gscPages.set(url.replace(/\/$/, '') || url, { clicks: num(clicks), impr: num(impr), pos: num(pos) })
  }
  if (queriesFile) {
    for (const [query, clicks, impr] of parseCsv(readFileSync(queriesFile, 'utf8')).slice(1)) {
      gscQueries.push({ query: query.toLowerCase(), clicks: num(clicks), impr: num(impr) })
    }
  }
  if (filterFile) {
    const date = parseCsv(readFileSync(filterFile, 'utf8')).find((r) => r[0] === 'Datum' || r[0] === 'Date')
    gscRange = date ? date[1] : path.basename(gscDir)
  }
  gscRange = `${gscRange} (${path.basename(gscDir)})`
}

// ---------- Inhalte: nur gerenderte Felder ----------
const renderedTextFields = [
  'title', 'intro', 'heroLine2', 'statement', 'audienceSection', 'audienceCards', 'localFaq', 'faq',
  'guideSection', 'focusSection', 'shootingStyles', 'gallerySection', 'processSection', 'processSteps',
]
const renderedImageFields = ['heroImage', 'heroSlides', 'heroPanels', 'portfolioTiles', 'gallerySection', 'focusSection', 'shootingStyles']

const collectStrings = (value, out = []) => {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out))
  return out
}
const imageRe = /(?:\/uploads|\/assets|assets\/)[^\s"')]+\.(?:webp|jpe?g|png|avif)/gi

const cityNames = {
  duesseldorf: 'düsseldorf', koeln: 'köln', moenchengladbach: 'mönchengladbach', 'bergisch-gladbach': 'bergisch gladbach',
}
const knownCities = ['duesseldorf', 'koeln', 'essen', 'dortmund', 'duisburg', 'bochum', 'wuppertal', 'leverkusen', 'oberhausen',
  'krefeld', 'moenchengladbach', 'moers', 'gelsenkirchen', 'bergisch-gladbach', 'solingen', 'remscheid', 'mettmann', 'hilden',
  'dormagen', 'neuss', 'ratingen', 'erkrath', 'nrw', 'deutschland']

const families = [
  ['automobil', /^(automobil|auto|autofotograf|fahrzeug|autohaus|carshooting|fotoshooting-mit-auto|person-mit-auto)/],
  ['sportwagen', /^(sportwagen|motorsport|performance|exotic|supersport|supercar)/],
  ['oldtimer', /^(oldtimer|classic|youngtimer|sammlerfahrzeug)/],
  ['motorrad', /^(motorrad|custom-bike|biker|bike)/],
  ['portrait', /^(portrait|business|headshot|personal|unternehmens|presse|dating|paar|familien|gutschein|bewerbung|maenner|musiker|schwarz|fotoshooting|fotograf-)/],
  ['landschaft', /^(landschaft|fine-art|wandbild|natur|kunstdruck|prints?)/],
]
const familyOf = (slug) => (families.find(([, re]) => re.test(slug)) || ['sonstige'])[0]

const docs = readdirSync(contentDir)
  .filter((f) => f.endsWith('.json'))
  .map((file) => {
    const j = JSON.parse(readFileSync(path.join(contentDir, file), 'utf8'))
    const slug = j.slug || file.replace(/\.json$/, '')
    const citySlug = knownCities.find((c) => slug.endsWith(`-${c}`)) || ''
    const isPath = (s) => /^\/|\.(?:webp|jpe?g|png|avif|html)$|^https?:/i.test(s.trim())
    const text = renderedTextFields.flatMap((k) => collectStrings(j[k])).filter((s) => !isPath(s)).join('\n')
    const images = new Set(renderedImageFields.flatMap((k) => collectStrings(j[k]).flatMap((s) => s.match(imageRe) || [])))
    const faq = j.localFaq?.length ? j.localFaq : j.faq || []
    return { file, slug, j, citySlug, family: familyOf(slug), text, images, faqCount: Array.isArray(faq) ? faq.length : 0 }
  })

// ---------- Textsignale ----------
const words = (t) => t.toLowerCase().replace(/[^a-zäöüß0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
const shingles = (t) => {
  const w = words(t)
  const s = new Set()
  for (let i = 0; i + 4 <= w.length; i++) s.add(w.slice(i, i + 4).join(' '))
  return s
}
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0
  let n = 0
  for (const x of a) if (b.has(x)) n++
  return n / (a.size + b.size - n)
}
const aiPatterns = [
  /nicht [^.]{1,60}?, sondern/gi,
  /\bohne [^.,]{1,40}, ohne\b/gi,
  /\bkein(?:e|en)? [^.,]{1,40} um der [^.,]{1,20} willen/gi,
  /\b(bewusst|ruhig|sauber|klar)(e|er|en|es)? (geführt|gesetzt|dokumentiert|geplant)/gi,
]
for (const d of docs) {
  d.wordCount = words(d.text).length
  d.emDashPer1000 = d.wordCount ? (((d.text.match(/—/g) || []).length / d.wordCount) * 1000) : 0
  d.aiPhrases = aiPatterns.reduce((n, re) => n + (d.text.match(re) || []).length, 0)
  d.sh = shingles(d.text)
}
for (const d of docs) {
  let max = 0
  let twin = ''
  for (const o of docs) {
    if (o === d) continue
    const v = jaccard(d.sh, o.sh)
    if (v > max) { max = v; twin = o.slug }
  }
  d.maxSim = max
  d.twin = twin
}

// ---------- Bildsignale ----------
const imageUse = new Map()
for (const d of docs) for (const img of d.images) imageUse.set(img, (imageUse.get(img) || 0) + 1)
for (const d of docs) {
  const uses = [...d.images].map((i) => imageUse.get(i))
  d.imageCount = d.images.size
  d.uniqueImages = uses.filter((u) => u === 1).length
  d.sharedImages10 = uses.filter((u) => u > 10).length
}

// ---------- Stadt-Nachfrage aus Suchanfragen ----------
for (const d of docs) {
  const name = d.citySlug ? (cityNames[d.citySlug] || d.citySlug.replace(/-/g, ' ')) : ''
  const hits = name && !['nrw', 'deutschland'].includes(d.citySlug) ? gscQueries.filter((q) => q.query.includes(name)) : []
  d.cityQueryImpr = hits.reduce((s, q) => s + q.impr, 0)
  d.cityQueryClicks = hits.reduce((s, q) => s + q.clicks, 0)
}

// ---------- Live-Status ----------
const sitemapLocs = new Set()
if (!offline) {
  for (const sm of ['sitemap-local-seo.xml', 'sitemap-services.xml', 'sitemap-pages.xml']) {
    const xml = await (await fetch(`${origin}/${sm}`)).text()
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapLocs.add(m[1].trim())
  }
  const queue = [...docs]
  const worker = async () => {
    while (queue.length) {
      const d = queue.shift()
      const url = `${origin}/${d.slug}.html`
      d.url = url
      try {
        const res = await fetch(url, { redirect: 'manual' })
        d.status = res.status
        d.location = res.headers.get('location') || ''
        if (res.status === 200) {
          const html = await res.text()
          const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)?.[1] || ''
          d.noindex = /noindex/i.test(robots)
          d.canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] || ''
        }
      } catch (e) {
        d.status = 'Fehler'
        d.location = String(e.message || e)
      }
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker))
}
for (const d of docs) {
  d.url ||= `${origin}/${d.slug}.html`
  d.inSitemap = sitemapLocs.has(d.url)
  const g = gscPages.get(d.url) || { clicks: 0, impr: 0, pos: 0 }
  Object.assign(d, { clicks: g.clicks, impr: g.impr, pos: g.pos })
  d.live = d.status === 200 && !d.noindex && (!d.canonical || d.canonical === d.url)
}

// ---------- Hubs: Seiten, auf die andere lokale Seiten weiterleiten, oder Regional-Pillars ----------
const hubRe = /^[a-z]*fotografie-(nrw|duesseldorf|deutschland)$|^fotografie-(nrw|duesseldorf)$/
for (const d of docs) {
  d.inbound = docs.filter((o) => o.location && o.location.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '') === `${d.slug}.html`).length
  d.isHub = d.status === 200 && (hubRe.test(d.slug) || d.inbound >= 2)
}

// ---------- Empfehlung ----------
// Schwellen gelten für den Zeitraum des GSC-Exports (hier: 3 Monate).
const isCity = (d) => d.citySlug && !['duesseldorf', 'nrw', 'deutschland'].includes(d.citySlug)
const recommend = (d) => {
  if (offline) return ['offline', 'Live-Status nicht geprüft']
  if (d.status !== 200) {
    const target = d.location ? d.location.replace(origin, '').replace(/^\//, '') : '?'
    return ['bereits umgeleitet', `${d.status} → ${target} · JSON wird nicht als eigene Seite ausgeliefert`]
  }
  if (!d.live) return ['nicht indexierbar', d.noindex ? 'noindex' : `kanonisch → ${d.canonical}`]
  if (d.isHub) return ['Hub: behalten + ausbauen', `Zielseite für Zusammenführungen (${d.inbound} Weiterleitungen) · ${d.clicks} Klicks / ${d.impr} Impr.`]
  const reasons = []
  if (d.clicks >= 3 || d.impr >= 150) return ['behalten + Nachweis ergänzen', `${d.clicks} Klicks / ${d.impr} Impr.`]
  if (!isCity(d)) {
    if (d.impr >= 20) return ['behalten + Nachweis ergänzen', `Hub/Keyword-Seite, ${d.impr} Impr.`]
    return ['prüfen: Keyword-Seite ohne Nachfrage', `${d.impr} Impr., Pos. ${d.pos || '–'}`]
  }
  if (d.impr >= 30 || (d.pos && d.pos <= 15 && d.impr >= 10)) {
    reasons.push(`${d.impr} Impr., Pos. ${d.pos || '–'}`)
    return ['aufwerten (nur mit echtem Shooting vor Ort)', reasons.join(' · ')]
  }
  reasons.push(`${d.impr} Impr. in 3 Monaten`)
  if (d.cityQueryImpr) reasons.push(`Stadtname in Suchanfragen: ${d.cityQueryImpr} Impr.`)
  if (d.sharedImages10 && d.uniqueImages === 0) reasons.push('nur Vorlagenbilder')
  return ['zusammenführen in Regional-Hub (301)', reasons.join(' · ')]
}
for (const d of docs) [d.action, d.reason] = recommend(d)
for (const d of docs) {
  if (!d.action.startsWith('zusammenführen') && !d.action.startsWith('prüfen')) { d.target = ''; continue }
  const hub = ['nrw', 'duesseldorf'].map((c) => docs.find((o) => o.live && o !== d && o.family === d.family && o.citySlug === c)).find(Boolean)
  d.target = hub ? `${hub.slug}.html` : ''
}

// ---------- Ausgabe ----------
const order = ['Hub: behalten + ausbauen', 'behalten + Nachweis ergänzen', 'aufwerten (nur mit echtem Shooting vor Ort)', 'prüfen: Keyword-Seite ohne Nachfrage',
  'zusammenführen in Regional-Hub (301)', 'nicht indexierbar', 'bereits umgeleitet', 'offline']
docs.sort((a, b) => order.indexOf(a.action) - order.indexOf(b.action) || a.family.localeCompare(b.family) || b.impr - a.impr || a.slug.localeCompare(b.slug))

const cols = [
  ['Empfehlung', (d) => d.action], ['Begründung', (d) => d.reason], ['URL', (d) => d.url], ['Familie', (d) => d.family],
  ['Stadt', (d) => d.citySlug || '(Keyword)'], ['Ziel bei Zusammenführung', (d) => d.target], ['HTTP', (d) => d.status ?? ''], ['In Sitemap', (d) => (d.inSitemap ? 'ja' : 'nein')],
  ['Klicks', (d) => d.clicks], ['Impressionen', (d) => d.impr], ['Position', (d) => (d.pos ? d.pos.toFixed(1) : '')],
  ['Stadt-Suchanfragen Impr.', (d) => d.cityQueryImpr], ['Wörter (gerendert)', (d) => d.wordCount],
  ['Gedankenstriche je 1000 Wörter', (d) => d.emDashPer1000.toFixed(1)], ['KI-Satzmuster', (d) => d.aiPhrases],
  ['Max. Textähnlichkeit', (d) => `${(d.maxSim * 100).toFixed(0)} %`], ['Ähnlichste Seite', (d) => d.twin],
  ['Bilder', (d) => d.imageCount], ['Bilder nur hier', (d) => d.uniqueImages], ['Bilder auf >10 Seiten', (d) => d.sharedImages10],
  ['FAQ', (d) => d.faqCount], ['Ratgeber-Abschnitt', (d) => (d.j.guideSection?.items?.length ? 'ja' : 'nein')],
  ['Echtes Shooting vor Ort? (manuell)', () => ''], ['Entscheidung (manuell)', () => ''],
]
const esc = (v) => {
  const s = String(v ?? '')
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const csv = '﻿' + [cols.map(([h]) => h).join(';'), ...docs.map((d) => cols.map(([, f]) => esc(f(d))).join(';'))].join('\r\n') + '\r\n'
writeFileSync(path.join(root, 'docs/seo-stadtseiten-scorecard.csv'), csv)

const count = (list, key) => list.reduce((m, d) => ((m[key(d)] = (m[key(d)] || 0) + 1), m), {})
const byAction = count(docs, (d) => d.action)
const live = docs.filter((d) => d.live)
const familiesLive = [...new Set(live.map((d) => d.family))].sort()
const median = (arr) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[s.length >> 1] : 0 }
const liveClicks = live.reduce((s, d) => s + d.clicks, 0)
const liveImpr = live.reduce((s, d) => s + d.impr, 0)

const table = (rows, head) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n')
const md = `# Scorecard Stadt- und Keyword-Seiten

Erzeugt am ${new Date().toISOString().slice(0, 10)} mit \`node tools/local-seo-scorecard.mjs --gsc "<GSC-Ordner>"\`.
GSC-Zeitraum: ${gscRange}. Vollständige Tabelle: [seo-stadtseiten-scorecard.csv](seo-stadtseiten-scorecard.csv) (Excel: Semikolon, UTF-8).

Diese Liste ist ein **Vorschlag**. Weiterleitungen, noindex oder das Löschen von Seiten ändern die Indexierung und werden erst nach ausdrücklicher Freigabe umgesetzt.

## Bestand

- JSON-Dateien in \`content/local-seo-pages\`: **${docs.length}**
- Davon live als eigene, indexierbare Seite (HTTP 200, kein noindex, selbstkanonisch): **${live.length}**
- Bereits umgeleitet: **${byAction['bereits umgeleitet'] || 0}**, nicht indexierbar: **${byAction['nicht indexierbar'] || 0}**
- GSC für die ${live.length} Live-Seiten: **${liveClicks} Klicks**, **${liveImpr} Impressionen**; Median **${median(live.map((d) => d.impr))} Impressionen** je Seite

## Empfehlungen (nur Live-Seiten)

${table(order.filter((a) => live.some((d) => d.action === a)).map((a) => [a, live.filter((d) => d.action === a).length]), ['Empfehlung', 'Seiten'])}

### Nach Familie

${table(familiesLive.map((f) => {
  const l = live.filter((d) => d.family === f)
  return [f, l.length, l.filter((d) => d.isHub).length, l.filter((d) => d.action.startsWith('behalten')).length, l.filter((d) => d.action.startsWith('aufwerten')).length,
    l.filter((d) => d.action.startsWith('prüfen')).length, l.filter((d) => d.action.startsWith('zusammenführen')).length,
    l.reduce((s, d) => s + d.clicks, 0), l.reduce((s, d) => s + d.impr, 0)]
}), ['Familie', 'live', 'Hub', 'behalten', 'aufwerten', 'prüfen', 'zusammenführen', 'Klicks', 'Impr.'])}

## Seiten, die Nachfrage haben (behalten + echten Nachweis ergänzen)

${table(live.filter((d) => d.action.startsWith('behalten')).sort((a, b) => b.impr - a.impr).map((d) => [d.slug, d.clicks, d.impr, d.pos ? d.pos.toFixed(1) : '–', d.uniqueImages]), ['Seite', 'Klicks', 'Impr.', 'Pos.', 'eigene Bilder'])}

## Hub-Seiten (Ziele der Zusammenführung)

${table(live.filter((d) => d.isHub).sort((a, b) => b.inbound - a.inbound || b.impr - a.impr).map((d) => [d.slug, d.inbound, d.clicks, d.impr, d.pos ? d.pos.toFixed(1) : '–', d.uniqueImages]), ['Seite', 'eingehende Weiterleitungen', 'Klicks', 'Impr.', 'Pos.', 'eigene Bilder'])}

Wichtig: Die NRW-Hubs haben schon 13 bis 21 Stadtseiten aufgenommen, aber selbst kaum Sichtbarkeit. Weitere Zusammenführungen bringen nur etwas, wenn diese Hubs echte Projekte, eigene Bilder und regionale Praxisinfos bekommen.

## Kandidaten zum Zusammenführen

${table(live.filter((d) => d.action.startsWith('zusammenführen')).sort((a, b) => a.family.localeCompare(b.family) || b.impr - a.impr).map((d) => [d.slug, d.impr, d.pos ? d.pos.toFixed(1) : '–', d.target || '–']), ['Seite', 'Impr.', 'Pos.', 'Ziel (301)'])}

## Keyword-Seiten ohne Nachfrage (prüfen)

${table(live.filter((d) => d.action.startsWith('prüfen')).sort((a, b) => a.family.localeCompare(b.family) || b.impr - a.impr).map((d) => [d.slug, d.impr, d.pos ? d.pos.toFixed(1) : '–', d.target || '–']), ['Seite', 'Impr.', 'Pos.', 'möglicher Hub'])}

## Muster über alle Live-Seiten

- Gerenderte Wörter je Seite (Median): **${median(live.map((d) => d.wordCount))}**
- Gedankenstriche je 1000 Wörter (Median): **${median(live.map((d) => d.emDashPer1000)).toFixed(1)}** (rund ein Gedankenstrich alle 60 Wörter; ein auffälliges, typisches Merkmal von KI-Texten)
- Seiten mit mindestens einem typischen KI-Satzmuster („nicht …, sondern“, „ohne …, ohne“): **${live.filter((d) => d.aiPhrases > 0).length}**
- Seiten ohne ein einziges Bild, das nur dort vorkommt: **${live.filter((d) => d.uniqueImages === 0).length}** von ${live.length}
- Seiten ohne Ratgeber-Abschnitt: **${live.filter((d) => !d.j.guideSection?.items?.length).length}**
- Höchste Textähnlichkeit zwischen zwei Live-Seiten (4-Wort-Folgen): **${(Math.max(0, ...live.map((d) => d.maxSim)) * 100).toFixed(0)} %**

## Regeln hinter der Empfehlung

Schwellen beziehen sich auf den GSC-Zeitraum (3 Monate).

1. **behalten + Nachweis ergänzen**: mindestens 3 Klicks oder 150 Impressionen; Keyword-/Hub-Seiten ab 20 Impressionen.
2. **aufwerten (nur mit echtem Shooting vor Ort)**: Stadtseite mit mindestens 30 Impressionen oder mindestens 10 Impressionen auf Position bis 15. Lohnt nur, wenn es dort ein echtes Shooting mit eigenen Bildern gibt; sonst wie 4.
0. **Hub: behalten + ausbauen**: Regional-Pillar (\`…-nrw\`, \`…-duesseldorf\`) oder Seite, auf die bereits andere Stadtseiten weiterleiten. Hier landen die Zusammenführungen; diese Seiten sollten die stärksten echten Nachweise bekommen.
3. **prüfen: Keyword-Seite ohne Nachfrage**: Seite ohne Stadtbezug mit unter 20 Impressionen. Entweder ein klar eigener Suchzweck mit echtem Inhalt (z. B. Verkaufsfotos vs. Shooting) oder in den Familien-Hub zusammenführen. Keine Textüberschneidung ist hoch genug, um als Duplikat zu gelten.
4. **zusammenführen in Regional-Hub (301)**: Stadtseite mit weniger als 30 Impressionen, außer sie hat mindestens 10 Impressionen auf Position bis 15. Ziel ist der jeweilige Familien-Hub (\`<familie>-fotografie-nrw.html\` bzw. Düsseldorf-Seite), so wie es für Gelsenkirchen, Hilden & Co. schon umgesetzt ist.

Die Spalten „Echtes Shooting vor Ort?“ und „Entscheidung“ sind zum Ausfüllen gedacht. Ein „ja“ bei „Echtes Shooting“ schlägt die Regel 4.

## Grenzen

- GSC liefert nur Seiten mit Impressionen; fehlende Seiten zählen als 0.
- Der Coverage-Export enthält nur Summen (z. B. „Gecrawlt – zurzeit nicht indexiert“), keine URL-Liste. Mit der URL-Liste aus der Search Console ließe sich der Index-Status je Seite ergänzen.
- Umami-Engagement ist nicht enthalten (kein Zugriff aus dem Repo).
- Bilder aus dem Familien-Template (wenn ein Feld leer ist) werden nicht mitgezählt; „Bilder nur hier = 0“ heißt deshalb: keine eigenen Bilder in den Seitendaten.
`
writeFileSync(path.join(root, 'docs/seo-stadtseiten-scorecard.md'), md)
console.log(JSON.stringify({ total: docs.length, live: live.length, byAction, liveClicks, liveImpr }, null, 2))
