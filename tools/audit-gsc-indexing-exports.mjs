import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultReportPath = path.join(root, 'docs/seo-gsc-export-url-audit.md')
const productionOrigin = 'https://matthiasramahi.de'

const args = process.argv.slice(2)

const readArg = (name) => {
  const index = args.indexOf(name)
  if (index === -1) return ''
  return args[index + 1] || ''
}

const origin = (readArg('--origin') || process.env.GSC_AUDIT_ORIGIN || '').replace(/\/+$/, '')
const reportPath = readArg('--report') || defaultReportPath
const strict = args.includes('--strict') || process.env.GSC_AUDIT_STRICT === '1'
const auditDate = new Date().toISOString().slice(0, 10)

const readPositiveInteger = (name, envName, fallback, maximum) => {
  const raw = readArg(name) || process.env[envName] || String(fallback)
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1 || value > maximum) {
    throw new Error(`${name} must be an integer between 1 and ${maximum}`)
  }
  return value
}

const concurrency = readPositiveInteger('--concurrency', 'GSC_AUDIT_CONCURRENCY', 8, 32)
const requestTimeoutMs = readPositiveInteger('--request-timeout-ms', 'GSC_AUDIT_REQUEST_TIMEOUT_MS', 15_000, 120_000)

const exportsConfig = [
  ['Nicht gefunden (404)', readArg('--not-found')],
  ['Gecrawlt - zurzeit nicht indexiert', readArg('--crawled')],
  ['Gefunden - zurzeit nicht indexiert', readArg('--found')],
].filter(([, file]) => file)

if (!origin) {
  throw new Error('Missing --origin or GSC_AUDIT_ORIGIN, for example --origin http://127.0.0.1:4321')
}

if (!exportsConfig.length) {
  throw new Error('Pass at least one export file: --not-found, --crawled, --found')
}

const normalizeUrl = (value) => {
  try {
    const url = new URL(value)
    url.hash = ''
    return url.toString()
  } catch {
    return value.trim()
  }
}

const productionUrlForPath = (pathname) => `${productionOrigin}${pathname}`

const localUrlForProductionUrl = (value) => {
  const url = new URL(value)
  return `${origin}${url.pathname}${url.search}`
}

const relativeOrAbsoluteTarget = (location, sourceUrl) => {
  if (!location) return ''
  try {
    const source = new URL(sourceUrl)
    return new URL(location, `${source.origin}${source.pathname}`).toString()
  } catch {
    return location
  }
}

const stripHtml = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const firstMatch = (value, re) => value.match(re)?.[1] || ''
const fetchManual = (url) =>
  fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(requestTimeoutMs),
  })

const parseExportUrls = async (label, file) => {
  const text = await readFile(file, 'utf8')
  const urls = [...text.matchAll(/https:\/\/matthiasramahi\.de\/[^\s]+/g)]
    .map((match) => normalizeUrl(match[0].replace(/[\uE000-\uF8FF].*$/, '')))
    .filter(Boolean)

  return [...new Set(urls)].map((url) => ({ group: label, url }))
}

const inspectUrl = async (productionUrl) => {
  const localUrl = localUrlForProductionUrl(productionUrl)
  const response = await fetchManual(localUrl)
  const status = response.status
  const location = relativeOrAbsoluteTarget(response.headers.get('location') || '', productionUrl)
  const xRobots = response.headers.get('x-robots-tag') || ''
  const result = {
    canonical: '',
    classification: '',
    finalCanonical: '',
    finalStatus: '',
    finalUrl: '',
    location,
    noindex: /noindex/i.test(xRobots),
    status,
    title: '',
    xRobots,
  }

  if ([301, 302, 307, 308].includes(status)) {
    result.classification = 'redirect'
    if (location) {
      try {
        const targetUrl = new URL(location)
        const finalResponse = await fetchManual(`${origin}${targetUrl.pathname}${targetUrl.search}`)
        result.finalStatus = finalResponse.status
        result.finalUrl = location
        const finalXRobots = finalResponse.headers.get('x-robots-tag') || ''
        if (finalResponse.status === 200) {
          const html = await finalResponse.text()
          result.finalCanonical = firstMatch(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)
          result.noindex = /noindex/i.test(finalXRobots) || /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)
          result.title = stripHtml(firstMatch(html, /<title>([\s\S]*?)<\/title>/i))
          result.classification = result.noindex ? 'redirect-to-noindex' : 'redirect-to-indexable'
        } else if (finalResponse.status === 410) {
          result.classification = 'redirect-to-gone'
        } else if (finalResponse.status === 404) {
          result.classification = 'redirect-to-404'
        }
      } catch (error) {
        result.classification = `redirect-check-failed:${error.message}`
      }
    }
    return result
  }

  if (status === 410) {
    result.classification = 'gone-410'
    return result
  }

  if (status === 404) {
    result.classification = 'open-404'
    return result
  }

  if (status === 403) {
    result.classification = 'blocked-403'
    return result
  }

  if (status === 200) {
    const html = await response.text()
    result.canonical = firstMatch(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)
    result.noindex = result.noindex || /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)
    result.title = stripHtml(firstMatch(html, /<title>([\s\S]*?)<\/title>/i))
    if (result.noindex) {
      result.classification = 'noindex'
      return result
    }

    const expectedCanonical = productionUrlForPath(new URL(productionUrl).pathname)
    result.classification = result.canonical && normalizeUrl(result.canonical) !== normalizeUrl(expectedCanonical)
      ? 'canonical-other'
      : 'indexable-200'
    return result
  }

  result.classification = `status-${status}`
  return result
}

const inspectEntries = async (entries) => {
  const rows = new Array(entries.length)
  let nextIndex = 0

  const worker = async () => {
    while (nextIndex < entries.length) {
      const index = nextIndex
      nextIndex += 1
      const entry = entries[index]

      try {
        rows[index] = {
          ...entry,
          ...(await inspectUrl(entry.url)),
        }
      } catch (error) {
        rows[index] = {
          ...entry,
          canonical: '',
          classification: 'fetch-error',
          error: error instanceof Error ? error.message : String(error),
          finalCanonical: '',
          finalStatus: '',
          finalUrl: '',
          location: '',
          noindex: false,
          status: '',
          title: '',
          xRobots: '',
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, () => worker()))
  return rows
}

const countBy = (items, key) =>
  items.reduce((acc, item) => {
    const value = item[key] || 'unknown'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

const markdownTable = (rows, columns) => {
  if (!rows.length) return '_Keine._'
  return [
    `| ${columns.map(([label]) => label).join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map(([, getter]) => String(getter(row) || '').replace(/\|/g, '\\|')).join(' | ')} |`),
  ].join('\n')
}

const main = async () => {
  const entries = (await Promise.all(exportsConfig.map(([label, file]) => parseExportUrls(label, file)))).flat()
  const rows = await inspectEntries(entries)

  const byGroup = Object.groupBy(rows, (row) => row.group)
  const acceptableClassifications = new Set(['gone-410', 'indexable-200', 'redirect-to-indexable'])
  const problematic = rows.filter((row) => !acceptableClassifications.has(row.classification))
  const currentIndexableFromFound = rows.filter((row) => row.group.startsWith('Gefunden') && row.classification === 'indexable-200')

  const lines = [
    '# GSC Export URL Audit',
    '',
    `Stand: ${auditDate}`,
    '',
    `Quelle: HTTP-Antworten von \`${origin}\` fuer exportierte Search-Console-URLs.`,
    `Pruefung: ${concurrency} parallele Requests, ${requestTimeoutMs} ms Timeout pro Request.`,
    '',
    '## Kurzbefund',
    '',
    `- Gepruefte URL-Eintraege: ${rows.length}`,
    `- Eindeutige URLs: ${new Set(rows.map((row) => row.url)).size}`,
    `- Offene technische Problemfaelle: ${problematic.length}`,
    `- Aktuelle 200/indexierbare URLs aus "Gefunden": ${currentIndexableFromFound.length}`,
    '',
    '## Gruppen',
    '',
    ...Object.entries(byGroup).flatMap(([group, groupRows]) => [
      `### ${group}`,
      '',
      `- URLs: ${groupRows.length}`,
      `- Klassifikation: ${Object.entries(countBy(groupRows, 'classification')).map(([name, count]) => `${name}: ${count}`).join(', ')}`,
      '',
    ]),
    '## Offene technische Problemfaelle',
    '',
    markdownTable(problematic, [
      ['GSC-Gruppe', (row) => row.group],
      ['URL', (row) => row.url],
      ['Status', (row) => row.status],
      ['Klasse', (row) => row.classification],
      ['Location/Canonical/Fehler', (row) => row.location || row.canonical || row.error],
    ]),
    '',
    '## Redirect-Beispiele',
    '',
    markdownTable(rows.filter((row) => row.classification.startsWith('redirect')).slice(0, 40), [
      ['GSC-Gruppe', (row) => row.group],
      ['URL', (row) => row.url],
      ['Status', (row) => row.status],
      ['Ziel', (row) => row.location],
      ['Final', (row) => row.finalStatus],
    ]),
    '',
    '## Aktuelle indexierbare URLs aus "Gefunden"',
    '',
    markdownTable(currentIndexableFromFound.slice(0, 80), [
      ['URL', (row) => row.url],
      ['Canonical', (row) => row.canonical],
      ['Title', (row) => row.title],
    ]),
    '',
  ]

  await mkdir(path.dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${lines.join('\n')}\n`)
  console.log(JSON.stringify({
    byClassification: countBy(rows, 'classification'),
    byGroup: Object.fromEntries(Object.entries(byGroup).map(([group, groupRows]) => [group, countBy(groupRows, 'classification')])),
    concurrency,
    problematic: problematic.length,
    reportPath,
    requestTimeoutMs,
    rows: rows.length,
    strict,
  }, null, 2))

  if (strict && problematic.length) {
    process.exitCode = 1
  }
}

await main()
