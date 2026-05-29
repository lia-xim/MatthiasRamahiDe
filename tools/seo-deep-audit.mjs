import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://matthiasramahi.de'
const SITE_HOST = new URL(SITE).hostname

const args = new Set(process.argv.slice(2))
const targetArg = process.argv.find((arg) => arg.startsWith('--target='))
const target = path.resolve(ROOT, targetArg ? targetArg.split('=').slice(1).join('=') : 'apps/web/dist/client')
const strict = args.has('--strict')

const textExtensions = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css', '.svg', '.webmanifest'])
const htmlExtensions = new Set(['.html'])
const pageAssetExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.svg',
  '.mp4',
  '.webm',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.txt',
  '.ico',
  '.pdf',
])

const forbiddenUrlPattern = /\bhttps?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?|\bhttps?:\/\/www\.matthiasramahi\.de\b/gi
const insecureSitePattern = /\bhttp:\/\/(?:www\.)?matthiasramahi\.de\b/gi
const encodingArtifactPattern = /[\uFFFD\u00C3\u00C2\u00E2]/g
const doubleEncodedEntityPattern = /&amp;(?:amp|lt|gt|quot|apos|#\d+);/g

function hasForbiddenUrl(value) {
  forbiddenUrlPattern.lastIndex = 0
  insecureSitePattern.lastIndex = 0
  return forbiddenUrlPattern.test(value) || insecureSitePattern.test(value)
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(fullPath, files)
    else files.push(fullPath)
  }
  return files
}

const relPath = (file) => path.relative(target, file).replace(/\\/g, '/')

const stripTags = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length
}

function snippetOf(text, index, size = 100) {
  return text
    .slice(Math.max(0, index - size / 2), Math.min(text.length, index + size / 2))
    .replace(/\s+/g, ' ')
    .trim()
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

function title(html) {
  return stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
}

function ownUrlForRel(rel) {
  if (rel === 'index.html') return `${SITE}/`
  if (rel.endsWith('.html/index.html')) return `${SITE}/${rel.replace(/\/index\.html$/, '')}`
  if (rel.endsWith('/index.html')) return `${SITE}/${rel.replace(/\/index\.html$/, '/')}`
  return `${SITE}/${rel}`
}

function normalizeUrl(value) {
  try {
    const url = new URL(value, SITE)
    const pathName = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')
    return `${url.protocol}//${url.hostname}${pathName}${url.search}`
  } catch {
    return value
  }
}

function isInternalUrl(value) {
  try {
    const url = new URL(value, SITE)
    return url.hostname === SITE_HOST
  } catch {
    return false
  }
}

function localFileCandidatesForUrl(value) {
  const url = new URL(value, SITE)
  if (url.hostname !== SITE_HOST) return []

  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, '')
  if (!cleanPath) return [path.join(target, 'index.html')]

  const candidates = [path.join(target, cleanPath)]
  if (path.extname(cleanPath) === '.html') candidates.push(path.join(target, cleanPath, 'index.html'))
  if (!path.extname(cleanPath)) {
    candidates.push(path.join(target, cleanPath, 'index.html'))
    candidates.push(path.join(target, `${cleanPath}.html`))
  }
  if (cleanPath.endsWith('/')) candidates.push(path.join(target, cleanPath, 'index.html'))
  return candidates
}

function existingLocalFileForUrl(value) {
  return localFileCandidatesForUrl(value).find((candidate) => fs.existsSync(candidate)) || ''
}

function idsInHtml(html) {
  const ids = new Set()
  for (const match of html.matchAll(/\b(?:id|name)=["']([^"']+)["']/gi)) ids.add(match[1])
  return ids
}

function linksFrom(html) {
  const links = []
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1]
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue
    links.push(href)
  }
  return links
}

function imgTagsFrom(html) {
  const visibleHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '')
  return [...visibleHtml.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])
}

function jsonLdBlocksFrom(html) {
  return [...html.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => match[1].trim(),
  )
}

function extractExactLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim())
}

function extractImageLocs(xml) {
  return [...xml.matchAll(/<image:loc>\s*([^<]+?)\s*<\/image:loc>/gi)].map((match) => match[1].trim())
}

function scanTextFiles(files) {
  const forbiddenHosts = []
  const insecureSiteUrls = []
  const encodingArtifacts = []
  const doubleEncodedEntities = []

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')
    for (const match of text.matchAll(forbiddenUrlPattern)) {
      forbiddenHosts.push({
        file: relPath(file),
        line: lineOf(text, match.index ?? 0),
        value: match[0],
      })
    }
    for (const match of text.matchAll(insecureSitePattern)) {
      insecureSiteUrls.push({
        file: relPath(file),
        line: lineOf(text, match.index ?? 0),
        value: match[0],
      })
    }
    for (const match of text.matchAll(encodingArtifactPattern)) {
      encodingArtifacts.push({
        file: relPath(file),
        line: lineOf(text, match.index ?? 0),
        snippet: snippetOf(text, match.index ?? 0),
      })
    }
    for (const match of text.matchAll(doubleEncodedEntityPattern)) {
      doubleEncodedEntities.push({
        file: relPath(file),
        line: lineOf(text, match.index ?? 0),
        value: match[0],
      })
    }
  }

  return { forbiddenHosts, insecureSiteUrls, encodingArtifacts, doubleEncodedEntities }
}

function auditHtml(files) {
  const rows = files.map((file) => {
    const html = fs.readFileSync(file, 'utf8')
    const rel = relPath(file)
    const robots = metaContent(html, 'robots')
    const ownUrl = ownUrlForRel(rel)
    const ownKey = normalizeUrl(ownUrl)
    const canonicalUrl = canonical(html)
    const canonicalKey = canonicalUrl ? normalizeUrl(canonicalUrl) : ''
    const noindex = /noindex/i.test(robots)
    const redirectTarget = metaContent(html, 'refresh', 'http-equiv')
    const isRedirect = /^\s*\d+\s*;\s*url=/i.test(redirectTarget)

    return {
      file,
      rel,
      html,
      ownUrl,
      ownKey,
      title: title(html),
      description: metaContent(html, 'description'),
      canonical: canonicalUrl,
      canonicalKey,
      robots,
      noindex,
      isRedirect,
      ids: idsInHtml(html),
      links: linksFrom(html),
      images: imgTagsFrom(html),
      jsonLdBlocks: jsonLdBlocksFrom(html),
    }
  })

  const byOwnKey = new Map(rows.map((row) => [row.ownKey, row]))
  const indexableRows = rows.filter((row) => !row.noindex && !row.isRedirect)
  const canonicalGroups = new Map()
  for (const row of indexableRows) {
    if (!row.canonicalKey) continue
    canonicalGroups.set(row.canonicalKey, [...(canonicalGroups.get(row.canonicalKey) || []), row.rel])
  }

  const invalidJsonLd = []
  const jsonLdForbiddenHosts = []
  const imgMissingAlt = []
  const internalNoindexLinks = []
  const internalNonCanonicalLinks = []
  const brokenInternalLinks = []
  const brokenAnchorLinks = []

  for (const row of rows) {
    row.jsonLdBlocks.forEach((block, index) => {
      try {
        JSON.parse(block)
      } catch (error) {
        invalidJsonLd.push({ file: row.rel, index, message: error.message })
      }
      if (hasForbiddenUrl(block)) {
        jsonLdForbiddenHosts.push({ file: row.rel, index })
      }
    })

    for (const tag of row.images) {
      if (!/\balt=["'][^"']*["']/i.test(tag)) imgMissingAlt.push({ file: row.rel, tag: stripTags(tag).slice(0, 140) || tag.slice(0, 140) })
    }

    for (const href of row.links) {
      if (/^(https?:)?\/\//i.test(href) && !isInternalUrl(href)) continue
      if (href.startsWith('#')) {
        const id = decodeURIComponent(href.slice(1))
        if (id && !row.ids.has(id)) brokenAnchorLinks.push({ from: row.rel, href })
        continue
      }

      const targetUrl = new URL(href, row.ownUrl)
      if (targetUrl.hostname !== SITE_HOST) continue
      if (pageAssetExtensions.has(path.extname(targetUrl.pathname).toLowerCase())) continue

      const targetFile = existingLocalFileForUrl(targetUrl.href)
      if (!targetFile) {
        brokenInternalLinks.push({ from: row.rel, href })
        continue
      }

      const targetRow = byOwnKey.get(normalizeUrl(ownUrlForRel(relPath(targetFile))))
      if (!targetRow) continue
      if (targetRow.noindex && !row.noindex) internalNoindexLinks.push({ from: row.rel, href, target: targetRow.rel })
      if (
        !targetRow.noindex &&
        !targetRow.isRedirect &&
        targetRow.canonicalKey &&
        targetRow.canonicalKey !== targetRow.ownKey
      ) {
        internalNonCanonicalLinks.push({ from: row.rel, href, target: targetRow.rel, canonical: targetRow.canonical })
      }
    }
  }

  return {
    rows,
    duplicateCanonicalGroups: [...canonicalGroups.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([canonicalUrl, files]) => ({ canonicalUrl, files })),
    nonSelfCanonicalPages: indexableRows
      .filter((row) => row.canonicalKey && row.canonicalKey !== row.ownKey)
      .map((row) => ({ file: row.rel, canonical: row.canonical })),
    titleLengthWarnings: indexableRows
      .filter((row) => row.title && (row.title.length < 25 || row.title.length > 65))
      .map((row) => ({ file: row.rel, length: row.title.length, title: row.title })),
    descriptionLengthWarnings: indexableRows
      .filter((row) => row.description && (row.description.length < 70 || row.description.length > 170))
      .map((row) => ({ file: row.rel, length: row.description.length, description: row.description })),
    invalidJsonLd,
    jsonLdForbiddenHosts,
    imgMissingAlt,
    internalNoindexLinks,
    internalNonCanonicalLinks,
    brokenInternalLinks,
    brokenAnchorLinks,
  }
}

function auditSitemaps(files, pageRows) {
  const htmlByOwnKey = new Map(pageRows.map((row) => [row.ownKey, row]))
  const locs = []
  const imageLocs = []

  for (const file of files) {
    const xml = fs.readFileSync(file, 'utf8')
    extractExactLocs(xml).forEach((loc) => locs.push({ file: relPath(file), loc }))
    extractImageLocs(xml).forEach((loc) => imageLocs.push({ file: relPath(file), loc }))
  }

  const locForbiddenHosts = locs.filter(({ loc }) => hasForbiddenUrl(loc))
  const imageForbiddenHosts = imageLocs.filter(({ loc }) => hasForbiddenUrl(loc))

  const pageLocs = locs.filter(({ loc }) => {
    try {
      const url = new URL(loc)
      return url.hostname === SITE_HOST && !url.pathname.endsWith('.xml')
    } catch {
      return false
    }
  })

  const externalPageLocs = locs.filter(({ loc }) => {
    try {
      const url = new URL(loc)
      return url.hostname !== SITE_HOST && !url.pathname.endsWith('.xml')
    } catch {
      return true
    }
  })

  const brokenLocs = []
  const noindexLocs = []
  const nonCanonicalLocs = []

  for (const item of pageLocs) {
    const localFile = existingLocalFileForUrl(item.loc)
    if (!localFile) {
      brokenLocs.push(item)
      continue
    }
    const row = htmlByOwnKey.get(normalizeUrl(ownUrlForRel(relPath(localFile))))
    if (!row) continue
    if (row.noindex || row.isRedirect) noindexLocs.push({ ...item, target: row.rel })
    if (row.canonicalKey && row.canonicalKey !== normalizeUrl(item.loc)) {
      nonCanonicalLocs.push({ ...item, target: row.rel, canonical: row.canonical })
    }
  }

  return {
    locs,
    imageLocs,
    locForbiddenHosts,
    imageForbiddenHosts,
    externalPageLocs,
    brokenLocs,
    noindexLocs,
    nonCanonicalLocs,
  }
}

function auditRobots(file) {
  if (!file || !fs.existsSync(file)) {
    return {
      exists: false,
      hasSitemap: false,
      forbiddenHosts: [],
    }
  }
  const text = fs.readFileSync(file, 'utf8')
  return {
    exists: true,
    hasSitemap: /^Sitemap:\s*https:\/\/matthiasramahi\.de\/sitemap\.xml\s*$/im.test(text),
    forbiddenHosts: [...text.matchAll(forbiddenUrlPattern)].map((match) => ({ line: lineOf(text, match.index ?? 0), value: match[0] })),
  }
}

const allFiles = walk(target)
const textFiles = allFiles.filter((file) => textExtensions.has(path.extname(file).toLowerCase()))
const htmlFiles = allFiles.filter((file) => htmlExtensions.has(path.extname(file).toLowerCase()))
const sitemapFiles = allFiles.filter((file) => path.basename(file).startsWith('sitemap') && path.extname(file) === '.xml')

const textReport = scanTextFiles(textFiles)
const htmlReport = auditHtml(htmlFiles)
const sitemapReport = auditSitemaps(sitemapFiles, htmlReport.rows)
const robotsReport = auditRobots(path.join(target, 'robots.txt'))

const report = {
  target,
  files: {
    html: htmlFiles.length,
    sitemaps: sitemapFiles.length,
    text: textFiles.length,
  },
  forbiddenHosts: textReport.forbiddenHosts,
  insecureSiteUrls: textReport.insecureSiteUrls,
  encodingArtifacts: textReport.encodingArtifacts.slice(0, 100),
  doubleEncodedEntities: textReport.doubleEncodedEntities.slice(0, 100),
  duplicateCanonicalGroups: htmlReport.duplicateCanonicalGroups,
  nonSelfCanonicalPages: htmlReport.nonSelfCanonicalPages,
  invalidJsonLd: htmlReport.invalidJsonLd,
  jsonLdForbiddenHosts: htmlReport.jsonLdForbiddenHosts,
  imgMissingAlt: htmlReport.imgMissingAlt.slice(0, 100),
  internalNoindexLinks: htmlReport.internalNoindexLinks.slice(0, 100),
  internalNonCanonicalLinks: htmlReport.internalNonCanonicalLinks.slice(0, 100),
  brokenInternalLinks: htmlReport.brokenInternalLinks.slice(0, 100),
  brokenAnchorLinks: htmlReport.brokenAnchorLinks.slice(0, 100),
  sitemap: {
    locCount: sitemapReport.locs.length,
    imageLocCount: sitemapReport.imageLocs.length,
    locForbiddenHosts: sitemapReport.locForbiddenHosts,
    imageForbiddenHosts: sitemapReport.imageForbiddenHosts,
    externalPageLocs: sitemapReport.externalPageLocs,
    brokenLocs: sitemapReport.brokenLocs,
    noindexLocs: sitemapReport.noindexLocs,
    nonCanonicalLocs: sitemapReport.nonCanonicalLocs,
  },
  robots: robotsReport,
  titleLengthWarnings: htmlReport.titleLengthWarnings.slice(0, 80),
  descriptionLengthWarnings: htmlReport.descriptionLengthWarnings.slice(0, 80),
}

const blockers = [
  report.forbiddenHosts.length,
  report.insecureSiteUrls.length,
  textReport.encodingArtifacts.length,
  textReport.doubleEncodedEntities.length,
  report.duplicateCanonicalGroups.length,
  report.invalidJsonLd.length,
  report.jsonLdForbiddenHosts.length,
  htmlReport.imgMissingAlt.length,
  report.internalNoindexLinks.length,
  report.internalNonCanonicalLinks.length,
  report.brokenInternalLinks.length,
  report.sitemap.locForbiddenHosts.length,
  report.sitemap.imageForbiddenHosts.length,
  report.sitemap.externalPageLocs.length,
  report.sitemap.brokenLocs.length,
  report.sitemap.noindexLocs.length,
  report.sitemap.nonCanonicalLocs.length,
  report.robots.exists ? 0 : 1,
  report.robots.hasSitemap ? 0 : 1,
  report.robots.forbiddenHosts.length,
].reduce((sum, value) => sum + value, 0)

console.log(JSON.stringify(report, null, 2))

if (strict && blockers > 0) {
  console.error(`Deep SEO audit failed with ${blockers} blocker(s).`)
  process.exit(1)
}
