import { imageDisplayUrl, type PayloadDoc, type PayloadMedia } from './payload'
import { richTextToParagraphs, type PlainRichText } from './richText'

type TextBlock = {
  blockType?: string
  body?: PlainRichText
  headline?: string
}

type ImageSequenceBlock = {
  blockType?: string
  headline?: string
  items?: Array<{
    caption?: string
    image?: PayloadMedia | string
  }>
}

type CmsHeroSlide = NonNullable<PayloadDoc['heroSlides']>[number]

export type PhotographyTopic = {
  id: string
  theme: 'dark' | 'light'
  title: string
  emphasis: string
  text: string
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
  title: string
  text: string
}

export type HomeHeroSlide = {
  image: string
  lead: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  titleLines: string[]
}

export type ServicesIndexItem = {
  id: string
  href: string
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

const cachedHomeHeroImages: Array<[string, string]> = [
  ['mpik8b82-dsc3879', '/assets/optimized/mpik8b82-dsc3879-1280.webp'],
  ['assets-photos-automobil-neon', '/assets/optimized/assets-photos-automobil-neon-1280.webp'],
  ['assets-photos-automobil-sunset', '/assets/optimized/assets-photos-automobil-sunset-1280.webp'],
  ['assets-photos-landschaft', '/assets/optimized/assets-photos-landschaft-960.webp'],
  ['assets-photos-oldtimer-stage', '/assets/optimized/assets-photos-oldtimer-stage-1280.webp'],
  ['assets-photos-motorrad', '/assets/optimized/assets-photos-motorrad-960.webp'],
]

const cachedHomeHeroImage = (image: string) => {
  const normalized = image.toLowerCase()
  const match = cachedHomeHeroImages.find(([needle]) => normalized.includes(needle))
  return match?.[1] || image
}

const homeChapterSizes =
  '(max-width: 780px) calc((100vw - 52px) / 2), (max-width: 1180px) calc((100vw - 112px) / 2), 437px'

const defaultHomeHeroLead =
  'Automobil-, Portrait- und Landschaftsfotografie aus Duesseldorf fuer Marken, Sammler und Menschen mit Anspruch.'

const defaultHeroCtas = {
  primaryHref: '#anfrage',
  primaryLabel: 'Projekt anfragen',
  secondaryHref: '/portfolio.html',
  secondaryLabel: 'Arbeiten ansehen',
}

const fallbackHeroText: Array<{ lead?: string; titleLines: string[] }> = [
  {
    titleLines: ['Fotografie', 'Duesseldorf'],
    lead: defaultHomeHeroLead,
  },
  {
    titleLines: ['Automobil'],
    lead: 'Ruhige Linien, kontrolliertes Licht und Bildserien fuer Fahrzeuge mit Wert.',
  },
  {
    titleLines: ['Landschaft'],
    lead: 'Fine-Art-Motive, Wandbilder und Editionen mit Raumwirkung.',
  },
  {
    titleLines: ['Oldtimer'],
    lead: 'Material, Geschichte und Charakter in praezisen Serien.',
  },
  {
    titleLines: ['Sportwagen'],
    lead: 'Performance, Form und Details ohne austauschbaren Showroom-Look.',
  },
  {
    titleLines: ['Motorrad'],
    lead: 'Maschine, Haltung und Mechanik als konzentrierte Bildstrecke.',
  },
]

export const homeHeroSlidesFallback = homeHeroImages.map((image, index) => ({
  image,
  lead: fallbackHeroText[index]?.lead || '',
  titleLines: fallbackHeroText[index]?.titleLines || ['Fotografie'],
  ...defaultHeroCtas,
}))

const titleLinesFor = (slide: Pick<CmsHeroSlide, 'headlineLine1' | 'headlineLine2'>, fallback: string[]) => {
  const lines = [slide.headlineLine1, slide.headlineLine2]
    .map((line) => (typeof line === 'string' ? line.trim() : ''))
    .filter(Boolean)

  return lines.length > 0 ? lines : fallback
}

const optionalText = (value?: string) => (typeof value === 'string' ? value.trim() : '')

const slideFromImage = (image: string, index: number, lead?: string): HomeHeroSlide => {
  const fallback = fallbackHeroText[index % fallbackHeroText.length] || fallbackHeroText[0]

  return {
    image,
    lead: lead || fallback.lead || '',
    titleLines: fallback.titleLines,
    ...defaultHeroCtas,
  }
}

const homeHeroSlidesFromCms = (doc: PayloadDoc | null | undefined) => {
  const fallback = fallbackHeroText[0]

  return (doc?.heroSlides || [])
    .map((slide, index) => {
      const image = cachedHomeHeroImage(imageDisplayUrl(slide.image, 'wide', { allowOriginal: true }))
      if (!image) return undefined

      return {
        image,
        lead: optionalText(slide.lead),
        primaryHref: slide.primaryHref || defaultHeroCtas.primaryHref,
        primaryLabel: slide.primaryLabel || defaultHeroCtas.primaryLabel,
        secondaryHref: slide.secondaryHref || defaultHeroCtas.secondaryHref,
        secondaryLabel: slide.secondaryLabel || defaultHeroCtas.secondaryLabel,
        titleLines: titleLinesFor(slide, index === 0 ? fallback.titleLines : fallbackHeroText[index]?.titleLines || ['Fotografie']),
      } satisfies HomeHeroSlide
    })
    .filter((slide): slide is HomeHeroSlide => Boolean(slide))
}

export const imageSequenceImages = (
  doc: PayloadDoc | null | undefined,
  labels: string[],
  fallback: string[],
) => {
  const normalizedLabels = labels.map((label) => label.toLowerCase())
  const block = ((doc?.blocks || []) as ImageSequenceBlock[]).find((candidate) => {
    if (candidate.blockType !== 'imageSequence') return false
    const headline = (candidate.headline || '').toLowerCase()
    return normalizedLabels.some((label) => headline.includes(label))
  })

  const images =
    block?.items
      ?.map((item) => imageDisplayUrl(item.image, 'wide', { allowOriginal: true }))
      .filter((url): url is string => Boolean(url)) || []

  return images.length > 0 ? images : fallback
}

export const homeHeroSlidesFor = (doc: PayloadDoc | null | undefined) => {
  const cmsSlides = homeHeroSlidesFromCms(doc)
  if (cmsSlides.length > 0) return cmsSlides

  const sequenceImages = imageSequenceImages(doc, ['hero', 'intro', 'start'], [])
  if (sequenceImages.length > 0) {
    return sequenceImages.map((image, index) => slideFromImage(image, index, index === 0 ? doc?.intro : undefined))
  }

  return homeHeroSlidesFallback
}

export const homeHeroImagesFor = (doc: PayloadDoc | null | undefined) => homeHeroSlidesFor(doc).map((slide) => slide.image)

export const homeChapters: HomeChapter[] = [
  {
    title: 'Automobil',
    href: '/automobil-fotografie-duesseldorf.html',
    image: '/assets/optimized/assets-photos-automobil-sunset-960.webp',
    srcset:
      '/assets/optimized/assets-photos-automobil-sunset-480.webp 480w, /assets/optimized/assets-photos-automobil-sunset-640.webp 640w, /assets/optimized/assets-photos-automobil-sunset-960.webp 960w, /assets/optimized/assets-photos-automobil-sunset-1280.webp 1280w',
    sizes: homeChapterSizes,
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
      '/assets/optimized/assets-photos-automobil-neon-480.webp 480w, /assets/optimized/assets-photos-automobil-neon-640.webp 640w, /assets/optimized/assets-photos-automobil-neon-960.webp 960w, /assets/optimized/assets-photos-automobil-neon-1280.webp 1280w',
    sizes: homeChapterSizes,
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
      '/assets/optimized/assets-photos-oldtimer-stage-480.webp 480w, /assets/optimized/assets-photos-oldtimer-stage-640.webp 640w, /assets/optimized/assets-photos-oldtimer-stage-960.webp 960w, /assets/optimized/assets-photos-oldtimer-stage-1280.webp 1280w',
    sizes: homeChapterSizes,
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
    sizes: homeChapterSizes,
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
    sizes: homeChapterSizes,
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
    sizes: homeChapterSizes,
    alt: 'Landschaftsfotografie',
    width: 1707,
    height: 2560,
    meta: 'Edition · Großformat',
  },
]

export const homeServices: HomeService[] = [
  {
    href: '/fotolabor-druck-duesseldorf.html',
    title: 'Fotolabor & Druck',
    text: 'FineArt- und Hochwertdruck — von der Datei bis zur signierten Edition.',
  },
  {
    href: '/grossformatdruck-duesseldorf.html',
    title: 'Großformatdruck',
    text: 'Poster, Banner, Messewände, Acrylglas — kalibrierte Galeriequalität.',
  },
  {
    href: '/werbetechnik-duesseldorf.html',
    title: 'Werbetechnik',
    text: 'Schaufenster, Beklebungen, Firmenschilder und Displaylösungen für den Raum.',
  },
  {
    href: '/webdesign-seo-duesseldorf.html',
    title: 'Webdesign & SEO',
    text: 'Markenseiten, Portfolios und lokale Sichtbarkeit im Rheinland.',
  },
  {
    href: '/viola-musik-duesseldorf.html',
    title: 'Viola Musik',
    text: 'Live-Musik und klassische Begleitung für Empfänge und Vernissagen.',
  },
  {
    href: '/videografie-duesseldorf.html',
    title: 'Videografie',
    text: 'Marken-, Event- und Imagefilm — vom Konzept bis zum finalen Cut.',
  },
  {
    href: '/drucke-sonderanfertigungen-duesseldorf.html',
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
    title: 'Wie ich einen Oldtimer-Shoot vor Ort aufbaue.',
    text: 'Lichtsetup, Material, Reflexionen — Schritt für Schritt durch einen kompletten Location-Workflow.',
  },
  {
    href: '/blog.html',
    image: '/assets/services/portfolio_webp_full_005-2.webp',
    alt: 'FineArt Print Edition',
    width: 1536,
    height: 1920,
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
    title: 'Lokal arbeiten — Düsseldorf, Köln, Essen.',
    text: 'Wie aus einem Netzwerk im Rheinland ein Workflow für Auflage, Sammlung und Marke entsteht.',
  },
]

export const servicesIndexItems: ServicesIndexItem[] = [
  {
    id: 'fotolabor',
    href: '/fotolabor-druck-duesseldorf.html',
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

// Shader-Hero für die Leistungs-Übersicht (gleiche Mechanik wie Home/Portfolio:
// Bild-Cycle, Lens-Cursor, Aperture-Beam, Glow), aber auf die weiteren
// Dienstleistungen gemünzt — eigene Service-Bilder und Texte. Erste Lead wird in
// NativeServicesIndexPage ggf. durch das CMS-Intro ersetzt.
const servicesHeroCtas = {
  primaryHref: '#anfrage',
  primaryLabel: 'Projekt anfragen',
  secondaryHref: '#overview',
  secondaryLabel: 'Leistungen ansehen',
} satisfies Pick<HomeHeroSlide, 'primaryHref' | 'primaryLabel' | 'secondaryHref' | 'secondaryLabel'>

export const servicesHeroSlides: HomeHeroSlide[] = [
  {
    image: '/assets/services/portfolio_webp_full_006-1.webp',
    titleLines: ['Alles aus', 'einer Hand'],
    lead: 'Für Projekte, die über die Fotografie hinausgehen — Druck, Großformat, Werbetechnik, Webdesign, Video und Live-Musik, seriös koordiniert über erfahrene Partner aus Düsseldorf und NRW.',
    ...servicesHeroCtas,
  },
  {
    image: '/assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp',
    titleLines: ['Vom Bild', 'zum Druck'],
    lead: 'Vom Motiv zur signierten Edition: Fine-Art-Prints, Fotobücher und Spezialmaterial, abgestimmt auf Papier, Oberfläche und Präsentation.',
    ...servicesHeroCtas,
  },
  {
    image: '/assets/services/Catoir_Ramahi-1-106-768x512-1.webp',
    titleLines: ['Großformat', '& Raum'],
    lead: 'Großformat, Schaufenster und Displays mit klarer Fernwirkung — geplant, visualisiert und sauber vor Ort umgesetzt.',
    ...servicesHeroCtas,
  },
  {
    image: '/assets/services/portfolio_webp_full_057-1.webp',
    titleLines: ['Bewegtbild', '& Marke'],
    lead: 'Bewegtbild mit fotografischem Blick: Image-, Event- und Markenfilme, von der Dramaturgie bis zum finalen Cut.',
    ...servicesHeroCtas,
  },
  {
    image: '/assets/services/portfolio_webp_full_254.webp',
    titleLines: ['Live', '& Event'],
    lead: 'Live-Musik und klassische Begleitung, die Atmosphäre schafft — dezent planbar für Empfang, Vernissage und Feier.',
    ...servicesHeroCtas,
  },
]

export const photographyTopics: PhotographyTopic[] = [
  {
    id: 'automobil',
    theme: 'dark',
    title: 'Automobil.',
    emphasis: 'Fotografie.',
    text: 'Für Fahrzeuge, Marken, Händler und private Verkäufe: Exterieur, Interieur, Details und Lichtführung werden so geplant, dass aus einem Auto eine verwertbare Bildserie wird — für Website, Inserat, Social, Print und Kampagne.',
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
    theme: 'light',
    title: 'Sportwagen.',
    emphasis: 'Fotografie.',
    text: 'Sportwagen brauchen Präzision statt Effektfeuerwerk: niedrige Blickachsen, saubere Spiegelungen, Innenraumdetails und eine Dramaturgie, die Leistung sichtbar macht, ohne ins Plakative zu kippen.',
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
    theme: 'dark',
    title: 'Oldtimer.',
    emphasis: 'Fotografie.',
    text: 'Oldtimer Fotografie erzählt Wert, Herkunft und Material. Lack, Chrom, Leder und Patina werden nicht nostalgisch überhöht, sondern mit Charakter und Ruhe präzise dokumentiert.',
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
    theme: 'light',
    title: 'Motorrad.',
    emphasis: 'Fotografie.',
    text: 'Motorräder funktionieren über Haltung, Mechanik und Silhouette. Die Serie kann Maschine, Details, Fahrer und Werkstattbezug verbinden — stärker als ein einzelnes Verkaufsfoto.',
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
    theme: 'dark',
    title: 'Portrait.',
    emphasis: 'Fotografie.',
    text: 'Portraits sollen professionell wirken, ohne Menschen glattzubügeln. Licht, Distanz und Blickführung werden auf Nutzung und Persönlichkeit abgestimmt — für Branding, Presse, Team und Editorial.',
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
    theme: 'light',
    title: 'Landschaft.',
    emphasis: 'Fotografie.',
    text: 'Landschaftsfotografie steht weniger für lokales Shooting als für kuratierten Bildkauf: Fine-Art-Prints, Wandbilder, Editionen und große Formate werden nach Raum, Material und Wirkung ausgewählt.',
    href: '/landschaftsfotografie.html',
    linkLabel: 'Zur Landschaftsfotografie →',
    image: '/assets/optimized/assets-photos-landschaft-720.webp',
    alt: 'Atmosphärische Landschaftsfotografie',
    width: 720,
    height: 1080,
    className: 'topic--landschaft',
  },
]

