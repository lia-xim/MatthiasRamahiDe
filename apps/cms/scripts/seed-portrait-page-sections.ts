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

const isEmpty = (value: unknown) =>
  value == null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(isEmpty))

async function mediaId(filename: string) {
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  })
  const media = result.docs[0]
  if (!media?.id) throw new Error(`Media not found: ${filename}`)
  return media.id
}

const img = async (filename: string) => ({ image: await mediaId(filename) })

const result = await payload.find({
  collection: 'service-pages',
  depth: 0,
  limit: 1,
  overrideAccess: true,
  where: { slug: { equals: 'portraitfotografie' } },
})
const doc = result.docs[0] as Record<string, any> | undefined
if (!doc?.id) throw new Error('Service page not found: portraitfotografie')

const data: Record<string, unknown> = {}
const filled: string[] = []
const setIfEmpty = (key: string, value: unknown) => {
  if (isEmpty(doc[key])) {
    data[key] = value
    filled.push(key)
  }
}

setIfEmpty('focusSection', {
  headline: 'Verschiedene',
  emphasis: 'Perspektiven.',
  lead: 'Fuenf Felder, in denen ein Portrait konkret etwas verschiebt - vom Personal Brand bis zur redaktionellen Strecke.',
})

setIfEmpty('shootingStyles', [
  {
    ...(await img('portrait-warm-1.webp')),
    title: 'Founder & Speaker',
    text: 'Selbststaendige, Coaches, Speaker, Founder - ein Bild, das wirkt, ohne sich aufzudraengen.',
  },
  {
    ...(await img('assets-portraits-dsc3908-1921.webp')),
    title: 'Agentur & Kanzlei',
    text: 'Agenturen, Kanzleien, Praxen, Marken - eine konsistente Bildsprache, ohne jeden Charakter zu glaetten.',
  },
  {
    ...(await img('assets-portraits-20250605-dsc04020-1921.webp')),
    title: 'Magazin & Strecke',
    text: 'Magazine, Bildstrecken, Kuenstler-Features - Portraits mit Haltung und Erzaehlung statt Pose.',
  },
  {
    ...(await img('_DSC9321-Enhanced-NR-2.webp')),
    title: 'Headshot & Profil',
    text: 'Pressefotos, Headshots, Bewerbung, Profil - klare, ruhige Bilder fuer den professionellen Auftritt.',
  },
  {
    ...(await img('assets-portraits-dsc2986-1921.webp')),
    title: 'Cover & Konzept',
    text: 'Marken-Portraits, Cover, Konzept-Strecken - inszenierte Bilder mit einem klaren Standpunkt.',
  },
])

setIfEmpty('gallerySection', {
  headline: 'Aus dem',
  lead: '',
})

setIfEmpty('processSection', {
  headline: 'Ablauf.',
  emphasis: '',
  lead: 'Vom ersten Kontakt bis zur Bildabgabe - fuenf ruhige Schritte, damit du vor dem Shooting weisst, was passiert und nach dem Shooting weisst, was kommt.',
})

setIfEmpty('processSteps', [
  {
    ...(await img('_DSC9301-Enhanced-NR-1.webp')),
    imageLabel: 'Anfrage',
    title: 'Anfrage',
    text: 'Kurze Nachricht reicht - Anlass, Person oder Team, gewuenschte Wirkung, Zeitraum. Antwort innerhalb von 24 Stunden mit erster Einordnung und naechsten Schritten.',
  },
  {
    ...(await img('assets-portfolio-dsc3032-generase-1-1920.webp')),
    imageLabel: 'Kennenlernen',
    title: 'Kennenlernen',
    text: 'Ein lockeres Gespraech - telefonisch oder vor Ort. Wir klaeren den Kontext, wer die Bilder sehen wird und welche Tonalitaet dazu passt. Ohne Verkaufsdruck.',
  },
  {
    ...(await img('20250605-DSC03756-2.webp')),
    imageLabel: 'Konzept',
    title: 'Konzept & Briefing',
    text: 'Wir sammeln Referenzen, definieren Licht, Hintergrund, Outfit und ein paar Schluesselbilder. Du bekommst ein klares Mini-Briefing - keine 30-Seiten-Decks.',
  },
  {
    ...(await img('assets-portraits-dsc2310-1921.webp')),
    imageLabel: 'Shooting',
    title: 'Shooting',
    text: 'Location in Duesseldorf oder vor Ort. Ruhiges Setup, viel Raum zum Ankommen, klare Regie ohne Pose-Drill. Zwischendurch ein gemeinsamer Blick auf den Monitor.',
  },
  {
    ...(await img('_DSC0470-Enhanced-NR-2.webp')),
    imageLabel: 'Auswahl und Lieferung',
    title: 'Auswahl & Lieferung',
    text: 'Eine kuratierte Vorauswahl als Web-Galerie. Du waehlst die finalen Bilder, ich retuschiere zurueckhaltend und liefere in den Formaten, die du brauchst - Web, Print, Social.',
  },
])

setIfEmpty('relatedSection', {
  headline: 'Verwandte',
  emphasis: 'Bereiche.',
  lead: 'Fahrzeug, Mensch und Raum bleiben eigene Bildbereiche. Die Links fuehren schnell zu der Seite, die zum Motiv, zur Nutzung und zum geplanten Shooting passt.',
  items: [
    { ...(await img('Wettberwerb_Foto5_Wunder_der_Natur2-1.webp')), title: 'Landschaft', href: 'landschaftsfotografie.html', alt: 'Landschaft' },
    { ...(await img('assets-photos-automobil-neon-1921.webp')), title: 'Automobil', href: 'automobil-fotografie.html', alt: 'Automobil' },
    { ...(await img('assets-portfolio-dsc3032-generase-1-1920.webp')), title: 'Videografie', href: 'videografie-duesseldorf.html', alt: 'Videografie' },
    { ...(await img('_DSC9321-Enhanced-NR-2.webp')), title: 'Portfolio', href: 'portfolio.html', alt: 'Portfolio' },
  ],
})

setIfEmpty('locationLinksSection', {
  headline: 'Portrait Fotografie',
  emphasis: 'vor Ort.',
})

setIfEmpty('searchLinksSection', {
  headline: 'Portrait Fotografie',
  emphasis: 'Suchbegriffe.',
})

setIfEmpty('contactSection', {
  headline: 'Portrait',
  emphasis: 'anfragen.',
  lead: 'Schreibe kurz, wofuer die Portraits gedacht sind - Personal Branding, Editorial, Team, Presse oder Bewerbung. Wichtig sind Person/Team, gewuenschte Wirkung, Ort und Zeitraum. Stil und Licht klaeren wir vor dem ersten Klick.',
  emailSubject: 'Portrait Fotografie Anfrage',
})

if (filled.length) {
  await payload.update({
    id: doc.id,
    collection: 'service-pages',
    data,
    draft: false,
    overrideAccess: true,
  })
  console.log(`UPDATED service-pages/portraitfotografie -> ${filled.join(', ')}`)
} else {
  console.log('UNCHANGED service-pages/portraitfotografie')
}

process.exit(0)
