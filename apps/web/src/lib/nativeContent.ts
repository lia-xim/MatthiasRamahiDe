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
  dataSrc?: string
  dataSrcset?: string
  sizes?: string
  alt: string
  width: number
  height: number
  number: string
  date: string
  category: string
  title: string
  text: string
}

export type ServicesIndexItem = {
  id: string
  href: string
  number: string
  headline: string
  text: string
  tags: string[]
  theme: 'light' | 'dark'
  images: Array<{
    alt: string
    caption: string
    className?: string
    height: number
    src: string
    width: number
  }>
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
  '/assets/optimized/mpik8b82-dsc3879-1280.webp',
  '/assets/optimized/assets-photos-automobil-neon-1280.webp',
  '/assets/optimized/assets-photos-landschaft-960.webp',
  '/assets/optimized/assets-photos-oldtimer-stage-1280.webp',
  '/assets/optimized/assets-photos-automobil-sunset-1280.webp',
  '/assets/optimized/assets-photos-motorrad-960.webp',
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
    dataSrc: '/assets/optimized/assets-photos-oldtimer-stage-960.webp',
    dataSrcset:
      '/assets/optimized/assets-photos-oldtimer-stage-640.webp 640w, /assets/optimized/assets-photos-oldtimer-stage-960.webp 960w, /assets/optimized/assets-photos-oldtimer-stage-1280.webp 1280w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
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
    image: '/assets/optimized/assets-photos-landschaft-720.webp',
    dataSrc: '/assets/optimized/assets-photos-landschaft-720.webp',
    dataSrcset:
      '/assets/optimized/assets-photos-landschaft-480.webp 480w, /assets/optimized/assets-photos-landschaft-720.webp 720w, /assets/optimized/assets-photos-landschaft-960.webp 960w',
    sizes: '(max-width: 780px) calc(100vw - 44px), (max-width: 1180px) calc((100vw - 112px) / 2), 437px',
    alt: 'Lokal arbeiten im Rheinland',
    width: 1707,
    height: 2560,
    number: 'N° 03',
    date: '03 / 2026',
    category: 'NRW',
    title: 'Lokal arbeiten — Düsseldorf, Köln, Essen.',
    text: 'Wie aus einem Netzwerk im Rheinland ein Workflow für Auflage, Sammlung und Marke entsteht.',
  },
]

export const servicesIndexItems: ServicesIndexItem[] = [
  {
    id: 'fotolabor',
    href: '/fotolabor-druck-duesseldorf.html',
    number: '01 · Fine Art',
    headline: 'Fotolabor & <em>Druck.</em>',
    text: 'In Zusammenarbeit mit einem Druckpartner in Düsseldorf entstehen hochwertige Fotodrucke, Bücher, Leinwände und Spezialmaterialien — von der Motivprüfung über Papier und Oberfläche bis zur finalen Präsentation an Wand, Tisch oder Portfolio.',
    tags: ['Fine Art Prints', 'Fotobücher', 'Spezialmaterial'],
    theme: 'light',
    images: [
      {
        className: 'tall print',
        src: '/assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp',
        alt: 'Fotobücher und Druckprodukte',
        width: 860,
        height: 603,
        caption: 'Print · Buch',
      },
      {
        className: 'small',
        src: '/assets/optimized/assets-photos-landschaft-720.webp',
        alt: 'Landschaftsmotiv als möglicher Fine-Art-Druck',
        width: 720,
        height: 1080,
        caption: 'Motiv · Fine Art',
      },
    ],
  },
  {
    id: 'grossformat',
    href: '/grossformatdruck-duesseldorf.html',
    number: '02 · Präsentation',
    headline: 'Großformat<em>druck.</em>',
    text: 'Für große Auftritte: Poster, Banner, Acrylglasdrucke oder Messesysteme in hochwertiger Qualität — geeignet für Ausstellungen, Autohauspräsentationen, Schaufenster, Messewände und Interior-Lösungen mit klarer Fernwirkung.',
    tags: ['Poster', 'Banner', 'Acrylglas'],
    theme: 'dark',
    images: [
      {
        src: '/assets/services/Catoir_Ramahi-1-106-768x512-1.webp',
        alt: 'Großformatige Schaufensterfassade in Düsseldorf',
        width: 768,
        height: 512,
        caption: 'Fassade',
      },
      {
        className: 'small',
        src: '/assets/services/catoir_ramahiinuikiim21-720.webp',
        alt: 'Präsentationsfläche mit großem Display',
        width: 720,
        height: 1080,
        caption: 'Display',
      },
    ],
  },
  {
    id: 'werbetechnik',
    href: '/werbetechnik-duesseldorf.html',
    number: '03 · Beschriftung',
    headline: 'Werbe<em>technik.</em>',
    text: 'Schaufensterbeklebung, Firmenschilder, Displaylösungen und Raumgrafiken werden gemeinsam mit einem Werbetechnik-Partner geplant und sauber umgesetzt — inklusive Materialwahl, Visualisierung und Montage vor Ort.',
    tags: ['Schaufenster', 'Displays', 'Beschilderung'],
    theme: 'light',
    images: [
      {
        src: '/assets/services/Catoir_Ramahi-1-32-768x512-1.webp',
        alt: 'Moderne Präsentationsfläche mit Produktdisplay',
        width: 768,
        height: 512,
        caption: 'Displaybau',
      },
      {
        className: 'small',
        src: '/assets/services/portfolio_webp_full_006-1.webp',
        alt: 'Chanel-Schaufensterbeklebung bei Nacht',
        width: 1920,
        height: 1280,
        caption: 'Window',
      },
    ],
  },
  {
    id: 'webdesign',
    href: '/webdesign-seo-duesseldorf.html',
    number: '04 · Online',
    headline: 'Webdesign & <em>SEO.</em>',
    text: 'Gemeinsam mit einer Webagentur entstehen moderne Online-Auftritte, die Bildsprache, Performance und Sichtbarkeit verbinden — mit Struktur für Leistungen, lokale Suchanfragen, Referenzen, Blog und einfache Kontaktaufnahme.',
    tags: ['Website', 'SEO', 'Performance'],
    theme: 'dark',
    images: [
      {
        className: 'screen',
        src: '/assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-720.webp',
        alt: 'Website-Design mit Reinigungsszene und Kontaktinformationen',
        width: 720,
        height: 1016,
        caption: 'Website',
      },
      {
        className: 'small',
        src: '/assets/services/portfolio_webp_full_001.webp',
        alt: 'Server-Racks als Symbol für technische Infrastruktur',
        width: 1280,
        height: 800,
        caption: 'Technik',
      },
    ],
  },
  {
    id: 'viola',
    href: '/viola-musik-duesseldorf.html',
    number: '05 · Event',
    headline: 'Viola <em>Musik.</em>',
    text: 'Musikalische Begleitung für besondere Momente — ob Hochzeit, Firmenfeier oder Event. Live-Musik schafft Atmosphäre, bleibt aber dezent planbar: passend zu Ablauf, Raum, Gästezahl und gewünschter Stimmung.',
    tags: ['Hochzeit', 'Event', 'Live-Musik'],
    theme: 'light',
    images: [
      {
        className: 'viola',
        src: '/assets/services/portfolio_webp_full_254.webp',
        alt: 'Violinistin in einem Kleid spielt im Freien',
        width: 1268,
        height: 1920,
        caption: 'Performance',
      },
      {
        className: 'small',
        src: '/assets/services/portfolio_webp_full_004-2.webp',
        alt: 'Nahaufnahme von Violinen',
        width: 853,
        height: 1280,
        caption: 'Instrument',
      },
    ],
  },
  {
    id: 'videografie',
    href: '/videografie-duesseldorf.html',
    number: '06 · Motion',
    headline: 'Video<em>grafie.</em>',
    text: 'Professionelle Videos für Fahrzeuge, Events, Imagekampagnen und Social Media — konzipiert mit fotografischem Blick, klarer Dramaturgie und passenden Exportformaten für Website, Reels, Kampagnen oder Präsentationen.',
    tags: ['Imagefilm', 'Event', 'Social Media'],
    theme: 'dark',
    images: [
      {
        src: '/assets/services/portfolio_webp_full_058-1.webp',
        alt: 'Professionelle Videokamera bei einer Veranstaltung',
        width: 1536,
        height: 1920,
        caption: 'Kamera',
      },
      {
        className: 'small',
        src: '/assets/services/portfolio_webp_full_057-1.webp',
        alt: 'Performance in rotem Licht',
        width: 1280,
        height: 1920,
        caption: 'Event',
      },
    ],
  },
  {
    id: 'sonder',
    href: '/drucke-sonderanfertigungen-duesseldorf.html',
    number: '07 · Sonderformat',
    headline: 'Drucke & <em>Sonderanfertigungen.</em>',
    text: 'Für Motive, die einen besonderen Ort bekommen sollen: Sonderformate, Materialtests, dekorative Drucklösungen und individuelle Präsentationen werden passend zu Raum, Anlass, Menge, Oberfläche und gewünschter Wirkung geplant.',
    tags: ['Sonderformate', 'Materialtest', 'Interior'],
    theme: 'light',
    images: [
      {
        src: '/assets/photos/portrait-warm.webp',
        alt: 'Portraitmotiv als hochwertiger Druck',
        width: 1600,
        height: 2560,
        caption: 'Motiv',
      },
      {
        className: 'small',
        src: '/assets/optimized/assets-photos-automobil-sunset-960.webp',
        alt: 'Automobilmotiv als Präsentationsdruck',
        width: 960,
        height: 640,
        caption: 'Format',
      },
    ],
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
    image: '/assets/optimized/assets-photos-automobil-neon-960.webp',
    alt: 'Automobil im kontrollierten Neonlicht',
    width: 960,
    height: 640,
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
    image: '/assets/optimized/assets-photos-automobil-sunset-960.webp',
    alt: 'Sportwagen im warmen Streiflicht',
    width: 960,
    height: 640,
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
    image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp',
    alt: 'Oldtimer als ruhige Inszenierung',
    width: 960,
    height: 640,
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
    image: '/assets/optimized/assets-photos-motorrad-720.webp',
    alt: 'Motorrad mit dunkler Location-Atmosphäre',
    width: 720,
    height: 1080,
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
    image: '/assets/optimized/assets-photos-portrait-blue-720.webp',
    alt: 'Editoriales Portrait mit blauem Licht',
    width: 720,
    height: 900,
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
    image: '/assets/optimized/assets-photos-landschaft-720.webp',
    alt: 'Atmosphärische Landschaftsfotografie',
    width: 720,
    height: 1080,
    className: 'topic--landschaft',
  },
]
