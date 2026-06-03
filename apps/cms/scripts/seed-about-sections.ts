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
      where: {
        or: [{ legacySourcePath: { equals: cleanPath } }, { filename: { equals: filename } }],
      } as never,
    })
    const id = found.docs[0]?.id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  payload.logger.warn(`Kein Media-Eintrag gefunden fuer: ${candidates.join(', ')}`)
  return undefined
}

const IMG = {
  heroPortrait: ['mpissxxj-portfolio_webp_full_063-1.webp'],
  automobilSunset: ['assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/optimized/assets-photos-automobil-sunset-960.webp'],
  automobilNeon: ['assets/optimized/assets-photos-automobil-neon-1920.webp', 'assets/optimized/assets-photos-automobil-neon-960.webp'],
  oldtimerStage: ['assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'assets/optimized/assets-photos-oldtimer-stage-960.webp'],
  motorrad: ['assets/optimized/assets-photos-motorrad-1920.webp', 'assets/optimized/assets-photos-motorrad-720.webp'],
  portraitBlue: ['assets/optimized/assets-photos-portrait-blue-960.webp', 'assets/optimized/assets-photos-portrait-blue-720.webp'],
  landschaft: ['assets/optimized/assets-photos-landschaft-1920.webp', 'assets/optimized/assets-photos-landschaft-720.webp'],
}

const chapterSeeds = [
  { img: IMG.automobilSunset, title: 'Automobil', href: '/automobil-fotografie-duesseldorf.html', alt: 'Automobilfotografie' },
  { img: IMG.automobilNeon, title: 'Sportwagen', href: '/sportwagen-fotografie-duesseldorf.html', alt: 'Sportwagenfotografie' },
  { img: IMG.oldtimerStage, title: 'Oldtimer', href: '/oldtimer-fotografie-duesseldorf.html', alt: 'Oldtimerfotografie' },
  { img: IMG.motorrad, title: 'Motorrad', href: '/motorrad-fotografie-duesseldorf.html', alt: 'Motorradfotografie' },
  { img: IMG.portraitBlue, title: 'Portrait', href: '/portraitfotografie-duesseldorf.html', alt: 'Portraitfotografie' },
  { img: IMG.landschaft, title: 'Landschaft', href: '/landschaftsfotografie-duesseldorf.html', alt: 'Landschaftsfotografie' },
]

const isFilledArray = (value: unknown) => Array.isArray(value) && value.length > 0
const isFilledText = (value: unknown) => typeof value === 'string' && value.trim().length > 0

try {
  const about = await payload.find({
    collection: 'site-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: 'about' } },
  })
  const doc = about.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Ueber-mich-Seite (pageType=about) in Payload nicht gefunden.')

  const data: Record<string, unknown> = {}
  const filled: string[] = []
  const skipped: string[] = []

  if (!isFilledText(doc.aboutHero?.lead)) {
    data.aboutHero = {
      ...(doc.aboutHero || {}),
      kicker: 'Ueber mich · Duesseldorf · NRW',
      titleLine1: 'Hinter der',
      titleLine2: 'Kamera.',
      lead:
        'Matthias Ramahi — Fotograf aus Duesseldorf. Editorial gefuehrte Bildserien fuer Automobile, Oldtimer, Sportwagen, Motorraeder, Portraits und Landschaften. Ausgebildet im Handwerk, denkend wie ein Editor.',
      image: doc.aboutHero?.image || (await resolveMediaId(IMG.heroPortrait)),
      primaryLabel: 'Portfolio ansehen ->',
      primaryHref: '/portfolio.html',
      secondaryLabel: 'Projekt anfragen',
      secondaryHref: '#anfrage',
    }
    filled.push('Hero')
  } else skipped.push('Hero')

  if (!isFilledText(doc.aboutStatement?.lead)) {
    data.aboutStatement = {
      ...(doc.aboutStatement || {}),
      headline: 'Bild vor Filter, Motiv vor',
      headlineEmphasis: 'Effekt',
      lead:
        'Was mich an Fotografie haelt, ist nicht das eine spektakulaere Bild — es ist die ruhige Arbeit davor: das genaue Hinsehen, das Warten auf das richtige Licht, die kleine Verschiebung in der Komposition, die ein Motiv ploetzlich tragen laesst.',
      body:
        'Mein Anspruch ist editorial: klare Linien, ehrliche Farben, keine Effektkette. Ob Portrait, Automobil oder Landschaft — am Ende geht es darum, dass das Bild den Charakter seines Motivs zeigt und nicht den meiner Software. Aus dieser Geduld entstehen Aufnahmen, die nach dem Shooting noch arbeiten — auf dem Inserat, im Pressekit, an der Wand.',
      primaryLabel: 'Portfolio ansehen',
      primaryHref: '/portfolio.html',
      secondaryLabel: 'Bereiche ansehen',
      secondaryHref: '#schwerpunkte',
    }
    filled.push('Haltung')
  } else skipped.push('Haltung')

  if (!isFilledArray(doc.aboutChapters?.items)) {
    const items = []
    for (const seed of chapterSeeds) {
      const image = await resolveMediaId(seed.img)
      if (!image) continue
      items.push({
        image,
        title: seed.title,
        alt: seed.alt,
        linkLabel: 'Bereich ansehen ->',
        href: seed.href,
      })
    }
    data.aboutChapters = {
      ...(doc.aboutChapters || {}),
      headline: 'Sechs Bereiche. Eine',
      headlineEmphasis: 'Hand',
      intro:
        'Ich arbeite nicht in Genre-Schubladen — aber jede Disziplin braucht ihr eigenes Vorgehen. Licht, Distanz, Material und Rhythmus passen sich an, die Bildsprache bleibt verwandt.',
      items,
    }
    filled.push('Sechs Bereiche')
  } else skipped.push('Sechs Bereiche')

  if (!isFilledText(doc.aboutSister?.lead)) {
    data.aboutSister = {
      ...(doc.aboutSister || {}),
      kicker: 'Bewegte Bilder · Empfehlung',
      headline: 'Wenn es',
      headlineEmphasis: 'bewegt',
      lead: 'Fuer bewegte Bilder empfehle ich meine Schwester Sophia Ramahi — Videografin aus dem Rheinland.',
      body:
        'Sophia produziert Musikvideos, Imagefilme und redaktionelles Bewegtbild. Aus einer Familie, aus einer Bildsprache — wir arbeiten regelmaessig parallel auf Set, damit Foto und Video aus einem Guss kommen.',
      buttonLabel: 'Anfrage Foto + Video ->',
      href: '/contact.html#anfrage',
      plate: {
        tag: 'Schwester · Location',
        nameLine1: 'Sophia',
        nameLine2: 'Ramahi',
        roles: [{ label: 'Videografin' }, { label: 'Musikvideos' }, { label: 'Imagefilm' }, { label: 'Editorial · Set' }],
        location: 'Duesseldorf · NRW',
      },
    }
    filled.push('Sophia / Video')
  } else skipped.push('Sophia / Video')

  if (!isFilledText(doc.aboutContact?.lead)) {
    data.aboutContact = {
      ...(doc.aboutContact || {}),
      subject: 'Projektanfrage',
      headline: 'Projekt <em>anfragen.</em>',
      lead:
        'Schreiben Sie kurz, welche Leistung Sie interessiert, wo das Projekt stattfindet und welchen Zeitraum Sie planen. Ich melde mich mit Rueckfragen oder einem naechsten Schritt per E-Mail.',
    }
    filled.push('Kontakt')
  } else skipped.push('Kontakt')

  if (Object.keys(data).length === 0) {
    payload.logger.info('Ueber-mich-Sektionen sind bereits gefuellt — nichts zu tun.')
  } else {
    await payload.update({
      collection: 'site-pages',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(
      `Ueber-mich-Sektionen gefuellt: ${filled.join(', ') || '-'}. Uebersprungen (bereits gepflegt): ${skipped.join(', ') || '-'}.`,
    )
  }
} catch (error) {
  printPayloadScriptError(error, 'Ueber-mich-Sektionen-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
