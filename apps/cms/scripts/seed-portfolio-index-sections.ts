import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import {
  portfolioArchivePhotos,
  portfolioContext,
  portfolioHeroSlidesFallback,
  portfolioSpreads,
  type PortfolioPhoto,
} from '../../web/src/lib/portfolioIndexContent'
import { printPayloadScriptError } from './lib/errors'

// Befuellt die Portfolio-Uebersicht (pageType 'portfolio-index') mit eigenem Hero,
// Kontext, Bildstrecken/Slices, Archiv und Kontakt. Nicht-destruktiv: bereits
// gepflegte CMS-Felder bleiben erhalten.

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

type RelationId = string | number

const normalizeAssetPath = (value: string) => value.split('?')[0].split('#')[0].trim().replace(/^\/+/, '')
const basenameCandidates = (value: string) => {
  const cleanPath = normalizeAssetPath(value)
  const filename = path.basename(cleanPath)
  const decoded = (() => {
    try {
      return decodeURIComponent(filename)
    } catch {
      return filename
    }
  })()
  return [...new Set([cleanPath, filename, decoded].filter(Boolean))]
}

async function resolveMediaId(candidates: string[]): Promise<RelationId | undefined> {
  for (const candidate of candidates.flatMap(basenameCandidates)) {
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { or: [{ legacySourcePath: { equals: candidate } }, { filename: { equals: path.basename(candidate) } }] } as never,
    })
    const id = found.docs[0]?.id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  payload.logger.warn(`Kein Media-Eintrag gefunden fuer: ${candidates.join(', ')}`)
  return undefined
}

const isFilledArray = (value: unknown) => Array.isArray(value) && value.length > 0
const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0

const portfolioPhotoSeed = async (photo: PortfolioPhoto) => {
  const image = await resolveMediaId([photo.src, photo.href])
  const fullImage = await resolveMediaId([photo.href, photo.src])
  const relation = image || fullImage
  if (!relation) return undefined

  return {
    image: relation,
    fullImage: fullImage || relation,
    caption: photo.caption,
    href: photo.href,
  }
}

const heroSlideSeed = async (slide: (typeof portfolioHeroSlidesFallback)[number]) => {
  const image = await resolveMediaId([slide.image])
  if (!image) return undefined

  return {
    image,
    headlineLine1: slide.titleLines[0],
    headlineLine2: slide.titleLines[1],
    lead: slide.lead,
    primaryLabel: slide.primaryLabel,
    primaryHref: slide.primaryHref,
    secondaryLabel: slide.secondaryLabel,
    secondaryHref: slide.secondaryHref,
    durationSec: 7,
  }
}

try {
  const found = await payload.find({
    collection: 'site-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: 'portfolio-index' } },
  })
  const doc = found.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Portfolio-Uebersicht (pageType=portfolio-index) in Payload nicht gefunden.')

  const group = doc.portfolioIndex || {}
  const next: Record<string, unknown> = { ...group }
  const data: Record<string, unknown> = {}
  const filled: string[] = []
  const skipped: string[] = []

  if (!isFilledArray(doc.heroSlides)) {
    const heroSlides = (await Promise.all(portfolioHeroSlidesFallback.map(heroSlideSeed))).filter(Boolean)
    if (heroSlides.length > 0) {
      data.heroSlides = heroSlides
      filled.push('Hero-Slides')
    }
  } else skipped.push('Hero-Slides')

  if (!hasText(group.contextKicker)) {
    next.contextKicker = 'Einordnung'
    filled.push('Kontext-Kicker')
  }
  if (!hasText(group.contextHeadline)) {
    next.contextHeadline = 'Serien statt Sammelmappe.'
    filled.push('Kontext-Headline')
  }
  if (!isFilledArray(group.contextBody)) {
    next.contextBody = portfolioContext.map((text) => ({ text }))
    filled.push('Kontexttexte')
  } else skipped.push('Kontexttexte')

  if (!isFilledArray(group.slices)) {
    const slices = []
    for (const spread of portfolioSpreads) {
      const photos = (await Promise.all(spread.photos.map(portfolioPhotoSeed))).filter(Boolean)
      slices.push({
        anchor: spread.id,
        label: spread.label,
        heading: spread.heading,
        theme: spread.theme,
        href: spread.href,
        linkLabel: spread.linkLabel,
        photos,
      })
    }
    next.slices = slices
    filled.push('Bildstrecken/Slices')
  } else skipped.push('Bildstrecken/Slices')

  const archive = group.archive || {}
  const nextArchive: Record<string, unknown> = { ...archive }
  if (!hasText(archive.headline)) nextArchive.headline = 'Bildarchiv'
  if (!archive.batchSize) nextArchive.batchSize = 12
  if (!isFilledArray(archive.items)) {
    nextArchive.items = (await Promise.all(portfolioArchivePhotos.map(portfolioPhotoSeed))).filter(Boolean)
    filled.push('Archivbilder')
  } else skipped.push('Archivbilder')
  next.archive = nextArchive

  const contact = group.contact || {}
  if (!hasText(contact.subject) || !hasText(contact.headline) || !hasText(contact.lead)) {
    next.contact = {
      subject: contact.subject || 'Shooting Anfrage',
      headline: contact.headline || 'Shooting <em>anfragen.</em>',
      lead:
        contact.lead ||
        'Schreiben Sie kurz, welche Bildsprache Sie interessiert, wofuer die Aufnahmen genutzt werden und welchen Zeitraum Sie planen. Dann klaeren wir Motiv, Umfang, Rechte und Ausgabe sauber gemeinsam.',
    }
    filled.push('Kontaktmodul')
  } else skipped.push('Kontaktmodul')

  data.portfolioIndex = next

  if (filled.length === 0) {
    payload.logger.info('Portfolio-Uebersicht ist bereits gefuellt - nichts zu tun.')
  } else {
    await payload.update({
      collection: 'site-pages',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(`Portfolio-Uebersicht gefuellt: ${filled.join(', ')}. Uebersprungen: ${skipped.join(', ') || '-'}.`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Portfolio-Uebersicht-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
