import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

// Befuellt die Leistungs-Uebersicht (pageType 'services-index') mit den bisher im Code
// hartkodierten Inhalten. Bilder werden gegen vorhandene Media-Eintraege verlinkt — pro
// Leistung nur, wenn BEIDE Bilder aufloesbar sind (sonst Bild-Fallback auf Code, kein
// Layout-Bruch). Nicht-destruktiv: nur setzen, wenn im CMS noch leer.

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

async function resolveMediaId(candidates: string[]): Promise<RelationId | undefined> {
  for (const candidate of candidates) {
    const cleanPath = candidate.replace(/^\/+/, '')
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
    const stem = path.basename(candidate.replace(/^\/+/, '')).replace(/\.[^.]+$/, '')
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
  return undefined
}

const serviceSeeds = [
  {
    number: '01 · Fine Art', overviewLabel: 'Fine Art', headline: 'Fotolabor & Druck.', emphasis: 'Druck.',
    text: 'In Zusammenarbeit mit einem Druckpartner in Düsseldorf entstehen hochwertige Fotodrucke, Bücher, Leinwände und Spezialmaterialien — von der Motivprüfung über Papier und Oberfläche bis zur finalen Präsentation an Wand, Tisch oder Portfolio.',
    tags: 'Fine Art Prints, Fotobücher, Spezialmaterial', href: '/fotolabor-druck-duesseldorf.html',
    img1: ['fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp'], cap1: 'Print · Buch',
    img2: ['assets-photos-landschaft-1920.webp', 'assets-photos-landschaft-720.webp'], cap2: 'Motiv · Fine Art',
  },
  {
    number: '02 · Präsentation', overviewLabel: 'Präsentation', headline: 'Großformatdruck.', emphasis: 'druck.',
    text: 'Für große Auftritte: Poster, Banner, Acrylglasdrucke oder Messesysteme in hochwertiger Qualität — geeignet für Ausstellungen, Autohauspräsentationen, Schaufenster, Messewände und Interior-Lösungen mit klarer Fernwirkung.',
    tags: 'Poster, Banner, Acrylglas', href: '/grossformatdruck-duesseldorf.html',
    img1: ['Catoir_Ramahi-1-106-768x512-1.webp'], cap1: 'Fassade',
    img2: ['catoir_ramahiinuikiim21.webp', 'catoir_ramahiinuikiim21-720.webp'], cap2: 'Display',
  },
  {
    number: '03 · Beschriftung', overviewLabel: 'Displays', headline: 'Werbetechnik.', emphasis: 'technik.',
    text: 'Schaufensterbeklebung, Firmenschilder, Displaylösungen und Raumgrafiken werden gemeinsam mit einem Werbetechnik-Partner geplant und sauber umgesetzt — inklusive Materialwahl, Visualisierung und Montage vor Ort.',
    tags: 'Schaufenster, Displays, Beschilderung', href: '/werbetechnik-duesseldorf.html',
    img1: ['Catoir_Ramahi-1-32-768x512-1.webp'], cap1: 'Displaybau',
    img2: ['portfolio_webp_full_006-1.webp'], cap2: 'Window',
  },
  {
    number: '04 · Online', overviewLabel: 'Online', headline: 'Webdesign & SEO.', emphasis: 'SEO.',
    text: 'Gemeinsam mit einer Webagentur entstehen moderne Online-Auftritte, die Bildsprache, Performance und Sichtbarkeit verbinden — mit Struktur für Leistungen, lokale Suchanfragen, Referenzen, Blog und einfache Kontaktaufnahme.',
    tags: 'Website, SEO, Performance', href: '/webdesign-seo-duesseldorf.html',
    img1: ['screencapture-gr-knospe-de-2025-10-02-23_10_04-scaled.webp', 'screencapture-gr-knospe-de-2025-10-02-23_10_04-720.webp'], cap1: 'Website',
    img2: ['portfolio_webp_full_001.webp'], cap2: 'Technik',
  },
  {
    number: '05 · Event', overviewLabel: 'Live', headline: 'Viola Musik.', emphasis: 'Musik.',
    text: 'Musikalische Begleitung für besondere Momente — ob Hochzeit, Firmenfeier oder Event. Live-Musik schafft Atmosphäre, bleibt aber dezent planbar: passend zu Ablauf, Raum, Gästezahl und gewünschter Stimmung.',
    tags: 'Hochzeit, Event, Live-Musik', href: '/viola-musik-duesseldorf.html',
    img1: ['portfolio_webp_full_254.webp'], cap1: 'Performance',
    img2: ['portfolio_webp_full_004-2.webp'], cap2: 'Instrument',
  },
  {
    number: '06 · Motion', overviewLabel: 'Motion', headline: 'Videografie.', emphasis: 'grafie.',
    text: 'Professionelle Videos für Fahrzeuge, Events, Imagekampagnen und Social Media — konzipiert mit fotografischem Blick, klarer Dramaturgie und passenden Exportformaten für Website, Reels, Kampagnen oder Präsentationen.',
    tags: 'Imagefilm, Event, Social Media', href: '/videografie-duesseldorf.html',
    img1: ['portfolio_webp_full_058-1.webp'], cap1: 'Kamera',
    img2: ['portfolio_webp_full_057-1.webp'], cap2: 'Event',
  },
  {
    number: '07 · Sonderformat', overviewLabel: 'Sonderformat', headline: 'Drucke & Sonderanfertigungen.', emphasis: 'Sonderanfertigungen.',
    text: 'Für Motive, die einen besonderen Ort bekommen sollen: Sonderformate, Materialtests, dekorative Drucklösungen und individuelle Präsentationen werden passend zu Raum, Anlass, Menge, Oberfläche und gewünschter Wirkung geplant.',
    tags: 'Sonderformate, Materialtest, Interior', href: '/drucke-sonderanfertigungen-duesseldorf.html',
    img1: ['portrait-warm.webp'], cap1: 'Motiv',
    img2: ['assets-photos-automobil-sunset-1920.webp', 'assets-photos-automobil-sunset-960.webp'], cap2: 'Format',
  },
]

const heroSlideSeeds = [
  {
    img: ['portfolio_webp_full_006-1.webp'],
    headlineLine1: 'Alles aus',
    headlineLine2: 'einer Hand',
    lead:
      'Fuer Projekte, die ueber die Fotografie hinausgehen - Druck, Grossformat, Werbetechnik, Webdesign, Video und Live-Musik, serioes koordiniert ueber erfahrene Partner aus Duesseldorf und NRW.',
  },
  {
    img: ['fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp'],
    headlineLine1: 'Vom Bild',
    headlineLine2: 'zum Druck',
    lead:
      'Vom Motiv zur signierten Edition: Fine-Art-Prints, Fotobuecher und Spezialmaterial, abgestimmt auf Papier, Oberflaeche und Praesentation.',
  },
  {
    img: ['Catoir_Ramahi-1-106-768x512-1.webp'],
    headlineLine1: 'Grossformat',
    headlineLine2: '& Raum',
    lead:
      'Grossformat, Schaufenster und Displays mit klarer Fernwirkung - geplant, visualisiert und sauber vor Ort umgesetzt.',
  },
  {
    img: ['portfolio_webp_full_057-1.webp'],
    headlineLine1: 'Bewegtbild',
    headlineLine2: '& Marke',
    lead:
      'Bewegtbild mit fotografischem Blick: Image-, Event- und Markenfilme, von der Dramaturgie bis zum finalen Cut.',
  },
  {
    img: ['portfolio_webp_full_254.webp'],
    headlineLine1: 'Live',
    headlineLine2: '& Event',
    lead:
      'Live-Musik und klassische Begleitung, die Atmosphaere schafft - dezent planbar fuer Empfang, Vernissage und Feier.',
  },
]

const whyCards = [
  { label: 'Koordination', headline: 'Ein Ansprechpartner, weniger Reibung.', emphasis: 'weniger Reibung.', text: 'Abstimmung, Reihenfolge und Partner werden gebündelt, damit das Projekt nicht zwischen Gewerken zerfällt.' },
  { label: 'Qualität', headline: 'Ein visueller Anspruch über alle Medien.', emphasis: 'über alle Medien.', text: 'Druck, Website, Video oder Event-Auftritt werden nicht einzeln gedacht, sondern auf dieselbe Bildsprache ausgerichtet.' },
  { label: 'Netzwerk', headline: 'Spezialisierte Partner aus Düsseldorf & NRW.', emphasis: 'aus Düsseldorf & NRW.', text: 'Kurze Wege, klare Kommunikation und erfahrene Partner für Produktion, Präsentation und digitale Umsetzung.' },
  { label: 'Lösung', headline: 'Keine Standardpakete.', emphasis: 'Standardpakete.', text: 'Format, Material, Umfang und Timing richten sich nach dem Projekt — nicht nach einer festen Schablone.' },
]

const isFilledArray = (value: unknown) => Array.isArray(value) && value.length > 0
const isFilledText = (value: unknown) => typeof value === 'string' && value.trim().length > 0
const oldOverviewIntro =
  'Vom einzelnen Fine-Art-Print bis zur kompletten Markenfläche, Website, Filmproduktion oder Eventbegleitung. Sechs ergänzende Bereiche, ein gemeinsamer visueller Anspruch.'
const defaultOverviewIntro =
  'Vom einzelnen Fine-Art-Print bis zur kompletten Markenfläche, Website, Filmproduktion oder Eventbegleitung. Sieben ergänzende Bereiche, ein gemeinsamer visueller Anspruch.'

const heroSlideSeed = async (seed: (typeof heroSlideSeeds)[number]) => {
  const image = await resolveMediaId(seed.img)
  if (!image) return undefined

  return {
    image,
    headlineLine1: seed.headlineLine1,
    headlineLine2: seed.headlineLine2,
    lead: seed.lead,
    primaryLabel: 'Projekt anfragen',
    primaryHref: '#anfrage',
    secondaryLabel: 'Leistungen ansehen',
    secondaryHref: '#overview',
    durationSec: 7,
  }
}

try {
  const found = await payload.find({
    collection: 'site-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: 'services-index' } },
  })
  const doc = found.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Leistungs-Uebersicht (pageType=services-index) in Payload nicht gefunden.')

  const group = doc.servicesIndex || {}
  const data: Record<string, unknown> = {}
  const next: Record<string, unknown> = { ...group }
  const filled: string[] = []
  const skipped: string[] = []
  let imagesLinked = 0
  let imagesFallback = 0

  if (!isFilledArray(doc.heroSlides)) {
    const heroSlides = (await Promise.all(heroSlideSeeds.map(heroSlideSeed))).filter(Boolean)
    if (heroSlides.length > 0) {
      data.heroSlides = heroSlides
      filled.push('Hero-Slides')
    }
  } else skipped.push('Hero-Slides')

  if (!isFilledArray(group.items)) {
    const items = []
    for (const seed of serviceSeeds) {
      const image1 = await resolveMediaId(seed.img1)
      const image2 = await resolveMediaId(seed.img2)
      const bothImages = image1 != null && image2 != null
      if (bothImages) imagesLinked += 1
      else imagesFallback += 1
      items.push({
        number: seed.number,
        overviewLabel: seed.overviewLabel,
        headline: seed.headline,
        emphasis: seed.emphasis,
        text: seed.text,
        tags: seed.tags,
        href: seed.href,
        ...(bothImages ? { image1, caption1: seed.cap1, image2, caption2: seed.cap2 } : {}),
      })
    }
    next.items = items
    filled.push(`Leistungen (Bilder verlinkt: ${imagesLinked}, Code-Fallback: ${imagesFallback})`)
  } else skipped.push('Leistungen')

  if (!isFilledText(group.overviewHeadline)) {
    next.overviewHeadline = 'Dienstleistungen im Überblick.'
    next.overviewEmphasis = 'im Überblick.'
    next.overviewIntro = defaultOverviewIntro
    filled.push('Überblick-Kopf')
  } else skipped.push('Überblick-Kopf')

  if (typeof group.overviewIntro === 'string' && group.overviewIntro.trim() === oldOverviewIntro) {
    next.overviewIntro = defaultOverviewIntro
    filled.push('Überblick-Intro auf sieben Bereiche aktualisiert')
  }

  if (!isFilledArray(group.whyCards)) {
    next.whyKicker = 'Projektablauf'
    next.whyHeadline = 'Ein Bildsystem, mehrere Ausgänge.'
    next.whyEmphasis = 'mehrere Ausgänge.'
    next.whyLead =
      'Der Vorteil liegt nicht in möglichst vielen Leistungen, sondern in einem sauber geführten Prozess: Bildsprache, Material, digitale Präsenz und Präsentation wirken am Ende wie ein zusammenhängender Auftritt.'
    next.whyCards = whyCards
    filled.push('Warum-Block')
  } else skipped.push('Warum-Block')

  if (filled.length === 0) {
    payload.logger.info('Leistungs-Uebersicht ist bereits gefuellt — nichts zu tun.')
  } else {
    data.servicesIndex = next
    await payload.update({
      collection: 'site-pages',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(`Leistungs-Uebersicht gefuellt: ${filled.join('; ')}. Uebersprungen: ${skipped.join(', ') || '—'}.`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Leistungs-Uebersicht-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
