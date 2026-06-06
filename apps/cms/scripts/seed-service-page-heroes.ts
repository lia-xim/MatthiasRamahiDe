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

type ServicePageDoc = Record<string, unknown> & {
  id?: RelationId
  heroPanels?: unknown[] | null
  heroSlides?: unknown[] | null
}

type ServiceHeroSeed = {
  heroImages: string[][]
  lead: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  slug: string
  titleLines: [string, string]
}

const serviceHeroSeeds: ServiceHeroSeed[] = [
  {
    slug: 'automobil-fotografie',
    titleLines: ['Automobil', 'Fotografie'],
    lead:
      'Kuratierte Fahrzeugserie mit Exterieur, Interieur, Details und Cinematic - als Bildsatz fuer Marke, Verkauf, Sammlung, Print und digitale Praesentation.',
    primaryLabel: 'Bilder ansehen',
    primaryHref: '#bilder',
    secondaryLabel: 'Projekt anfragen',
    secondaryHref: '#anfrage',
    heroImages: [['_DSC2321.webp', '_DSC2321-2560x1707.webp']],
  },
  {
    slug: 'sportwagen-fotografie',
    titleLines: ['Sportwagen', 'Fotografie'],
    lead:
      'Sportwagenfotografie ordnet ein, was Supercar-Fotografie, Performance-Car-Aufnahmen und Exotic-Car-Serien gemeinsam haben: Fahrzeuge, die bildlich nicht zufällig funktionieren, sondern geplant. Exterieur, Interieur, Lichtkanten und Reflexe werden in einer kontrollierten Komposition sichtbar - als Bildserie für Sammlung, Marke, Handel und Kampagne. Dieser Bereich ist der Ausgangspunkt des Sportwagen-Clusters; er verteilt auf Shooting-Anlässe, Fahrzeugklassen und Motiv-Schwerpunkte.',
    primaryLabel: 'Shooting buchen →',
    primaryHref: '#anfrage',
    secondaryLabel: 'Portfolio',
    secondaryHref: 'portfolio.html',
    heroImages: [
      ['assets-portfolio-dsc3982-1920.webp', 'assets-portfolio-dsc3982-1920-1920x1280.webp'],
      ['assets-portfolio-dsc3879-1920.webp', 'assets-portfolio-dsc3879-1920-1920x1280.webp'],
      ['_DSC9321-Enhanced-NR-2.webp', '_DSC9321-Enhanced-NR-2-1707x2560.webp'],
    ],
  },
  {
    slug: 'oldtimer-fotografie',
    titleLines: ['Oldtimer', 'Fotografie'],
    lead:
      'Oldtimerfotografie und Classic-Car-Fotografie in NRW - Bildserien für Sammlung, Auktion, Verkauf und Ausstellung. Lack, Chrom, Patina und Herkunft werden präzise dokumentiert, ob Sammlerfahrzeug, Youngtimer oder Fahrzeug mit Museumscharakter. Location und Lichtfenster werden in ganz NRW gewählt; der Ausgangspunkt ist immer das Fahrzeug selbst.',
    primaryLabel: 'Projekt anfragen',
    primaryHref: '#anfrage',
    secondaryLabel: 'Arbeiten ansehen',
    secondaryHref: '/portfolio.html',
    heroImages: [['assets-photos-oldtimer-stage-1920.webp', 'assets-photos-oldtimer-stage-1280.webp']],
  },
  {
    slug: 'motorrad-fotografie',
    titleLines: ['Motorrad', 'Fotografie'],
    lead:
      'Motorradfotografie: Silhouette, Mechanik, Haltung und Fahrerbezug werden als kuratierte Serie geplant - kein generisches Bike-Foto, sondern ein Bildsatz, der Maschine und Charakter gemeinsam trägt. Der Cluster reicht von der ruhigen Standstudie über custom bike fotografie und biker portrait bis zu motorrad verkaufsfotos für Händler und Privatverkäufer. Geplant wird in ganz NRW; Lichtfenster, Location und Output werden präzise auf Maschine und Nutzung abgestimmt.',
    primaryLabel: 'Shooting buchen →',
    primaryHref: '#anfrage',
    secondaryLabel: 'Portfolio',
    secondaryHref: 'portfolio.html',
    heroImages: [
      ['assets-photos-motorrad-ninja-road-1921.webp', 'assets-photos-motorrad-ninja-road-1921-1920x2880.webp'],
      ['assets-portfolio-dsc3892-1920.webp', 'assets-portfolio-dsc3892-1920-1920x1280.webp'],
      ['assets-photos-motorrad-duke-1921.webp', 'assets-photos-motorrad-duke-1921-1920x3413.webp'],
    ],
  },
  {
    slug: 'portraitfotografie',
    titleLines: ['Porträt', 'Fotografie'],
    lead:
      'Ein Portrait ist keine Aufnahme - es ist eine Entscheidung über Licht, Abstand und den richtigen Moment. Ob Business Portrait, Personal Branding oder outdoor portrait fotoshooting: die Komposition folgt der Person, nicht der Pose. Matthias Ramahi begleitet Portraitfotografie-Produktionen ruhig und präzise - vom ersten Briefing bis zur kuratierten Bildserie.',
    primaryLabel: 'Portraitshooting anfragen →',
    primaryHref: '#anfrage',
    secondaryLabel: 'Portfolio',
    secondaryHref: 'portfolio.html',
    heroImages: [
      ['_DSC0470-Enhanced-NR-2.webp', '_DSC0470-Enhanced-NR-2-1600x2560.webp'],
      ['_DSC9301-Enhanced-NR.webp', '_DSC9301-Enhanced-NR-2048x2560.webp'],
      ['20250327-DSC01550-2.webp', '20250327-DSC01550-2-720x1090.webp'],
      ['_DSC9321-Enhanced-NR-2.webp', '_DSC9321-Enhanced-NR-2-1100x1650.webp'],
    ],
  },
  {
    slug: 'landschaftsfotografie',
    titleLines: ['Landschaft', 'Fotografie'],
    lead:
      'Landschaftsfotografie als kuratierter Bestand - Weite, Textur und Licht, präzise auf Großformat und Fine-Art-Print ausgelegt. Jede Bildserie entsteht mit Blick auf das Wandbild: Komposition, Lichtkante und Bildraum sind von Anfang an auf Druck gerechnet. Naturfotografie aus NRW und dem Rheinland, verfügbar als Edition, Leinwand oder Einzelabzug - nach Umfang.',
    primaryLabel: 'Landschafts-Serie anfragen →',
    primaryHref: '#anfrage',
    secondaryLabel: 'Portfolio',
    secondaryHref: 'portfolio.html',
    heroImages: [
      ['Wettberwerb_Foto5_Wunder_der_Natur2-1.webp', 'Wettberwerb_Foto5_Wunder_der_Natur2-1-720x471.webp'],
      ['Wettberwerb_Foto6_Wunder_der_Natur-1.webp', 'Wettberwerb_Foto6_Wunder_der_Natur-1-720x520.webp'],
      ['20250605-DSC03756-2.webp', '20250605-DSC03756-2-720x1080.webp'],
      ['20250605-DSC04020-2.webp', '20250605-DSC04020-2-720x1080.webp'],
      ['assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Wettberwerb_Foto10_Wunder_der_natur.webp'],
    ],
  },
]

const unique = <T>(values: T[]) => Array.from(new Set(values))

const relationIdFor = (value: unknown): RelationId | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return undefined
}

const cleanAssetPath = (candidate: string) => {
  const withoutHost = candidate.replace(/^https?:\/\/[^/]+\//, '')
  const withoutQuery = withoutHost.split('?')[0]?.split('#')[0] || ''
  const trimmed = withoutQuery.trim().replace(/\\/g, '/').replace(/^\/+/, '')

  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

const filenameFor = (candidate: string) => cleanAssetPath(candidate).split('/').filter(Boolean).at(-1) || ''
const stemFor = (filename: string) => filename.replace(/\.[^.]+$/, '')
const stripDerivativeSize = (stem: string) => stem.replace(/-\d+x\d+$/, '')

async function findMediaByExactCandidate(candidate: string): Promise<RelationId | undefined> {
  const cleanPath = cleanAssetPath(candidate)
  const filename = filenameFor(candidate)

  if (!cleanPath && !filename) return undefined

  const found = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      or: [
        { legacySourcePath: { equals: cleanPath } },
        { legacySourcePath: { equals: `/${cleanPath}` } },
        { filename: { equals: filename } },
      ],
    } as never,
  })

  return relationIdFor(found.docs[0]?.id)
}

async function findMediaByLooseStem(stem: string): Promise<RelationId | undefined> {
  if (stem.length < 4) return undefined

  const found = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      or: [{ filename: { like: stem } }, { legacySourcePath: { like: stem } }],
    } as never,
  })

  return relationIdFor(found.docs[0]?.id)
}

async function resolveMediaId(candidates: string[]): Promise<RelationId | undefined> {
  const cleanCandidates = unique(candidates.map(cleanAssetPath).filter(Boolean))

  for (const candidate of cleanCandidates) {
    const exactId = await findMediaByExactCandidate(candidate)
    if (exactId) return exactId
  }

  const stems = unique(
    cleanCandidates.flatMap((candidate) => {
      const filename = filenameFor(candidate)
      const stem = stemFor(filename)
      const withoutDerivativeSize = stripDerivativeSize(stem)
      return [stem, withoutDerivativeSize]
    }).filter(Boolean),
  )

  for (const stem of stems) {
    const looseId = await findMediaByLooseStem(stem)
    if (looseId) return looseId
  }

  return undefined
}

const hasFilledRows = (value: unknown) => Array.isArray(value) && value.length > 0

async function buildHeroPanels(seed: ServiceHeroSeed) {
  const panels: Array<{ image: RelationId }> = []
  const missing: string[] = []

  for (const imageCandidates of seed.heroImages) {
    const image = await resolveMediaId(imageCandidates)
    if (image) panels.push({ image })
    else missing.push(imageCandidates[0] || '(unbekannt)')
  }

  return { missing, panels }
}

async function findServicePage(slug: string) {
  const found = await payload.find({
    collection: 'service-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })

  return found.docs[0] as unknown as ServicePageDoc | undefined
}

try {
  const updated: string[] = []
  const skipped: string[] = []
  const warnings: string[] = []

  for (const seed of serviceHeroSeeds) {
    const doc = await findServicePage(seed.slug)
    if (!doc?.id) {
      warnings.push(`${seed.slug}: Service-Seite nicht gefunden`)
      continue
    }

    const data: Record<string, unknown> = {}
    const filled: string[] = []

    const { missing, panels } = await buildHeroPanels(seed)
    if (missing.length > 0) warnings.push(`${seed.slug}: Medien nicht gefunden: ${missing.join(', ')}`)

    if (!hasFilledRows(doc.heroSlides)) {
      const heroImage = panels[0]?.image
      if (heroImage) {
        data.heroSlides = [
          {
            image: heroImage,
            headlineLine1: seed.titleLines[0],
            headlineLine2: seed.titleLines[1],
            lead: seed.lead,
            durationSec: 7,
            primaryLabel: seed.primaryLabel,
            primaryHref: seed.primaryHref,
            secondaryLabel: seed.secondaryLabel,
            secondaryHref: seed.secondaryHref,
          },
        ]
        filled.push('Hero-Text/CTA/Hauptbild')
      } else {
        warnings.push(`${seed.slug}: Hero-Slide nicht gesetzt, weil das erste Hero-Bild fehlt`)
      }
    } else {
      skipped.push(`${seed.slug}: Hero-Slides bereits vorhanden`)
    }

    if (!hasFilledRows(doc.heroPanels)) {
      if (panels.length > 0) {
        data.heroPanels = panels
        filled.push(`Hero-Bilder (${panels.length}/${seed.heroImages.length})`)
      }
    } else {
      skipped.push(`${seed.slug}: Hero-Bilder bereits vorhanden`)
    }

    if (filled.length === 0) continue

    await payload.update({
      collection: 'service-pages',
      id: doc.id,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })

    updated.push(`${seed.slug}: ${filled.join(', ')}`)
  }

  payload.logger.info(
    `Service-Heros synchronisiert: ${updated.length} Seiten aktualisiert. ${updated.join('; ') || 'Keine Updates.'}`,
  )

  if (skipped.length > 0) payload.logger.info(`Uebersprungen: ${skipped.join('; ')}`)
  if (warnings.length > 0) payload.logger.warn(`Warnungen: ${warnings.join('; ')}`)
} catch (error) {
  printPayloadScriptError(error, 'Service-Hero-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
