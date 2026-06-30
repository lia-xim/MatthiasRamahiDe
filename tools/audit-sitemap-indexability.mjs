import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultReportPath = path.join(root, 'docs/seo-sitemap-indexability-audit.md')
const productionOrigin = 'https://matthiasramahi.de'

const args = process.argv.slice(2)

const readArg = (name) => {
  const index = args.indexOf(name)
  if (index === -1) return ''
  return args[index + 1] || ''
}

const origin = (readArg('--origin') || process.env.SITEMAP_AUDIT_ORIGIN || '').replace(/\/+$/, '')
const reportPath = readArg('--report') || defaultReportPath
const strict = args.includes('--strict') || process.env.SITEMAP_AUDIT_STRICT === '1'

if (!origin) {
  throw new Error('Missing --origin or SITEMAP_AUDIT_ORIGIN, for example --origin http://127.0.0.1:4321')
}

const normalizeUrl = (value) => {
  try {
    const url = new URL(value)
    url.hash = ''
    return url.toString()
  } catch {
    return String(value || '').trim()
  }
}

const localUrlForProductionUrl = (value) => {
  const url = new URL(value)
  return `${origin}${url.pathname}${url.search}`
}

const stripHtml = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const firstMatch = (value, re) => value.match(re)?.[1] || ''

const fetchText = async (url) => {
  const response = await fetch(url, { redirect: 'manual' })
  return { response, text: await response.text() }
}

const locsFromXml = (xml) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim()).filter(Boolean)

const readSitemapUrls = async () => {
  const { response, text } = await fetchText(`${origin}/sitemap.xml`)
  if (!response.ok) throw new Error(`Could not fetch sitemap index: ${response.status}`)

  const childSitemaps = locsFromXml(text)
    .filter((url) => !url.includes('sitemap-images.xml'))
    .map((url) => localUrlForProductionUrl(url))

  const sitemapRows = []
  const pageUrls = []
  for (const sitemapUrl of childSitemaps) {
    const { response: childResponse, text: childText } = await fetchText(sitemapUrl)
    const productionSitemapUrl = `${productionOrigin}${new URL(sitemapUrl).pathname}`
    const urls = childResponse.ok ? locsFromXml(childText) : []
    sitemapRows.push({
      status: childResponse.status,
      sitemap: productionSitemapUrl,
      urls: urls.length,
    })
    pageUrls.push(...urls)
  }

  return { pageUrls: [...new Set(pageUrls)].sort((a, b) => a.localeCompare(b)), sitemapRows }
}

const inspectPage = async (url) => {
  const localUrl = localUrlForProductionUrl(url)
  const response = await fetch(localUrl, { redirect: 'manual' })
  const row = {
    canonical: '',
    h1: '',
    indexable: false,
    location: response.headers.get('location') || '',
    noindex: /noindex/i.test(response.headers.get('x-robots-tag') || ''),
    problems: [],
    status: response.status,
    title: '',
    url,
  }

  if (response.status !== 200) {
    row.problems.push(`status-${response.status}`)
    if (row.location) row.problems.push('redirect-in-sitemap')
    return row
  }

  const html = await response.text()
  row.title = stripHtml(firstMatch(html, /<title>([\s\S]*?)<\/title>/i))
  row.h1 = stripHtml(firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i))
  row.canonical = firstMatch(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)
  row.noindex = row.noindex || /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)

  if (row.noindex) row.problems.push('noindex')
  if (!row.title) row.problems.push('missing-title')
  if (!row.h1) row.problems.push('missing-h1')
  if (!row.canonical) row.problems.push('missing-canonical')
  if (row.canonical && normalizeUrl(row.canonical) !== normalizeUrl(url)) row.problems.push('canonical-other')

  row.indexable = row.problems.length === 0
  return row
}

const countBy = (items, key) =>
  items.reduce((acc, item) => {
    const value = item[key] || 'unknown'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

const duplicateValues = (rows, key) => {
  const grouped = new Map()
  for (const row of rows) {
    const value = row[key]
    if (!value) continue
    if (!grouped.has(value)) grouped.set(value, [])
    grouped.get(value).push(row)
  }
  return [...grouped.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([value, items]) => ({ value, items }))
}

const markdownTable = (rows, columns) => {
  if (!rows.length) return '_Keine._'
  return [
    `| ${columns.map(([label]) => label).join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map(([, getter]) => String(getter(row) || '').replace(/\|/g, '\\|')).join(' | ')} |`),
  ].join('\n')
}

const main = async () => {
  const { pageUrls, sitemapRows } = await readSitemapUrls()
  const rows = []

  for (const url of pageUrls) {
    rows.push(await inspectPage(url))
  }

  const canonicalDuplicates = duplicateValues(rows, 'canonical')
  const titleDuplicates = duplicateValues(rows, 'title')
  const problemRows = rows.filter((row) => row.problems.length)
  const statusCounts = countBy(rows, 'status')

  const lines = [
    '# Sitemap Indexability Audit',
    '',
    'Stand: 2026-06-30',
    '',
    `Quelle: normale Sitemap-URLs von \`${origin}/sitemap.xml\`, Bild-Sitemap ausgeschlossen.`,
    '',
    '## Kurzbefund',
    '',
    `- Normale Sitemap-URLs: ${rows.length}`,
    `- Indexierbare 200er mit Self-Canonical: ${rows.filter((row) => row.indexable).length}`,
    `- Technische Problemfaelle: ${problemRows.length}`,
    `- Doppelte Canonicals: ${canonicalDuplicates.length}`,
    `- Doppelte Titles: ${titleDuplicates.length}`,
    `- Statuscodes: ${Object.entries(statusCounts).map(([status, count]) => `${status}: ${count}`).join(', ')}`,
    '',
    '## Sitemap-Dateien',
    '',
    markdownTable(sitemapRows, [
      ['Sitemap', (row) => row.sitemap],
      ['Status', (row) => row.status],
      ['URLs', (row) => row.urls],
    ]),
    '',
    '## Technische Problemfaelle',
    '',
    markdownTable(problemRows, [
      ['URL', (row) => row.url],
      ['Status', (row) => row.status],
      ['Probleme', (row) => row.problems.join(', ')],
      ['Canonical/Location', (row) => row.canonical || row.location],
    ]),
    '',
    '## Doppelte Canonicals',
    '',
    markdownTable(canonicalDuplicates, [
      ['Canonical', (row) => row.value],
      ['URLs', (row) => row.items.map((item) => item.url).join('<br>')],
    ]),
    '',
    '## Doppelte Titles',
    '',
    markdownTable(titleDuplicates, [
      ['Title', (row) => row.value],
      ['URLs', (row) => row.items.map((item) => item.url).join('<br>')],
    ]),
    '',
  ]

  await mkdir(path.dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${lines.join('\n')}\n`)
  console.log(JSON.stringify({
    canonicalDuplicates: canonicalDuplicates.length,
    indexable: rows.filter((row) => row.indexable).length,
    problemRows: problemRows.length,
    reportPath,
    rows: rows.length,
    statusCounts,
    strict,
    titleDuplicates: titleDuplicates.length,
  }, null, 2))

  if (strict && (problemRows.length || canonicalDuplicates.length || titleDuplicates.length)) {
    process.exitCode = 1
  }
}

await main()
