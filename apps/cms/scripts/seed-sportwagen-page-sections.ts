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

const relationIdFor = (value: unknown): RelationId | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return undefined
}

const filenameFor = (candidate: string) => candidate.replace(/^\/+/, '').split('/').filter(Boolean).at(-1) || ''
const stemFor = (filename: string) => filename.replace(/\.[^.]+$/, '').replace(/-\d+x\d+$/, '')

async function resolveMediaId(candidates: string[]): Promise<RelationId | undefined> {
  for (const candidate of candidates) {
    const cleanPath = candidate.replace(/^\/+/, '')
    const filename = filenameFor(cleanPath)
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
    const id = relationIdFor(found.docs[0]?.id)
    if (id) return id
  }

  for (const candidate of candidates) {
    const stem = stemFor(filenameFor(candidate))
    if (!stem) continue
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { or: [{ filename: { like: stem } }, { legacySourcePath: { like: stem } }] } as never,
    })
    const id = relationIdFor(found.docs[0]?.id)
    if (id) return id
  }

  return undefined
}

async function image(candidates: string[]) {
  return resolveMediaId(candidates)
}

const withImage = async <T extends Record<string, unknown>>(data: T, candidates: string[]) => {
  const media = await image(candidates)
  return media ? { ...data, image: media } : data
}

const cities = [
  ['sportwagen-fotografie-duesseldorf.html', 'Düsseldorf'],
  ['sportwagen-fotografie-erkrath.html', 'Erkrath'],
  ['sportwagen-fotografie-ratingen.html', 'Ratingen'],
  ['sportwagen-fotografie-koeln.html', 'Köln'],
  ['sportwagen-fotografie-essen.html', 'Essen'],
  ['sportwagen-fotografie-dortmund.html', 'Dortmund'],
  ['sportwagen-fotografie-duisburg.html', 'Duisburg'],
  ['sportwagen-fotografie-bochum.html', 'Bochum'],
  ['sportwagen-fotografie-wuppertal.html', 'Wuppertal'],
  ['sportwagen-fotografie-leverkusen.html', 'Leverkusen'],
  ['sportwagen-fotografie-oberhausen.html', 'Oberhausen'],
  ['sportwagen-fotografie-krefeld.html', 'Krefeld'],
  ['sportwagen-fotografie-moenchengladbach.html', 'Mönchengladbach'],
  ['sportwagen-fotografie-moers.html', 'Moers'],
  ['sportwagen-fotografie-gelsenkirchen.html', 'Gelsenkirchen'],
  ['sportwagen-fotografie-bergisch-gladbach.html', 'Bergisch Gladbach'],
  ['sportwagen-fotografie-solingen.html', 'Solingen'],
  ['sportwagen-fotografie-remscheid.html', 'Remscheid'],
  ['sportwagen-fotografie-mettmann.html', 'Mettmann'],
  ['sportwagen-fotografie-hilden.html', 'Hilden'],
  ['sportwagen-fotografie-dormagen.html', 'Dormagen'],
  ['sportwagen-fotografie-neuss.html', 'Neuss'],
  ['sportwagen-fotografie-nrw.html', 'NRW'],
  ['sportwagen-fotografie-deutschland.html', 'Deutschland'],
]

const searchTerms = [
  ['motorsport-sportwagen-fotografie.html', 'Motorsport & Sportwagen'],
  ['motorsport-fotografie.html', 'Motorsport Fotografie'],
  ['sportwagen-shooting-duesseldorf.html', 'Sportwagen Shooting'],
  ['sportwagen-fotoshooting-duesseldorf.html', 'Sportwagen Fotoshooting'],
  ['performance-car-fotografie.html', 'Performance Car Fotografie'],
  ['exotic-car-fotografie.html', 'Exotic Car Fotografie'],
  ['supersportwagen-fotografie.html', 'Supersportwagen Fotografie'],
]

try {
  const found = await payload.find({
    collection: 'service-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'sportwagen-fotografie' } },
  })
  const doc = found.docs[0]
  if (!doc?.id) throw new Error('Service-Seite sportwagen-fotografie nicht gefunden.')

  const shootingStyles = await Promise.all([
    withImage(
      {
        title: 'Exterieur',
        text: 'Vollformatige Außenaufnahmen mit kontrolliertem Licht, ruhigen Reflexen und sauberer Linienführung. Lack, Proportionen und Charakter wirken stimmig - egal ob Showroom, Industrie oder urbanes Setting.',
      },
      ['_DSC3982.webp', 'assets-portfolio-dsc3982-1920.webp'],
    ),
    withImage(
      {
        title: 'Interieur',
        text: 'Cockpit, Sitze, Materialien, Atmosphäre. Mit mobilem Licht inszeniert, damit Leder, Carbon und Chrom ihren Ton behalten und der Innenraum die gleiche Sprache spricht wie das Exterieur.',
      },
      ['_DSC9321-Enhanced-NR.webp', '_DSC9321-Enhanced-NR-2.webp'],
    ),
    withImage(
      {
        title: 'Details',
        text: 'Emblem, Sicken, Felgen, Bremse, Naht, Schalter. Detailaufnahmen erzählen die Geschichte eines Fahrzeugs im Kleinen - perfekt für Händlerseiten, Landingpages und redaktionelle Strecken.',
      },
      ['_DSC9301-Enhanced-NR.webp'],
    ),
    withImage(
      {
        title: 'Cinematic',
        text: 'Inszenierte Perspektiven mit gesetztem Licht, gewählter Architektur und dramaturgischer Komposition. Bilder mit Filmcharakter - für Kampagne, Magazin und Bildstrecken, die Stimmung tragen.',
      },
      ['assets-photos-automobil-neon-1920.webp', 'assets-photos-automobil-neon-960.webp'],
    ),
  ])

  const portfolioTiles = await Promise.all([
    withImage({ label: 'Exterieur' }, ['assets-portfolio-dsc3879-1920.webp', '_DSC3879.webp']),
    withImage({ label: 'Interieur' }, ['_DSC9321-Enhanced-NR.webp']),
    withImage({ label: 'Detail' }, ['assets-portfolio-dsc3982-1920.webp', '_DSC3982.webp']),
    withImage({ label: 'Felge' }, ['_DSC9301-Enhanced-NR.webp']),
    withImage({ label: 'Profil' }, ['_DSC3908.webp', 'assets-portfolio-dsc3908-1920.webp']),
    withImage({ label: 'Cinematic' }, ['assets-photos-automobil-neon-1920.webp']),
  ])

  const audienceCards = await Promise.all([
    withImage(
      {
        number: '01',
        title: 'Privatkunden & Fahrzeugbesitzer',
        text: 'Ein Sportwagen ist kein Alltagsobjekt. Wer sein Fahrzeug - ob neuer GT, gepflegter Supersportwagen oder exotisches Einzelstück - dauerhaft in einer Bildserie dokumentieren möchte, erhält kuratierte Aufnahmen von Exterieur, Cockpit und Details. Keine Bewerbungsfotos, sondern eine ruhige, präzise Arbeit für Sammlung, Verkauf oder persönliches Archiv.',
      },
      ['assets-portfolio-dsc3879-1920.webp', '_DSC3879.webp'],
    ),
    withImage(
      {
        number: '02',
        title: 'Händler & Importeure',
        text: 'Performance Cars und Exotic Cars verkaufen sich über Bilder, die die Komplexität des Fahrzeugs sichtbar machen: Lichtkantenführung, Reflexe im Lack, Materialien im Innenraum. Konsistente Serien für mehrere Fahrzeuge - aufbereitet für Web, Portale und Print - werden mit einem abgestimmten Ablauf effizient produziert.',
      },
      ['_DSC3908.webp', 'assets-portfolio-dsc3908-1920.webp'],
    ),
    withImage(
      {
        number: '03',
        title: 'Marken & Agenturen',
        text: 'Kampagnen-Assets für Performance- und Supercar-Fotografie verlangen eine klare Dramaturgie: Hero-Motiv, Umfeld, Detail und Atmosphäre greifen in einem einheitlichen Bildsystem ineinander. Planung, Shooting und Dateiübergabe werden auf die Nutzung in Kampagne, Magazin oder Launch-Material abgestimmt.',
      },
      ['assets-portfolio-dsc3982-1920.webp', '_DSC3982.webp'],
    ),
    withImage(
      {
        number: '04',
        title: 'Clubs & Redaktionen',
        text: 'Sportwagen-Clubs, Automotive-Magazine und redaktionelle Strecken suchen Bilder mit Standpunkt - kein generisches Fotografie-Porträt, sondern Aufnahmen, die Fahrzeugcharakter, Linien und Bildsprache gleichzeitig transportieren. Sportwagen Shooting für Editorial und Sonderausgaben wird als vollständige Bildserie geliefert.',
      },
      ['_DSC6982.webp'],
    ),
    withImage(
      {
        number: '05',
        title: 'Motorsport & Events',
        text: 'Rennstrecke, Trackday und Fahrerporträt: wenn Sportwagen in Bewegung dokumentiert werden sollen, verändert sich die Bildsprache grundlegend - Schärfentiefe, Komposition und Timing arbeiten anders als beim statischen Shooting. Dieser Bereich verbindet Sportwagenfotografie und Motorsport zu einem eigenständigen Bildkapitel.',
      },
      ['_DSC0470-Enhanced-NR.webp'],
    ),
  ])

  const relatedItems = await Promise.all([
    withImage({ title: 'Automobil', href: 'automobil-fotografie.html', alt: 'Automobilfotografie' }, ['assets-photos-automobil-neon-1920.webp']),
    withImage({ title: 'Oldtimer', href: 'oldtimer-fotografie.html', alt: 'Oldtimerfotografie' }, ['assets-photos-oldtimer-stage-1920.webp']),
    withImage({ title: 'Motorrad', href: 'motorrad-fotografie.html', alt: 'Motorradfotografie' }, ['assets-photos-motorrad-1920.webp', 'assets-photos-motorrad-ninja-road-1921.webp']),
    withImage({ title: 'Portfolio', href: 'portfolio.html', alt: 'Vollständiges Portfolio' }, ['assets-portfolio-dsc3879-1920.webp', '_DSC3879.webp']),
  ])

  const statementImage = await image(['assets-portfolio-dsc3879-1920.webp', '_DSC3879.webp'])

  await payload.update({
    collection: 'service-pages',
    id: doc.id,
    data: {
      statement: {
        ...(statementImage ? { image: statementImage } : {}),
        headline: 'Speed.',
        emphasis: 'Klar gezeichnet.',
        body: [
          {
            text: 'Sportwagenfotografie ist kein eigener Stil - sie ist eine eigene Anforderung. Performance Cars, Exotic Cars und Supersportwagen haben eine Formsprache, die im Bild nur dann funktioniert, wenn Licht, Aufstellwinkel, Schärfentiefe und Bildausschnitt präzise zusammenpassen. Kontrollierte Reflexe im Lack, saubere Lichtkanten, ein Cockpit, das die gleiche Sprache spricht wie das Exterieur - das entsteht nicht zufällig.',
          },
          {
            text: 'Dieser Hub ordnet die Sportwagen-Bildsprache: Shooting-Anlässe, Fahrzeugklassen von Performance bis Supersportwagen, Motiv-Schwerpunkte von Stance bis Detail, und Produktionsformate vom Einzelmotiv bis zur vollständigen Serie für Kampagne und Motorsport. Bilder werden nicht improvisiert; sie werden mit einem Plan für Nutzung, Lichtfenster und Output geplant - ob als ruhige Sammler-Dokumentation oder als Kampagnenserie für Händler und Marke.',
          },
        ],
      },
      focusSection: {
        headline: 'Form, Material,',
        emphasis: 'Druckqualität.',
        lead: 'Reflexe, Strecke, Standbild, Cockpit und Detailmotive werden mit klarer Dramaturgie geplant.',
      },
      shootingStyles,
      gallerySection: {
        headline: 'Sportwagenfotografie als Bildserie.',
        lead: 'Sportwagenfotografie für Sammler, Händler, Marken, Verkauf und Fine-Art-Druck.',
      },
      portfolioTiles,
      audienceSection: {
        headline: 'Sportwagenfotografie: passende Anfragen.',
        lead: 'Sportwagenfotografie für Sammler, Händler, Marken, Verkauf und Fine-Art-Druck.',
      },
      audienceCards,
      relatedSection: {
        headline: 'Verwandte',
        emphasis: 'Bereiche.',
        lead: 'Die Hauptseite führt zu Motorsport, Performance Car, Exotic Car und Supersportwagen.',
        items: relatedItems,
      },
      locationLinksSection: {
        headline: 'Sportwagen Fotografie',
        emphasis: 'vor Ort.',
        items: cities.map(([href, label]) => ({ href, label })),
      },
      searchLinksSection: {
        headline: 'Sportwagen Fotografie',
        emphasis: 'Suchbegriffe.',
        items: searchTerms.map(([href, label]) => ({ href, label })),
      },
      contactSection: {
        headline: 'Sportwagen',
        emphasis: 'anfragen.',
        lead: 'Schreibe kurz, welches Motiv im Mittelpunkt steht, wofür Sportwagenfotografie gebraucht wird und ob die Bilder privat, kommerziell, redaktionell oder für Verkauf und Print genutzt werden sollen.',
        emailSubject: 'Sportwagen Fotografie Anfrage',
      },
      _status: 'published',
    } as never,
    draft: false,
    overrideAccess: true,
  })

  payload.logger.info('Sportwagen-Seite: Themen-Sektionen, Bildslots und sichtbare Texte synchronisiert.')
} catch (error) {
  printPayloadScriptError(error, 'Sportwagen-Seiten-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
