import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd())
const outputPath = path.join(repoRoot, 'docs', 'legacy-reference-manifest.json')
const htmlFiles = (await fs.readdir(repoRoot))
  .filter((file) => file.endsWith('.html'))
  .sort((a, b) => a.localeCompare(b))

const decodeEntities = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

const cleanText = (value = '') =>
  decodeEntities(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const attr = (tag, name) => tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1] || ''

const contentTypeFor = (file) => {
  if (file === 'index.html') return 'home'
  if (['portfolio.html', 'leistungen.html', 'contact.html', 'ueber-mich.html', 'blog.html'].includes(file)) {
    return 'core-page'
  }
  if (
    [
      'fotografie.html',
      'automobil-fotografie.html',
      'sportwagen-fotografie.html',
      'oldtimer-fotografie.html',
      'motorrad-fotografie.html',
      'portraitfotografie.html',
      'landschaftsfotografie.html',
    ].includes(file)
  ) {
    return 'photography-main'
  }
  if (file.startsWith('blog-')) return 'journal'
  if (/(duesseldorf|koeln|nrw|deutschland|bochum|essen|dortmund|neuss|krefeld|wuppertal|solingen|remscheid|moers|hilden|oberhausen|leverkusen|dormagen|mettmann|gelsenkirchen|bergisch-gladbach|moenchengladbach)/i.test(file)) {
    return 'local-seo'
  }
  return 'supporting-page'
}

const entries = []

for (const file of htmlFiles) {
  const absolutePath = path.join(repoRoot, file)
  const html = await fs.readFile(absolutePath, 'utf8')
  const stat = await fs.stat(absolutePath)
  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1])
  const description = cleanText(attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] || '', 'content'))
  const canonicalUrl = attr(html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || '', 'href')
  const h1 = cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1])
  const hash = crypto.createHash('sha256').update(html).digest('hex')

  entries.push({
    file,
    type: contentTypeFor(file),
    sha256: hash,
    bytes: stat.size,
    mtime: stat.mtime.toISOString(),
    title,
    description,
    h1,
    canonicalUrl,
  })
}

const manifest = {
  generatedAt: new Date().toISOString(),
  description:
    'Current root HTML files frozen as the visual reference for the Astro/Payload migration. Do not treat these files as deleted until their matching Astro/Payload route is adopted and verified.',
  totals: {
    htmlFiles: entries.length,
    byType: entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1
      return acc
    }, {}),
  },
  entries,
}

await fs.mkdir(path.dirname(outputPath), { recursive: true })
await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Legacy reference manifest written to ${outputPath}`)
console.log(`Frozen ${entries.length} HTML files.`)

