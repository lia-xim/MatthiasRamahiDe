import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
const legacyRoot = path.resolve(process.cwd(), '../..')
const siteUrl = process.env.ASTRO_PUBLIC_SITE_URL || 'https://matthiasramahi.de'
const importLimit = Number(process.env.LEGACY_IMPORT_LIMIT || '0')
const adoptedOnly = process.env.LEGACY_IMPORT_ADOPTED_ONLY === 'true'

type PayloadRelationId = string | number

const sitePageMap: Record<string, { pageType: string; slug: string }> = {
  'index.html': { slug: 'home', pageType: 'home' },
  'portfolio.html': { slug: 'portfolio', pageType: 'portfolio-index' },
  'leistungen.html': { slug: 'leistungen', pageType: 'services-index' },
  'ueber-mich.html': { slug: 'ueber-mich', pageType: 'about' },
  'contact.html': { slug: 'contact', pageType: 'contact' },
  'blog.html': { slug: 'blog', pageType: 'journal-index' },
  'impressum.html': { slug: 'impressum', pageType: 'legal' },
  'datenschutz.html': { slug: 'datenschutz', pageType: 'legal' },
  'fotografie.html': { slug: 'fotografie', pageType: 'photography-index' },
}

const adoptedFiles = new Set([
  'index.html',
  'fotografie.html',
  'automobil-fotografie.html',
  'sportwagen-fotografie.html',
  'oldtimer-fotografie.html',
  'motorrad-fotografie.html',
  'portraitfotografie.html',
  'landschaftsfotografie.html',
  'portfolio.html',
  'leistungen.html',
  'ueber-mich.html',
  'contact.html',
  'blog.html',
  'impressum.html',
  'datenschutz.html',
  'fotolabor-druck-duesseldorf.html',
  'grossformatdruck-duesseldorf.html',
  'werbetechnik-duesseldorf.html',
  'webdesign-seo-duesseldorf.html',
  'videografie-duesseldorf.html',
  'viola-musik-duesseldorf.html',
  'drucke-sonderanfertigungen-duesseldorf.html',
  'blog-automotive-fotografie-duesseldorf.html',
  'blog-fine-art-druck.html',
  'blog-location-scouting-duesseldorf.html',
  'blog-motorradfotografie-linien.html',
  'blog-oldtimer-wertobjekt.html',
  'blog-portraits-ohne-generische-posen.html',
  'blog-serie-kuratieren.html',
])

const canonicalServiceFiles = new Set([
  'automobil-fotografie.html',
  'sportwagen-fotografie.html',
  'oldtimer-fotografie.html',
  'motorrad-fotografie.html',
  'portraitfotografie.html',
  'landschaftsfotografie.html',
  'fotolabor-druck-duesseldorf.html',
  'grossformatdruck-duesseldorf.html',
  'werbetechnik-duesseldorf.html',
  'webdesign-seo-duesseldorf.html',
  'videografie-duesseldorf.html',
  'viola-musik-duesseldorf.html',
  'drucke-sonderanfertigungen-duesseldorf.html',
])

const obsoleteSeededServiceSlugs = new Set(['weitere-dienstleistungen'])

const cityTokens = [
  'bergisch-gladbach',
  'bochum',
  'deutschland',
  'dormagen',
  'dortmund',
  'duesseldorf',
  'duisburg',
  'essen',
  'gelsenkirchen',
  'hilden',
  'koeln',
  'krefeld',
  'leverkusen',
  'mettmann',
  'moenchengladbach',
  'moers',
  'neuss',
  'nrw',
  'oberhausen',
  'remscheid',
  'solingen',
  'wuppertal',
]

const serviceTypeFor = (slug: string) => {
  if (slug.includes('sportwagen')) return 'sportwagen'
  if (slug.includes('oldtimer') || slug.includes('youngtimer') || slug.includes('classic-car')) return 'oldtimer'
  if (slug.includes('motorrad') || slug.includes('bike')) return 'motorrad'
  if (slug.includes('portrait') || slug.includes('headshot') || slug.includes('branding')) return 'portrait'
  if (slug.includes('landschaft') || slug.includes('natur')) return 'landschaft'
  if (slug.includes('fotolabor')) return 'fotolabor'
  if (slug.includes('grossformat')) return 'grossformatdruck'
  if (slug.includes('werbetechnik')) return 'werbetechnik'
  if (slug.includes('webdesign')) return 'webdesign-seo'
  if (slug.includes('video')) return 'videografie'
  if (slug.includes('auto') || slug.includes('fahrzeug') || slug.includes('car')) return 'automotive'
  return 'other'
}

const serviceLabelFor = (slug: string) => {
  const type = serviceTypeFor(slug)
  const labels: Record<string, string> = {
    automotive: 'Automobil Fotografie',
    sportwagen: 'Sportwagen Fotografie',
    oldtimer: 'Oldtimer Fotografie',
    motorrad: 'Motorrad Fotografie',
    portrait: 'Portraitfotografie',
    landschaft: 'Landschaftsfotografie',
    fotolabor: 'Fotolabor & Druck',
    grossformatdruck: 'Grossformatdruck',
    werbetechnik: 'Werbetechnik',
    'webdesign-seo': 'Webdesign & SEO',
    videografie: 'Videografie',
    other: 'Fotografie',
  }
  return labels[type] || labels.other
}

const cleanText = (value: string) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))
  return match?.[1] || ''
}

const formatSlug = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const stripChrome = (html: string) =>
  html
    .replace(/<header\b[\s\S]*?<\/header>/i, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/i, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')

const firstMatch = (html: string, pattern: RegExp) => html.match(pattern)?.[1] || ''

const between = (source: string, start: string, end: string) => {
  const startIndex = source.indexOf(start)
  if (startIndex === -1) return ''

  const contentStart = startIndex + start.length
  const endIndex = source.indexOf(end, contentStart)
  if (endIndex === -1) return ''

  return source.slice(contentStart, endIndex)
}

const normalizeLegacyUrls = (html: string) => {
  return html
    .replace(/(?<![A-Za-z0-9:/])assets\//g, '/assets/')
    .replace(
      /((?:src|href|poster|content|data-full)=["'])(?!\/|https?:|data:|mailto:|tel:|#)([^"']+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp|css|js|json|txt|xml))/gi,
      '$1/$2',
    )
    .replace(
      /url\((["']?)(?!\/|https?:|data:|#)([^"')]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp))\1\)/gi,
      'url($1/$2$1)',
    )
}

const legacyHeadFrom = (html: string) => {
  const explicitHead = between(html, '<head>', '</head>')
  if (explicitHead) return explicitHead

  const headEnd = html.search(/<\/head>/i)
  if (headEnd === -1) return ''

  const fallbackHead = html.slice(0, headEnd)
  const firstValidTag = fallbackHead.search(/<(?:link|meta|title|script|style)\b/i)
  return firstValidTag === -1 ? fallbackHead : fallbackHead.slice(firstValidTag)
}

const bodyClassFrom = (html: string) => html.match(/<body\b[^>]*class=["']([^"']+)["'][^>]*>/i)?.[1] || ''

const headerCurrentFrom = (html: string) => {
  const header = html.match(/<header\b[^>]*class=["'][^"']*\btopbar\b[^"']*["'][^>]*>/i)?.[0] || ''
  return header.match(/\bdata-current=["']([^"']+)["']/i)?.[1] || undefined
}

const contentStartAfterHeader = (html: string, headerEnd: number) => {
  const mainStart = html.indexOf('<main', headerEnd)
  if (mainStart !== -1) return mainStart

  const sectionStart = html.indexOf('<section', headerEnd)
  if (sectionStart !== -1) return sectionStart

  return headerEnd
}

const contentStartWithoutHeader = (html: string) => {
  const bodyOpen = html.match(/<body\b[^>]*>/i)
  if (bodyOpen?.index !== undefined) return bodyOpen.index + bodyOpen[0].length

  const headEnd = html.search(/<\/head>/i)
  if (headEnd !== -1) return headEnd + '</head>'.length

  const mainStart = html.indexOf('<main')
  if (mainStart !== -1) return mainStart

  const sectionStart = html.indexOf('<section')
  if (sectionStart !== -1) return sectionStart

  return 0
}

const footerEndFrom = (html: string, footerStart: number) => {
  if (footerStart === -1) return -1
  const footerEnd = html.indexOf('</footer>', footerStart)
  return footerEnd === -1 ? -1 : footerEnd + '</footer>'.length
}

const cleanLegacyFragment = (html: string) => html.replace(/^\s*undefined/i, '')

const extractRenderParts = (html: string) => {
  const headerStart = html.search(/<header\b[^>]*class=["'][^"']*\btopbar\b/i)
  const headerClose = headerStart === -1 ? -1 : html.indexOf('</header>', headerStart)
  const headerEnd = headerClose === -1 ? -1 : headerClose + '</header>'.length
  const contentStart = headerEnd === -1 ? contentStartWithoutHeader(html) : contentStartAfterHeader(html, headerEnd)
  const footerStart = html.search(/<footer\b[^>]*class=["'][^"']*\bmr-footer\b/i)
  const footerEnd = footerEndFrom(html, footerStart)
  const bodyClose = html.lastIndexOf('</body>')
  const contentEnd = footerStart === -1 ? (bodyClose === -1 ? html.length : bodyClose) : footerStart

  return {
    afterFooterHtml:
      footerEnd === -1 ? '' : normalizeLegacyUrls(html.slice(footerEnd, bodyClose === -1 ? html.length : bodyClose)),
    bodyClass: bodyClassFrom(html),
    headerCurrent: headerCurrentFrom(html),
    renderedBodyHtml: cleanLegacyFragment(normalizeLegacyUrls(html.slice(contentStart, contentEnd))),
    renderedHeadHtml: normalizeLegacyUrls(legacyHeadFrom(html)),
    renderSource: 'payload-legacy-html',
  }
}

const metaContent = (html: string, kind: 'name' | 'property', value: string) => {
  const tag = Array.from(html.matchAll(/<meta\b[^>]*>/gi))
    .map((match) => match[0])
    .find((metaTag) => attr(metaTag, kind).toLowerCase() === value.toLowerCase())
  return tag ? attr(tag, 'content') : ''
}

const metaContents = (html: string, kind: 'name' | 'property', value: string) =>
  Array.from(html.matchAll(/<meta\b[^>]*>/gi))
    .map((match) => match[0])
    .filter((metaTag) => attr(metaTag, kind).toLowerCase() === value.toLowerCase())
    .map((metaTag) => cleanText(attr(metaTag, 'content')))
    .filter(Boolean)

const localLegacyPathFromUrl = (value: string) => {
  const clean = value.split('?')[0].split('#')[0].trim()
  if (!clean) return ''

  if (/^https?:\/\//i.test(clean)) {
    try {
      const url = new URL(clean)
      if (!['matthiasramahi.de', 'www.matthiasramahi.de', 'localhost', '127.0.0.1'].includes(url.hostname)) return ''
      return url.pathname.replace(/^\/+/, '')
    } catch {
      return ''
    }
  }

  return clean.replace(/^\/+/, '')
}

const extractElementByClass = (html: string, tagName: string, className: string) => {
  const openerPattern = new RegExp(`<${tagName}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, 'i')
  const opener = openerPattern.exec(html)
  if (!opener) return ''

  const contentStart = opener.index + opener[0].length
  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi')
  tagPattern.lastIndex = contentStart

  let depth = 1
  let match: RegExpExecArray | null
  while ((match = tagPattern.exec(html))) {
    const token = match[0]
    if (token.startsWith('</')) {
      depth -= 1
      if (depth === 0) return html.slice(contentStart, match.index)
    } else if (!token.endsWith('/>')) {
      depth += 1
    }
  }

  return ''
}

const richTextFromParagraphs = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map((paragraph) => ({
      type: 'paragraph',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: [
        {
          type: 'text',
          version: 1,
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: paragraph,
        },
      ],
    })),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const isUsefulParagraph = (text: string) =>
  text.length > 28 &&
  !/^weiterlesen:/i.test(text) &&
  !/^navigation$/i.test(text) &&
  !/Fotografie aus Duesseldorf - kuratiert fuer/i.test(text)

async function extractStructuredBlocks(page: ReturnType<typeof extractPage>, html: string) {
  const source = page.renderParts.renderedBodyHtml || stripChrome(html)
  const tokens = Array.from(source.matchAll(/<(h1|h2|h3|p|figure)\b[^>]*>[\s\S]*?<\/\1>/gi)).map((match) => match[0])
  const blocks: Array<Record<string, unknown>> = []
  let currentHeadline = ''
  let currentParagraphs: string[] = []

  const flushTextBlock = () => {
    if (currentParagraphs.length === 0) return

    blocks.push({
      blockType: 'textBlock',
      headline: currentHeadline || undefined,
      body: richTextFromParagraphs(currentParagraphs),
    })
    currentHeadline = ''
    currentParagraphs = []
  }

  for (const token of tokens) {
    if (/^<h[1-3]\b/i.test(token)) {
      const headline = cleanText(token)
      if (!headline || headline === currentHeadline) continue

      flushTextBlock()
      currentHeadline = headline
      continue
    }

    if (/^<p\b/i.test(token)) {
      const text = cleanText(token)
      if (isUsefulParagraph(text)) currentParagraphs.push(text)
      continue
    }

    if (/^<figure\b/i.test(token)) {
      flushTextBlock()
      const imageTag = token.match(/<img\b[^>]*>/i)?.[0] || ''
      const caption = cleanText(firstMatch(token, /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i))
      const src = attr(imageTag, 'src')
      const alt = cleanText(attr(imageTag, 'alt')) || caption || page.h1
      const media = src ? await importMedia(src, alt, page.file, caption || page.h1) : null

      if (media?.id) {
        blocks.push({
          blockType: 'imageSequence',
          headline: caption || undefined,
          layout: 'single-large',
          items: [{ image: media.id, caption: caption || alt, cropIntent: 'auto' }],
        })
      }
    }
  }

  flushTextBlock()

  return blocks.slice(0, 24)
}

function extractPage(file: string, html: string) {
  const content = stripChrome(html)
  const title = cleanText(firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i))
  const description = attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] || '', 'content')
  const h1 = cleanText(firstMatch(content, /<h1[^>]*>([\s\S]*?)<\/h1>/i))
  const headings = Array.from(content.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi))
    .map((match) => cleanText(match[1]))
    .filter(Boolean)
  const paragraphs = Array.from(content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => cleanText(match[1]))
    .filter((text) => text.length > 28 && !text.includes('Fotografie aus Duesseldorf - kuratiert fuer'))
  const imageMatches = Array.from(html.matchAll(/<img\b[^>]*>/gi))
  const images = imageMatches
    .map((match) => {
      const tag = match[0]
      const src = attr(tag, 'src')
      const alt = cleanText(attr(tag, 'alt'))
      const before = html.slice(Math.max(0, match.index - 240), match.index)
      const caption = attr(before.match(/data-caption=["'][^"']*["']/i)?.[0] || '', 'data-caption')
      return src && !src.startsWith('data:') ? { alt, caption, src } : null
    })
    .filter(Boolean) as Array<{ alt: string; caption: string; src: string }>

  return {
    canonicalUrl: file === 'index.html' ? `${siteUrl}/` : `${siteUrl}/${file}`,
    description: cleanText(description),
    extractedText: paragraphs.join('\n\n'),
    file,
    h1: h1 || title.replace(/\s+[—|-]\s+.*$/, ''),
    headings,
    images,
    intro: paragraphs[0] || cleanText(description),
    renderParts: extractRenderParts(html),
    title,
  }
}

const legacyForPage = (page: ReturnType<typeof extractPage>) => ({
  sourceFile: page.file,
  sourceUrl: page.canonicalUrl,
  migrationStatus: 'seeded',
  renderSource: page.renderParts.renderSource,
  renderedHeadHtml: page.renderParts.renderedHeadHtml,
  renderedBodyHtml: page.renderParts.renderedBodyHtml,
  afterFooterHtml: page.renderParts.afterFooterHtml,
  bodyClass: page.renderParts.bodyClass,
  headerCurrent: page.renderParts.headerCurrent,
  extractedHeadings: page.headings.slice(0, 30),
  extractedImagePaths: page.images.map((image) => image.src).slice(0, 80),
  extractedText: page.extractedText.slice(0, 12000),
})

const imageCategoryFor = (src: string, sourceFile: string) => {
  const lower = `${src} ${sourceFile}`.toLowerCase()
  if (lower.includes('portrait')) return 'portrait'
  if (lower.includes('oldtimer')) return 'oldtimer'
  if (lower.includes('motorrad') || lower.includes('bike')) return 'motorrad'
  if (lower.includes('landschaft') || lower.includes('natur') || lower.includes('wunder')) return 'landschaft'
  if (lower.includes('service') || lower.includes('druck') || lower.includes('video') || lower.includes('webdesign')) return 'service'
  if (lower.includes('auto') || lower.includes('sportwagen') || lower.includes('car') || lower.includes('_dsc')) return 'automotive'
  return 'atmosphere'
}

const imageTypeFor = (category: string) => {
  if (category === 'portrait') return ['portrait']
  if (category === 'motorrad') return ['motorcycle']
  if (category === 'landschaft') return ['landscape']
  if (category === 'service') return ['editorial']
  if (category === 'atmosphere') return ['atmosphere']
  return ['automotive']
}

const toneFor = (src: string) => {
  const lower = src.toLowerCase()
  if (lower.includes('neon') || lower.includes('night') || lower.includes('nacht')) return ['dark-cinematic']
  if (lower.includes('warm') || lower.includes('sunset')) return ['warm-atmospheric']
  if (lower.includes('detail')) return ['detail-texture']
  return ['light-editorial']
}

async function upsertBySlug(collection: string, slug: string, data: Record<string, unknown>, publish = true) {
  const existing = await payload.find({
    collection: collection as any,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })

  const payloadData: Record<string, unknown> = {
    ...data,
    ...(publish ? { _status: 'published' as const } : { _status: 'draft' as const }),
  }

  if (existing.docs[0]?.id) {
    const currentLegacy = (existing.docs[0] as any)?.legacy
    const currentMigrationStatus = currentLegacy?.migrationStatus
    const currentRenderSource = currentLegacy?.renderSource
    if (
      currentMigrationStatus &&
      currentMigrationStatus !== 'seeded' &&
      payloadData.legacy &&
      typeof payloadData.legacy === 'object'
    ) {
      payloadData.legacy = {
        ...(payloadData.legacy as Record<string, unknown>),
        migrationStatus: currentMigrationStatus,
        ...(currentRenderSource === 'native-component' || currentRenderSource === 'structured-blocks'
          ? { renderSource: currentRenderSource }
          : {}),
      }
    }

    await payload.update({
      collection: collection as any,
      id: existing.docs[0].id,
      data: payloadData as any,
      draft: !publish,
      overrideAccess: true,
    })
    return existing.docs[0]
  }

  return payload.create({
    collection: collection as any,
    data: payloadData as any,
    draft: !publish,
    overrideAccess: true,
  })
}

async function findMediaBySource(src: string) {
  const filename = path.basename(src)
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    overrideAccess: true,
    where: {
      or: [{ legacySourcePath: { equals: src } }, { filename: { equals: filename } }],
    } as any,
  })
  return existing.docs[0]
}

async function deleteObsoleteSeededServicePages() {
  for (const slug of obsoleteSeededServiceSlugs) {
    const existing = await payload.find({
      collection: 'service-pages' as any,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    })
    const doc = existing.docs[0] as any
    if (!doc?.id) continue

    const sourceFile = doc?.legacy?.sourceFile || doc?.seo?.legacyUrl
    if (doc?.legacy?.migrationStatus === 'seeded' && sourceFile === `${slug}.html`) {
      await payload.delete({
        collection: 'service-pages' as any,
        id: doc.id,
        overrideAccess: true,
      })
    }
  }
}

async function importMedia(src: string, alt: string, sourceFile: string, caption = '') {
  const cleanSrc = localLegacyPathFromUrl(src)
  if (!cleanSrc) return null

  const resolved = path.resolve(legacyRoot, cleanSrc)
  if (!resolved.startsWith(legacyRoot) || !fs.existsSync(resolved)) return null

  const existing = await findMediaBySource(cleanSrc)
  const category = imageCategoryFor(cleanSrc, sourceFile)
  const title = alt || caption || path.basename(cleanSrc, path.extname(cleanSrc)).replace(/[-_]+/g, ' ')
  const data = {
    title,
    alt: alt || `${serviceLabelFor(sourceFile)} - ${title}`,
    caption,
    category,
    imageType: imageTypeFor(category),
    visualTone: toneFor(cleanSrc),
    usagePurpose: cleanSrc.includes('thumbs') ? ['teaser'] : ['gallery'],
    featured: /hero|stage|sunset|neon|_DSC3879|_DSC0470/i.test(cleanSrc),
    usageNotes: `Aus ${sourceFile} importiert. Alt-Text redaktionell pruefen.`,
    legacySourcePath: cleanSrc,
  }

  if (existing?.id && process.env.LEGACY_IMPORT_REFRESH_MEDIA !== 'true') {
    return existing
  }

  if (existing?.id) {
    return payload.update({
      collection: 'media',
      id: existing.id,
      data: data as any,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'media',
    filePath: resolved,
    data: data as any,
    overrideAccess: true,
  })
}

async function importSitePage(page: ReturnType<typeof extractPage>, html: string) {
  const mapped = sitePageMap[page.file]
  if (!mapped) return

  const hero = page.images[0] ? await importMedia(page.images[0].src, page.images[0].alt, page.file, page.images[0].caption) : null
  const blocks = await extractStructuredBlocks(page, html)

  await upsertBySlug(
    'site-pages',
    mapped.slug,
    {
      title: page.h1,
      slug: mapped.slug,
      pageType: mapped.pageType,
      intro: page.intro,
      heroImage: hero?.id,
      teaserImage: hero?.id,
      blocks,
      seo: {
        title: page.title.slice(0, 70),
        description: page.description.slice(0, 170),
        canonicalUrl: page.canonicalUrl,
        legacyUrl: page.file,
        ogImage: hero?.id,
      },
      legacy: legacyForPage(page),
    },
    true,
  )
}

async function importServicePage(page: ReturnType<typeof extractPage>, html: string) {
  const slug = page.file.replace(/\.html$/, '')
  if (!canonicalServiceFiles.has(page.file)) return

  const hero = page.images[0] ? await importMedia(page.images[0].src, page.images[0].alt, page.file, page.images[0].caption) : null
  const blocks = await extractStructuredBlocks(page, html)

  await upsertBySlug(
    'service-pages',
    slug,
    {
      title: page.h1,
      slug,
      serviceType: serviceTypeFor(slug),
      heroImage: hero?.id,
      teaserImage: hero?.id,
      intro: page.intro,
      proofPoints: page.headings.slice(1, 5).map((heading) => ({ label: heading, text: page.intro })),
      blocks,
      seo: {
        title: page.title.slice(0, 70),
        description: page.description.slice(0, 170),
        canonicalUrl: page.canonicalUrl,
        legacyUrl: page.file,
        ogImage: hero?.id,
      },
      legacy: legacyForPage(page),
    },
    Boolean(hero?.id),
  )
}

const cityFromSlug = (slug: string) => cityTokens.find((city) => slug.endsWith(`-${city}`) || slug.includes(`-${city}-`))

async function importLocalSeoPage(page: ReturnType<typeof extractPage>, html: string) {
  const slug = page.file.replace(/\.html$/, '')
  const city = cityFromSlug(slug)
  if (!city || page.file.startsWith('blog-') || canonicalServiceFiles.has(page.file) || sitePageMap[page.file]) return

  const hero = page.images[0] ? await importMedia(page.images[0].src, page.images[0].alt, page.file, page.images[0].caption) : null
  const blocks = await extractStructuredBlocks(page, html)

  await upsertBySlug(
    'local-seo-pages',
    slug,
    {
      title: page.h1,
      slug,
      city: city.replace(/-/g, ' '),
      service: serviceLabelFor(slug),
      targetKeyword: page.h1,
      intro: page.intro,
      heroImage: hero?.id,
      localProof: page.headings.slice(1, 4).map((heading) => ({ label: heading, text: page.intro })),
      blocks,
      seo: {
        title: page.title.slice(0, 70),
        description: page.description.slice(0, 170),
        canonicalUrl: page.canonicalUrl,
        legacyUrl: page.file,
        ogImage: hero?.id,
      },
      legacy: legacyForPage(page),
    },
    false,
  )
}

async function importPortfolioFromPage(page: ReturnType<typeof extractPage>, html: string) {
  if (page.file !== 'portfolio.html') return

  const sections = Array.from(html.matchAll(/<section class="pf-spread[\s\S]*?<\/section>/gi))
  for (const sectionMatch of sections) {
    const section = sectionMatch[0]
    const title = cleanText(firstMatch(section, /<h2[^>]*>([\s\S]*?)<\/h2>/i))
    const label = cleanText(attr(section.match(/aria-label=["'][^"']*["']/i)?.[0] || '', 'aria-label')) || title
    const slug = formatSlug(label)
    const imageTags = Array.from(section.matchAll(/<img\b[^>]*>/gi)).map((match) => match[0])
    const media = (
      await Promise.all(
        imageTags.map((tag) =>
          importMedia(attr(tag, 'src'), cleanText(attr(tag, 'alt')) || label, page.file, attr(section, 'data-caption') || label),
        ),
      )
    ).filter(Boolean) as Array<{ id: PayloadRelationId }>

    if (media.length === 0) continue

    const category = await upsertBySlug(
      'portfolio-categories',
      slug,
      {
        title: label,
        slug,
        intro: title,
        coverImage: media[0].id,
        seo: {
          title: `${label} | Portfolio`.slice(0, 70),
          description: `${label} aus dem Legacy-Portfolio von Matthias Ramahi.`.slice(0, 170),
          canonicalUrl: page.canonicalUrl,
          legacyUrl: page.file,
        },
        legacy: {
          sourceFile: page.file,
          sourceUrl: page.canonicalUrl,
          migrationStatus: 'seeded',
          extractedHeadings: [title],
          extractedImagePaths: imageTags.map((tag) => attr(tag, 'src')),
          extractedText: cleanText(section),
        },
      },
      true,
    )

    await upsertBySlug(
      'portfolio-projects',
      `portfolio-auswahl-${slug}`,
      {
        title: `Portfolio-Auswahl ${label}`,
        slug: `portfolio-auswahl-${slug}`,
        category: category.id,
        presentationMode: 'floating-archive',
        excerpt: title || `${label} aus dem bestehenden Portfolio.`,
        coverImage: media[0].id,
        gallery: media.map((item) => ({ image: item.id, caption: label, role: 'sequence' })),
        seo: {
          title: `Portfolio-Auswahl ${label}`.slice(0, 70),
          description: (title || `${label} aus dem bestehenden Portfolio von Matthias Ramahi.`).slice(0, 170),
          canonicalUrl: page.canonicalUrl,
          legacyUrl: page.file,
        },
        legacy: {
          sourceFile: page.file,
          sourceUrl: page.canonicalUrl,
          migrationStatus: 'seeded',
          extractedHeadings: [title],
          extractedImagePaths: imageTags.map((tag) => attr(tag, 'src')),
          extractedText: cleanText(section),
        },
      },
      true,
    )
  }
}

async function importJournalFromPage(page: ReturnType<typeof extractPage>, html: string) {
  if (!page.file.startsWith('blog-') || page.file === 'blog-journal.html') return

  const article = firstMatch(html, /<article\b[^>]*>([\s\S]*?)<\/article>/i)
  const prose = extractElementByClass(article || html, 'div', 'prose')
  if (!article && !prose) return

  const title = cleanText(
    firstMatch(article, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
      page.h1 ||
      page.title.replace(/\s+[—|-]\s+Matthias Ramahi.*$/i, ''),
  )
  if (!title || title.toLowerCase().includes('blog / journal')) return

  const slug = formatSlug(page.file.replace(/^blog-/, '').replace(/\.html$/i, ''))
  const ogImage = metaContent(html, 'property', 'og:image')
  const heroImageTag = article.match(/<img\b[^>]*>/i)?.[0] || ''
  const heroImageSrc = localLegacyPathFromUrl(ogImage) || attr(heroImageTag, 'src') || page.images[0]?.src || ''
  const heroAlt =
    cleanText(attr(heroImageTag, 'alt')) ||
    title ||
    cleanText(metaContent(html, 'property', 'og:title')) ||
    `${serviceLabelFor(slug)} - Journal`
  const hero = heroImageSrc ? await importMedia(heroImageSrc, heroAlt, page.file, title) : null
  const articleSection = cleanText(metaContent(html, 'property', 'article:section'))
  const tags = metaContents(html, 'property', 'article:tag')
  const proseText = cleanText(prose || article)
  const words = proseText.split(/\s+/).filter(Boolean).length
  const lead = cleanText(firstMatch(prose, /<p\b[^>]*class=["'][^"']*\blead\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i))
  const excerpt = (lead || page.intro || page.description).slice(0, 520)
  const publishedAt =
    metaContent(html, 'property', 'article:published_time') ||
    fs.statSync(path.join(legacyRoot, page.file)).mtime.toISOString()
  const categorySource = `${articleSection} ${title} ${page.file}`.toLowerCase()
  const category = categorySource.match(/portrait/)
    ? 'portrait'
    : categorySource.match(/print|druck|landschaft|fine-art/)
      ? 'landscape-print'
      : categorySource.match(/auto|car|oldtimer|motorrad|bike/)
        ? 'automotive'
        : 'process'

  const relatedPages = Array.from(article.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi))
    .map((match) => ({
      href: attr(match[0], 'href'),
      label: cleanText(match[2]),
    }))
    .filter((link) => link.href && link.label && !link.href.startsWith('#') && !/^mailto:/i.test(link.href))
    .slice(0, 6)

  const extractedImagePaths = Array.from(article.matchAll(/<img\b[^>]*>/gi))
    .map((match) => attr(match[0], 'src'))
    .filter(Boolean)

  const blocks: Array<Record<string, unknown>> = []
  const tokens = Array.from((prose || article).matchAll(/<(h2|p|figure)\b[^>]*>[\s\S]*?<\/\1>/gi)).map((match) => match[0])
  let currentHeadline = ''
  let currentParagraphs: string[] = []

  const flushTextBlock = () => {
    if (currentParagraphs.length === 0) return
    blocks.push({
      blockType: 'textBlock',
      headline: currentHeadline || undefined,
      body: richTextFromParagraphs(currentParagraphs),
    })
    currentHeadline = ''
    currentParagraphs = []
  }

  for (const token of tokens) {
    if (/^<h2\b/i.test(token)) {
      flushTextBlock()
      currentHeadline = cleanText(token)
      continue
    }

    if (/^<p\b/i.test(token)) {
      const text = cleanText(token)
      if (text && !text.startsWith('Weiterlesen:')) currentParagraphs.push(text)
      continue
    }

    if (/^<figure\b/i.test(token)) {
      flushTextBlock()
      const imageTag = token.match(/<img\b[^>]*>/i)?.[0] || ''
      const caption = cleanText(firstMatch(token, /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i))
      const src = attr(imageTag, 'src')
      const media = src ? await importMedia(src, cleanText(attr(imageTag, 'alt')) || title, page.file, caption || title) : null
      if (media?.id) {
        blocks.push({
          blockType: 'imageSequence',
          headline: caption || title,
          layout: 'single-large',
          items: [{ image: media.id, caption: caption || cleanText(attr(imageTag, 'alt')) || title, cropIntent: 'auto' }],
        })
      }
    }
  }

  flushTextBlock()

  await upsertBySlug(
    'journal-posts',
    slug,
    {
      title,
      slug,
      category,
      publishedAt,
      coverImage: hero?.id,
      excerpt,
      readingTime: Math.max(2, Math.ceil(words / 220)),
      tags,
      relatedPages,
      blocks,
      seo: {
        title: page.title.slice(0, 70),
        description: page.description.slice(0, 170),
        canonicalUrl: page.canonicalUrl,
        legacyUrl: page.file,
        ogImage: hero?.id,
      },
      legacy: {
        ...legacyForPage(page),
        extractedImagePaths,
        extractedText: proseText.slice(0, 12000),
      },
    },
    Boolean(hero?.id),
  )
}

try {
  const files = (await fsp.readdir(legacyRoot))
    .filter((file) => file.endsWith('.html'))
    .filter((file) => !adoptedOnly || adoptedFiles.has(file))
    .sort((a, b) => a.localeCompare(b))
  const selectedFiles = importLimit > 0 ? files.slice(0, importLimit) : files
  const pages = []

  for (const file of selectedFiles) {
    const html = await fsp.readFile(path.join(legacyRoot, file), 'utf8')
    const page = extractPage(file, html)
    pages.push({ html, page })

    for (const image of page.images) {
      await importMedia(image.src, image.alt, file, image.caption)
    }
  }

  for (const { html, page } of pages) {
    await importSitePage(page, html)
    await importServicePage(page, html)
    await importLocalSeoPage(page, html)
  }

  for (const { html, page } of pages) {
    await importPortfolioFromPage(page, html)
    await importJournalFromPage(page, html)
  }

  await deleteObsoleteSeededServicePages()

  payload.logger.info(
    `Legacy import complete: ${selectedFiles.length} HTML files scanned${adoptedOnly ? ' (adopted-only)' : ''}.`,
  )
  process.exit(0)
} catch (error) {
  payload.logger.error(error)
  process.exit(1)
}
