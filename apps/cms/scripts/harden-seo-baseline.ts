import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type DataRecord = Record<string, unknown>

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

const labelFromTitle = (title: unknown, fallback: string) =>
  (asString(title) || fallback)
    .replace(/^Portfolio-Auswahl\s+/i, '')
    .replace(/\s+Portfolio$/i, '')
    .trim()

const clamp = (value: string, max: number) => (value.length <= max ? value : `${value.slice(0, max - 4).replace(/\s+\S*$/, '')}...`)

const siteUrl = (process.env.ASTRO_PUBLIC_SITE_URL || 'https://matthiasramahi.de').replace(/\/$/, '')

const absolutePath = (pathname: string) => `${siteUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`

const sourceFileOf = (doc: DataRecord) => asString(asRecord(doc.legacy).sourceFile)

const strengthenedLocalDescription = (doc: DataRecord) => {
  const title = asString(doc.title) || 'Fotografie in Duesseldorf und NRW'
  const intro = asString(doc.intro)
  const city = asString(doc.city)
  const service = asString(doc.service)
  const context = [service, city].filter(Boolean).join(' in ')
  const base = intro || `${context || title} von Matthias Ramahi`
  const description = `${title}: ${base}`
  if (description.length >= 90) return clamp(description, 168)

  return clamp(
    `${description}. Klare Bildsprache, kuratierte Auswahl und starke Motive fuer Web, Portfolio, SEO und Print in Duesseldorf / NRW.`,
    168,
  )
}

const sitePageSeo: Record<string, { title: string; description: string }> = {
  impressum: {
    title: 'Impressum | Matthias Ramahi Fotografie',
    description:
      'Impressum von Matthias Ramahi Fotografie mit Anbieterkennzeichnung, Kontaktmoeglichkeiten und rechtlichen Pflichtangaben fuer die Website.',
  },
  blog: {
    title: 'Journal zu Fotografie, Orten und Bildauswahl | Matthias Ramahi',
    description:
      'Journal von Matthias Ramahi ueber Fotografie, Bildauswahl, Orte, Druck, Serien und visuelle Entscheidungen in Duesseldorf und NRW.',
  },
  portfolio: {
    title: 'Portfolio Fotografie Duesseldorf & NRW | Matthias Ramahi',
    description:
      'Portfolio von Matthias Ramahi mit kuratierten Serien aus Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft.',
  },
}

async function findBySlug(payload: Awaited<ReturnType<typeof getPayload>>, collection: string, slug: string) {
  const result = await payload.find({
    collection: collection as never,
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    } as never,
  })

  return result.docs[0] as DataRecord | undefined
}

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: string) {
  const docs: DataRecord[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: collection as never,
      depth: 0,
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

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  let updates = 0
  let removedDuplicateLocalSeo = 0

  const journalSourceFiles = new Set((await findAll(cms, 'journal-posts')).map(sourceFileOf).filter(Boolean))

  for (const doc of await findAll(cms, 'local-seo-pages')) {
    const sourceFile = sourceFileOf(doc)
    if (sourceFile.startsWith('blog-') && journalSourceFiles.has(sourceFile)) {
      await cms.delete({
        collection: 'local-seo-pages' as never,
        id: doc.id as string | number,
        overrideAccess: true,
      })
      removedDuplicateLocalSeo += 1
      continue
    }

    const seo = asRecord(doc.seo)
    const description = asString(seo.description)
    if (description.length > 0 && description.length < 90) {
      await cms.update({
        collection: 'local-seo-pages' as never,
        id: doc.id as string | number,
        data: {
          seo: {
            ...seo,
            description: strengthenedLocalDescription(doc),
          },
        } as never,
        overrideAccess: true,
      })
      updates += 1
    }
  }

  for (const [slug, seo] of Object.entries(sitePageSeo)) {
    const doc = await findBySlug(cms, 'site-pages', slug)
    if (!doc?.id) continue
    await cms.update({
      collection: 'site-pages' as never,
      id: doc.id as string | number,
      data: { seo: { ...asRecord(doc.seo), ...seo } } as never,
      overrideAccess: true,
    })
    updates += 1
  }

  for (const doc of await findAll(cms, 'portfolio-projects')) {
    const label = labelFromTitle(doc.title, asString(doc.slug) || 'Portfolio')
    const seo = asRecord(doc.seo)
    await cms.update({
      collection: 'portfolio-projects' as never,
      id: doc.id as string | number,
      data: {
        seo: {
          ...seo,
          title: clamp(`${label} Portfolio-Auswahl | Matthias Ramahi Fotografie`, 70),
          description: clamp(
            `Portfolio-Auswahl ${label}: kuratierte Bildstrecke mit Licht, Details, Perspektive und visueller Produktion von Matthias Ramahi in Duesseldorf / NRW.`,
            168,
          ),
          canonicalUrl: absolutePath(`/portfolio/${asString(doc.slug)}`),
        },
      } as never,
      overrideAccess: true,
    })
    updates += 1
  }

  for (const doc of await findAll(cms, 'portfolio-categories')) {
    const label = labelFromTitle(doc.title, asString(doc.slug) || 'Portfolio')
    const seo = asRecord(doc.seo)
    await cms.update({
      collection: 'portfolio-categories' as never,
      id: doc.id as string | number,
      data: {
        seo: {
          ...seo,
          title: clamp(`${label} Portfolio Fotografie | Matthias Ramahi`, 70),
          description: clamp(
            `Kuratierte ${label}-Fotografie von Matthias Ramahi: Serien, Motive und Bildauswahl fuer Portfolio, Web, Print und visuelle Projekte in Duesseldorf / NRW.`,
            168,
          ),
          canonicalUrl: absolutePath('/portfolio'),
        },
      } as never,
      overrideAccess: true,
    })
    updates += 1
  }

  console.log(`SEO-Basis gehaertet: ${updates} Dokumente aktualisiert, ${removedDuplicateLocalSeo} doppelte Local-SEO-Blogimporte entfernt.`)
} catch (error) {
  printPayloadScriptError(error, 'SEO-Basis-Haertung')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
