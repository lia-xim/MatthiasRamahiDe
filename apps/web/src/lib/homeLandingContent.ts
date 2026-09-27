// Inhalte und Datenaufbereitung für die neuen Startseiten-Sektionen
// (Kontaktbogen, „Wofür“-Wegweiser, Ablauf, FAQ).
//
// Alle Aussagen stammen aus bereits veröffentlichten Leistungs-/FAQ-Texten der Site
// bzw. dem Projektprofil — keine erfundenen Kennzahlen, Kunden oder Preise.

import contactSheetData from '../data/homeContactSheet.json'
import { imageDisplayUrl, imageSrcset, type PayloadDoc, type PayloadMedia } from './payload'
import { resolveTinaMediaRef } from './tinaMedia'

// --- „Wofür brauchst du Bilder?“ — Wegweiser zu den Intent-Seiten ---
export type HomeIntent = { title: string; text: string; href: string; topic: string }

export const homeIntents: HomeIntent[] = [
  {
    title: 'Fahrzeug verkaufen',
    text: 'Verkaufsbilder, die Zustand, Ausstattung und Details ehrlich zeigen.',
    href: '/autoverkauf-fotos-duesseldorf.html',
    topic: 'automobil',
  },
  {
    title: 'Autohaus & Bestand',
    text: 'Einheitliche Serien für Showroom, Bestand und Inserat.',
    href: '/autohaus-fotografie-duesseldorf.html',
    topic: 'sportwagen',
  },
  {
    title: 'Du & dein Auto',
    text: 'Ein privates Shooting mit dem eigenen Fahrzeug, an einer Location, die passt.',
    href: '/fotoshooting-mit-auto-duesseldorf.html',
    topic: 'automobil',
  },
  {
    title: 'Oldtimer & Sammlung',
    text: 'Provenienz, Patina und Zustand für Sammlung, Versicherung oder Auktion.',
    href: '/sammlerfahrzeug-fotografie-duesseldorf.html',
    topic: 'oldtimer',
  },
  {
    title: 'Custom Bike & Werkstatt',
    text: 'Umbau, Handwerk und Fahrer als zusammenhängende Serie.',
    href: '/custom-bike-fotografie-duesseldorf.html',
    topic: 'motorrad',
  },
  {
    title: 'Business & Personal Brand',
    text: 'Headshots, Founder- und Teamportraits für Website, Presse und LinkedIn.',
    href: '/business-portrait-duesseldorf.html',
    topic: 'portrait',
  },
  {
    title: 'Fine-Art-Print & Wandbild',
    text: 'Landschaftsmotive als Edition, Wandbild oder Raumkonzept.',
    href: '/wandbilder-landschaftsfotografie.html',
    topic: 'landschaft',
  },
]

// --- Ablauf ---
export const homeProcess = [
  {
    title: 'Briefing',
    text: 'Motiv, Ort, Zeitrahmen, Nutzung: Wir klären, wofür die Bilder gebraucht werden. Du bekommst vorab ein klares Angebot statt eines Pauschalpreises.',
  },
  {
    title: 'Location & Licht',
    text: 'Ort und Lichtfenster werden auf Motiv und Wirkung abgestimmt, in Düsseldorf, im Umland oder an einer passenden Location in NRW.',
  },
  {
    title: 'Shooting',
    text: 'Ruhig, präzise und im engen Dialog. Fahrzeuge fotografiere ich auch vor Ort: im Autohaus, in der Werkstatt oder am privaten Stellplatz.',
  },
  {
    title: 'Auswahl',
    text: 'Du bekommst eine kuratierte Vorauswahl als Galerie und entscheidest, welche Motive final und zurückhaltend retuschiert werden.',
  },
  {
    title: 'Ausgabe',
    text: 'Web-, Social- und Print-Auflösungen getrennt geliefert. Auf Wunsch als Fine-Art-Print oder im Großformat aus einer Hand.',
  },
]

// --- FAQ (zugleich FAQPage-Schema) ---
export type HomeFaq = { question: string; answer: string; link?: { href: string; label: string } }

export const homeFaq: HomeFaq[] = [
  {
    question: 'Was kostet ein Fotoshooting?',
    answer:
      'Der Preis richtet sich nach Umfang: Motiv, Anzahl der Bilder, Location und Nutzung. Du bekommst vorab ein klares Angebot statt eines Pauschalpreises.',
    link: { href: '/fotoshooting-preise.html', label: 'Mehr zu Preisen' },
  },
  {
    question: 'Wo findet das Shooting statt?',
    answer:
      'In Düsseldorf, im Umland oder an einer passenden Location in NRW. Fahrzeuge fotografiere ich auch direkt vor Ort, im Autohaus, in der Werkstatt oder am privaten Stellplatz.',
  },
  {
    question: 'Wofür darf ich die Bilder nutzen?',
    answer:
      'Die Nutzungsrechte werden je nach Projekt definiert: private Nutzung, Verkaufsinserat, Showroom, Social Media oder Print. Umfang und Laufzeit klären wir vor dem Shooting schriftlich.',
  },
  {
    question: 'Wie läuft die Bildauswahl ab?',
    answer:
      'Du bekommst eine kuratierte Vorauswahl als Galerie und entscheidest, welche Motive final und zurückhaltend retuschiert werden.',
  },
  {
    question: 'In welchen Formaten bekomme ich die Bilder?',
    answer:
      'Web- und Druckqualität getrennt, auf Wunsch inklusive vertikaler Formate für Reels und Story. Ein einheitlicher Bild-Look sorgt dafür, dass die Serie auf allen Kanälen funktioniert.',
  },
  {
    question: 'Kann ich Bilder als Print oder Wandbild kaufen?',
    answer:
      'Ja. Die Landschaftsarbeiten gibt es als Fine-Art-Print, Wandbild oder limitierte Edition, auf Fine-Art-Papier, Aluminium-Dibond oder Acrylglas.',
    link: { href: '/landschaftsbilder-kaufen.html', label: 'Landschaftsbilder ansehen' },
  },
]

export const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://matthiasramahi.de/#faq',
  mainEntity: homeFaq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

// --- Kontaktbogen: sechs Serien aus den Portfolio-Auswahlen ---
export const contactSheetSeries = [
  { topic: 'automobil', label: 'Automobil', slug: 'portfolio-auswahl-automobil' },
  { topic: 'sportwagen', label: 'Sportwagen', slug: 'portfolio-auswahl-sportwagen' },
  { topic: 'oldtimer', label: 'Oldtimer', slug: 'portfolio-auswahl-oldtimer' },
  { topic: 'motorrad', label: 'Motorrad', slug: 'portfolio-auswahl-motorrad' },
  { topic: 'portrait', label: 'Portrait', slug: 'portfolio-auswahl-portrait' },
  { topic: 'landschaft', label: 'Landschaft', slug: 'portfolio-auswahl-landschaft' },
] as const

export type ContactFrame = {
  src: string
  srcset?: string
  full: string
  alt: string
  caption: string
  width: number
  height: number
  ratio: number
}

export type ContactStrip = {
  topic: string
  label: string
  excerpt: string
  href: string
  count: number
  frames: ContactFrame[]
}

type SheetImage = { width: number; height: number; variants: Array<{ url: string; width: number; height: number }> }
const sheetImages = (contactSheetData as { images: Record<string, SheetImage> }).images

/** Vorberechnete Varianten (tools/build-home-contact-sheet.mjs) für Bilder ohne CMS-Größen. */
export function localVariantImage(url?: string) {
  const sheet = url ? sheetImages[url] : undefined
  if (!sheet?.variants?.length) return null
  const last = sheet.variants[sheet.variants.length - 1]
  return {
    src: last.url,
    srcset: sheet.variants.map((variant) => `${variant.url} ${variant.width}w`).join(', '),
    width: sheet.width,
    height: sheet.height,
  }
}

const mediaUrlOf = (image: PayloadMedia | string | undefined) =>
  typeof image === 'string' ? image : image?.url || ''

// Ziel: pro Streifen ungefähr dieselbe Höhe. Querformate brauchen weniger Frames,
// Hochformate mehr — Summe der Seitenverhältnisse ≈ ROW_RATIO.
const ROW_RATIO = 4.4
const MAX_FRAMES = 7

export function buildContactStrip(
  series: (typeof contactSheetSeries)[number],
  doc: PayloadDoc | null | undefined,
): ContactStrip | null {
  const gallery = ((doc?.gallery || []) as Array<{ image?: PayloadMedia | string; caption?: string }>).filter(
    (item) => item?.image,
  )
  if (!gallery.length) return null

  const seen = new Set<string>()
  const frames: ContactFrame[] = []
  let ratioSum = 0

  for (const item of gallery) {
    const url = mediaUrlOf(item.image)
    if (!url || seen.has(url)) continue
    seen.add(url)

    const media = typeof item.image === 'string' ? resolveTinaMediaRef(item.image) || item.image : item.image
    const sheet = sheetImages[url]
    const width = sheet?.width || (typeof media === 'object' ? media?.width : 0) || 1500
    const height = sheet?.height || (typeof media === 'object' ? media?.height : 0) || 1000
    const ratio = width / height

    const small = sheet?.variants?.[0]?.url
    const src = small || imageDisplayUrl(media as PayloadMedia | string, 'mobile', { allowOriginal: true, mapCachedAssets: false })
    const srcset = sheet
      ? sheet.variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ')
      : imageSrcset(media as PayloadMedia | string, ['thumb', 'mobile', 'card'], 'raster', { mapCachedAssets: false }) || undefined
    const full = imageDisplayUrl(media as PayloadMedia | string, 'hero', { allowOriginal: true, mapCachedAssets: false })

    const rawCaption = (item.caption || '').trim()
    const caption = rawCaption && rawCaption.toLowerCase() !== series.label.toLowerCase() ? rawCaption : ''
    const alt = caption
      ? `${series.label}fotografie: ${caption}`
      : `${series.label}fotografie von Matthias Ramahi, Bild ${frames.length + 1} der Serie`

    frames.push({ src, srcset, full, alt, caption, width, height, ratio })
    ratioSum += ratio
    if (frames.length >= MAX_FRAMES || ratioSum >= ROW_RATIO) break
  }

  if (!frames.length) return null
  return {
    topic: series.topic,
    label: series.label,
    excerpt: typeof doc?.excerpt === 'string' ? doc.excerpt : '',
    href: `/portfolio/${series.slug}`,
    count: gallery.length,
    frames,
  }
}

// ImageGallery-Schema für den Kontaktbogen: Urheber- und Credit-Angaben je Bild
// (Google-Bildersuche zeigt Creator/Credit an; alle Motive sind eigene Arbeiten).
const SITE = 'https://matthiasramahi.de'
const absolute = (url: string) => new URL(url, SITE).href

export function contactSheetJsonLd(strips: ContactStrip[]) {
  const images = strips.flatMap((strip) =>
    strip.frames.map((frame) => ({
      '@type': 'ImageObject',
      contentUrl: absolute(frame.full || frame.src),
      thumbnailUrl: absolute(frame.src),
      name: frame.alt,
      ...(frame.caption ? { caption: frame.caption } : {}),
      width: frame.width,
      height: frame.height,
      creator: { '@id': `${SITE}/#person` },
      creditText: 'Matthias Ramahi',
      copyrightNotice: '© Matthias Ramahi',
    })),
  )
  if (!images.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${SITE}/#arbeiten`,
    name: 'Ausgewählte Arbeiten – Matthias Ramahi Fotografie',
    url: `${SITE}/#arbeiten`,
    author: { '@id': `${SITE}/#person` },
    associatedMedia: images,
  }
}
