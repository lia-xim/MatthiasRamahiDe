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
const repoRoot = path.resolve(process.cwd(), '../..')

type RelationId = string | number

type MediaDoc = {
  id: RelationId
  alt?: string | null
  category?: string | null
  filename?: string | null
  imageType?: string[] | null
  legacySourcePath?: string | null
  title?: string | null
  usageNotes?: string | null
  usagePurpose?: string[] | null
  visualTone?: string[] | null
}

type HeroSlideDoc = Record<string, unknown> & {
  image?: MediaDoc | RelationId | null
}

type HeroSlideSeed = {
  sourcePath: string
  replaceSourcePaths?: string[]
  headlineLine1: string
  headlineLine2?: string
  lead: string
  alt: string
  category: 'automotive' | 'landschaft' | 'motorrad' | 'oldtimer'
  imageType: ('automotive' | 'landscape' | 'motorcycle')[]
  visualTone: ('dark-cinematic' | 'light-editorial' | 'warm-atmospheric')[]
  tags: string[]
}

const defaultHeroCtas = {
  primaryHref: '#anfrage',
  primaryLabel: 'Projekt anfragen',
  secondaryHref: '/portfolio.html',
  secondaryLabel: 'Arbeiten ansehen',
}

const seedSlides: HeroSlideSeed[] = [
  {
    sourcePath: '/assets/optimized/assets-portfolio-dsc3879-1920.webp',
    replaceSourcePaths: [
      '/assets/optimized/mpik8b82-dsc3879-1280.webp',
      '/assets/optimized/mpik8b82-dsc3879-1920.webp',
    ],
    headlineLine1: 'Fotografie',
    headlineLine2: 'Duesseldorf',
    lead: 'Automobil-, Portrait- und Landschaftsfotografie aus Duesseldorf fuer Marken, Sammler und Menschen mit Anspruch.',
    alt: 'Fotografische Hero-Aufnahme von Matthias Ramahi fuer die Startseite',
    category: 'automotive',
    imageType: ['automotive'],
    visualTone: ['light-editorial'],
    tags: ['Startseite', 'Hero', 'Duesseldorf', 'Fotografie'],
  },
  {
    sourcePath: '/assets/optimized/assets-photos-automobil-neon-1920.webp',
    replaceSourcePaths: ['/assets/optimized/assets-photos-automobil-neon-1280.webp'],
    headlineLine1: 'Automobil',
    lead: 'Ruhige Linien, kontrolliertes Licht und Bildserien fuer Fahrzeuge mit Wert.',
    alt: 'Automobilfotografie mit kontrolliertem Neonlicht als Startseiten-Hero',
    category: 'automotive',
    imageType: ['automotive'],
    visualTone: ['dark-cinematic'],
    tags: ['Startseite', 'Hero', 'Automobil', 'Neon'],
  },
  {
    sourcePath: '/assets/optimized/assets-photos-landschaft-1920.webp',
    replaceSourcePaths: ['/assets/optimized/assets-photos-landschaft-960.webp'],
    headlineLine1: 'Landschaft',
    lead: 'Fine-Art-Motive, Wandbilder und Editionen mit Raumwirkung.',
    alt: 'Landschaftsfotografie als Fine-Art-Motiv fuer den Startseiten-Hero',
    category: 'landschaft',
    imageType: ['landscape'],
    visualTone: ['light-editorial'],
    tags: ['Startseite', 'Hero', 'Landschaft', 'Fine Art'],
  },
  {
    sourcePath: '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    replaceSourcePaths: ['/assets/optimized/assets-photos-oldtimer-stage-1280.webp'],
    headlineLine1: 'Oldtimer',
    lead: 'Material, Geschichte und Charakter in praezisen Serien.',
    alt: 'Oldtimer-Fotografie mit Buehnenlicht als Startseiten-Hero',
    category: 'oldtimer',
    imageType: ['automotive'],
    visualTone: ['dark-cinematic'],
    tags: ['Startseite', 'Hero', 'Oldtimer'],
  },
  {
    sourcePath: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    replaceSourcePaths: ['/assets/optimized/assets-photos-automobil-sunset-1280.webp'],
    headlineLine1: 'Sportwagen',
    lead: 'Performance, Form und Details ohne austauschbaren Showroom-Look.',
    alt: 'Sportwagen-Fotografie bei warmem Abendlicht als Startseiten-Hero',
    category: 'automotive',
    imageType: ['automotive'],
    visualTone: ['warm-atmospheric'],
    tags: ['Startseite', 'Hero', 'Sportwagen'],
  },
  {
    sourcePath: '/assets/optimized/assets-photos-motorrad-1920.webp',
    replaceSourcePaths: ['/assets/optimized/assets-photos-motorrad-960.webp'],
    headlineLine1: 'Motorrad',
    lead: 'Maschine, Haltung und Mechanik als konzentrierte Bildstrecke.',
    alt: 'Motorradfotografie mit Fokus auf Maschine und Mechanik als Startseiten-Hero',
    category: 'motorrad',
    imageType: ['motorcycle'],
    visualTone: ['light-editorial'],
    tags: ['Startseite', 'Hero', 'Motorrad'],
  },
]

const compactRecord = (value: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry !== 'undefined'))

const normalizeAssetPath = (value: string) => value.split('?')[0].split('#')[0].trim().replace(/^\/+/, '')

const normalizeKey = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? String(value).trim().toLowerCase() : ''

const relationIdFor = (value: unknown): RelationId | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return undefined
}

const mediaKeysFor = (value: unknown) => {
  if (!value) return []
  if (typeof value === 'string' || typeof value === 'number') return [normalizeKey(value)].filter(Boolean)
  if (typeof value !== 'object') return []

  const media = value as MediaDoc
  return [media.legacySourcePath, media.filename, media.id].map(normalizeKey).filter(Boolean)
}

const unique = (values: unknown[], fallback: string[] = []) => {
  const clean = values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)

  return Array.from(new Set(clean.length > 0 ? clean : fallback))
}

async function findMediaBySource(sourcePath: string) {
  const cleanPath = normalizeAssetPath(sourcePath)
  const filename = path.basename(cleanPath)

  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      or: [{ legacySourcePath: { equals: cleanPath } }, { filename: { equals: filename } }],
    } as never,
  })

  return existing.docs[0] as MediaDoc | undefined
}

async function upsertHeroMedia(seed: HeroSlideSeed) {
  const cleanPath = normalizeAssetPath(seed.sourcePath)
  const resolved = path.resolve(repoRoot, cleanPath)

  if (!resolved.startsWith(`${repoRoot}${path.sep}`) || !fs.existsSync(resolved)) {
    throw new Error(`Hero-Bild nicht gefunden: ${cleanPath}`)
  }

  const existing = await findMediaBySource(cleanPath)
  const title = seed.headlineLine2 ? `${seed.headlineLine1} ${seed.headlineLine2}` : seed.headlineLine1
  const usageNotes = `Aus dem bisherigen Startseiten-Hero importiert. Als echter Payload-Slide editierbar; Alt-Text und Einsatz bitte redaktionell pruefen.`

  if (existing?.id) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.id,
      data: compactRecord({
        title: existing.title || title,
        alt: existing.alt || seed.alt,
        category:
          existing.category && existing.category !== 'uncategorized'
            ? existing.category
            : seed.category,
        imageType: unique([existing.imageType, seed.imageType], seed.imageType),
        visualTone: unique([existing.visualTone, seed.visualTone], seed.visualTone),
        usagePurpose: unique([existing.usagePurpose, 'hero'], ['hero']),
        featured: true,
        tags: seed.tags,
        usageNotes: existing.usageNotes || usageNotes,
        legacySourcePath: existing.legacySourcePath || cleanPath,
      }) as never,
      overrideAccess: true,
    })

    return updated as MediaDoc
  }

  const created = await payload.create({
    collection: 'media',
    filePath: resolved,
    data: {
      title,
      alt: seed.alt,
      caption: '',
      category: seed.category,
      imageType: seed.imageType,
      visualTone: seed.visualTone,
      usagePurpose: ['hero'],
      featured: true,
      tags: seed.tags,
      usageNotes,
      legacySourcePath: cleanPath,
    } as never,
    overrideAccess: true,
  })

  return created as MediaDoc
}

async function findHomePage() {
  const byPageType = await payload.find({
    collection: 'site-pages',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: {
      pageType: {
        equals: 'home',
      },
    },
  })

  if (byPageType.docs[0]) return byPageType.docs[0] as unknown as Record<string, unknown>

  const bySlug = await payload.find({
    collection: 'site-pages',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  return bySlug.docs[0] as unknown as Record<string, unknown> | undefined
}

const existingSlideForUpdate = (slide: HeroSlideDoc) =>
  compactRecord({
    id: slide.id,
    image: relationIdFor(slide.image) || slide.image,
    headlineLine1: slide.headlineLine1,
    headlineLine2: slide.headlineLine2,
    lead: slide.lead,
    primaryLabel: slide.primaryLabel,
    primaryHref: slide.primaryHref,
    secondaryLabel: slide.secondaryLabel,
    secondaryHref: slide.secondaryHref,
  })

try {
  const homePage = await findHomePage()
  if (!homePage?.id) throw new Error('Startseite in Payload nicht gefunden.')

  const existingSlides = Array.isArray(homePage.heroSlides) ? (homePage.heroSlides as HeroSlideDoc[]) : []
  const existingKeys = new Set(existingSlides.flatMap((slide) => mediaKeysFor(slide.image)))
  const nextSlides = existingSlides.map(existingSlideForUpdate)
  let addedSlides = 0
  let upgradedSlides = 0

  for (const seed of seedSlides) {
    const media = await upsertHeroMedia(seed)
    const seedKeys = [normalizeAssetPath(seed.sourcePath), path.basename(seed.sourcePath), media.id].map(normalizeKey)
    const replacementKeys = (seed.replaceSourcePaths || [])
      .flatMap((sourcePath) => [normalizeAssetPath(sourcePath), path.basename(sourcePath)])
      .map(normalizeKey)
    const matchingLowResIndexes = existingSlides
      .map((slide, index) => ({ index, keys: mediaKeysFor(slide.image) }))
      .filter(({ keys }) => replacementKeys.some((key) => keys.includes(key)))
      .map(({ index }) => index)

    if (matchingLowResIndexes.length > 0) {
      for (const index of matchingLowResIndexes) {
        nextSlides[index] = {
          ...nextSlides[index],
          image: media.id,
        }
      }
      seedKeys.forEach((key) => existingKeys.add(key))
      upgradedSlides += matchingLowResIndexes.length
      continue
    }

    if (seedKeys.some((key) => existingKeys.has(key))) continue

    nextSlides.push({
      image: media.id,
      headlineLine1: seed.headlineLine1,
      headlineLine2: seed.headlineLine2 || '',
      lead: seed.lead,
      ...defaultHeroCtas,
    })
    seedKeys.forEach((key) => existingKeys.add(key))
    addedSlides += 1
  }

  await payload.update({
    collection: 'site-pages',
    id: homePage.id as RelationId,
    data: {
      heroSlides: nextSlides,
      _status: 'published',
    } as never,
    draft: false,
    overrideAccess: true,
  })

  payload.logger.info(
    `Startseiten-Hero synchronisiert: ${existingSlides.length} vorhandene Slides behalten, ${upgradedSlides} Slides auf bessere Quellen aktualisiert, ${addedSlides} Default-Slides ergaenzt.`,
  )
} catch (error) {
  printPayloadScriptError(error, 'Startseiten-Hero-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
