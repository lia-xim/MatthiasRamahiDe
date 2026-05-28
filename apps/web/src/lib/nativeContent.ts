import type { PayloadDoc } from './payload'
import { richTextToParagraphs, type PlainRichText } from './richText'

type TextBlock = {
  blockType?: string
  body?: PlainRichText
  headline?: string
}

export type PhotographyTopic = {
  id: string
  kicker: string
  theme: 'dark' | 'light'
  title: string
  emphasis: string
  text: string
  note: string
  href: string
  linkLabel: string
  image: string
  alt: string
  width: number
  height: number
  className: string
}

export type HomeChapter = {
  title: string
  href: string
  image: string
  srcset: string
  sizes: string
  alt: string
  width: number
  height: number
  meta: string
}

export type HomeService = {
  href: string
  number: string
  title: string
  text: string
}

export type HomeJournalCard = {
  href: string
  image: string
  imageAttrs?: string
  alt: string
  width: number
  height: number
  number: string
  date: string
  category: string
  title: string
  text: string
}

const cleanTitle = (value = '') => value.replace(/\s+\./g, '.').trim()

export const blockByHeadline = (doc: PayloadDoc | null | undefined, needle: string) =>
  ((doc?.blocks || []) as TextBlock[]).find((block) => {
    return block.blockType === 'textBlock' && block.headline?.toLowerCase().includes(needle.toLowerCase())
  })

export const blockParagraphs = (doc: PayloadDoc | null | undefined, needle: string, fallback: string[]) => {
  const paragraphs = richTextToParagraphs(blockByHeadline(doc, needle)?.body)
  return paragraphs.length > 0 ? paragraphs : fallback
}

export const blockHeadline = (doc: PayloadDoc | null | undefined, needle: string, fallback: string) =>
  cleanTitle(blockByHeadline(doc, needle)?.headline) || fallback

export const homeHeroImages = [
  '/assets/optimized/mpik8b82-dsc3879-1920.webp',
  '/assets/optimized/assets-photos-automobil-neon-1920.webp',
  '/assets/optimized/assets-photos-landschaft-1920.webp',
  '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
  '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
  '/assets/optimized/assets-photos-motorrad-1920.webp',
]

export const homeChapters: HomeChapter[] = [
  {
    title: 'Automobil',
    href: '/automobil-fotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-automobil-sunset-960.webp',
    srcset:
      '/assets/optimized/assets-photos-automobil-sunset-640.webp 640w, /assets/optimized/assets-photos-automobil-sunset-960.webp 960w, /assets/optimized/assets-photos-automobil-sunset-1280.webp 1280w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Automobilfotografie',
    width: 1920,
    height: 1280,
    meta: 'Location · Location · Detail',
  },
  {
    title: 'Sportwagen',
    href: '/sportwagen-fotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-automobil-neon-960.webp',
    srcset:
      '/assets/optimized/assets-photos-automobil-neon-640.webp 640w, /assets/optimized/assets-photos-automobil-neon-960.webp 960w, /assets/optimized/assets-photos-automobil-neon-1280.webp 1280w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Sportwagenfotografie',
    width: 1920,
    height: 1280,
    meta: 'Performance · Editorial',
  },
  {
    title: 'Oldtimer',
    href: '/oldtimer-fotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp',
    srcset:
      '/assets/optimized/assets-photos-oldtimer-stage-640.webp 640w, /assets/optimized/assets-photos-oldtimer-stage-960.webp 960w, /assets/optimized/assets-photos-oldtimer-stage-1280.webp 1280w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Oldtimerfotografie',
    width: 1920,
    height: 1280,
    meta: 'Sammlung · Auktion',
  },
  {
    title: 'Motorrad',
    href: '/motorrad-fotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-motorrad-720.webp',
    srcset:
      '/assets/optimized/assets-photos-motorrad-480.webp 480w, /assets/optimized/assets-photos-motorrad-720.webp 720w, /assets/optimized/assets-photos-motorrad-960.webp 960w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Motorradfotografie',
    width: 1707,
    height: 2560,
    meta: 'Manufaktur · Bewegung',
  },
  {
    title: 'Portrait',
    href: '/portraitfotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-portrait-warm-720.webp',
    srcset:
      '/assets/optimized/assets-photos-portrait-warm-480.webp 480w, /assets/optimized/assets-photos-portrait-warm-720.webp 720w, /assets/optimized/assets-photos-portrait-warm-960.webp 960w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Portraitfotografie',
    width: 1600,
    height: 2560,
    meta: 'Business · Editorial',
  },
  {
    title: 'Landschaft',
    href: '/landschaftsfotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-landschaft-720.webp',
    srcset:
      '/assets/optimized/assets-photos-landschaft-480.webp 480w, /assets/optimized/assets-photos-landschaft-720.webp 720w, /assets/optimized/assets-photos-landschaft-960.webp 960w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Landschaftsfotografie',
    width: 1707,
    height: 2560,
    meta: 'Edition · Großformat',
  },
]

export const homeServices: HomeService[] = [
  {
    href: '/fotolabor-druck-duesseldorf.html',
    number: 'N° 01',
    title: 'Fotolabor & Druck',
    text: 'FineArt- und Hochwertdruck — von der Datei bis zur signierten Edition.',
  },
  {
    href: '/grossformatdruck-duesseldorf.html',
    number: 'N° 02',
    title: 'Großformatdruck',
    text: 'Poster, Banner, Messewände, Acrylglas — kalibrierte Galeriequalität.',
  },
  {
    href: '/werbetechnik-duesseldorf.html',
    number: 'N° 03',
    title: 'Werbetechnik',
    text: 'Schaufenster, Beklebungen, Firmenschilder und Displaylösungen für den Raum.',
  },
  {
    href: '/webdesign-seo-duesseldorf.html',
    number: 'N° 04',
    title: 'Webdesign & SEO',
    text: 'Markenseiten, Portfolios und lokale Sichtbarkeit im Rheinland.',
  },
  {
    href: '/viola-musik-duesseldorf.html',
    number: 'N° 05',
    title: 'Viola Musik',
    text: 'Live-Musik und klassische Begleitung für Empfänge und Vernissagen.',
  },
  {
    href: '/videografie-duesseldorf.html',
    number: 'N° 06',
    title: 'Videografie',
    text: 'Marken-, Event- und Imagefilm — vom Konzept bis zum finalen Cut.',
  },
  {
    href: '/drucke-sonderanfertigungen-duesseldorf.html',
    number: 'N° 07',
    title: 'Drucke & Sonderanfertigungen',
    text: 'Mappen, Editionen, Geschenke und Interior — von der Idee zum Unikat.',
  },
]

export const homeJournalCards: HomeJournalCard[] = [
  {
    href: '/blog.html',
    image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp',
    imageAttrs:
      'data-src="/assets/optimized/assets-photos-oldtimer-stage-960.webp" data-srcset="/assets/optimized/assets-photos-oldtimer-stage-640.webp 640w, /assets/optimized/assets-photos-oldtimer-stage-960.webp 960w, /assets/optimized/assets-photos-oldtimer-stage-1280.webp 1280w"',
    alt: 'Location Setup für Oldtimer',
    width: 1920,
    height: 1280,
    number: 'N° 01',
    date: '05 / 2026',
    category: 'Fotograf',
    title: 'Wie ich einen Oldtimer-Shoot vor Ort aufbaue.',
    text: 'Lichtsetup, Material, Reflexionen — Schritt für Schritt durch einen kompletten Location-Workflow.',
  },
  {
    href: '/blog.html',
    image: '/assets/services/portfolio_webp_full_005-2.webp',
    alt: 'FineArt Print Edition',
    width: 1536,
    height: 1920,
    number: 'N° 02',
    date: '04 / 2026',
    category: 'Print',
    title: 'Vom Sensor bis zur FineArt-Edition.',
    text: 'Farbprofile, Papiere, Druckpartner — was zwischen Bild und signierter Edition wirklich passiert.',
  },
  {
    href: '/blog.html',
    image: '/assets/optimized/assets-photos-automobil-neon-960.webp',
    imageAttrs:
      'data-src="/assets/optimized/assets-photos-automobil-neon-960.webp" data-srcset="/assets/optimized/assets-photos-automobil-neon-640.webp 640w, /assets/optimized/assets-photos-automobil-neon-960.webp 960w, /assets/optimized/assets-photos-automobil-neon-1280.webp 1280w"',
    alt: 'Automotive Fotografie in Düsseldorf',
    width: 1920,
    height: 1280,
    number: 'N° 03',
    date: '03 / 2026',
    category: 'Location',
    title: 'Lokal arbeiten — Düsseldorf, Köln, Essen.',
    text: 'Warum Nähe, Genehmigungen und Timing für Automotive-Produktionen entscheidend sind.',
  },
]

export const photographyTopics: PhotographyTopic[] = [
  {
    id: 'automobil',
    kicker: '01 · Automobil',
    theme: 'dark',
    title: 'Automobil.',
    emphasis: 'Fotografie.',
    text: 'Für Fahrzeuge, Marken, Händler und private Verkäufe: Exterieur, Interieur, Details und Lichtführung werden so geplant, dass aus einem Auto eine verwertbare Bildserie wird — für Website, Inserat, Social, Print und Kampagne.',
    note: 'Keine generischen Fahrzeugbilder: kontrollierte Reflexe, ruhige Linien und ein Bildsatz, der technisch sauber weiterverwendet werden kann.',
    href: '/automobil-fotografie.html',
    linkLabel: 'Zur Automobil Fotografie →',
    image: '/assets/optimized/assets-photos-automobil-neon-1920.webp',
    alt: 'Automobil im kontrollierten Neonlicht',
    width: 1920,
    height: 1280,
    className: 'topic--automobil',
  },
  {
    id: 'sportwagen',
    kicker: '02 · Sportwagen',
    theme: 'light',
    title: 'Sportwagen.',
    emphasis: 'Fotografie.',
    text: 'Sportwagen brauchen Präzision statt Effektfeuerwerk: niedrige Blickachsen, saubere Spiegelungen, Innenraumdetails und eine Dramaturgie, die Leistung sichtbar macht, ohne ins Plakative zu kippen.',
    note: 'Für Sammler, Händler, Performance-Projekte und hochwertige Verkaufsserien mit Bildwirkung über den ersten Blick hinaus.',
    href: '/sportwagen-fotografie.html',
    linkLabel: 'Zur Sportwagen Fotografie →',
    image: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    alt: 'Sportwagen im warmen Streiflicht',
    width: 1920,
    height: 1280,
    className: 'topic--sportwagen',
  },
  {
    id: 'oldtimer',
    kicker: '03 · Oldtimer',
    theme: 'dark',
    title: 'Oldtimer.',
    emphasis: 'Fotografie.',
    text: 'Oldtimer Fotografie erzählt Wert, Herkunft und Material. Lack, Chrom, Leder und Patina werden nicht nostalgisch überhöht, sondern mit Charakter und Ruhe präzise dokumentiert.',
    note: 'Ideal für Sammlung, Auktion, Verkauf, Ausstellung und Fahrzeuge, deren Geschichte sichtbar bleiben soll.',
    href: '/oldtimer-fotografie.html',
    linkLabel: 'Zur Oldtimer Fotografie →',
    image: '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    alt: 'Oldtimer als ruhige Inszenierung',
    width: 1920,
    height: 1280,
    className: 'topic--oldtimer',
  },
  {
    id: 'motorrad',
    kicker: '04 · Motorrad',
    theme: 'light',
    title: 'Motorrad.',
    emphasis: 'Fotografie.',
    text: 'Motorräder funktionieren über Haltung, Mechanik und Silhouette. Die Serie kann Maschine, Details, Fahrer und Werkstattbezug verbinden — stärker als ein einzelnes Verkaufsfoto.',
    note: 'Für Custom Bikes, Händler, private Maschinen, Werkstätten und dokumentarische Serien mit Druck.',
    href: '/motorrad-fotografie.html',
    linkLabel: 'Zur Motorrad Fotografie →',
    image: '/assets/optimized/assets-photos-motorrad-1920.webp',
    alt: 'Motorrad mit dunkler Location-Atmosphäre',
    width: 1707,
    height: 2560,
    className: 'topic--motorrad',
  },
  {
    id: 'portrait',
    kicker: '05 · Portrait',
    theme: 'dark',
    title: 'Portrait.',
    emphasis: 'Fotografie.',
    text: 'Portraits sollen professionell wirken, ohne Menschen glattzubügeln. Licht, Distanz und Blickführung werden auf Nutzung und Persönlichkeit abgestimmt — für Branding, Presse, Team und Editorial.',
    note: 'Kein Passbild-Look, kein austauschbares LinkedIn-Template — sondern klare Bilder mit Haltung und Wiedererkennung.',
    href: '/portraitfotografie.html',
    linkLabel: 'Zur Portrait Fotografie →',
    image: '/assets/photos/portrait-blue.webp',
    alt: 'Editoriales Portrait mit blauem Licht',
    width: 2048,
    height: 2560,
    className: 'topic--portrait',
  },
  {
    id: 'landschaft',
    kicker: '06 · Landschaft',
    theme: 'light',
    title: 'Landschaft.',
    emphasis: 'Fotografie.',
    text: 'Landschaftsfotografie steht weniger für lokales Shooting als für kuratierten Bildkauf: Fine-Art-Prints, Wandbilder, Editionen und große Formate werden nach Raum, Material und Wirkung ausgewählt.',
    note: 'Sinnvoll für private Räume, Praxen, Hotels, Büros und Sammlungen, die Ruhe statt Dekoration suchen.',
    href: '/landschaftsfotografie.html',
    linkLabel: 'Zur Landschaftsfotografie →',
    image: '/assets/optimized/assets-photos-landschaft-1920.webp',
    alt: 'Atmosphärische Landschaftsfotografie',
    width: 1707,
    height: 2560,
    className: 'topic--landschaft',
  },
]
