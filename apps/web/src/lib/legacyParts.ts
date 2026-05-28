import path from 'node:path'

import { listLegacyHtmlFiles, readLegacyPage } from './legacy'

const useLegacyPartsCache = import.meta.env.PROD && process.env.LEGACY_DISABLE_PARTS_CACHE !== 'true'
let legacyHomePartsCache: Promise<LegacyHomeParts> | null = null
const componentizedLegacyPartsCache = new Map<string, Promise<ComponentizedLegacyParts>>()

type LegacyHomeParts = {
  afterFooter: string
  head: string
  mainAfterHero: string
}

type ComponentizedLegacyParts = {
  afterFooter: string
  bodyClass: string
  current?: string
  fileName: string
  headerTheme?: string
  head: string
  pageContent: string
}

const between = (source: string, start: string, end: string) => {
  const startIndex = source.indexOf(start)
  if (startIndex === -1) return ''

  const contentStart = startIndex + start.length
  const endIndex = source.indexOf(end, contentStart)
  if (endIndex === -1) return ''

  return source.slice(contentStart, endIndex)
}

const after = (source: string, marker: string) => {
  const index = source.indexOf(marker)
  return index === -1 ? '' : source.slice(index + marker.length)
}

const normalizeLegacyUrls = (html: string) => {
  return html
    .replace(/(?<![A-Za-z0-9:/])assets\//g, '/assets/')
    .replace(
      /((?:src|href|poster|content)=["'])(?!\/|https?:|data:)([^"']+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp))/gi,
      '$1/$2',
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

const cleanLegacyFragment = (html: string) => {
  return html.replace(/^\s*undefined/i, '')
}

async function buildLegacyHomeParts(): Promise<LegacyHomeParts> {
  const html = await readLegacyPage('index.html')
  const head = normalizeLegacyUrls(legacyHeadFrom(html))
  const main = between(html, '<main>', '</main>')
  const heroStart = main.indexOf('<section class="hero"')
  const heroEnd = heroStart === -1 ? -1 : main.indexOf('</section>', heroStart)
  const afterHero = heroEnd === -1 ? main : main.slice(heroEnd + '</section>'.length)
  const footerWithRest = after(html, '<footer class="mr-footer" data-header-theme="dark" aria-label="Website Footer">')
  const afterFooter = normalizeLegacyUrls(after(footerWithRest, '</footer>'))

  return {
    afterFooter,
    head,
    mainAfterHero: normalizeLegacyUrls(afterHero),
  }
}

export async function getLegacyHomeParts() {
  if (useLegacyPartsCache && legacyHomePartsCache) return legacyHomePartsCache

  const read = buildLegacyHomeParts()
  if (useLegacyPartsCache) legacyHomePartsCache = read

  try {
    return await read
  } catch (error) {
    if (useLegacyPartsCache) legacyHomePartsCache = null
    throw error
  }
}

const bodyClassFrom = (html: string) => {
  const match = html.match(/<body\b[^>]*class=["']([^"']+)["'][^>]*>/i)
  return match?.[1] || ''
}

const headerCurrentFrom = (html: string) => {
  const header = html.match(/<header\b[^>]*class=["'][^"']*\btopbar\b[^"']*["'][^>]*>/i)?.[0] || ''
  return header.match(/\bdata-current=["']([^"']+)["']/i)?.[1] || undefined
}

const headerThemeFrom = (html: string) => {
  const header = html.match(/<header\b[^>]*class=["'][^"']*\btopbar\b[^"']*["'][^>]*>/i)?.[0] || ''
  return header.match(/\bdata-header-theme=["']([^"']+)["']/i)?.[1] || undefined
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

async function buildComponentizedLegacyParts(fileName: string): Promise<ComponentizedLegacyParts> {
  if (path.dirname(fileName) !== '.' || !fileName.endsWith('.html')) {
    throw new Error(`Invalid componentized legacy page path: ${fileName}`)
  }

  const html = await readLegacyPage(fileName)
  const head = normalizeLegacyUrls(legacyHeadFrom(html))
  const headerStart = html.search(/<header\b[^>]*class=["'][^"']*\btopbar\b/i)
  const headerEnd = headerStart === -1 ? -1 : html.indexOf('</header>', headerStart) + '</header>'.length
  const contentStart = headerEnd === -1 ? contentStartWithoutHeader(html) : contentStartAfterHeader(html, headerEnd)
  const footerStart = html.search(/<footer\b[^>]*class=["'][^"']*\bmr-footer\b/i)
  const footerEnd = footerEndFrom(html, footerStart)
  const bodyClose = html.lastIndexOf('</body>')
  const contentEnd = footerStart === -1 ? (bodyClose === -1 ? html.length : bodyClose) : footerStart
  const afterFooter =
    footerEnd === -1 ? '' : normalizeLegacyUrls(html.slice(footerEnd, bodyClose === -1 ? html.length : bodyClose))

  return {
    afterFooter,
    bodyClass: bodyClassFrom(html),
    current: headerCurrentFrom(html),
    fileName,
    headerTheme: headerThemeFrom(html),
    head,
    pageContent: cleanLegacyFragment(normalizeLegacyUrls(html.slice(contentStart, contentEnd))),
  }
}

export async function getComponentizedLegacyParts(fileName: string) {
  if (useLegacyPartsCache) {
    const cached = componentizedLegacyPartsCache.get(fileName)
    if (cached) return cached
  }

  const read = buildComponentizedLegacyParts(fileName)
  if (useLegacyPartsCache) componentizedLegacyPartsCache.set(fileName, read)

  try {
    return await read
  } catch (error) {
    if (useLegacyPartsCache) componentizedLegacyPartsCache.delete(fileName)
    throw error
  }
}

export function clearLegacyPartsCache() {
  legacyHomePartsCache = null
  componentizedLegacyPartsCache.clear()
}

export async function getComponentizedLegacyStaticPaths() {
  const files = await listLegacyHtmlFiles()
  return files
    .map((file) => ({
      params: { slug: file.replace(/\.html$/i, '') },
      props: { legacyFile: file },
    }))
}
