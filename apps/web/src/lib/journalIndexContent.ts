import type { HomeHeroSlide } from './nativeContent'

export type JournalPostCard = {
  category: string
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
  { label: 'Portrait', value: 'portrait' },
  { label: 'Prozess', value: 'prozess' },
  { label: 'Druck', value: 'print' },
]

export const journalCards: JournalPostCard[] = [
  {
    category: 'automotive',
    dark: true,
    href: '/blog-automotive-fotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-automobil-neon-960.webp',
    imageAlt: 'Automobil in neonartigem Licht',
    width: 960,
    height: 640,
    readTime: '5 Min',
    title: 'Automotive-Fotografie in Düsseldorf.',
    text: 'Standort, Lichtkante und Karosserieform entscheiden darüber, ob ein Fahrzeug lebendig wirkt.',
    eager: true,
  },
  {
    category: 'portrait',
    href: '/blog-portraits-ohne-generische-posen.html',
    image: '/assets/optimized/assets-photos-portrait-warm-720.webp',
    imageAlt: 'Portrait in warmem Licht',
    width: 720,
    height: 1152,
    readTime: '4 Min',
    title: 'Portraits ohne generische Posen.',
    text: 'Wie ein ruhiger Bildraum mehr Wirkung erzeugt als ein überinszeniertes Setting.',
    eager: true,
  },
  {
    category: 'prozess',
    href: '/blog-serie-kuratieren.html',
    image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp',
    imageAlt: 'Oldtimer Szene in dunklem Licht',
    width: 960,
    height: 640,
    readTime: '6 Min',
    title: 'Wie eine Serie kuratiert wird.',
    text: 'Von der ersten Auswahl bis zur Reihenfolge, die beim Betrachten Spannung hält.',
    eager: true,
  },
  {
    category: 'automotive',
    dark: true,
    href: '/blog-oldtimer-wertobjekt.html',
    image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp',
    imageAlt: 'Oldtimer in Bühnenlicht',
    width: 960,
    height: 640,
    readTime: '3 Min',
    title: 'Oldtimer als Wertobjekt.',
    text: 'Warum Zurückhaltung oft hochwertiger wirkt als dramatischer Dauer-Effekt.',
  },
  {
    category: 'print',
    href: '/blog-fine-art-druck.html',
    image: '/assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp',
    imageAlt: 'Fotobücher und Druckprodukte',
    width: 860,
    height: 603,
    readTime: '5 Min',
    title: 'Vom Bild zum Fine-Art-Druck.',
    text: 'Warum Material und Farbmanagement Teil der fotografischen Wirkung sind.',
    eager: true,
  },
  {
    category: 'prozess',
    dark: true,
    href: '/blog-location-scouting-duesseldorf.html',
    image: '/assets/optimized/assets-photos-landschaft-720.webp',
    imageAlt: 'Landschaftsmotiv mit starker Tiefe',
    width: 720,
    height: 1080,
    readTime: '4 Min',
    title: 'Location Scouting für starke Motive.',
    text: 'Wie Orte ausgewählt werden, bevor Kamera und Licht überhaupt aufgebaut sind.',
    eager: true,
  },
  {
    category: 'automotive',
    href: '/blog-motorradfotografie-linien.html',
    image: '/assets/optimized/assets-photos-motorrad-720.webp',
    imageAlt: 'Motorrad vor Architektur',
    width: 720,
    height: 1080,
    readTime: '4 Min',
    title: 'Linien, Metall, Haltung.',
    text: 'Warum Motorradbilder stärker über Spannung und Nähe funktionieren.',
    eager: true,
  },
]
