const DEFAULT_SITEMAP = 'https://matthiasramahi.de/sitemap.xml'
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow'
const DEFAULT_KEY = '6264b9277eabe63e38ded00c923c2480'

const args = process.argv.slice(2)

function option(name, fallback = '') {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || process.env[`INDEXNOW_${name.toUpperCase().replaceAll('-', '_')}`] || fallback
}

function chunk(items, size) {
  const chunks = []
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size))
  return chunks
}

async function fetchText(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  return response.text()
}

function locsFromXml(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim()).filter(Boolean)
}

async function collectUrls(sitemapUrl) {
  const xml = await fetchText(sitemapUrl)
  const locs = locsFromXml(xml)
  const sitemapLocs = locs.filter((loc) => /\.xml(?:$|[?#])/i.test(new URL(loc).pathname))
  const pageLocs = locs.filter((loc) => !/\.xml(?:$|[?#])/i.test(new URL(loc).pathname))

  for (const nested of sitemapLocs) {
    const nestedXml = await fetchText(nested)
    pageLocs.push(...locsFromXml(nestedXml).filter((loc) => !/\.xml(?:$|[?#])/i.test(new URL(loc).pathname)))
  }

  return [...new Set(pageLocs)].sort((a, b) => a.localeCompare(b))
}

const sitemapUrl = option('sitemap', DEFAULT_SITEMAP)
const endpoint = option('endpoint', DEFAULT_ENDPOINT)
const key = option('key', DEFAULT_KEY)
const host = option('host', new URL(sitemapUrl).hostname)
const keyLocation = option('key-location', `https://${host}/${key}.txt`)
const dryRun = args.includes('--dry-run')

const urls = await collectUrls(sitemapUrl)
const batches = chunk(urls, 10000)

console.log(JSON.stringify({ dryRun, endpoint, host, keyLocation, sitemapUrl, urls: urls.length, batches: batches.length }, null, 2))

if (dryRun) process.exit(0)

for (const [index, urlList] of batches.entries()) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  })

  const body = await response.text()
  console.log(JSON.stringify({ batch: index + 1, urls: urlList.length, status: response.status, body: body.slice(0, 300) }))

  if (!response.ok && response.status !== 202) process.exitCode = 1
}
