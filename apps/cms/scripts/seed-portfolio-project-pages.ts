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
  dsc3879: ['assets/optimized/assets-portfolio-dsc3879-1920.webp', 'assets/portfolio/thumbs/_DSC3879.webp'],
  dsc2986: ['assets/optimized/assets-portfolio-dsc2986-1920.webp', 'assets/portfolio/thumbs/_DSC2986.webp'],
  dsc3892: ['assets/optimized/assets-portfolio-dsc3892-1920.webp', 'assets/portfolio/thumbs/_DSC3892.webp'],
  dsc3032: ['assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'assets/portfolio/thumbs/_DSC3032_genErase (1).webp'],
  dsc3982: ['assets/optimized/assets-portfolio-dsc3982-1920.webp', 'assets/portfolio/thumbs/_DSC3982.webp'],
  dsc2316: ['assets/optimized/assets-portfolio-dsc2316-1920.webp', 'assets/portfolio/thumbs/_DSC2316.webp'],
  dsc2310: ['assets/optimized/assets-portfolio-dsc2310-1920.webp', 'assets/portfolio/thumbs/_DSC2310.webp'],
  dsc6982: ['assets/optimized/assets-portfolio-dsc6982-1920.webp', 'assets/portfolio/thumbs/_DSC6982.webp'],
  dsc8032: ['assets/optimized/assets-portfolio-dsc8032-1920.webp', 'assets/portfolio/thumbs/_DSC8032.webp'],
  neon: ['assets/optimized/assets-photos-automobil-neon-1920.webp', 'assets/optimized/assets-photos-automobil-neon-960.webp'],
  sunset: ['assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/optimized/assets-photos-automobil-sunset-960.webp'],
  oldtimer: ['assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'assets/optimized/assets-photos-oldtimer-stage-960.webp'],
  motorrad: ['assets/optimized/assets-photos-motorrad-1920.webp', 'assets/optimized/assets-photos-motorrad-720.webp'],
}

const heroSeeds = [
  {
    img: IMG.dsc3879,
    headlineLine1: 'Portfolio',
    headlineLine2: 'Automobil.',
    lead: 'Kuratierte Fahrzeugserie mit Exterieur, Interieur, Details und Cinematic - als Bildsatz fuer Marke, Verkauf, Sammlung, Print und digitale Praesentation.',
  },
  {
    img: IMG.neon,
    headlineLine1: 'Linie,',
    headlineLine2: 'Lack, Licht.',
    lead: 'Automobilbilder mit kontrollierten Reflexen, ruhiger Form und klarer Reihenfolge statt einzelner Zufallstreffer.',
  },
  {
    img: IMG.sunset,
    headlineLine1: 'Fahrzeug',
    headlineLine2: 'als Serie.',
    lead: 'Vom Hero-Motiv ueber Detail und Innenraum bis zum atmosphaerischen Abschluss wird die Strecke als zusammenhaengendes Bildsystem geplant.',
  },
]

const perspectives = [
  {
    label: 'Exterieur',
    title: 'Vollformat, ruhige Linien.',
    text: 'Aussenaufnahmen mit kontrolliertem Licht und ruhigen Reflexen. Lack, Proportionen und Linienfuehrung wirken stimmig - Showroom, Industrie oder urbanes Setting.',
    image: IMG.dsc3879,
    bullets: ['Showroom & Location', 'Architektur & Industrie', 'Tages- und Nachtlicht'],
  },
  {
    label: 'Interieur',
    title: 'Innenraum, Material und Bedienung.',
    text: 'Cockpit, Leder, Carbon, Instrumente und Details werden nicht nur dokumentiert, sondern als nutzbare Motive fuer Inserat, Editorial und Markenpraesentation kuratiert.',
    image: IMG.dsc2986,
    bullets: ['Cockpit & Sitze', 'Materialdetails', 'Licht ohne harte Reflexe'],
  },
  {
    label: 'Details',
    title: 'Lack, Sicke, Zeichen.',
    text: 'Detailbilder geben der Serie Rhythmus. Embleme, Sicken, Felgen, Oberflaechen und mechanische Formen schaffen Naehe, ohne das Fahrzeug aus dem Kontext zu reissen.',
    image: IMG.dsc3892,
    bullets: ['Lack & Chrom', 'Felgen & Linien', 'Marken- und Formdetails'],
  },
  {
    label: 'Cinematic',
    title: 'Atmosphaere als Abschluss.',
    text: 'Cineastische Frames, Bewegungsgefuehl und Night Looks machen aus der Serie eine Strecke mit Dramaturgie - nutzbar fuer Social, Web, Kampagne und Print.',
    image: IMG.dsc3032,
    bullets: ['Motion & Stimmung', 'Nachtlicht', 'Editorialer Schlussakkord'],
  },
]

const gallerySeeds = [
  { img: IMG.dsc3879, caption: '01 - Showroom' },
  { img: ['assets/portfolio/_DSC9301-Enhanced-NR.webp', 'assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp'], caption: '02 - Cockpit' },
  { img: IMG.dsc3892, caption: '03 - Detail' },
  { img: IMG.dsc3982, caption: '04 - Night' },
  { img: IMG.dsc2316, caption: '05 - Lines' },
  { img: IMG.dsc2310, caption: '06 - Black' },
  { img: IMG.dsc3032, caption: '07 - Motion' },
  { img: IMG.dsc6982, caption: '08 - Daylight' },
  { img: IMG.dsc8032, caption: '09 - Frame' },
]

const infoCards = [
  { number: '01', title: 'Privatkundinnen', label: 'Privat - Geschenk', href: '#anfrage' },
  { number: '02', title: 'Hersteller & Marken', label: 'Kampagne - CI', href: '#anfrage' },
  { number: '03', title: 'Autohaeuser & Haendler', label: 'Showroom - Serie', href: '#anfrage' },
  { number: '04', title: 'Clubs & Redaktionen', label: 'Magazin - Editorial', href: '#anfrage' },
  { number: '05', title: 'Sammler & Besitzer', label: 'Edition - Archiv', href: '#anfrage' },
]

const relatedCards = [
  { label: '01 / Verwandt', title: 'Sportwagen', href: '/sportwagen-fotografie-duesseldorf.html', image: IMG.dsc3982 },
  { label: '02 / Verwandt', title: 'Oldtimer', href: '/oldtimer-fotografie-duesseldorf.html', image: IMG.oldtimer },
  { label: '03 / Verwandt', title: 'Motorrad', href: '/motorrad-fotografie-duesseldorf.html', image: IMG.motorrad },
  { label: '04 / Uebersicht', title: 'Portfolio', href: '/portfolio.html', image: IMG.dsc3879 },
]

const heroSlideSeed = async (seed: (typeof heroSeeds)[number]) => {
  const image = await resolveMediaId(seed.img)
  if (!image) return undefined
  return {
    image,
    headlineLine1: seed.headlineLine1,
    headlineLine2: seed.headlineLine2,
    lead: seed.lead,
    primaryLabel: 'Bilder ansehen',
    primaryHref: '#bilder',
    secondaryLabel: 'Projekt anfragen',
    secondaryHref: '#anfrage',
    durationSec: 7,
  }
}

const perspectiveSeed = async (seed: (typeof perspectives)[number]) => ({
  label: seed.label,
  title: seed.title,
  text: seed.text,
  image: await resolveMediaId(seed.image),
  bullets: seed.bullets.map((text) => ({ text })),
})

const relatedCardSeed = async (seed: (typeof relatedCards)[number]) => ({
  label: seed.label,
  title: seed.title,
  href: seed.href,
  image: await resolveMediaId(seed.image),
})

const gallerySeed = async (seed: (typeof gallerySeeds)[number]) => {
  const image = await resolveMediaId(seed.img)
  if (!image) return undefined
  return { image, caption: seed.caption, role: 'sequence' }
}

try {
  const found = await payload.find({
    collection: 'portfolio-projects',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'portfolio-auswahl-automobil' } },
  })
  const doc = found.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Portfolio-Projekt portfolio-auswahl-automobil in Payload nicht gefunden.')

  const nextProjectPage: Record<string, unknown> = { ...(doc.projectPage || {}) }
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

  if (!isFilledArray(doc.gallery) || doc.gallery.length < gallerySeeds.length) {
    const existing = Array.isArray(doc.gallery) ? doc.gallery : []
    const existingIds = new Set(existing.map((item: any) => String(item?.image?.id || item?.image || '')))
    const additions = []
    for (const seed of gallerySeeds) {
      const item = await gallerySeed(seed)
      if (item && !existingIds.has(String(item.image))) additions.push(item)
    }
    data.gallery = [...existing, ...additions]
    filled.push(`Galerie (${additions.length} Motive ergaenzt)`)
  } else skipped.push('Galerie')

  const statement = (doc.projectPage || {}).statement || {}
  if (!hasText(statement.quote) && !isFilledArray(statement.stats)) {
    nextProjectPage.statement = {
      quote: 'Vom Inserat bis zur',
      accent: 'Kampagne.',
      stats: [
        { label: 'Output', text: 'Web, Print, Social, Verkauf' },
        { label: 'Fokus', text: 'Exterieur, Interieur, Details' },
        { label: 'Basis', text: 'Düsseldorf / NRW' },
      ],
      buttonLabel: 'Bildsatz anfragen',
      buttonHref: '#anfrage',
    }
    filled.push('Statement')
  } else skipped.push('Statement')

  const context = (doc.projectPage || {}).context || {}
  if (!isFilledArray(context.body)) {
    nextProjectPage.context = {
      ...context,
      kicker: context.kicker || 'Einordnung',
      headline: context.headline || 'Fahrzeug als Bildsystem.',
      body: [
        {
          text:
            'Automobilfotografie funktioniert auf dieser Seite nicht als einzelne schoene Aufnahme, sondern als Bildsatz: Hero-Motiv, Exterieur, Interieur, Detail, Stimmung und Abschluss greifen ineinander.',
        },
        {
          text:
            'Die Reihenfolge entscheidet darueber, ob die Serie fuer Verkauf, Marke, Sammlung, Print oder digitale Praesentation funktioniert. Deshalb werden Motiv, Lichtfenster, Standort und Ausgabe schon vor dem Shooting zusammen gedacht.',
        },
      ],
    }
    filled.push('Einordnung')
  } else skipped.push('Einordnung')

  if (!isFilledArray((doc.projectPage || {}).perspectives)) {
    nextProjectPage.perspectives = await Promise.all(perspectives.map(perspectiveSeed))
    filled.push('Blickwinkel/Bildsystem')
  } else skipped.push('Blickwinkel/Bildsystem')

  if (!isFilledArray((doc.projectPage || {}).infoCards)) {
    nextProjectPage.infoCards = infoCards
    filled.push('Kacheln')
  } else skipped.push('Kacheln')

  if (!isFilledArray((doc.projectPage || {}).relatedCards)) {
    nextProjectPage.relatedCards = await Promise.all(relatedCards.map(relatedCardSeed))
    filled.push('Verwandte Bereiche')
  } else skipped.push('Verwandte Bereiche')

  const contact = (doc.projectPage || {}).contact || {}
  if (!hasText(contact.headline) || !hasText(contact.text)) {
    nextProjectPage.contact = {
      headline: contact.headline || 'Automobilserie anfragen.',
      text:
        contact.text ||
        'Schreiben Sie kurz, welches Fahrzeug, welche Nutzung und welcher Zeitraum geplant ist. Dann klaeren wir Motiv, Umfang, Rechte und Ausgabeformate gemeinsam.',
      buttonLabel: contact.buttonLabel || 'Projekt anfragen',
      emailSubject: contact.emailSubject || 'Anfrage Automobil-Portfolio',
    }
    filled.push('Kontakt-CTA')
  } else skipped.push('Kontakt-CTA')

  if (filled.length === 0) {
    payload.logger.info('Portfolio-Projekt Automobil ist bereits gefuellt - nichts zu tun.')
  } else {
    data.projectPage = nextProjectPage
    await payload.update({
      collection: 'portfolio-projects',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(`Portfolio-Projekt Automobil gefuellt: ${filled.join(', ')}. Uebersprungen: ${skipped.join(', ') || '-'}.`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Portfolio-Projektseiten-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
