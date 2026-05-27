import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type CollectionSlug = 'site-pages' | 'service-pages' | 'local-seo-pages' | 'portfolio-projects' | 'journal-posts' | 'portfolio-categories'
type DataRecord = Record<string, unknown>
type Issue = { label: string; message: string; severity: 'error' | 'warn' }

const collections: CollectionSlug[] = [
  'site-pages',
  'service-pages',
  'local-seo-pages',
  'portfolio-projects',
  'journal-posts',
  'portfolio-categories',
]

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

const asRecord = (value: unknown): DataRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as DataRecord) : {}

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const hasValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && typeof value !== 'undefined'
}

const valueAtPath = (data: DataRecord, dottedPath: string) =>
  dottedPath.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as DataRecord)[segment]
  }, data)

const labelFor = (collection: string, doc: DataRecord) =>
  `${collection}/${asString(doc.slug) || asString(doc.filename) || asString(doc.title) || String(doc.id || 'unknown')}`

const routeForDoc = (collection: string, doc: DataRecord) => {
  const slug = asString(doc.slug)
  if (!slug) return ''
  if (collection === 'portfolio-projects') return `/portfolio/${slug}`
  if (collection === 'journal-posts') return `/journal/${slug}`
  if (collection === 'site-pages') return slug === 'home' || doc.pageType === 'home' ? '/' : `/${slug}`
  if (collection === 'portfolio-categories') return '/portfolio'
  return `/${slug}`
}

const pathFromHref = (href: string) => {
  if (!href || /^(mailto:|tel:|#)/i.test(href)) return ''
  try {
    const url = new URL(href, 'https://matthiasramahi.de')
    if (!['matthiasramahi.de', 'www.matthiasramahi.de'].includes(url.hostname)) return ''
    return url.pathname.replace(/\/$/, '') || '/'
  } catch {
    return href.split(/[?#]/)[0].replace(/\/$/, '') || '/'
  }
}

const normalizeRouteVariants = (href: string) => {
  const pathname = pathFromHref(href)
  if (!pathname) return []
  const variants = new Set([pathname])
  if (pathname.endsWith('.html')) variants.add(pathname.replace(/\.html$/i, ''))
  else if (pathname !== '/') variants.add(`${pathname}.html`)
  return [...variants]
}

const walk = (value: unknown, visit: (record: DataRecord) => void) => {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }
  if (!value || typeof value !== 'object') return
  const record = value as DataRecord
  visit(record)
  for (const entry of Object.values(record)) walk(entry, visit)
}

const collectLinks = (value: unknown) => {
  const links: Array<{ href: string; label?: string }> = []
  walk(value, (record) => {
    const href = asString(record.href)
    if (href) links.push({ href, label: asString(record.label) })
  })
  return links
}

const collectImages = (doc: DataRecord) => {
  const images: Array<{ media: DataRecord; slot: string }> = []
  const push = (value: unknown, slot: string) => {
    const media = asRecord(value)
    if (media.id || media.filename || media.url) images.push({ media, slot })
  }

  push(valueAtPath(doc, 'seo.ogImage'), 'seo.ogImage')
  push(doc.coverImage, 'coverImage')
  push(doc.heroImage, 'heroImage')
  push(doc.teaserImage, 'teaserImage')

  for (const item of Array.isArray(doc.gallery) ? doc.gallery : []) push(asRecord(item).image, 'gallery')
  for (const block of Array.isArray(doc.blocks) ? doc.blocks : []) {
    const current = asRecord(block)
    if (current.blockType !== 'imageSequence') continue
    for (const item of Array.isArray(current.items) ? current.items : []) push(asRecord(item).image, 'imageSequence')
  }

  return images
}

const legacyRouteSet = () => {
  const repoRoot = path.resolve(process.cwd(), '../..')
  const routes = new Set<string>(['/'])

  for (const file of fs.readdirSync(repoRoot)) {
    if (!file.endsWith('.html')) continue
    const withoutExt = `/${file.replace(/\.html$/i, '')}`
    routes.add(`/${file}`)
    routes.add(withoutExt === '/index' ? '/' : withoutExt)
  }

  const pagesDir = path.join(repoRoot, 'apps/web/src/pages')
  const visitPages = (dir: string, segments: string[] = []) => {
    if (!fs.existsSync(dir)) return

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.startsWith('[')) continue
      const nextSegments = [...segments, entry.name]
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        visitPages(fullPath, nextSegments)
        continue
      }

      if (!/\.(astro|tsx?|mdx?)$/i.test(entry.name)) continue
      const routeSegments = nextSegments
        .join('/')
        .replace(/\.(astro|tsx?|mdx?)$/i, '')
        .replace(/\/index(?:\.html)?$/i, '')
        .replace(/^index(?:\.html)?$/i, '')
      const route = routeSegments ? `/${routeSegments}` : '/'
      routes.add(route)
      if (route.endsWith('.html')) routes.add(route.replace(/\.html$/i, '') || '/')
    }
  }

  visitPages(pagesDir)
  return routes
}

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: CollectionSlug, depth = 2) {
  const docs: DataRecord[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: collection as never,
      depth,
      draft: true,
      limit: 100,
      overrideAccess: true,
      page,
    })
    docs.push(...(result.docs as DataRecord[]))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return docs
}

const strict = process.argv.includes('--strict')
const issues: Issue[] = []
const canonicalCounts = new Map<string, string[]>()
const routeSet = legacyRouteSet()
let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const allDocs: Array<{ collection: CollectionSlug; doc: DataRecord }> = []

  for (const collection of collections) {
    const docs = await findAll(cms, collection)
    for (const doc of docs) {
      allDocs.push({ collection, doc })
      const route = routeForDoc(collection, doc)
      if (route) routeSet.add(route)
      const canonical = asString(valueAtPath(doc, 'seo.canonicalUrl'))
      if (canonical) {
        for (const variant of normalizeRouteVariants(canonical)) routeSet.add(variant)
        const key = pathFromHref(canonical)
        canonicalCounts.set(key, [...(canonicalCounts.get(key) || []), labelFor(collection, doc)])
      }
    }
  }

  for (const [canonical, labels] of canonicalCounts) {
    if (canonical && labels.length > 1 && canonical !== '/portfolio') {
      issues.push({ severity: 'warn', label: canonical, message: `Canonical wird mehrfach genutzt: ${labels.slice(0, 5).join(', ')}` })
    }
  }

  for (const { collection, doc } of allDocs) {
    const label = labelFor(collection, doc)
    const status = asString(doc._status)
    const title = asString(valueAtPath(doc, 'seo.title'))
    const description = asString(valueAtPath(doc, 'seo.description'))
    const canonical = asString(valueAtPath(doc, 'seo.canonicalUrl'))

    if (status === 'published') {
      if (title.length < 35) issues.push({ severity: 'warn', label, message: `SEO-Titel sehr kurz (${title.length} Zeichen).` })
      if (title.length > 70) issues.push({ severity: 'error', label, message: `SEO-Titel zu lang (${title.length} Zeichen).` })
      if (description.length < 90) issues.push({ severity: 'warn', label, message: `Meta-Beschreibung kurz (${description.length} Zeichen).` })
      if (description.length > 170) issues.push({ severity: 'error', label, message: `Meta-Beschreibung zu lang (${description.length} Zeichen).` })
      if (!canonical) issues.push({ severity: 'error', label, message: 'Canonical fehlt.' })
    }

    for (const { media, slot } of collectImages(doc)) {
      if (!hasValue(media.alt)) issues.push({ severity: 'error', label, message: `${slot}: Alt-Text fehlt.` })
      if (!hasValue(media.blurDataUrl)) issues.push({ severity: 'warn', label, message: `${slot}: Blur/LQIP fehlt.` })
      if ((slot === 'heroImage' || slot === 'coverImage') && (!hasValue(media.focalX) || !hasValue(media.focalY))) {
        issues.push({ severity: 'warn', label, message: `${slot}: Focal Point ist nicht gesetzt.` })
      }
    }

    for (const link of collectLinks(doc)) {
      if (!link.label && !/^(mailto:|tel:|#)/i.test(link.href)) {
        issues.push({ severity: 'warn', label, message: `Link ohne Label: ${link.href}` })
      }
      if (/^http:\/\//i.test(link.href)) issues.push({ severity: 'warn', label, message: `Externer Link nutzt HTTP statt HTTPS: ${link.href}` })
      const variants = normalizeRouteVariants(link.href)
      if (variants.length > 0 && !/^https?:\/\//i.test(link.href) && !variants.some((variant) => routeSet.has(variant))) {
        issues.push({ severity: 'warn', label, message: `Interner Link zeigt auf unbekannte Route: ${link.href}` })
      }
    }
  }

  for (const globalSlug of ['navigation', 'footer', 'global-ctas'] as const) {
    const globalDoc = (await cms.findGlobal({ slug: globalSlug, depth: 1, overrideAccess: true })) as unknown as DataRecord
    for (const link of collectLinks(globalDoc)) {
      if (!link.label && !/^(mailto:|tel:|#)/i.test(link.href)) issues.push({ severity: 'warn', label: globalSlug, message: `Link ohne Label: ${link.href}` })
      const variants = normalizeRouteVariants(link.href)
      if (variants.length > 0 && !/^https?:\/\//i.test(link.href) && !variants.some((variant) => routeSet.has(variant))) {
        issues.push({ severity: 'warn', label: globalSlug, message: `Interner Link zeigt auf unbekannte Route: ${link.href}` })
      }
    }
  }

  const errors = issues.filter((issue) => issue.severity === 'error')
  const warnings = issues.filter((issue) => issue.severity === 'warn')

  console.log('CMS SEO / Link / Image Audit')
  console.log('============================')
  console.log(`Gepruefte Dokumente: ${allDocs.length}`)
  console.log(`Bekannte interne Routen: ${routeSet.size}`)
  console.log(`Errors: ${errors.length}`)
  console.log(`Warnings: ${warnings.length}`)

  for (const issue of issues.slice(0, 80)) {
    console.log(`- [${issue.severity.toUpperCase()}] ${issue.label}: ${issue.message}`)
  }
  if (issues.length > 80) console.log(`- ... ${issues.length - 80} weitere Hinweise`)

  if (strict && errors.length > 0) process.exitCode = 1
} catch (error) {
  printPayloadScriptError(error, 'CMS SEO / Link / Image Audit')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
