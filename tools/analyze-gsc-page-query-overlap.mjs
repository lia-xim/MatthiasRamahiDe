import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const argValue = (name, fallback = '') => {
  const inline = args.find((item) => item.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] || fallback : fallback
}

const inputPath = argValue('--input')
const reportPath = argValue('--report', '.tmp/seo/gsc-page-query-overlap.md')

if (!inputPath) {
  console.error(
    'Usage: node tools/analyze-gsc-page-query-overlap.mjs --input <page-query.csv> [--report <report.md>]',
  )
  process.exit(2)
}

const headerAliases = {
  page: ['page', 'seite', 'landing page', 'landingpage', 'url'],
  query: ['query', 'suchanfrage', 'suchanfragen', 'keyword'],
  clicks: ['clicks', 'klicks'],
  impressions: ['impressions', 'impressionen'],
  ctr: ['ctr', 'click through rate', 'klickrate'],
  position: ['position', 'durchschnittliche position', 'average position'],
}

const reviewGroups = [
  {
    id: 'automobil-synonyme',
    label: 'Automobil: Autofotografie / Fahrzeugfotografie / Fotoshooting mit Auto',
    pages: ['/autofotografie.html', '/fahrzeugfotografie.html', '/fotoshooting-mit-auto.html'],
  },
  {
    id: 'sportwagen-shooting',
    label: 'Sportwagen: Shooting / Fotoshooting Düsseldorf',
    pages: ['/sportwagen-shooting-duesseldorf.html', '/sportwagen-fotoshooting-duesseldorf.html'],
  },
  {
    id: 'motorrad-bike',
    label: 'Motorrad: Pillar / Bike-Fotografie',
    pages: ['/motorrad-fotografie.html', '/bike-fotografie.html'],
  },
  {
    id: 'landschaft-staedte',
    label: 'Landschaft: bestehende Stadtvarianten',
    pagePattern: /^\/landschaftsfotografie-(?!print-deutschland)[a-z-]+\.html$/,
  },
]

const normalizeHeader = (value) =>
  String(value || '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLocaleLowerCase('de-DE')

const normalizePage = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  try {
    const url = new URL(raw, 'https://matthiasramahi.de')
    return url.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return raw.split(/[?#]/, 1)[0].replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '') || '/'
  }
}

const parseNumber = (value) => {
  let text = String(value || '').trim().replace(/\s/g, '').replace(/%$/, '')
  if (!text) return 0
  if (/^-?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(text)) text = text.replace(/\./g, '').replace(',', '.')
  else if (/^-?\d+(?:,\d+)?$/.test(text)) text = text.replace(',', '.')
  const number = Number(text)
  return Number.isFinite(number) ? number : 0
}

const detectDelimiter = (text) => {
  const firstLine = text.split(/\r?\n/, 1)[0] || ''
  const counts = { ',': 0, ';': 0, '\t': 0 }
  let quoted = false
  for (let index = 0; index < firstLine.length; index += 1) {
    const char = firstLine[index]
    if (char === '"') quoted = !quoted
    else if (!quoted && Object.hasOwn(counts, char)) counts[char] += 1
  }
  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0][0]
}

const parseDelimited = (text, delimiter) => {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]
    if (quoted && char === '"' && next === '"') {
      field += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (!quoted && char === delimiter) {
      row.push(field)
      field = ''
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') index += 1
      row.push(field)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  row.push(field)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

const source = await fs.readFile(path.resolve(inputPath), 'utf8')
const parsed = parseDelimited(source, detectDelimiter(source))
if (parsed.length < 2) throw new Error('Der Export enthaelt keine Datenzeilen.')

const headers = parsed[0].map(normalizeHeader)
const columnIndex = {}
for (const [key, aliases] of Object.entries(headerAliases)) {
  columnIndex[key] = headers.findIndex((header) => aliases.includes(header))
}
for (const required of ['page', 'query', 'clicks', 'impressions', 'position']) {
  if (columnIndex[required] < 0) {
    throw new Error(`Pflichtspalte fehlt: ${required}. Gefunden: ${headers.join(', ')}`)
  }
}

const rows = parsed
  .slice(1)
  .map((values) => ({
    page: normalizePage(values[columnIndex.page]),
    query: String(values[columnIndex.query] || '').trim().toLocaleLowerCase('de-DE'),
    clicks: parseNumber(values[columnIndex.clicks]),
    impressions: parseNumber(values[columnIndex.impressions]),
    ctr: columnIndex.ctr >= 0 ? parseNumber(values[columnIndex.ctr]) : 0,
    position: parseNumber(values[columnIndex.position]),
  }))
  .filter((row) => row.page && row.query)

const formatNumber = (value, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits }).format(value)
const formatPercent = (value) => `${formatNumber(value * 100, 1)} %`
const markdownCell = (value) => String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')

const reports = reviewGroups.map((group) => {
  const pages = group.pages || [...new Set(rows.filter((row) => group.pagePattern.test(row.page)).map((row) => row.page))].sort()
  const pageData = new Map(
    pages.map((page) => {
      const pageRows = rows.filter((row) => row.page === page)
      const queryMap = new Map()
      for (const row of pageRows) {
        const current = queryMap.get(row.query) || { clicks: 0, impressions: 0, weightedPosition: 0 }
        current.clicks += row.clicks
        current.impressions += row.impressions
        current.weightedPosition += row.position * row.impressions
        queryMap.set(row.query, current)
      }
      return [page, queryMap]
    }),
  )
  const pairs = []

  for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
      const leftPage = pages[leftIndex]
      const rightPage = pages[rightIndex]
      const leftQueries = pageData.get(leftPage) || new Map()
      const rightQueries = pageData.get(rightPage) || new Map()
      const leftSet = new Set(leftQueries.keys())
      const rightSet = new Set(rightQueries.keys())
      const shared = [...leftSet].filter((query) => rightSet.has(query))
      const union = new Set([...leftSet, ...rightSet])
      const leftImpressions = [...leftQueries.values()].reduce((sum, item) => sum + item.impressions, 0)
      const rightImpressions = [...rightQueries.values()].reduce((sum, item) => sum + item.impressions, 0)
      const sharedImpressions = shared.reduce(
        (sum, query) =>
          sum + Math.min(leftQueries.get(query)?.impressions || 0, rightQueries.get(query)?.impressions || 0),
        0,
      )
      const smallerDemand = Math.min(leftImpressions, rightImpressions)
      pairs.push({
        leftPage,
        rightPage,
        sharedQueries: shared.length,
        queryJaccard: union.size ? shared.length / union.size : 0,
        smallerPageCoverage: smallerDemand ? sharedImpressions / smallerDemand : 0,
        sharedImpressions,
      })
    }
  }

  return { ...group, pageData, pages, pairs }
})

const output = [
  '# GSC Page-Query-Overlap',
  '',
  `Quelle: \`${path.resolve(inputPath)}\``,
  `Ausgewertete Zeilen: ${formatNumber(rows.length)}`,
  '',
  '> Dieser Report entscheidet keine Weiterleitung automatisch. Eine Konsolidierung braucht zusaetzlich mindestens 90 Tage Daten, Landingpage-Conversions, vorhandene Links und eine manuelle Intent-Pruefung.',
  '',
]

for (const report of reports) {
  output.push(`## ${report.label}`, '')
  output.push('| Seite | Queries | Klicks | Impressionen | gewichtete Position |', '|---|---:|---:|---:|---:|')
  for (const page of report.pages) {
    const queryMap = report.pageData.get(page) || new Map()
    const totals = [...queryMap.values()].reduce(
      (result, item) => ({
        clicks: result.clicks + item.clicks,
        impressions: result.impressions + item.impressions,
        weightedPosition: result.weightedPosition + item.weightedPosition,
      }),
      { clicks: 0, impressions: 0, weightedPosition: 0 },
    )
    const position = totals.impressions ? totals.weightedPosition / totals.impressions : 0
    output.push(
      `| \`${markdownCell(page)}\` | ${formatNumber(queryMap.size)} | ${formatNumber(totals.clicks)} | ${formatNumber(totals.impressions)} | ${formatNumber(position, 1)} |`,
    )
  }
  if (!report.pages.length) output.push('| _Keine passenden Seiten im Export_ | 0 | 0 | 0 | 0 |')
  output.push('')

  output.push('| Seitenpaar | gemeinsame Queries | Query-Jaccard | Abdeckung der kleineren Seite | gemeinsame Impressionen |', '|---|---:|---:|---:|---:|')
  for (const pair of report.pairs) {
    output.push(
      `| \`${markdownCell(pair.leftPage)}\` / \`${markdownCell(pair.rightPage)}\` | ${formatNumber(pair.sharedQueries)} | ${formatPercent(pair.queryJaccard)} | ${formatPercent(pair.smallerPageCoverage)} | ${formatNumber(pair.sharedImpressions)} |`,
    )
  }
  if (!report.pairs.length) output.push('| _Nicht genug Seiten mit Daten_ | 0 | 0 % | 0 % | 0 |')
  output.push('')
}

output.push(
  '## Entscheidungsregel',
  '',
  '1. Seiten nur als Konsolidierungskandidaten markieren, wenn die Abfragen semantisch dasselbe Anliegen ausdruecken und die kleinere Seite ueber mindestens 90 Tage keine eigene Conversion-Rolle zeigt.',
  '2. Hoher Jaccard allein reicht nicht. Links, qualifizierte Anfragen, Bildsichtbarkeit und die konkrete Seitenrolle muessen mitgeprueft werden.',
  '3. Bei Konsolidierung bleibt die staerkere, passendere Canonical-URL bestehen; die andere URL erhaelt genau einen dauerhaften Redirect und verschwindet aus Sitemap sowie interner Navigation.',
  '',
)

await fs.mkdir(path.dirname(path.resolve(reportPath)), { recursive: true })
await fs.writeFile(path.resolve(reportPath), `${output.join('\n')}\n`, 'utf8')
console.log(`GSC overlap report written: ${path.resolve(reportPath)}`)
