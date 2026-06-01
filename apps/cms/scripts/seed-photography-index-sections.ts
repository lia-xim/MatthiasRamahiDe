import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

// Befuellt die Fotografie-Uebersicht (pageType 'photography-index') mit den bisher im Code
// hartkodierten Themen-Bereichen + Einstiegstext. Bilder werden gegen vorhandene Media-Eintraege
// verlinkt. Nicht-destruktiv: nur setzen, wenn im CMS noch leer.

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
  payload.logger.warn(`Kein Media-Eintrag gefunden fuer: ${candidates.join(', ')}`)
  return undefined
}

const IMG = {
  neon: ['assets/optimized/assets-photos-automobil-neon-1920.webp', 'assets/optimized/assets-photos-automobil-neon-1280.webp'],
  sunset: ['assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/optimized/assets-photos-automobil-sunset-1280.webp'],
  oldtimer: ['assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'assets/optimized/assets-photos-oldtimer-stage-1280.webp'],
  motorrad: ['assets/optimized/assets-photos-motorrad-1920.webp', 'assets/optimized/assets-photos-motorrad-960.webp'],
  portraitBlue: ['assets/photos/portrait-blue.webp', 'portrait-blue.webp'],
  landschaft: ['assets/optimized/assets-photos-landschaft-1920.webp', 'assets/optimized/assets-photos-landschaft-960.webp'],
}

const topicSeeds = [
  { img: IMG.neon, title: 'Automobil.', emphasis: 'Fotografie.', linkLabel: 'Zur Automobil Fotografie →', href: '/automobil-fotografie.html', text: 'Für Fahrzeuge, Marken, Händler und private Verkäufe: Exterieur, Interieur, Details und Lichtführung werden so geplant, dass aus einem Auto eine verwertbare Bildserie wird — für Website, Inserat, Social, Print und Kampagne.' },
  { img: IMG.sunset, title: 'Sportwagen.', emphasis: 'Fotografie.', linkLabel: 'Zur Sportwagen Fotografie →', href: '/sportwagen-fotografie.html', text: 'Sportwagen brauchen Präzision statt Effektfeuerwerk: niedrige Blickachsen, saubere Spiegelungen, Innenraumdetails und eine Dramaturgie, die Leistung sichtbar macht, ohne ins Plakative zu kippen.' },
  { img: IMG.oldtimer, title: 'Oldtimer.', emphasis: 'Fotografie.', linkLabel: 'Zur Oldtimer Fotografie →', href: '/oldtimer-fotografie.html', text: 'Oldtimer Fotografie erzählt Wert, Herkunft und Material. Lack, Chrom, Leder und Patina werden nicht nostalgisch überhöht, sondern mit Charakter und Ruhe präzise dokumentiert.' },
  { img: IMG.motorrad, title: 'Motorrad.', emphasis: 'Fotografie.', linkLabel: 'Zur Motorrad Fotografie →', href: '/motorrad-fotografie.html', text: 'Motorräder funktionieren über Haltung, Mechanik und Silhouette. Die Serie kann Maschine, Details, Fahrer und Werkstattbezug verbinden — stärker als ein einzelnes Verkaufsfoto.' },
  { img: IMG.portraitBlue, title: 'Portrait.', emphasis: 'Fotografie.', linkLabel: 'Zur Portrait Fotografie →', href: '/portraitfotografie.html', text: 'Portraits sollen professionell wirken, ohne Menschen glattzubügeln. Licht, Distanz und Blickführung werden auf Nutzung und Persönlichkeit abgestimmt — für Branding, Presse, Team und Editorial.' },
  { img: IMG.landschaft, title: 'Landschaft.', emphasis: 'Fotografie.', linkLabel: 'Zur Landschaftsfotografie →', href: '/landschaftsfotografie.html', text: 'Landschaftsfotografie steht weniger für lokales Shooting als für kuratierten Bildkauf: Fine-Art-Prints, Wandbilder, Editionen und große Formate werden nach Raum, Material und Wirkung ausgewählt.' },
]

const clusterIntro = [
  'Die Übersicht ist der Einstiegspunkt. Von hier aus führen die sechs Bereiche auf eigene Hauptseiten — und von dort weiter in lokale Varianten, NRW- und Deutschland-Hubs sowie die jeweiligen Keyword-Seiten.',
  'Nutzer wählen nicht aus einem generischen Portfolio, sondern steigen direkt in Automobil, Sportwagen, Oldtimer, Motorrad, Portrait oder Landschaft ein. Jede Kategorie zeigt auf ihrer Hauptseite die zugehörigen Städte und Regionen.',
]

const isFilledArray = (value: unknown) => Array.isArray(value) && value.length > 0

try {
  const found = await payload.find({
    collection: 'site-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: 'photography-index' } },
  })
  const doc = found.docs[0] as unknown as Record<string, any> | undefined
  if (!doc?.id) throw new Error('Fotografie-Uebersicht (pageType=photography-index) in Payload nicht gefunden.')

  const group = doc.photographyIndex || {}
  const data: Record<string, unknown> = {}
  const next: Record<string, unknown> = { ...group }
  const filled: string[] = []
  const skipped: string[] = []

  if (!isFilledArray(group.topics)) {
    const topics = []
    for (const seed of topicSeeds) {
      topics.push({
        image: await resolveMediaId(seed.img),
        title: seed.title,
        emphasis: seed.emphasis,
        text: seed.text,
        linkLabel: seed.linkLabel,
        href: seed.href,
      })
    }
    next.topics = topics
    filled.push('Themen-Bereiche')
  } else skipped.push('Themen-Bereiche')

  if (!isFilledArray(group.clusterIntro)) {
    next.clusterIntro = clusterIntro.map((text) => ({ text }))
    filled.push('Einstiegstext')
  } else skipped.push('Einstiegstext')

  if (filled.length === 0) {
    payload.logger.info('Fotografie-Uebersicht ist bereits gefuellt — nichts zu tun.')
  } else {
    data.photographyIndex = next
    await payload.update({
      collection: 'site-pages',
      id: doc.id as RelationId,
      data: { ...data, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    payload.logger.info(`Fotografie-Uebersicht gefuellt: ${filled.join(', ')}. Uebersprungen: ${skipped.join(', ') || '—'}.`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Fotografie-Uebersicht-Seed')
  process.exitCode = 1
} finally {
  try {
    await payload.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
