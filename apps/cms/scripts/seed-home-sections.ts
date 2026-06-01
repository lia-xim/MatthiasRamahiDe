import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

// Befuellt die neuen Startseiten-Sektionen (Tab "Startseite") des Home-Docs mit den
// bisher im Code hartkodierten Inhalten. Bilder werden gegen vorhandene Media-Eintraege
// verlinkt (kein Import). Nicht-destruktiv: jede Sektion wird nur gesetzt, wenn sie im
// CMS noch leer ist — bereits redaktionell gepflegte Inhalte bleiben unangetastet.

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

// Bild gegen vorhandene Media-Eintraege aufloesen: probiert mehrere Kandidaten
// (legacySourcePath ODER filename), gibt die erste Treffer-ID zurueck.
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

// Kandidatenlisten (hoechste Aufloesung zuerst) — entsprechen den im Code genutzten Motiven.
const IMG = {
  automobilSunset: ['assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/optimized/assets-photos-automobil-sunset-1280.webp'],
  automobilNeon: ['assets/optimized/assets-photos-automobil-neon-1920.webp', 'assets/optimized/assets-photos-automobil-neon-1280.webp'],
  oldtimerStage: ['assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'assets/optimized/assets-photos-oldtimer-stage-1280.webp'],
  motorrad: ['assets/optimized/assets-photos-motorrad-1920.webp', 'assets/optimized/assets-photos-motorrad-960.webp'],
  portraitWarm: ['assets/photos/portrait-warm.webp', 'portrait-warm.webp'],
  landschaft: ['assets/optimized/assets-photos-landschaft-1920.webp', 'assets/optimized/assets-photos-landschaft-960.webp'],
  portfolio005: ['assets/services/portfolio_webp_full_005-2.webp', 'portfolio_webp_full_005-2.webp'],
  portrait063: ['mpissxxj-portfolio_webp_full_063-1.webp'],
}

const statementBody = [
  'Seit über zehn Jahren entstehen meine Serien im Spannungsfeld von Präzision und Atmosphäre - Automobile, Oldtimer, Sportwagen, Motorräder, Portraits und Landschaften. Jede Arbeit folgt einer ruhigen redaktionellen Logik: Licht, Komposition, Material, Zeit.',
  'Auftraggeber sind Marken, Sammler, Manufakturen und private Eigentümer aus Düsseldorf, Köln, Essen, Dortmund und dem gesamten Rheinland - überall dort, wo Bilder über Auflage, Sammlung oder Markenwert mitentscheiden.',
]

const aboutBody = [
  'Ausgebildet im Handwerk, denkend wie ein Editor - ich arbeite ruhig, präzise und in engem Dialog mit dem Auftraggeber. Vom ersten Briefing bis zum finalen Druck.',
  'Meine Location steht in Düsseldorf, mein Netzwerk im gesamten Rheinland. Ich begleite Marken, Manufakturen, Sammler und private Eigentümer dort, wo ein Bild über Auflage, Sammlung oder Markenwert mitentscheidet.',
]

const chapterSeeds = [
  { img: IMG.automobilSunset, title: 'Automobil', meta: 'Location · Location · Detail', href: '/automobil-fotografie-duesseldorf.html' },
  { img: IMG.automobilNeon, title: 'Sportwagen', meta: 'Performance · Editorial', href: '/sportwagen-fotografie-duesseldorf.html' },
  { img: IMG.oldtimerStage, title: 'Oldtimer', meta: 'Sammlung · Auktion', href: '/oldtimer-fotografie-duesseldorf.html' },
  { img: IMG.motorrad, title: 'Motorrad', meta: 'Manufaktur · Bewegung', href: '/motorrad-fotografie-duesseldorf.html' },
  { img: IMG.portraitWarm, title: 'Portrait', meta: 'Business · Editorial', href: '/portraitfotografie-duesseldorf.html' },
  { img: IMG.landschaft, title: 'Landschaft', meta: 'Edition · Großformat', href: '/landschaftsfotografie-duesseldorf.html' },
]

const serviceSeeds = [
  { number: 'N° 01', title: 'Fotolabor & Druck', text: 'FineArt- und Hochwertdruck — von der Datei bis zur signierten Edition.', href: '/fotolabor-druck-duesseldorf.html' },
  { number: 'N° 02', title: 'Großformatdruck', text: 'Poster, Banner, Messewände, Acrylglas — kalibrierte Galeriequalität.', href: '/grossformatdruck-duesseldorf.html' },
  { number: 'N° 03', title: 'Werbetechnik', text: 'Schaufenster, Beklebungen, Firmenschilder und Displaylösungen für den Raum.', href: '/werbetechnik-duesseldorf.html' },
  { number: 'N° 04', title: 'Webdesign & SEO', text: 'Markenseiten, Portfolios und lokale Sichtbarkeit im Rheinland.', href: '/webdesign-seo-duesseldorf.html' },
  { number: 'N° 05', title: 'Viola Musik', text: 'Live-Musik und klassische Begleitung für Empfänge und Vernissagen.', href: '/viola-musik-duesseldorf.html' },
  { number: 'N° 06', title: 'Videografie', text: 'Marken-, Event- und Imagefilm — vom Konzept bis zum finalen Cut.', href: '/videografie-duesseldorf.html' },
  { number: 'N° 07', title: 'Drucke & Sonderanfertigungen', text: 'Mappen, Editionen, Geschenke und Interior — von der Idee zum Unikat.', href: '/drucke-sonderanfertigungen-duesseldorf.html' },
]

const journalSeeds = [
  { img: IMG.oldtimerStage, number: 'N° 01', date: '05 / 2026', category: 'Fotograf', title: 'Wie ich einen Oldtimer-Shoot vor Ort aufbaue.', text: 'Lichtsetup, Material, Reflexionen — Schritt für Schritt durch einen kompletten Location-Workflow.', href: '/blog.html' },
  { img: IMG.portfolio005, number: 'N° 02', date: '04 / 2026', category: 'Print', title: 'Vom Sensor bis zur FineArt-Edition.', text: 'Farbprofile, Papiere, Druckpartner — was zwischen Bild und signierter Edition wirklich passiert.', href: '/blog.html' },
  { img: IMG.landschaft, number: 'N° 03', date: '03 / 2026', category: 'NRW', title: 'Lokal arbeiten — Düsseldorf, Köln, Essen.', text: 'Wie aus einem Netzwerk im Rheinland ein Workflow für Auflage, Sammlung und Marke entsteht.', href: '/blog.html' },
]

const isFilledArray = (value: unknown) => Array.isArray(value) && value.length > 0
const isFilledText = (value: unknown) => typeof value === 'string' && value.trim().length > 0

try {
  const home = await payload.find({
    collection: 'site-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: 'home' } },
  })
  const doc = home.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Startseite (pageType=home) in Payload nicht gefunden.')

  const data: Record<string, unknown> = {}
  const filled: string[] = []
  const skipped: string[] = []

  // 1) Statement
  if (!isFilledArray(doc.homeStatement?.body)) {
    data.homeStatement = { ...(doc.homeStatement || {}), body: statementBody.map((text) => ({ text })) }
    filled.push('Statement')
  } else skipped.push('Statement')

  // 2) Bereiche
  if (!isFilledArray(doc.homeChapters?.items)) {
    const items = []
    for (const seed of chapterSeeds) {
      items.push({ image: await resolveMediaId(seed.img), title: seed.title, meta: seed.meta, href: seed.href })
    }
    data.homeChapters = {
      ...(doc.homeChapters || {}),
      intro: isFilledText(doc.homeChapters?.intro)
        ? doc.homeChapters.intro
        : 'Jeder Bereich hat eine eigene visuelle Logik - Bewegung, Material, Mensch, Raum. Auswählen, weiterlesen, eine Serie sehen.',
      items,
    }
    filled.push('Bereiche')
  } else skipped.push('Bereiche')

  // 3) Ausgewaehlte Arbeiten (nur Intro)
  if (!isFilledText(doc.homeSelectedWorks?.intro)) {
    data.homeSelectedWorks = {
      ...(doc.homeSelectedWorks || {}),
      intro: 'Ein Strom aus aktuellen Serien - kontinuierlich in Bewegung. Klick auf ein Bild öffnet die Vorschau.',
    }
    filled.push('Ausgewaehlte Arbeiten')
  } else skipped.push('Ausgewaehlte Arbeiten')

  // 4) Hinter der Kamera
  if (!isFilledArray(doc.homeAbout?.body)) {
    data.homeAbout = {
      ...(doc.homeAbout || {}),
      kicker: isFilledText(doc.homeAbout?.kicker) ? doc.homeAbout.kicker : 'Über mich',
      image: doc.homeAbout?.image || (await resolveMediaId(IMG.portrait063)),
      body: aboutBody.map((text) => ({ text })),
    }
    filled.push('Hinter der Kamera')
  } else skipped.push('Hinter der Kamera')

  // 5) Weitere Leistungen
  if (!isFilledArray(doc.homeServices?.items)) {
    data.homeServices = {
      ...(doc.homeServices || {}),
      intro: isFilledText(doc.homeServices?.intro)
        ? doc.homeServices.intro
        : 'Für Projekte, die über die Fotografie hinausgehen - Druck, Großformat, Werbetechnik, Webdesign, Video, Sonderanfertigungen und Musik. Kuratiert, koordiniert, ein Ansprechpartner.',
      items: serviceSeeds.map((seed) => ({ number: seed.number, title: seed.title, text: seed.text, href: seed.href })),
    }
    filled.push('Weitere Leistungen')
  } else skipped.push('Weitere Leistungen')

  // 6) Journal
  if (!isFilledArray(doc.homeJournal?.items)) {
    const items = []
    for (const seed of journalSeeds) {
      items.push({
        image: await resolveMediaId(seed.img),
        number: seed.number,
        date: seed.date,
        category: seed.category,
        title: seed.title,
        text: seed.text,
        href: seed.href,
      })
    }
    data.homeJournal = {
      ...(doc.homeJournal || {}),
      intro: isFilledText(doc.homeJournal?.intro)
        ? doc.homeJournal.intro
        : 'Notizen aus dem Netzwerk - Workflow, Material, Auftragsgeschichten. Lange Form, ruhig kuratiert.',
      items,
    }
    filled.push('Journal')
  } else skipped.push('Journal')

  if (Object.keys(data).length === 0) {
    payload.logger.info('Startseiten-Sektionen sind bereits gefuellt — nichts zu tun.')
  } else {
    await payload.update({
      collection: 'site-pages',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(`Startseiten-Sektionen gefuellt: ${filled.join(', ') || '—'}. Uebersprungen (bereits gepflegt): ${skipped.join(', ') || '—'}.`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Startseiten-Sektionen-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
