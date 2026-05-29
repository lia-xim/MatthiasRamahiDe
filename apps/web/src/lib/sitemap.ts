import {
  getLegacyRedirectTarget,
  isLegacyRedirectFile,
  listNativeHtmlRouteFiles,
} from './adoptedRoutes'
import { getAdoptedPageChrome } from './adoptedPageChrome'
import { getConceptArchivePage } from './conceptArchiveContent'
import {
  configuredSiteUrl,
  imageAlt,
  imageUrl,
  listDocuments,
  routeForDoc,
  toAbsoluteSiteUrl,
  type PayloadDoc,
  type PayloadMedia,
} from './payload'

export type SitemapSection = 'pages' | 'local-seo' | 'services' | 'journal' | 'portfolio'

export type SitemapEntry = {
  loc: string
  lastmod?: string
  images?: Array<{ loc: string; title?: string }>
}

const photoClusterPrefixes = [
  'automobil-fotografie',
  'automotive-fotografie',
  'autofotografie',
  'autohaus-fotografie',
  'autoverkauf-fotos',
  'fahrzeugfotografie',
  'sportwagen-fotografie',
  'sportwagen-shooting',
  'sportwagen-fotoshooting',
  'performance-car-fotografie',
  'exotic-car-fotografie',
  'supersportwagen-fotografie',
  'oldtimer-fotografie',
  'oldtimer-shooting',
  'oldtimer-verkaufsfotos',
  'classic-car-fotografie',
  'youngtimer-fotografie',
  'sammlerfahrzeug-fotografie',
  'motorrad-fotografie',
  'motorrad-shooting',
  'motorrad-verkaufsfotos',
  'bike-fotografie',
  'custom-bike-fotografie',
  'biker-portrait',
  'portraitfotografie',
  'business-portrait',
  'headshot-fotograf',
  'personal-branding-fotografie',
  'unternehmensportrait',
  'pressefoto',
  'landschaftsfotografie',
  'landschaftsbilder',
  'fine-art-prints',
  'wandbilder-landschaftsfotografie',
  'naturfotografie-prints',
  'fotografie-',
]

const servicePrefixes = [
  'leistungen',
  'fotolabor-druck',
  'grossformatdruck',
  'drucke-sonderanfertigungen',
  'webdesign-seo',
  'videografie',
  'werbetechnik',
  'viola-musik',
]

export const sitemapSections: SitemapSection[] = ['pages', 'local-seo', 'services', 'journal', 'portfolio']

export const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const decodeEntities = (value?: string) => {
  let text = String(value || '')
  for (let index = 0; index < 8; index += 1) {
    const decoded = text
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    if (decoded === text) return decoded
    text = decoded
  }
  return text
}

const dateOnly = (value?: string | number | Date) => {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().slice(0, 10)
}

const legacyUrlForFile = (file: string) => (file === 'index.html' ? '/' : `/${file}`)

const sectionForLegacyFile = (file: string): SitemapSection => {
  const slug = file.replace(/\.html$/, '')
  if (file.startsWith('blog')) return 'journal'
  if (slug.includes('portfolio')) return 'portfolio'
  if (photoClusterPrefixes.some((prefix) => slug.startsWith(prefix))) return 'local-seo'
  if (servicePrefixes.some((prefix) => slug.startsWith(prefix))) return 'services'
  return 'pages'
}

const sectionForCollection = (collection: string): SitemapSection => {
  if (collection === 'local-seo-pages') return 'local-seo'
  if (collection === 'service-pages') return 'services'
  if (collection === 'journal-posts') return 'journal'
  if (collection === 'portfolio-projects') return 'portfolio'
  return 'pages'
}

const mediaTitle = (media: PayloadMedia | string | undefined, fallback?: string) => {
  if (!media || typeof media === 'string') return fallback
  return imageAlt(media, fallback || media.title || '')
}

const collectCmsImages = (doc: PayloadDoc) => {
  const images: Array<{ media: PayloadMedia | string | undefined; title?: string }> = [
    { media: doc.seo?.ogImage, title: doc.title },
    { media: doc.coverImage, title: doc.title },
    { media: doc.heroImage, title: doc.title },
    { media: doc.teaserImage, title: doc.title },
  ]

  for (const item of doc.gallery ?? []) {
    images.push({ media: item.image, title: item.caption || doc.title })
  }

  for (const block of Array.isArray(doc.blocks) ? doc.blocks : []) {
    if (!block || typeof block !== 'object') continue
    const current = block as { blockType?: string; headline?: string; items?: Array<{ image?: PayloadMedia | string; caption?: string }> }
    if (current.blockType !== 'imageSequence') continue
    for (const item of current.items ?? []) {
      images.push({ media: item.image, title: item.caption || current.headline || doc.title })
    }
  }

  const seen = new Set<string>()

  return images
    .map(({ media, title }): { loc: string; title?: string } | null => {
      const loc = imageUrl(media, 'hero')
      if (!loc || seen.has(loc)) return null
      seen.add(loc)
      const resolvedTitle = mediaTitle(media, title)
      return resolvedTitle ? { loc, title: resolvedTitle } : { loc }
    })
    .filter((item): item is { loc: string; title?: string } => Boolean(item))
}

export async function nativeRouteSitemapEntries(section?: SitemapSection): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  const files = listNativeHtmlRouteFiles()

  for (const file of files) {
    if (isLegacyRedirectFile(file) || getLegacyRedirectTarget(file) || getConceptArchivePage(file)) continue
    if (section && sectionForLegacyFile(file) !== section) continue

    const chrome = getAdoptedPageChrome(file)
    const images = [...(chrome.ogImage ? [chrome.ogImage] : []), ...(chrome.preloadImages || [])]
      .filter(Boolean)
      .slice(0, 12)
      .map((image) => ({
        loc: toAbsoluteSiteUrl(image),
        title: decodeEntities(chrome.title || 'Matthias Ramahi Fotografie'),
      }))

    entries.push({
      loc: toAbsoluteSiteUrl(legacyUrlForFile(file)),
      images,
    })
  }

  return entries
}

export async function cmsSitemapEntries(section?: SitemapSection): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  const collections = ['portfolio-projects', 'service-pages', 'local-seo-pages', 'journal-posts', 'site-pages']

  for (const collection of collections) {
    if (section && sectionForCollection(collection) !== section) continue

    const docs = await listDocuments(collection, { limit: 1000, depth: 1 })
    docs
      .filter((doc) => doc._status !== 'draft' && !doc.seo?.noIndex)
      .forEach((doc: PayloadDoc) => {
        const loc = doc.seo?.canonicalUrl || routeForDoc(collection, doc)
        entries.push({
          loc: toAbsoluteSiteUrl(loc),
          lastmod: dateOnly(doc.updatedAt || doc.publishedAt),
          images: collectCmsImages(doc),
        })
      })
  }

  return entries
}

export async function sitemapEntries(section?: SitemapSection): Promise<SitemapEntry[]> {
  const entries = [...(await nativeRouteSitemapEntries(section)), ...(await cmsSitemapEntries(section))]
  const byUrl = new Map<string, SitemapEntry>()

  for (const entry of entries) {
    const normalized = toAbsoluteSiteUrl(entry.loc).replace(/\/$/, '')
    const key = normalized || configuredSiteUrl()
    const existing = byUrl.get(key)
    if (!existing || (entry.lastmod && (!existing.lastmod || entry.lastmod > existing.lastmod))) {
      byUrl.set(key, { ...entry, loc: normalized || configuredSiteUrl() })
    }
  }

  return [...byUrl.values()].sort((a, b) => a.loc.localeCompare(b.loc))
}

export async function imageSitemapEntries(): Promise<SitemapEntry[]> {
  return (await sitemapEntries())
    .map((entry) => ({
      ...entry,
      images: (entry.images ?? []).filter((image) => image.loc && !image.loc.includes('localhost')).slice(0, 20),
    }))
    .filter((entry) => entry.images && entry.images.length > 0)
}

export function urlsetXml(entries: SitemapEntry[], options: { images?: boolean } = {}) {
  const imageNs = options.images ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNs}>
${entries
  .map((entry) => {
    const imageXml =
      options.images && entry.images
        ? entry.images
            .map(
              (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>${image.title ? `
      <image:title>${escapeXml(image.title)}</image:title>` : ''}
    </image:image>`,
            )
            .join('\n')
        : ''

    return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''}${imageXml ? `
${imageXml}` : ''}
  </url>`
  })
  .join('\n')}
</urlset>`
}

export function sitemapIndexXml() {
  const siteUrl = configuredSiteUrl()
  const today = new Date().toISOString().slice(0, 10)
  const files = [
    ...sitemapSections.map((section) => `sitemap-${section}.xml`),
    'sitemap-images.xml',
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (file) => `  <sitemap>
    <loc>${escapeXml(`${siteUrl}/${file}`)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`,
  )
  .join('\n')}
</sitemapindex>`
}
