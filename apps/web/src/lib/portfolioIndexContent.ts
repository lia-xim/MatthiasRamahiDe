export type PortfolioPhoto = {
  caption: string
  height: number
  href: string
  src: string
  width: number
  eager?: boolean
}

export type PortfolioSpread = {
  id: string
  label: string
  heading: string
  /** Kurze Einordnung der Serie — was sie zeigt und wofür die Bilder gedacht sind. */
  lead?: string
  href: string
  linkLabel: string
  portfolioHref?: string
  portfolioLinkLabel?: string
  theme: 'light' | 'dark'
  photos: PortfolioPhoto[]
}

export const portfolioHeroSlidesFallback = [
  {
    image: '/assets/optimized/assets-portfolio-dsc3879-1920.webp',
    titleLines: ['Portfolio', 'Bildarchiv'],
    lead: 'Serien aus Portrait, Automobil, Sportwagen, Oldtimer, Motorrad und Landschaft als eigener Einstieg ins Bildarchiv.',
    primaryHref: '#archive',
    primaryLabel: 'Archiv ansehen',
    secondaryHref: '#anfrage',
    secondaryLabel: 'Projekt anfragen',
  },
  {
    image: '/assets/optimized/assets-portfolio-dsc2310-1920.webp',
    titleLines: ['Sportwagen', 'Details'],
    lead: 'Form, Reflexion und Linie in ruhigen Serien fuer Marke, Verkauf und Sammlung.',
    primaryHref: '#sport',
    primaryLabel: 'Serie ansehen',
    secondaryHref: '#archive',
    secondaryLabel: 'Zum Archiv',
  },
  {
    image: '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    titleLines: ['Oldtimer', 'Charakter'],
    lead: 'Material, Patina und Geschichte als Bildstrecke mit kontrolliertem Licht.',
    primaryHref: '#classic',
    primaryLabel: 'Serie ansehen',
    secondaryHref: '#anfrage',
    secondaryLabel: 'Anfragen',
  },
  {
    image: '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp',
    titleLines: ['Motorrad', 'Mechanik'],
    lead: 'Maschine, Haltung und Details fuer konzentrierte Editorial- und Verkaufsbilder.',
    primaryHref: '#moto',
    primaryLabel: 'Serie ansehen',
    secondaryHref: '#archive',
    secondaryLabel: 'Zum Archiv',
  },
  {
    image: '/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp',
    titleLines: ['Landschaft', 'Edition'],
    lead: 'Ruhige Landschaftsmotive fuer Fine-Art, Wandbild und grossformatige Praesentation.',
    primaryHref: '#land',
    primaryLabel: 'Serie ansehen',
    secondaryHref: '#archive',
    secondaryLabel: 'Zum Archiv',
  },
]

export const portfolioContext = [
  'Das Portfolio ist nach Bildfunktionen und Themenclustern aufgebaut: Portrait, Automobil, Sportwagen, Oldtimer, Motorrad und Landschaft. Jede Strecke zeigt nicht nur ein einzelnes Motiv, sondern die visuelle Logik dahinter: Einstieg, Detail, Material, Atmosphaere und ein ruhiges Schlussbild.',
  'So wird schneller sichtbar, welche Bildsprache fuer Verkauf, Marke, Sammlung, Website, Print oder redaktionelle Nutzung passt. Die Galerie fuehrt bewusst in die passenden Leistungs- und Standortseiten weiter, damit Portfolio und konkrete Anfragen dieselbe Struktur sprechen.',
]

export const portfolioIndexLinks = [
  { label: 'Portrait', href: '#portrait' },
  { label: 'Automobil', href: '#auto' },
  { label: 'Sportwagen', href: '#sport' },
  { label: 'Oldtimer', href: '#classic' },
  { label: 'Motorrad', href: '#moto' },
  { label: 'Landschaft', href: '#land' },
  { label: 'Archiv', href: '#archive' },
]

const photo = (
  caption: string,
  href: string,
  src: string,
  width: number,
  height: number,
  eager = false,
): PortfolioPhoto => ({
  caption,
  eager,
  height,
  href,
  src,
  width,
})

export const portfolioSpreads: PortfolioSpread[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    heading: 'Portrait',
    lead: 'Bewegung, Licht und Haltung: Tanzserien im Bühnenlicht, Musikerinnen an offenen Orten, ruhige Einzelstudien. Die Führung ist Teil der Arbeit — Blick, Abstand und Körperspannung werden gesetzt, nicht abgewartet.',
    href: '/portraitfotografie-duesseldorf.html',
    linkLabel: 'Zur Portraitfotografie →',
    portfolioHref: '/portfolio/portfolio-auswahl-portrait',
    portfolioLinkLabel: 'Portrait-Auswahl ansehen →',
    theme: 'light',
    photos: [
      photo('Portrait', '/assets/portfolio/_DSC0470-Enhanced-NR.webp', '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', 720, 1152),
      photo('Portrait', '/assets/portfolio/_DSC9301-Enhanced-NR.webp', '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', 720, 900),
      photo(
        'Portrait',
        '/assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp',
        '/assets/portfolio/thumbs/20250327-DSC01550.webp',
        720,
        1090,
      ),
      photo('Portrait', '/assets/portfolio/_DSC9321-Enhanced-NR.webp', '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', 720, 1080),
    ],
  },
  {
    id: 'auto',
    label: 'Automobil',
    heading: 'Automobil',
    lead: 'Fahrzeuge im Abendlicht, auf dem Messestand und in der Halle — Exterieur, Interieur und Detail als zusammenhängende Serie. Licht und Standort stehen vor dem Termin fest, damit Lack, Linie und Innenraum dieselbe Bildsprache tragen.',
    href: '/automobil-fotografie-duesseldorf.html',
    linkLabel: 'Zur Automobilfotografie →',
    portfolioHref: '/portfolio/portfolio-auswahl-automobil',
    portfolioLinkLabel: 'Automobil-Auswahl ansehen →',
    theme: 'dark',
    photos: [
      photo('Automobil', '/assets/optimized/assets-photos-automobil-neon-1920.webp', '/assets/optimized/assets-photos-automobil-neon-960.webp', 960, 640),
      photo('Automobil', '/assets/optimized/assets-portfolio-dsc3982-1920.webp', '/assets/portfolio/thumbs/_DSC3982.webp', 720, 480),
      photo('Automobil', '/assets/optimized/assets-portfolio-dsc3878-1920.webp', '/assets/portfolio/thumbs/_DSC3878.webp', 720, 480),
      photo('Automobil', '/assets/optimized/assets-portfolio-dsc3908-1920.webp', '/assets/portfolio/thumbs/_DSC3908.webp', 720, 480),
    ],
  },
  {
    id: 'sport',
    label: 'Sportwagen',
    heading: 'Sportwagen',
    lead: 'Renn- und Straßensportwagen aus Messehallen, Showräumen und Tiefgaragen. Der Bildaufbau folgt der Form: tiefe Perspektive, kontrollierte Reflexionen, klare Kanten statt Effekt.',
    href: '/sportwagen-fotografie-duesseldorf.html',
    linkLabel: 'Zur Sportwagenfotografie →',
    portfolioHref: '/portfolio/portfolio-auswahl-sportwagen',
    portfolioLinkLabel: 'Sportwagen-Auswahl ansehen →',
    theme: 'light',
    photos: [
      photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2310-1920.webp', '/assets/portfolio/thumbs/_DSC2310.webp', 720, 480),
      photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2316-1920.webp', '/assets/portfolio/thumbs/_DSC2316.webp', 720, 450),
      photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2345-1920.webp', '/assets/portfolio/thumbs/_DSC2345.webp', 720, 576),
      photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2358-1920.webp', '/assets/portfolio/thumbs/_DSC2358.webp', 720, 1080),
    ],
  },
  {
    id: 'classic',
    label: 'Oldtimer',
    heading: 'Oldtimer',
    lead: 'Vorkriegsrennwagen, Klassiker auf der Bühne und Cockpits mit Patina. Material und Gebrauchsspuren bleiben sichtbar — Speichen, Leder und Rundinstrumente werden nicht weggeglättet.',
    href: '/oldtimer-fotografie-duesseldorf.html',
    linkLabel: 'Zur Oldtimerfotografie →',
    portfolioHref: '/portfolio/portfolio-auswahl-oldtimer',
    portfolioLinkLabel: 'Oldtimer-Auswahl ansehen →',
    theme: 'dark',
    photos: [
      photo('Oldtimer', '/assets/optimized/assets-portfolio-dsc3892-1920.webp', '/assets/portfolio/thumbs/_DSC3892.webp', 720, 480),
      photo('Oldtimer', '/assets/optimized/assets-portfolio-dsc2986-1920.webp', '/assets/portfolio/thumbs/_DSC2986.webp', 720, 1080),
      photo(
        'Karosserie',
        '/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp',
        '/assets/portfolio/thumbs/_DSC3032_genErase (1).webp',
        720,
        480,
      ),
      photo(
        'Karosserie',
        '/assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp',
        '/assets/portfolio/thumbs/_DSC3032_genErase (2).webp',
        720,
        480,
      ),
    ],
  },
  {
    id: 'moto',
    label: 'Motorrad',
    heading: 'Motorrad',
    lead: 'Maschinen im Stand, aber nie statisch: Detailschnitte an Gabel und Lenker, Silhouetten vor Glasfassaden, Nachtaufnahmen mit gesetztem Farblicht. Jede Serie deckt Gesamtansicht, Detail und Atmosphäre ab.',
    href: '/motorrad-fotografie-duesseldorf.html',
    linkLabel: 'Zur Motorradfotografie →',
    portfolioHref: '/portfolio/portfolio-auswahl-motorrad',
    portfolioLinkLabel: 'Motorrad-Auswahl ansehen →',
    theme: 'light',
    photos: [
      photo('Motorrad', '/assets/optimized/assets-photos-motorrad-duke-1920.webp', '/assets/optimized/assets-photos-motorrad-duke-720.webp', 720, 1280),
      photo(
        'Motorrad',
        '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp',
        '/assets/optimized/assets-photos-motorrad-ninja-road-720.webp',
        720,
        1080,
      ),
      photo('Detail', '/assets/optimized/assets-portfolio-dsc6982-1920.webp', '/assets/portfolio/thumbs/_DSC6982.webp', 720, 1080),
      photo('Detail', '/assets/optimized/assets-portfolio-dsc8032-1920.webp', '/assets/portfolio/thumbs/_DSC8032.webp', 720, 900),
    ],
  },
  {
    id: 'land',
    label: 'Landschaft',
    heading: 'Landschaft',
    lead: 'Ruhige Landschaften von der Alpenkante bis zur Atlantikküste — Felsinseln, Steilküsten, weite Strände und ein Steinbock im Gegenlicht. Die Motive sind auf großes Format gerechnet und als Fine-Art-Print erhältlich.',
    href: '/landschaftsfotografie-duesseldorf.html',
    linkLabel: 'Zur Landschaftsfotografie →',
    portfolioHref: '/portfolio/portfolio-auswahl-landschaft',
    portfolioLinkLabel: 'Landschaft-Auswahl ansehen →',
    theme: 'dark',
    photos: [
      photo(
        'Landschaft',
        '/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp',
        '/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp',
        720,
        471,
      ),
      photo(
        'Landschaft',
        '/assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp',
        '/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp',
        720,
        520,
      ),
      photo(
        'Landschaft',
        '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp',
        '/assets/portfolio/thumbs/20250605-DSC03756.webp',
        720,
        1080,
      ),
      photo(
        'Landschaft',
        '/assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp',
        '/assets/portfolio/thumbs/20250605-DSC04020.webp',
        720,
        1080,
      ),
    ],
  },
]

export const portfolioArchivePhotos: PortfolioPhoto[] = [
  photo('Portrait', '/assets/portfolio/_DSC9321-Enhanced-NR.webp', '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', 720, 1080, true),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc3879-1920.webp', '/assets/portfolio/thumbs/_DSC3879.webp', 720, 480, true),
  photo('Panorama', '/assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp', '/assets/portfolio/thumbs/20250605-DSC03978.webp', 720, 960, true),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc3982-1920.webp', '/assets/portfolio/thumbs/_DSC3982.webp', 720, 480),
  photo('Portrait', '/assets/portfolio/_DSC9301-Enhanced-NR.webp', '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', 720, 900),
  photo('Portrait', '/assets/portfolio/_DSC0470-Enhanced-NR.webp', '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', 720, 1152),
  photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2310-1920.webp', '/assets/portfolio/thumbs/_DSC2310.webp', 720, 480),
  photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2316-1920.webp', '/assets/portfolio/thumbs/_DSC2316.webp', 720, 450),
  photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2329-1920.webp', '/assets/portfolio/thumbs/_DSC2329.webp', 720, 1080, true),
  photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2345-1920.webp', '/assets/portfolio/thumbs/_DSC2345.webp', 720, 576),
  photo('Sportwagen', '/assets/optimized/assets-portfolio-dsc2358-1920.webp', '/assets/portfolio/thumbs/_DSC2358.webp', 720, 1080),
  photo('Oldtimer', '/assets/optimized/assets-photos-oldtimer-stage-1920.webp', '/assets/optimized/assets-photos-oldtimer-stage-960.webp', 960, 640, true),
  photo('Oldtimer', '/assets/optimized/assets-portfolio-dsc3892-1920.webp', '/assets/portfolio/thumbs/_DSC3892.webp', 720, 480),
  photo('Oldtimer', '/assets/optimized/assets-portfolio-dsc2986-1920.webp', '/assets/portfolio/thumbs/_DSC2986.webp', 720, 1080),
  photo('Karosserie', '/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', '/assets/portfolio/thumbs/_DSC3032_genErase (1).webp', 720, 480),
  photo('Karosserie', '/assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp', '/assets/portfolio/thumbs/_DSC3032_genErase (2).webp', 720, 480),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc2876-generase-1-1920.webp', '/assets/portfolio/thumbs/_DSC2876_genErase (1).webp', 720, 480, true),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc2861-1-1920.webp', '/assets/portfolio/thumbs/_DSC2861 (1).webp', 720, 480, true),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc2788-1-1920.webp', '/assets/portfolio/thumbs/_DSC2788 (1).webp', 720, 1080, true),
  photo('Motorrad', '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', '/assets/optimized/assets-photos-motorrad-ninja-road-720.webp', 720, 1080, true),
  photo('Motorrad', '/assets/optimized/assets-photos-motorrad-duke-1920.webp', '/assets/optimized/assets-photos-motorrad-duke-720.webp', 720, 1280),
  photo('Motorrad', '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', '/assets/optimized/assets-photos-motorrad-ninja-road-720.webp', 720, 1080),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc6982-1920.webp', '/assets/portfolio/thumbs/_DSC6982.webp', 720, 1080),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc8032-1920.webp', '/assets/portfolio/thumbs/_DSC8032.webp', 720, 900),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc3908-1920.webp', '/assets/portfolio/thumbs/_DSC3908.webp', 720, 480),
  photo('Detail', '/assets/optimized/assets-portfolio-dsc3878-1920.webp', '/assets/portfolio/thumbs/_DSC3878.webp', 720, 480),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp',
    '/assets/portfolio/thumbs/Wettberwerb_Foto10_Wunder_der_natur.webp',
    720,
    448,
    true,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp',
    '/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp',
    720,
    471,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp',
    '/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp',
    720,
    520,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp',
    '/assets/portfolio/thumbs/20250605-DSC03756.webp',
    720,
    1080,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-20250605-dsc03793-1920.webp',
    '/assets/portfolio/thumbs/20250605-DSC03793.webp',
    720,
    960,
    true,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-20250605-dsc03816-1920.webp',
    '/assets/portfolio/thumbs/20250605-DSC03816.webp',
    720,
    960,
    true,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp',
    '/assets/portfolio/thumbs/20250605-DSC04020.webp',
    720,
    1080,
  ),
  photo(
    'Portrait',
    '/assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp',
    '/assets/portfolio/thumbs/20250327-DSC01550.webp',
    720,
    1090,
  ),
  photo(
    'Landschaft',
    '/assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp',
    '/assets/portfolio/thumbs/20250414-DSC00341.webp',
    720,
    1080,
    true,
  ),
  photo('Landschaft', '/assets/optimized/assets-portfolio-dsc2744-1920.webp', '/assets/portfolio/thumbs/_DSC2744.webp', 720, 1080, true),
  photo('Landschaft', '/assets/optimized/assets-portfolio-dsc2762-1920.webp', '/assets/portfolio/thumbs/_DSC2762.webp', 720, 480, true),
]
