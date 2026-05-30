import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd())
const legacyReferenceRoot = path.join(repoRoot, 'legacy-reference', 'html')
const outputPath = path.join(repoRoot, 'docs', 'legacy-reference-manifest.json')
const checkMode = process.argv.includes('--check')

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

async function buildManifest() {
  const htmlFiles = (await fs.readdir(legacyReferenceRoot))
    .filter((file) => file.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b))

  const entries = []

  for (const file of htmlFiles) {
    const absolutePath = path.join(legacyReferenceRoot, file)
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
      title,
      description,
      h1,
      canonicalUrl,
    })
  }

  return {
    generatedAt: new Date().toISOString(),
    description:
      'Archived legacy HTML files frozen as the visual reference for the Astro/Payload migration. These files live under legacy-reference/html and must not be served as production routes.',
    totals: {
      htmlFiles: entries.length,
      byType: entries.reduce((acc, entry) => {
        acc[entry.type] = (acc[entry.type] || 0) + 1
        return acc
      }, {}),
    },
    entries,
  }
}

function comparableManifest(manifest) {
  return {
    description: manifest.description,
    totals: manifest.totals,
    entries: (manifest.entries || []).map(({ mtime, ...entry }) => entry),
  }
}

function explainDiff(expected, actual) {
  const expectedEntries = new Map((expected.entries || []).map((entry) => [entry.file, entry]))
  const actualEntries = new Map((actual.entries || []).map((entry) => [entry.file, entry]))
  const missing = [...expectedEntries.keys()].filter((file) => !actualEntries.has(file))
  const added = [...actualEntries.keys()].filter((file) => !expectedEntries.has(file))
  const changed = [...actualEntries.keys()].filter((file) => {
    if (!expectedEntries.has(file)) return false
    return JSON.stringify(expectedEntries.get(file)) !== JSON.stringify(actualEntries.get(file))
  })

  return { added, changed, missing }
}

const manifest = await buildManifest()

if (checkMode) {
  const existing = JSON.parse(await fs.readFile(outputPath, 'utf8'))
  const expected = comparableManifest(existing)
  const actual = comparableManifest(manifest)

  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    const diff = explainDiff(expected, actual)
    console.error('Legacy reference manifest is stale. Run `corepack pnpm legacy:freeze` after deliberately accepting the archived legacy HTML baseline.')
    if (diff.added.length > 0) console.error(`Added archived HTML files: ${diff.added.slice(0, 20).join(', ')}`)
    if (diff.missing.length > 0) console.error(`Missing archived HTML files: ${diff.missing.slice(0, 20).join(', ')}`)
    if (diff.changed.length > 0) console.error(`Changed archived HTML files: ${diff.changed.slice(0, 20).join(', ')}`)
    process.exit(1)
  }

  console.log(`Legacy reference manifest is current (${manifest.entries.length} HTML files).`)
} else {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(`Legacy reference manifest written to ${outputPath}`)
  console.log(`Frozen ${manifest.entries.length} HTML files.`)
}
