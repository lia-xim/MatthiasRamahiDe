import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://matthiasramahi.de'

const args = new Set(process.argv.slice(2))
const targetArg = process.argv.find((arg) => arg.startsWith('--target='))
const target = path.resolve(ROOT, targetArg ? targetArg.split('=').slice(1).join('=') : '.')
const strict = args.has('--strict')

const htmlExtensions = new Set(['.html', ''])
const assetExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.mp4', '.webm'])

const stripTags = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(fullPath, files)
    else files.push(fullPath)
  }
  return files
}

function htmlFiles() {
  return walk(target).filter((file) => {
    const rel = path.relative(target, file)
    if (rel.includes(`${path.sep}dist${path.sep}server${path.sep}`)) return false
    if (path.extname(file) === '.html') return true
    if (htmlExtensions.has(path.extname(file))) {
      try {
        return fs.readFileSync(file, 'utf8').includes('<html')
      } catch {
        return false
      }
    }
    return false
  })
}

function attrFromTag(tag, attr) {
  return tag?.match(new RegExp(`\\b${attr}=["']([^"']*)["']`, 'i'))?.[1] || ''
}

function metaContent(html, key, type = 'name') {
  const tag = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${type}=["']${key}["'])[^>]*>`, 'i'))?.[0]
  return attrFromTag(tag, 'content')
}

function canonical(html) {
  const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0]
  return attrFromTag(tag, 'href')
}

function absoluteUrlForRel(rel) {
  const clean = rel.replace(/\\/g, '/')
  if (clean === 'index.html') return `${SITE}/`
  if (clean.endsWith('.html/index.html')) return `${SITE}/${clean.replace(/\/index\.html$/, '')}`
  if (clean.endsWith('/index.html')) return `${SITE}/${clean.replace(/\/index\.html$/, '/')}`
  return `${SITE}/${clean}`
}

function title(html) {
  return stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
}

function refsFrom(html) {
  const refs = []
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"'#?]+)(?:[#?][^"']*)?["']/gi)) {
    const url = match[1]
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(url) || url.startsWith('//')) continue
    if (/[+"']/.test(url)) continue
    refs.push(url)
  }
  for (const match of html.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^'")]+))\s*\)/gi)) {
    const url = (match[1] || match[2] || match[3] || '').trim()
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(url) || url.startsWith('//')) continue
    if (/[+"']/.test(url)) continue
    refs.push(url)
  }
  return refs
}

function existsRef(fromFile, ref) {
  const base = ref.startsWith('/') ? target : path.dirname(fromFile)
  let clean = ref.startsWith('/') ? ref.replace(/^\/+/, '') : ref
  try {
    clean = decodeURIComponent(clean)
  } catch {
    // Keep the original reference if it is not URI-encoded cleanly.
  }
  const candidates = [
    path.resolve(base, clean),
    path.resolve(base, `${clean}.html`),
    path.resolve(base, clean, 'index.html'),
    path.resolve(target, clean),
    path.resolve(target, `${clean}.html`),
    path.resolve(target, clean, 'index.html'),
  ]
  return candidates.some((candidate) => fs.existsSync(candidate))
}

function auditHtml() {
  const rows = htmlFiles().map((file) => {
    const html = fs.readFileSync(file, 'utf8')
    const robots = metaContent(html, 'robots')
    return {
      file,
      rel: path.relative(target, file).replace(/\\/g, '/'),
      html,
      title: title(html),
      description: metaContent(html, 'description'),
      canonical: canonical(html),
      robots,
      noindex: /noindex/i.test(robots),
      h1s: [...html.matchAll(/<h1\b/gi)].length,
      jsonLd: [...html.matchAll(/application\/ld\+json/gi)].length,
      ogImage: metaContent(html, 'og:image', 'property'),
    }
  })

  const byTitle = new Map()
  const byDescription = new Map()
  for (const row of rows.filter((row) => !row.noindex)) {
    if (row.title) byTitle.set(row.title, [...(byTitle.get(row.title) || []), row.rel])
    if (row.description) byDescription.set(row.description, [...(byDescription.get(row.description) || []), row.rel])
  }

  const broken = []
  const heavyRefs = []
  for (const row of rows) {
    for (const ref of refsFrom(row.html)) {
      if (!existsRef(row.file, ref)) broken.push({ from: row.rel, ref })
      const refPath = ref.startsWith('/') ? path.join(target, ref.replace(/^\/+/, '')) : path.resolve(path.dirname(row.file), ref)
      if (assetExtensions.has(path.extname(refPath).toLowerCase()) && fs.existsSync(refPath)) {
        const size = fs.statSync(refPath).size
        if (size > 900 * 1024) heavyRefs.push({ from: row.rel, ref, kb: Math.round(size / 1024) })
      }
    }
  }

  const sitemapPath = path.join(target, 'sitemap.xml')
  const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : ''
  const noindexInSitemap = []
  if (sitemap) {
    for (const row of rows.filter((row) => row.noindex && row.canonical)) {
      const ownUrl = absoluteUrlForRel(row.rel)
      if (sitemap.includes(ownUrl) || (row.canonical === ownUrl && sitemap.includes(row.canonical))) {
        noindexInSitemap.push(row.rel)
      }
    }
  }

  const duplicateTitles = [...byTitle.entries()].filter(([, files]) => files.length > 1)
  const duplicateDescriptions = [...byDescription.entries()].filter(([, files]) => files.length > 1)

  return {
    target,
    pages: rows.length,
    missingTitle: rows.filter((row) => !row.noindex && !row.title).map((row) => row.rel),
    missingDescription: rows.filter((row) => !row.noindex && !row.description).map((row) => row.rel),
    missingCanonical: rows.filter((row) => !row.noindex && !row.canonical).map((row) => row.rel),
    canonicalLocalhost: rows.filter((row) => row.canonical.includes('localhost')).map((row) => [row.rel, row.canonical]),
    canonicalWww: rows.filter((row) => row.canonical.includes('://www.')).map((row) => [row.rel, row.canonical]),
    missingRobots: rows.filter((row) => !row.robots).map((row) => row.rel),
    missingH1: rows.filter((row) => !row.noindex && row.h1s === 0).map((row) => row.rel),
    multipleH1: rows.filter((row) => !row.noindex && row.h1s > 1).map((row) => [row.rel, row.h1s]),
    missingJsonLd: rows.filter((row) => !row.noindex && row.jsonLd === 0).map((row) => row.rel),
    missingOgImage: rows.filter((row) => !row.noindex && !row.ogImage).map((row) => row.rel),
    duplicateTitleGroups: duplicateTitles.map(([value, files]) => ({ value, files })),
    duplicateDescriptionGroups: duplicateDescriptions.map(([value, files]) => ({ value, files })),
    brokenLinks: broken,
    heavyAssetRefs: heavyRefs.sort((a, b) => b.kb - a.kb).slice(0, 50),
    sitemapLocalhost: sitemap.includes('localhost'),
    noindexInSitemap,
  }
}

const report = auditHtml()
const blockers = [
  report.missingTitle.length,
  report.missingDescription.length,
  report.missingCanonical.length,
  report.canonicalLocalhost.length,
  report.canonicalWww.length,
  report.missingRobots.length,
  report.missingH1.length,
  report.missingJsonLd.length,
  report.missingOgImage.length,
  report.brokenLinks.length,
  report.sitemapLocalhost ? 1 : 0,
  report.noindexInSitemap.length,
].reduce((sum, value) => sum + value, 0)

console.log(JSON.stringify(report, null, 2))

if (strict && blockers > 0) {
  console.error(`SEO audit failed with ${blockers} blocker(s).`)
  process.exit(1)
}
