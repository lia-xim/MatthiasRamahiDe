import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const legacyPerformanceHref = 'assets/legacy-performance.css'

const aliasRedirects = new Map([
  ['blog-journal.html', 'blog.html'],
  ['matthias-ramahi-portfolio.html', 'portfolio.html'],
  ['portfolio-1-tunnel.html', 'portfolio.html'],
  ['weitere-dienstleistungen.html', 'leistungen.html'],
])

const imageCache = new Map()

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function decodePath(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function localAssetPath(url, currentDir) {
  if (!url || /^(https?:|data:|mailto:|tel:|#|javascript:)/i.test(url)) return ''
  const clean = decodePath(url.split('#')[0].split('?')[0])
  if (!clean) return ''
  if (clean.startsWith('/')) return path.join(repoRoot, clean.replace(/^\/+/, ''))
  return path.resolve(currentDir, clean)
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16)
}

function dimensionsFromPng(buffer) {
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

function dimensionsFromGif(buffer) {
  if (buffer.length < 10 || !['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) return null
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) }
}

function dimensionsFromJpeg(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null
    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      }
    }
    offset += 2 + length
  }
  return null
}

function dimensionsFromWebp(buffer) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null
  }

  const chunk = buffer.toString('ascii', 12, 16)
  if (chunk === 'VP8X') {
    return {
      width: readUInt24LE(buffer, 24) + 1,
      height: readUInt24LE(buffer, 27) + 1,
    }
  }
  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21)
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    }
  }
  if (chunk === 'VP8 ' && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    }
  }
  return null
}

async function imageDimensions(filePath) {
  if (imageCache.has(filePath)) return imageCache.get(filePath)
  let result = null
  try {
    const buffer = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    if (ext === '.png') result = dimensionsFromPng(buffer)
    else if (ext === '.gif') result = dimensionsFromGif(buffer)
    else if (ext === '.jpg' || ext === '.jpeg') result = dimensionsFromJpeg(buffer)
    else if (ext === '.webp') result = dimensionsFromWebp(buffer)
  } catch {
    result = null
  }
  imageCache.set(filePath, result)
  return result
}

function upsertAttr(tag, name, value) {
  const pattern = new RegExp(`\\s${name}=(["'])[^"']*\\1`, 'i')
  if (pattern.test(tag)) return tag
  return tag.replace(/>$/, ` ${name}="${value}">`)
}

function replaceAttr(tag, name, value) {
  const pattern = new RegExp(`(\\s${name}=)(["'])[^"']*\\2`, 'i')
  if (pattern.test(tag)) return tag.replace(pattern, `$1"${value}"`)
  return upsertAttr(tag, name, value)
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function normalizeDuplicateAttrs(tag) {
  const seen = new Set()
  return tag.replace(/\s([a-zA-Z:-]+)=(["'])[^"']*\2/g, (match, name) => {
    const key = name.toLowerCase()
    if (seen.has(key)) return ''
    seen.add(key)
    return match
  })
}

async function hardenImages(html, filePath) {
  const currentDir = path.dirname(filePath)
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)]
  let result = html
  let offset = 0
  let index = 0

  for (const match of imageTags) {
    const original = match[0]
    let tag = normalizeDuplicateAttrs(original)
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || ''
    const imagePath = localAssetPath(src, currentDir)
    const dims = imagePath ? await imageDimensions(imagePath) : null
    if (dims && !/\bwidth=/i.test(tag) && !/\bheight=/i.test(tag)) {
      tag = upsertAttr(tag, 'width', dims.width)
      tag = upsertAttr(tag, 'height', dims.height)
    }

    tag = upsertAttr(tag, 'decoding', 'async')

    const hasHighPriority = /\bfetchpriority=["']high["']/i.test(tag)
    const hasEager = /\bloading=["']eager["']/i.test(tag)
    if (index > 0 && !hasHighPriority && !hasEager) {
      tag = replaceAttr(tag, 'loading', 'lazy')
    }

    if (tag !== original) {
      const start = match.index + offset
      result = result.slice(0, start) + tag + result.slice(start + original.length)
      offset += tag.length - original.length
    }
    index += 1
  }
  return result
}

function deferDuplicateImages(html) {
  const seen = new Set()

  return html.replace(/<img\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>/gi, (tag, quote, src) => {
    if (/^(?:data:|blob:)/i.test(src) || /\bdata-src=/i.test(tag)) return tag
    const key = decodePath(src).split('#')[0].split('?')[0]
    if (!seen.has(key)) {
      seen.add(key)
      return tag
    }

    let next = tag.replace(/\s+src=(["'])[^"']+\1/i, '')
    next = next.replace(/<img\b/i, `<img data-src="${escapeAttr(src)}"`)
    next = replaceAttr(next, 'loading', 'lazy')
    next = upsertAttr(next, 'decoding', 'async')
    return next
  })
}

function addPerformanceCss(html) {
  if (html.includes(legacyPerformanceHref)) return html
  const siteChromeLink = /(\s*<link\s+rel=["']stylesheet["']\s+href=["']assets\/site-chrome\.css["']\s*\/?>)/i
  if (siteChromeLink.test(html)) {
    return html.replace(siteChromeLink, `$1\n  <link rel="stylesheet" href="${legacyPerformanceHref}" />`)
  }
  return html.replace('</head>', `  <link rel="stylesheet" href="${legacyPerformanceHref}" />\n</head>`)
}

function redirectHtml(fileName, target) {
  const title = `${fileName} -> ${target}`
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,follow" />
  <meta http-equiv="refresh" content="0;url=${target}" />
  <link rel="canonical" href="https://matthiasramahi.de/${target}" />
  <title>${title}</title>
  <script>location.replace('${target}');</script>
</head>
<body>
  <main>
    <h1>Weiterleitung</h1>
    <p><a href="${target}">Zur kanonischen Seite</a></p>
  </main>
</body>
</html>
`
}

async function legacyHtmlFiles() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => path.join(repoRoot, entry.name))
}

let updated = 0
let redirected = 0

for (const filePath of await legacyHtmlFiles()) {
  const fileName = path.basename(filePath)
  let html = await fs.readFile(filePath, 'utf8')

  if (aliasRedirects.has(fileName)) {
    const next = redirectHtml(fileName, aliasRedirects.get(fileName))
    if (next !== html) {
      await fs.writeFile(filePath, next)
      updated += 1
      redirected += 1
    }
    continue
  }

  let next = addPerformanceCss(html)
  next = await hardenImages(next, filePath)
  next = deferDuplicateImages(next)

  if (next !== html) {
    await fs.writeFile(filePath, next)
    updated += 1
  }
}

console.log(`Legacy performance hardening complete: ${updated} files updated, ${redirected} aliases redirected.`)
