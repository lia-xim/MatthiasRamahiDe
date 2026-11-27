#!/usr/bin/env node
// Text-Audit über alle Sitemap-Seiten: misst Muster, die Seiten maschinell, gestopft
// oder austauschbar wirken lassen, auf dem GERENDERTEN Text (ohne Header, Footer, Skripte).
//
// Aufruf:
//   node tools/copy-quality-audit.mjs --base-url http://localhost:4330 [--sitemaps local-seo,services,pages,journal] [--json out.json]
// Ausgabe: docs/seo-text-audit.md (+ optional JSON mit allen Kennzahlen)

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const arg = (name, fallback = '') => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1] || fallback
}
const base = arg('--base-url', 'http://localhost:4321').replace(/\/$/, '')
const sitemaps = arg('--sitemaps', 'local-seo,services,pages,journal').split(',')
const jsonOut = arg('--json')
const prodOrigin = 'https://matthiasramahi.de'

// ---------- URLs sammeln ----------
const urls = []
for (const sm of sitemaps) {
  const xml = await (await fetch(`${base}/sitemap-${sm}.xml`)).text()
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = m[1].trim()
    if (/\.(webp|jpe?g|png)$/i.test(loc)) continue
    urls.push({ sitemap: sm, url: loc, local: loc.replace(prodOrigin, base) })
  }
}

// ---------- Text extrahieren ----------
const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
const mainText = (html) => {
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0]
  return decode(
    main
      .replace(/<(script|style|noscript|svg|nav)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section|\/figcaption|\/summary|\/dt|\/dd|\/blockquote)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
}

// ---------- Muster ----------
const patterns = {
  'nicht …, sondern': /\bnicht\b[^.!?\n]{1,80}?,\s*sondern\b/gi,
  'ohne …, ohne': /\bohne\b[^.!?\n]{1,50},\s*ohne\b/gi,
  'kein … um der … willen': /um der [^.,]{1,20} willen/gi,
  'als lokaler Suchraum': /lokaler? Suchraum/gi,
  'Superlativ/Werbefloskel': /\b(hochwertig\w*|perfekt\w*|einzigartig\w*|unvergesslich\w*|atemberaubend\w*|professionell\w*)\b/gi,
  'Kuratiert-Häufung': /\bkuratiert\w*\b/gi,
}
// Kleingeschriebene Keyword-Einsprengsel mitten im Satz (typisch für Keyword-Stuffing).
const lowerKeyword = /(?<![.!?:]\s)(?<=\s)(auto fotoshooting|portrait fotoshooting|motorrad fotoshooting|business portrait|classic car|exotic car|supercar fotografie|performance car fotografie|oldtimer fotografie|sportwagen fotografie|motorrad fotografie|automobil fotografie)\b/g

const words = (t) => t.split(/\s+/).filter((w) => /[a-zäöüß0-9]/i.test(w)).length
const sentences = (t) =>
  t
    .split(/(?<=[.!?])\s+|\n/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 6)

const cityWords = /\b(Düsseldorf|Köln|Essen|Dortmund|Duisburg|Bochum|Wuppertal|Leverkusen|Oberhausen|Krefeld|Mönchengladbach|Moers|Gelsenkirchen|Bergisch Gladbach|Solingen|Remscheid|Mettmann|Hilden|Dormagen|Neuss|Ratingen|Erkrath|NRW|Deutschland)\b/g
const normalizeSentence = (s) => s.replace(cityWords, '{Ort}').replace(/\s+/g, ' ').toLowerCase()

// ---------- Abruf ----------
const pages = []
const queue = [...urls]
const worker = async () => {
  while (queue.length) {
    const u = queue.shift()
    try {
      const res = await fetch(u.local)
      const html = await res.text()
      const title = decode((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '')
      const text = mainText(html)
      const w = words(text)
      const counts = Object.fromEntries(Object.entries(patterns).map(([k, re]) => [k, (text.match(re) || []).length]))
      const keyPhrase = title.split(/\s+[—|–-]\s+/)[0].trim()
      const keyCount = keyPhrase.length > 6 ? (text.toLowerCase().match(new RegExp(keyPhrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length : 0
      pages.push({
        ...u,
        status: res.status,
        title,
        words: w,
        emDash: (text.match(/—/g) || []).length,
        emDashPer1000: w ? ((text.match(/—/g) || []).length / w) * 1000 : 0,
        lowerKeywords: (text.match(lowerKeyword) || []).length,
        keyPhrase,
        keyCount,
        keyPer1000: w ? (keyCount / w) * 1000 : 0,
        counts,
        sentences: sentences(text),
      })
    } catch (e) {
      pages.push({ ...u, status: 'Fehler', error: String(e.message || e), sentences: [], counts: {} })
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker))

// ---------- Seitenübergreifende Wiederholungen ----------
const sentencePages = new Map()
for (const p of pages) {
  for (const s of new Set(p.sentences.map(normalizeSentence))) {
    if (!sentencePages.has(s)) sentencePages.set(s, new Set())
    sentencePages.get(s).add(p.url)
  }
}
const repeated = [...sentencePages.entries()].filter(([, set]) => set.size >= 5).sort((a, b) => b[1].size - a[1].size)
const repeatedSet = new Set(repeated.map(([s]) => s))
for (const p of pages) {
  const norm = p.sentences.map(normalizeSentence)
  p.boilerplateShare = norm.length ? norm.filter((s) => repeatedSet.has(s)).length / norm.length : 0
  p.score =
    p.emDashPer1000 * 1 +
    p.lowerKeywords * 3 +
    Math.max(0, p.keyPer1000 - 6) * 2 +
    (p.counts['nicht …, sondern'] || 0) * 2 +
    (p.counts['ohne …, ohne'] || 0) * 2 +
    (p.counts['als lokaler Suchraum'] || 0) * 10 +
    p.boilerplateShare * 40
}

// ---------- Bericht ----------
const ok = pages.filter((p) => p.status === 200)
const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  return s.length ? s[s.length >> 1] : 0
}
const sum = (k) => ok.reduce((a, p) => a + (typeof k === 'function' ? k(p) : p[k]), 0)
const table = (rows, head) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n')
const bySitemap = [...new Set(ok.map((p) => p.sitemap))].map((sm) => {
  const l = ok.filter((p) => p.sitemap === sm)
  return [sm, l.length, median(l.map((p) => p.words)), median(l.map((p) => p.emDashPer1000)).toFixed(1), l.reduce((a, p) => a + p.lowerKeywords, 0), l.reduce((a, p) => a + (p.counts['nicht …, sondern'] || 0), 0), `${(median(l.map((p) => p.boilerplateShare)) * 100).toFixed(0)} %`]
})

const md = `# Text-Audit (gerenderte Seiten)

Erzeugt ${new Date().toISOString().slice(0, 16).replace('T', ' ')} gegen \`${base}\` mit \`node tools/copy-quality-audit.mjs\`.
Gemessen wird nur der Text in \`<main>\` (ohne Navigation, Skripte, Footer).

## Überblick

- Seiten: **${ok.length}** (Fehler: ${pages.length - ok.length})
- Gedankenstriche gesamt: **${sum('emDash')}**, Median **${median(ok.map((p) => p.emDashPer1000)).toFixed(1)}** je 1000 Wörter
- Kleingeschriebene Keyword-Einsprengsel: **${sum('lowerKeywords')}**
- „nicht …, sondern“: **${sum((p) => p.counts['nicht …, sondern'] || 0)}**, „ohne …, ohne“: **${sum((p) => p.counts['ohne …, ohne'] || 0)}**
- „lokaler Suchraum“: **${sum((p) => p.counts['als lokaler Suchraum'] || 0)}**
- Sätze, die auf mindestens 5 Seiten gleich vorkommen (Ortsnamen neutralisiert): **${repeated.length}**

${table(bySitemap, ['Sitemap', 'Seiten', 'Wörter (Median)', '— je 1000', 'Keyword klein', 'nicht…sondern', 'Boilerplate-Anteil (Median)'])}

## Häufigste wiederholte Sätze (Vorlagen-Bausteine)

${table(repeated.slice(0, 40).map(([s, set]) => [set.size, s.slice(0, 160).replace(/\|/g, '/')]), ['Seiten', 'Satz (normalisiert)'])}

## Seiten mit dem größten Handlungsbedarf

${table(ok.sort((a, b) => b.score - a.score).slice(0, 40).map((p) => [p.url.replace(prodOrigin, ''), p.words, p.emDashPer1000.toFixed(1), p.lowerKeywords, p.counts['nicht …, sondern'] || 0, `${(p.boilerplateShare * 100).toFixed(0)} %`, p.keyPer1000.toFixed(1), p.score.toFixed(0)]), ['Seite', 'Wörter', '— /1000', 'KW klein', 'nicht…sondern', 'Boilerplate', 'Titel-Phrase /1000', 'Score'])}
`
writeFileSync(path.join(root, 'docs/seo-text-audit.md'), md)
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ pages: pages.map(({ sentences, ...p }) => p), repeated: repeated.map(([s, set]) => ({ s, n: set.size, pages: [...set] })) }, null, 1))
console.log(JSON.stringify({ pages: ok.length, emDash: sum('emDash'), lowerKeywords: sum('lowerKeywords'), nichtSondern: sum((p) => p.counts['nicht …, sondern'] || 0), suchraum: sum((p) => p.counts['als lokaler Suchraum'] || 0), repeated: repeated.length, medianBoilerplate: median(ok.map((p) => p.boilerplateShare)) }))
