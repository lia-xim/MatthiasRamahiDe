import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'apps/web/src/lib')
const distDir = path.join(root, 'apps/web/dist/client')
const reportPath = path.join(root, 'docs/seo-local-seiten-duplicate-audit.md')
const siteOrigin = 'https://matthiasramahi.de'

const cityLabels = {
  'bergisch-gladbach': 'Bergisch Gladbach',
  bochum: 'Bochum',
  deutschland: 'Deutschland',
  dormagen: 'Dormagen',
  dortmund: 'Dortmund',
  duesseldorf: 'Duesseldorf',
  duisburg: 'Duisburg',
  erkrath: 'Erkrath',
  essen: 'Essen',
  gelsenkirchen: 'Gelsenkirchen',
  hilden: 'Hilden',
  koeln: 'Koeln',
  krefeld: 'Krefeld',
  leverkusen: 'Leverkusen',
  mettmann: 'Mettmann',
  moenchengladbach: 'Moenchengladbach',
  moers: 'Moers',
  neuss: 'Neuss',
  nrw: 'NRW',
  oberhausen: 'Oberhausen',
  ratingen: 'Ratingen',
  remscheid: 'Remscheid',
  solingen: 'Solingen',
  wuppertal: 'Wuppertal',
}

const priorityCities = new Set(['duesseldorf', 'erkrath', 'ratingen', 'mettmann', 'koeln', 'essen', 'dortmund'])
let sectionRichPrefixes = new Set([
  'auto-fotografieren-tipps',
  'auto-fotoshooting',
  'bilder-mit-auto',
  'fotoshooting-mit-auto',
  'motorsport-fotografie',
  'motorsport-sportwagen-fotografie',
  'portrait-fotoshooting',
  'portraitfotografie-beleuchtung',
  'dating-fotoshooting',
  'fotoshooting-gutschein',
  'fotoshooting-preise',
  'paarshooting-familienshooting',
  'schwarz-weiss-portrait-fotografie',
])

const plannedButNotDeepPrefixes = new Set([
  'business-portrait',
  'headshot-fotograf',
  'personal-branding-fotografie',
  'pressefoto',
  'unternehmensportrait',
])

const stripHtml = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

const pickArray = (source, name) => {
  const match = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\](?: as const)?`))
  if (!match) return []
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1])
}

const parseFamilies = (source) => {
  const families = []
  const familyRe = /family:\s*'([^']+)'[\s\S]*?prefixes:\s*\[([\s\S]*?)\]/g
  for (const match of source.matchAll(familyRe)) {
    families.push({
      family: match[1],
      prefixes: [...match[2].matchAll(/'([^']+)'/g)].map((entry) => entry[1]),
    })
  }
  return families
}

const normalize = (value) =>
  stripHtml(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(duesseldorf|dusseldorf|erkrath|ratingen|mettmann|koeln|koln|essen|dortmund|bochum|krefeld|leverkusen|wuppertal|neuss|nrw|deutschland|bergisch gladbach|dormagen|duisburg|gelsenkirchen|hilden|moenchengladbach|monchengladbach|moers|oberhausen|remscheid|solingen)\b/g, ' city ')
    .replace(/\b(auto-fotoshooting|auto fotoshooting|bilder mit auto|fotoshooting mit auto|motorsport fotografie|portrait fotoshooting|dating fotoshooting|fotoshooting gutschein|fotoshooting preise|portraitfotografie beleuchtung|schwarz weiss portrait fotografie|paarshooting und familienshooting)\b/g, ' keyword ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const shingles = (text, size = 5) => {
  const words = normalize(text).split(' ').filter(Boolean)
  const result = new Set()
  for (let i = 0; i <= words.length - size; i += 1) {
    result.add(words.slice(i, i + size).join(' '))
  }
  return result
}

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0
  let intersection = 0
  for (const item of a) {
    if (b.has(item)) intersection += 1
  }
  return intersection / (a.size + b.size - intersection)
}

const firstMatch = (html, re) => {
  const match = html.match(re)
  return match ? stripHtml(match[1] || match[0]) : ''
}

const attrMatch = (html, re) => {
  const match = html.match(re)
  return match ? match[1] : ''
}

const parseSections = (html) => {
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || html
  const sections = []
  for (const match of main.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)) {
    const attrs = match[1]
    const body = match[2]
    const className = attrMatch(attrs, /class="([^"]*)"/i)
    const id = attrMatch(attrs, /id="([^"]*)"/i)
    const aria = attrMatch(attrs, /aria-label="([^"]*)"/i)
    const text = stripHtml(body)
    const h2 = firstMatch(body, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i)
    const key = className || id || aria || 'section'
    const ignored = /mr-cities|data-contact-section|contact|anfrage/.test(`${className} ${id} ${attrs}`)
    sections.push({ key, h2, text, ignored })
  }
  return sections
}

const classifyScope = (slug, cityTokens, standaloneFiles) => {
  const city = cityTokens.find((token) => slug.endsWith(`-${token}`) || slug.includes(`-${token}-`))
  if (city) return { city, label: cityLabels[city] || city, kind: 'lokal' }
  if (standaloneFiles.has(`${slug}.html`)) return { city: '', label: 'ueberregional', kind: 'standalone-keyword' }
  return { city: 'duesseldorf', label: 'Duesseldorf', kind: 'parent-or-default' }
}

const familyForPrefix = (prefix, families) => families.find((entry) => entry.prefixes.includes(prefix))?.family || 'unbekannt'

const prefixForSlug = (slug, prefixes) =>
  [...prefixes].sort((a, b) => b.length - a.length).find((prefix) => slug === prefix || slug.startsWith(`${prefix}-`)) || ''

const riskFor = ({ prefix, scope, family, titleUnique, canonicalOk, h1Unique, sectionSimilarity, sectionPattern }) => {
  if (!canonicalOk || !titleUnique) return 'hoch'
  if (sectionRichPrefixes.has(prefix)) return h1Unique ? 'niedrig' : 'mittel'
  if (scope.kind === 'lokal' && ['automobil-fotografie', 'sportwagen-fotografie', 'oldtimer-fotografie', 'motorrad-fotografie', 'portraitfotografie', 'landschaftsfotografie'].includes(prefix)) {
    return priorityCities.has(scope.city) ? 'mittel' : 'mittel-niedrig'
  }
  if (plannedButNotDeepPrefixes.has(prefix)) return 'hoch'
  if (sectionPattern === 'gleiches Layout + kaum eigene Mitteltexte' || sectionSimilarity >= 0.74) return 'hoch'
  if (family === 'landschaft' || family === 'oldtimer' || family === 'motorrad') return 'mittel'
  return 'mittel-hoch'
}

const statusTextFor = ({ prefix, scope, family, sectionSimilarity }) => {
  if (sectionRichPrefixes.has(prefix)) return 'eigene Sektionstexte'
  if (scope.kind === 'lokal' && ['automobil-fotografie', 'sportwagen-fotografie', 'oldtimer-fotografie', 'motorrad-fotografie', 'portraitfotografie', 'landschaftsfotografie'].includes(prefix)) {
    return 'gleiches Layout, lokale Mitteltexte'
  }
  if (plannedButNotDeepPrefixes.has(prefix)) return 'bestehende Seite, tiefer Copy-Ausbau offen'
  if (sectionSimilarity >= 0.74) return 'gleiches Layout + kaum eigene Mitteltexte'
  if (family === 'landschaft') return 'Print-Intent vorhanden, aber Ratgeber-Copy offen'
  return 'gleiches Layout, Intent-Copy ausbauen'
}

const todoFor = ({ prefix, scope, risk, statusText }) => {
  if (sectionRichPrefixes.has(prefix)) {
    return scope.kind === 'lokal'
      ? 'bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen'
      : 'H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique'
  }
  if (risk === 'niedrig') return 'beobachten, spaeter CMS-Feinschliff'
  if (statusText === 'gleiches Layout, lokale Mitteltexte') {
    return priorityCities.has(scope.city)
      ? '1-2 echte Orts-/Referenzabschnitte fuer Prioritaetsstadt ergaenzen'
      : 'vorerst okay, erst bei Impressionen weiter individualisieren'
  }
  if (plannedButNotDeepPrefixes.has(prefix)) return 'eigene Module/FAQ/Use-Cases pro Suchintent erstellen'
  if (prefix.includes('verkaufsfotos') || prefix.includes('autohaus')) return 'Verkauf/Auktion/Haendler-Prozess klar trennen'
  if (prefix.includes('shooting') || prefix.includes('fotoshooting')) return 'Shooting-Ablauf, Zielgruppe und FAQ intent-spezifisch schreiben'
  if (prefix.includes('prints') || prefix.includes('wandbilder') || prefix.includes('landschaftsbilder')) return 'Print-/Material-/Raumwirkung als eigene Ratgeberseite ausbauen'
  return 'eigene Mittel-Sektionen, FAQ und interne Links passend zum Keyword ergaenzen'
}

const main = async () => {
  const layoutSource = await readFile(path.join(srcDir, 'localSeoLayoutFamilies.ts'), 'utf8')
  const adoptedSource = await readFile(path.join(srcDir, 'adoptedRoutes.ts'), 'utf8')
  const familyContentSource = await readFile(path.join(srcDir, 'localSeoFamilyContent.ts'), 'utf8')

  const families = parseFamilies(layoutSource)
  const generatedRichPrefixes = [...familyContentSource.matchAll(/^\s*'([^']+)':\s*(?:simpleKeywordCopy|\{)/gm)]
    .map((match) => match[1])
    .filter((prefix) => prefix.includes('-') || /^[a-z]+$/.test(prefix))
  sectionRichPrefixes = new Set([...sectionRichPrefixes, ...generatedRichPrefixes])
  const prefixes = families.flatMap((entry) => entry.prefixes)
  const cityTokens = pickArray(layoutSource, 'localSeoCityTokens')
  const fullScopePrefixes = pickArray(adoptedSource, 'fullScopeLocalSeoPrefixes')
  const duesseldorfScopedPrefixes = pickArray(adoptedSource, 'duesseldorfScopedKeywordPrefixes')
  const standaloneKeywordFiles = new Set(pickArray(adoptedSource, 'standaloneKeywordFiles'))
  const specialScopedKeywordFiles = pickArray(adoptedSource, 'specialScopedKeywordFiles')

  const files = [
    ...fullScopePrefixes.flatMap((prefix) => [`${prefix}.html`, ...cityTokens.map((city) => `${prefix}-${city}.html`)]),
    ...duesseldorfScopedPrefixes.map((prefix) => `${prefix}-duesseldorf.html`),
    ...standaloneKeywordFiles,
    ...specialScopedKeywordFiles,
  ]

  const uniqueFiles = [...new Set(files)].sort((a, b) => a.localeCompare(b))
  const pages = []

  for (const file of uniqueFiles) {
    const htmlPath = path.join(distDir, file, 'index.html')
    let html = ''
    try {
      html = await readFile(htmlPath, 'utf8')
    } catch {
      pages.push({ file, missing: true })
      continue
    }

    const slug = file.replace(/\.html$/i, '')
    const prefix = prefixForSlug(slug, prefixes)
    const family = familyForPrefix(prefix, families)
    const scope = classifyScope(slug, cityTokens, standaloneKeywordFiles)
    const sections = parseSections(html)
    const contentSections = sections.filter((section) => !section.ignored)
    const mainText = contentSections.map((section) => `${section.h2} ${section.text}`).join(' ')

    pages.push({
      canonical: attrMatch(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i),
      description: attrMatch(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
      family,
      file,
      h1: firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
      mainText,
      prefix,
      scope,
      sectionHeadings: contentSections.map((section) => section.h2).filter(Boolean),
      sectionKeys: contentSections.map((section) => section.key.split(/\s+/)[0]).join(' > '),
      sectionCount: contentSections.length,
      shingles: shingles(mainText),
      title: firstMatch(html, /<title>([\s\S]*?)<\/title>/i),
      url: `${siteOrigin}/${file}`,
    })
  }

  const titleCounts = new Map()
  const h1Counts = new Map()
  for (const page of pages.filter((page) => !page.missing)) {
    titleCounts.set(page.title, (titleCounts.get(page.title) || 0) + 1)
    h1Counts.set(page.h1, (h1Counts.get(page.h1) || 0) + 1)
  }

  const baselineByPrefix = new Map()
  for (const page of pages.filter((entry) => !entry.missing)) {
    if (!baselineByPrefix.has(page.prefix) || page.scope.city === 'duesseldorf' || page.scope.kind === 'standalone-keyword') {
      baselineByPrefix.set(page.prefix, page)
    }
  }

  const rows = pages.map((page) => {
    if (page.missing) {
      return {
        ...page,
        canonicalStatus: 'fehlt',
        h1Status: 'fehlt',
        risk: 'hoch',
        sectionSimilarity: 0,
        statusText: 'HTML fehlt',
        titleStatus: 'fehlt',
        todo: 'Route/Build pruefen',
      }
    }

    const baseline = baselineByPrefix.get(page.prefix)
    const sectionSimilarity = baseline && baseline.file !== page.file ? jaccard(page.shingles, baseline.shingles) : 1
    const titleUnique = titleCounts.get(page.title) === 1
    const canonicalOk = page.canonical === page.url
    const h1Unique = h1Counts.get(page.h1) === 1
    const sectionPattern = statusTextFor({ ...page, sectionSimilarity })
    const risk = riskFor({
      ...page,
      canonicalOk,
      h1Unique,
      sectionPattern,
      sectionSimilarity,
      titleUnique,
    })

    return {
      ...page,
      canonicalStatus: canonicalOk ? 'ok' : 'pruefen',
      h1Status: h1Unique ? 'unique' : 'geteilt',
      risk,
      sectionSimilarity,
      statusText: sectionPattern,
      titleStatus: titleUnique ? 'unique' : 'doppelt',
      todo: todoFor({ ...page, risk, statusText: sectionPattern }),
    }
  })

  const byRisk = rows.reduce((acc, row) => {
    acc[row.risk] = (acc[row.risk] || 0) + 1
    return acc
  }, {})

  const canonicalProblems = rows.filter((row) => row.canonicalStatus !== 'ok')
  const titleProblems = rows.filter((row) => row.titleStatus !== 'unique')
  const highRows = rows.filter((row) => row.risk === 'hoch')
  const richRows = rows.filter((row) => sectionRichPrefixes.has(row.prefix))

  const rowLine = (row) => [
    `\`${row.file}\``,
    row.family,
    row.scope.kind === 'lokal' ? row.scope.label : row.scope.kind,
    row.titleStatus,
    row.canonicalStatus,
    row.h1Status,
    row.statusText,
    row.sectionSimilarity === 1 ? 'Basis' : `${Math.round(row.sectionSimilarity * 100)}%`,
    row.risk,
    row.todo,
  ].map((cell) => String(cell).replace(/\|/g, '\\|')).join(' | ')

  const familySections = families.map(({ family }) => {
    const familyRows = rows.filter((row) => row.family === family)
    return [
      `## ${family[0].toUpperCase()}${family.slice(1)}`,
      '',
      '| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |',
      '|---|---|---|---|---|---|---|---:|---|---|',
      ...familyRows.map((row) => `| ${rowLine(row)} |`),
      '',
    ].join('\n')
  })

  const summaryLines = [
    '# Local-SEO Duplicate- und Kannibalisierungs-Audit',
    '',
    'Stand: 2026-05-31',
    '',
    'Ziel: Alle lokalen Seiten, Keyword-Zusatzseiten und bereits vorhandenen Local-SEO-Varianten werden darauf geprueft, ob sie nur URL-/Ortsvarianten sind oder ob Title, Canonical, H1, Sektionen und Textsignale klar genug auseinanderlaufen.',
    '',
    '## Kurzbefund',
    '',
    `- Gepruefte Local-/Keyword-Seiten: ${rows.length}`,
    `- Title-Duplikate: ${titleProblems.length}`,
    `- Canonical-Probleme: ${canonicalProblems.length}`,
    `- Seiten mit bereits ausgebauten Unique-Sektionen: ${richRows.length}`,
    `- Risikoverteilung: ${Object.entries(byRisk).map(([risk, count]) => `${risk}: ${count}`).join(', ')}`,
    '',
    'Wichtig: Gleiche Layouts sind fuer Clusterseiten nicht automatisch ein Problem. Kritisch wird es erst, wenn Title/H1/Canonical und die sichtbaren Mittel-Sektionen nur minimal variieren. Die Tabelle trennt deshalb zwischen "gleiches Layout, lokale Mitteltexte" und "gleiches Layout + kaum eigene Mitteltexte".',
    '',
    '## Sofortige SEO-Regeln',
    '',
    '1. Jede indexierbare Seite braucht einen eigenen Canonical auf sich selbst.',
    '2. Jede Seite braucht einen eigenen Title, idealerweise mit Intent und Ort nur dort, wo Ort wirklich der Intent ist.',
    '3. H1 darf im Cluster aehnlich sein, sollte bei Keywordseiten aber mittelfristig den Suchintent nennen.',
    '4. Prioritaetsseiten duerfen nicht nur andere URLs haben. Sie brauchen eigene Mittel-Sektionen, Zielgruppen, Ablauf-/FAQ-Logik und interne Links.',
    '5. Lokale Seiten duerfen das gleiche Grundlayout nutzen, brauchen aber fuer Prioritaetsorte echte Orts-/Projekt-/Logistik-Abschnitte.',
    '',
    '## Hohe Risiken Zuerst',
    '',
    '| Seite | Familie | Scope | Status | To-do |',
    '|---|---|---|---|---|',
    ...highRows.map((row) => `| \`${row.file}\` | ${row.family} | ${row.scope.label || row.scope.kind} | ${row.statusText} | ${row.todo} |`),
    '',
    ...familySections,
  ]

  await writeFile(reportPath, `${summaryLines.join('\n')}\n`, 'utf8')
  console.log(`Wrote ${reportPath}`)
  console.log(JSON.stringify({ pages: rows.length, byRisk, titleProblems: titleProblems.length, canonicalProblems: canonicalProblems.length, richRows: richRows.length }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
