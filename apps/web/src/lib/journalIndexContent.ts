import type { HomeHeroSlide } from './nativeContent'
import { journalArticles, journalClusterFor, journalClusterProfiles } from './journalArticleContent'

export type JournalPostCard = {
  category: string
  dateTime?: string
  dark?: boolean
  href: string
  image: string
  imageAlt: string
  height: number
  readTime: string
  text: string
  title: string
  width: number
  eager?: boolean
}

export const journalHero = {
  image: '/assets/optimized/assets-photos-automobil-sunset-960.webp',
  kicker: 'Journal · Notizen · Düsseldorf',
  title: 'Notizen <em>aus Licht.</em>',
  lead: 'Ein kuratiertes Journal über Fotografie, Orte, Bildauswahl und Präsentation — ruhig, persönlich, ohne Content-Masse.',
}

// Shader-Hero (gleiche Animation/Markup wie Home & Portfolio): Bild-Cycle, Lens-Cursor,
// Aperture-Beam, Glow. Eigene Texte/Bilder für das Journal. Erste Lead wird zur Laufzeit
// ggf. durch das CMS-Intro überschrieben (siehe NativeJournalIndexPage).
const journalHeroCtas = {
  primaryHref: '#journal',
  primaryLabel: 'Artikel ansehen',
  secondaryHref: '/contact.html',
  secondaryLabel: 'Fotoauftrag anfragen',
} satisfies Pick<HomeHeroSlide, 'primaryHref' | 'primaryLabel' | 'secondaryHref' | 'secondaryLabel'>

export const journalHeroSlides: HomeHeroSlide[] = [
  {
    image: '/assets/optimized/assets-photos-automobil-sunset-1280.webp',
    titleLines: ['Notizen', 'aus Licht'],
    lead: journalHero.lead,
    ...journalHeroCtas,
  },
  {
    image: '/assets/optimized/assets-photos-automobil-neon-1280.webp',
    titleLines: ['Automotive', 'im Detail'],
    lead: 'Lichtkanten, Lackreflexe und die Frage, wann ein Fahrzeug im Bild wirklich lebt.',
    ...journalHeroCtas,
  },
  {
    image: '/assets/optimized/assets-photos-oldtimer-stage-1280.webp',
    titleLines: ['Material', '& Patina'],
    lead: 'Wie Geschichte sichtbar wird — Chrom, Leder, Lack und die ruhige Inszenierung von Wert.',
    ...journalHeroCtas,
  },
  {
    image: '/assets/optimized/assets-photos-landschaft-960.webp',
    titleLines: ['Vom Bild', 'zum Druck'],
    lead: 'Vom Negativ zur Wand — Material, Farbmanagement und Format als Teil der fotografischen Wirkung.',
    ...journalHeroCtas,
  },
]

export const journalTicker = [
  '<b>Automotive</b> Lichtführung',
  'Portrait ohne Location-Klischee',
  '<b>Düsseldorf</b> Locations',
  'Fine-Art-Druck',
  'Bildauswahl für Kunden',
  '<b>Behind the scenes</b>',
  '<b>Automotive</b> Lichtführung',
  'Portrait ohne Location-Klischee',
  '<b>Düsseldorf</b> Locations',
  'Fine-Art-Druck',
  'Bildauswahl für Kunden',
  '<b>Behind the scenes</b>',
]

export const journalFilters = [
  { label: 'Alle', value: 'all' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Sportwagen', value: 'sportwagen' },
  { label: 'Oldtimer', value: 'oldtimer' },
  { label: 'Motorrad', value: 'motorrad' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Prozess', value: 'prozess' },
  { label: 'Druck', value: 'print' },
]

export const journalCards: JournalPostCard[] = journalArticles.map((article, index) => {
  const cluster = journalClusterFor(article)
  const portraitFormat = cluster === 'portrait' || cluster === 'motorcycle'
  return {
    category: journalClusterProfiles[cluster].filter,
    dateTime: article.dateTime,
    dark: index % 3 === 0,
    eager: index < 3,
    height: portraitFormat ? 2400 : 1280,
    href: `/${article.legacyFile}`,
    image: `/${article.heroImage.replace(/^\//, '')}`,
    imageAlt: article.heroImageAlt,
    readTime: article.minutes,
    text: article.description,
    title: article.title.replace(/<[^>]+>/g, ''),
    width: portraitFormat ? 1600 : 1920,
  }
})
