import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    if (!process.env[key]) process.env[key] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

const isEmpty = (value: unknown): boolean =>
  value == null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(isEmpty))

const result = await payload.find({
  collection: 'service-pages',
  depth: 0,
  limit: 1,
  overrideAccess: true,
  where: { slug: { equals: 'landschaftsfotografie' } },
})

const doc = result.docs[0] as Record<string, any> | undefined
if (!doc?.id) throw new Error('Service page not found: landschaftsfotografie')

const data: Record<string, unknown> = {}
const filled: string[] = []
const setIfEmpty = (key: string, value: unknown) => {
  if (isEmpty(doc[key])) {
    data[key] = value
    filled.push(key)
  }
}

const oldCards = Array.isArray(doc.audienceCards) ? doc.audienceCards : []
const gallery = Array.isArray(doc.portfolioTiles) ? doc.portfolioTiles : []
const imageFrom = (...sources: Array<Record<string, unknown> | undefined>) =>
  sources.find((source) => source?.image)?.image

setIfEmpty('focusSection', {
  headline: 'Motiv, Material,',
  emphasis: 'Raumwirkung.',
  lead: 'Landschaftsbilder werden nicht nur als Motiv gedacht, sondern als Objekt im Raum: Format, Material, Oberflaeche und Abstand gehoeren zur Bildentscheidung.',
})

setIfEmpty(
  'shootingStyles',
  oldCards.length
    ? oldCards.slice(0, 4).map((card: Record<string, unknown>, index: number) => ({
        image: card.image || imageFrom(gallery[index]),
        title: card.title,
        text: card.text,
      }))
    : [
        { image: imageFrom(gallery[1]), title: 'Fine-Art', text: 'Papier, Tonwert und Motiv werden passend zum Raum abgestimmt.' },
        { image: imageFrom(gallery[2]), title: 'Aluminium', text: 'Ruhige Wandbilder auf stabilem Traeger fuer klare Raeume und Praxen.' },
        { image: imageFrom(gallery[3]), title: 'Acrylglas', text: 'Tiefe, Glanz und klare Kanten fuer Motive mit Licht und Struktur.' },
        { image: imageFrom(gallery[4]), title: 'Edition', text: 'Kuratierte Motive als Einzelabzug oder kleine Edition nach Umfang.' },
      ],
)

setIfEmpty('gallerySection', {
  headline: 'Ausgewaehlte Landschaften.',
  lead: 'Eine ruhige Auswahl aus Landschaft, Licht, Struktur und Print-Potential.',
})

setIfEmpty('processSection', {
  headline: 'So entsteht',
  emphasis: 'Ihr Druck.',
  lead: 'Vom ersten Motivwunsch bis zur Lieferung wird die Bildauswahl als Printobjekt geplant: passend zu Raum, Material, Format und Wirkung.',
})

setIfEmpty('processSteps', [
  {
    image: imageFrom(gallery[0]),
    imageLabel: 'Anfrage',
    title: 'Anfrage',
    text: 'Motiv, Raum, Format und gewuenschte Wirkung werden kurz eingeordnet.',
  },
  {
    image: imageFrom(gallery[1]),
    imageLabel: 'Beratung',
    title: 'Beratung',
    text: 'Material, Groesse, Oberflaeche und Haengung werden passend zum Ort geplant.',
  },
  {
    image: imageFrom(gallery[2]),
    imageLabel: 'Produktion',
    title: 'Produktion',
    text: 'Der Print wird farbverbindlich vorbereitet und auf das gewaehlte Material ausgegeben.',
  },
  {
    image: imageFrom(gallery[3]),
    imageLabel: 'Lieferung',
    title: 'Lieferung',
    text: 'Das fertige Bild wird sicher verpackt und mit den benoetigten Angaben uebergeben.',
  },
])

setIfEmpty('relatedSection', {
  headline: 'Verwandte',
  emphasis: 'Bereiche.',
  lead: 'Fahrzeug, Mensch und Raum bleiben eigene Bildbereiche. Die Links fuehren schnell zu der Seite, die zum Motiv, zur Nutzung und zum geplanten Projekt passt.',
  items: [
    { image: imageFrom(gallery[4]), title: 'Portrait', href: 'portraitfotografie.html', alt: 'Portrait' },
    { image: imageFrom(gallery[5]), title: 'Oldtimer', href: 'oldtimer-fotografie.html', alt: 'Oldtimer' },
    { image: imageFrom(gallery[6]), title: 'Drucke', href: 'drucke-sonderanfertigungen-duesseldorf.html', alt: 'Drucke' },
    { image: imageFrom(gallery[7]), title: 'Portfolio', href: 'portfolio.html', alt: 'Portfolio' },
  ],
})

setIfEmpty('locationLinksSection', {
  headline: 'Landschaftsfotografie',
  emphasis: 'vor Ort.',
})

setIfEmpty('searchLinksSection', {
  headline: 'Landschaftsfotografie',
  emphasis: 'Suchbegriffe.',
})

setIfEmpty('contactSection', {
  headline: 'Landschaft',
  emphasis: 'anfragen.',
  lead: 'Schreibe kurz, wofuer die Landschaftsbilder eingesetzt werden - Fine-Art-Print, Innenraum, Editorial, Website oder Markenbild. Wichtig sind gewuenschte Atmosphaere, Format, Material und Zeitraum.',
  emailSubject: 'Landschaftsfotografie Anfrage',
})

if (filled.length) {
  await payload.update({
    id: doc.id,
    collection: 'service-pages',
    data,
    draft: false,
    overrideAccess: true,
  })
  console.log(`UPDATED service-pages/landschaftsfotografie -> ${filled.join(', ')}`)
} else {
  console.log('UNCHANGED service-pages/landschaftsfotografie')
}

process.exit(0)
