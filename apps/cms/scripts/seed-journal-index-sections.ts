import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

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

async function resolveMediaId(candidates: string[]): Promise<RelationId | undefined> {
  for (const candidate of candidates) {
    const cleanPath = normalizeAssetPath(candidate)
    const filename = path.basename(cleanPath)
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { or: [{ legacySourcePath: { equals: cleanPath } }, { filename: { equals: filename } }] } as never,
    })
    const id = found.docs[0]?.id
    if (typeof id === 'string' || typeof id === 'number') return id
  }

  for (const candidate of candidates) {
    const stem = path.basename(normalizeAssetPath(candidate)).replace(/\.[^.]+$/, '')
    if (!stem) continue
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { filename: { like: stem } } as never,
    })
    const id = found.docs[0]?.id
    if (typeof id === 'string' || typeof id === 'number') return id
  }

  payload.logger.warn(`Kein Media-Eintrag gefunden fuer: ${candidates.join(', ')}`)
  return undefined
}

const isFilledArray = (value: unknown) => Array.isArray(value) && value.length > 0
const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0

const IMG = {
  sunset: ['assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/optimized/assets-photos-automobil-sunset-960.webp'],
  neon: ['assets/optimized/assets-photos-automobil-neon-1920.webp', 'assets/optimized/assets-photos-automobil-neon-960.webp'],
  oldtimer: ['assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'assets/optimized/assets-photos-oldtimer-stage-960.webp'],
  portrait: ['assets/optimized/assets-photos-portrait-warm-720.webp', 'assets/photos/portrait-warm.webp'],
  print: ['assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp'],
}

const heroSeeds = [
  {
    img: IMG.sunset,
    headlineLine1: 'Notizen',
    headlineLine2: 'aus Licht.',
    lead: 'Ein kuratiertes Journal ueber Fotografie, Orte, Bildauswahl und Praesentation - ruhig, persoenlich, ohne Content-Masse.',
  },
  {
    img: IMG.neon,
    headlineLine1: 'Automotive',
    headlineLine2: 'Lichtfuehrung.',
    lead: 'Standort, Lichtkante und Karosserieform entscheiden darueber, ob ein Fahrzeug lebendig wirkt.',
  },
  {
    img: IMG.oldtimer,
    headlineLine1: 'Serien',
    headlineLine2: 'kuratieren.',
    lead: 'Von der ersten Auswahl bis zur Reihenfolge, die beim Betrachten Spannung haelt.',
  },
]

const heroSlideSeed = async (seed: (typeof heroSeeds)[number]) => {
  const image = await resolveMediaId(seed.img)
  if (!image) return undefined
  return {
    image,
    headlineLine1: seed.headlineLine1,
    headlineLine2: seed.headlineLine2,
    lead: seed.lead,
    primaryLabel: 'Artikel ansehen',
    primaryHref: '#journal',
    secondaryLabel: 'Fotoauftrag anfragen',
    secondaryHref: '/contact.html',
    durationSec: 7,
  }
}

try {
  const found = await payload.find({
    collection: 'site-pages',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: 'journal-index' } },
  })
  const doc = found.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Journal-Uebersicht (pageType=journal-index) in Payload nicht gefunden.')

  const group = doc.journalIndex || {}
  const next: Record<string, unknown> = { ...group }
  const data: Record<string, unknown> = {}
  const filled: string[] = []
  const skipped: string[] = []

  if (!isFilledArray(doc.heroSlides)) {
    const heroSlides = (await Promise.all(heroSeeds.map(heroSlideSeed))).filter(Boolean)
    if (heroSlides.length > 0) {
      data.heroSlides = heroSlides
      filled.push('Hero-Slides')
    }
  } else skipped.push('Hero-Slides')

  if (!isFilledArray(group.tickerItems)) {
    next.tickerItems = [
      '<b>Automotive</b> Lichtfuehrung',
      'Portrait ohne Location-Klischee',
      '<b>Duesseldorf</b> Locations',
      'Fine-Art-Druck',
      'Bildauswahl fuer Kunden',
      '<b>Behind the scenes</b>',
    ].map((text) => ({ text }))
    filled.push('Ticker')
  } else skipped.push('Ticker')

  const featured = group.featured || {}
  if (!hasText(featured.headline) || !hasText(featured.text)) {
    next.featured = {
      kicker: featured.kicker || 'Ausgewaehlter Beitrag',
      headline: featured.headline || 'Geplant, nicht zufaellig.',
      text:
        featured.text ||
        'Ein starkes Foto entsteht nicht erst beim Ausloesen - sondern in der Entscheidung fuer Ort, Tageszeit, Bildschnitt und Stimmung.',
      buttonLabel: featured.buttonLabel || 'Beitrag lesen',
      buttonHref: featured.buttonHref || '/blog-automotive-fotografie-duesseldorf.html',
      image: featured.image || (await resolveMediaId(IMG.sunset)),
    }
    filled.push('Ausgewaehlter Beitrag')
  } else skipped.push('Ausgewaehlter Beitrag')

  if (!isFilledArray(group.filters)) {
    next.filters = [
      { label: 'Alle', value: 'all' },
      { label: 'Automotive', value: 'automotive' },
      { label: 'Portrait', value: 'portrait' },
      { label: 'Prozess', value: 'prozess' },
      { label: 'Druck', value: 'print' },
    ]
    filled.push('Filter')
  } else skipped.push('Filter')

  if (!hasText(group.indexHeadline)) {
    next.indexHeadline = 'Journal Index.'
    next.initialVisiblePostCount = 6
    next.loadMoreLabel = 'Mehr Beitraege laden'
    next.loadStatusTemplate = '{visible} von {total} Beitraegen sichtbar'
    filled.push('Index-Kopf')
  } else skipped.push('Index-Kopf')

  const finalCta = group.finalCta || {}
  if (!hasText(finalCta.headline) || !hasText(finalCta.text)) {
    next.finalCta = {
      kicker: finalCta.kicker || 'Naechster Schritt',
      headline: finalCta.headline || 'Fotoauftrag planen.',
      text:
        finalCta.text ||
        'Wenn Sie Automotive-Aufnahmen, Portraits, eine Bildstrecke oder eine hochwertige visuelle Praesentation benoetigen, schicken Sie kurz Ort, Zeitraum und Ziel des Projekts.',
      primaryLabel: finalCta.primaryLabel || 'Projekt anfragen',
      primaryHref: finalCta.primaryHref || '/contact.html',
      secondaryLabel: finalCta.secondaryLabel || 'Portfolio ansehen',
      secondaryHref: finalCta.secondaryHref || '/portfolio.html',
    }
    filled.push('Abschluss-CTA')
  } else skipped.push('Abschluss-CTA')

  if (filled.length === 0) {
    payload.logger.info('Journal-Uebersicht ist bereits gefuellt - nichts zu tun.')
  } else {
    data.journalIndex = next
    await payload.update({
      collection: 'site-pages',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(`Journal-Uebersicht gefuellt: ${filled.join(', ')}. Uebersprungen: ${skipped.join(', ') || '-'}.`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Journal-Uebersicht-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
