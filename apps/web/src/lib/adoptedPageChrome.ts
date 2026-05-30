import { localSeoLayoutFamilyForSlug, type LocalSeoLayoutFamily } from './localSeoLayoutFamilies'

export type AdoptedPageChrome = {
  bodyClass?: string
  current?: string
  description?: string
  headerTheme?: string
  inlineCriticalCss?: string
  ogImage?: string
  preloadImages?: string[]
  scripts?: string[]
  stylesheets?: string[]
  title?: string
}

const rootRelative = (href: string) => {
  if (!href || /^(https?:|data:|mailto:|tel:|#)/i.test(href)) return href
  return href.startsWith('/') ? href : `/${href}`
}

const unique = (items: string[] = []) => [...new Set(items.filter(Boolean).map(rootRelative))]

const siteChromeScript = ['/assets/site-chrome.js']
const sharedStyles = ['/assets/site-chrome.css', '/assets/native-performance.css']

const automotiveChrome: AdoptedPageChrome = {
  current: 'fotografie',
  ogImage: '/assets/optimized/mpjpgo2b-dsc3032-generase-1-1920.webp',
  preloadImages: ['/assets/optimized/mpjpgo2b-dsc3032-generase-1-1280.webp'],
  scripts: [...siteChromeScript, '/assets/native-automobil.js'],
  stylesheets: [...sharedStyles, '/assets/native-automobil.css'],
}

const sportwagenChrome: AdoptedPageChrome = {
  current: 'fotografie',
  ogImage: '/assets/optimized/mpixi92f-dsc3032-generase-1-1920.webp',
  preloadImages: [
    '/assets/optimized/mpixih9c-dsc3982-720.webp',
    '/assets/optimized/mpixi92f-dsc3032-generase-1-720.webp',
  ],
  scripts: [...siteChromeScript, '/assets/native-sportwagen.js'],
  stylesheets: [...sharedStyles, '/assets/native-sportwagen.css'],
}

const oldtimerChrome: AdoptedPageChrome = {
  current: 'fotografie',
  ogImage: '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
  preloadImages: ['/assets/optimized/assets-photos-oldtimer-stage-1280.webp'],
  scripts: [...siteChromeScript, '/assets/native-oldtimer.js'],
  stylesheets: [...sharedStyles, '/assets/native-oldtimer.css'],
}

const motorradChrome: AdoptedPageChrome = {
  current: 'fotografie',
  ogImage: '/assets/optimized/assets-photos-motorrad-1920.webp',
  preloadImages: ['/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp'],
  scripts: [...siteChromeScript, '/assets/native-motorrad.js'],
  stylesheets: [...sharedStyles, '/assets/native-motorrad.css'],
}

const portraitChrome: AdoptedPageChrome = {
  current: 'fotografie',
  ogImage: '/assets/portraits/_DSC0470-Enhanced-NR.webp',
  preloadImages: ['/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp'],
  scripts: [...siteChromeScript, '/assets/native-portrait.js'],
  stylesheets: [...sharedStyles, '/assets/native-portrait.css'],
}

const landscapeChrome: AdoptedPageChrome = {
  current: 'fotografie',
  ogImage: '/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp',
  preloadImages: ['/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp'],
  scripts: [...siteChromeScript, '/assets/native-landscape.js'],
  stylesheets: [...sharedStyles, '/assets/native-landscape.css'],
}

const familyChrome: Record<LocalSeoLayoutFamily, AdoptedPageChrome> = {
  automobil: automotiveChrome,
  sportwagen: sportwagenChrome,
  oldtimer: oldtimerChrome,
  motorrad: motorradChrome,
  portrait: portraitChrome,
  landschaft: landscapeChrome,
}

const serviceMiniChrome = (ogImage: string): AdoptedPageChrome => ({
  current: 'leistungen',
  ogImage,
  preloadImages: [ogImage],
  scripts: siteChromeScript,
  stylesheets: [...sharedStyles, '/assets/native-service-mini.css'],
})

const exactChrome: Record<string, AdoptedPageChrome> = {
  'index.html': {
    bodyClass: 'has-mr-footer',
    current: 'home',
    description:
      'Matthias Ramahi Fotografie in Düsseldorf und NRW: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft für Marke, Verkauf, Print und Kampagne.',
    inlineCriticalCss: 'assets/critical-home.css',
    ogImage: '/assets/optimized/mpik8b82-dsc3879-1920.webp',
    preloadImages: ['/assets/optimized/mpik8b82-dsc3879-1280.webp'],
    scripts: ['/assets/native-home.js', ...siteChromeScript],
    stylesheets: [...sharedStyles, '/assets/native-home.css'],
    title: 'Matthias Ramahi - Fotografie Düsseldorf & NRW',
  },
  'fotografie.html': {
    current: 'fotografie',
    description:
      'Fotografie als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft - sechs spezialisierte Bereiche mit eigenem Einstieg.',
    ogImage: '/assets/optimized/mpik8b82-dsc3879-1920.webp',
    preloadImages: ['/assets/optimized/mpik8b82-dsc3879-1920.webp'],
    scripts: ['/assets/native-home.js', ...siteChromeScript],
    stylesheets: [...sharedStyles, '/assets/fotografie-overview.css'],
    title: 'Fotografie | Übersicht der Bereiche | Matthias Ramahi',
  },
  'fotografie-duesseldorf.html': {
    current: 'fotografie',
    description:
      'Fotografie Düsseldorf als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft - sechs spezialisierte Bereiche mit eigenem Einstieg.',
    ogImage: '/assets/optimized/mpik8b82-dsc3879-1920.webp',
    preloadImages: ['/assets/optimized/mpik8b82-dsc3879-1920.webp'],
    scripts: ['/assets/native-home.js', ...siteChromeScript],
    stylesheets: [...sharedStyles, '/assets/fotografie-overview.css'],
    title: 'Fotografie Düsseldorf | Übersicht | Matthias Ramahi',
  },
  'fotografie-nrw.html': {
    current: 'fotografie',
    description:
      'Fotografie NRW als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft - sechs spezialisierte Bereiche für Rheinland, Ruhrgebiet und Deutschland.',
    ogImage: '/assets/optimized/mpik8b82-dsc3879-1920.webp',
    preloadImages: ['/assets/optimized/mpik8b82-dsc3879-1920.webp'],
    scripts: ['/assets/native-home.js', ...siteChromeScript],
    stylesheets: [...sharedStyles, '/assets/fotografie-overview.css'],
    title: 'Fotografie NRW | Übersicht | Matthias Ramahi',
  },
  'fotografie-deutschland.html': {
    current: 'fotografie',
    description:
      'Fotografie Deutschland als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft - sechs spezialisierte Bereiche für hochwertige Bildserien.',
    ogImage: '/assets/optimized/mpik8b82-dsc3879-1920.webp',
    preloadImages: ['/assets/optimized/mpik8b82-dsc3879-1920.webp'],
    scripts: ['/assets/native-home.js', ...siteChromeScript],
    stylesheets: [...sharedStyles, '/assets/fotografie-overview.css'],
    title: 'Fotografie Deutschland | Übersicht | Matthias Ramahi',
  },
  'automobil-fotografie.html': {
    ...automotiveChrome,
    description:
      'Automobilfotografie: Exterieur, Interieur, Details und cineastische Bildserien für Marke, Showroom, Verkauf und Kampagne - geplant aus Düsseldorf / NRW.',
    title: 'Automobilfotografie - Matthias Ramahi',
  },
  'sportwagen-fotografie.html': {
    ...sportwagenChrome,
    description:
      'Sportwagenfotografie: hochwertige Serien für Performance Cars, Sammlerfahrzeuge, Händler und Marken - Exterieur, Interieur, Details und Druckqualität.',
    title: 'Sportwagenfotografie - Matthias Ramahi',
  },
  'oldtimer-fotografie.html': {
    ...oldtimerChrome,
    description:
      'Oldtimer-Fotografie: Bildserien für Sammlung, Verkauf, Auktion und Ausstellung - Karosserie, Lack, Chrom, Leder, Patina und Herkunft.',
    title: 'Oldtimer-Fotografie - Matthias Ramahi',
  },
  'motorrad-fotografie.html': {
    ...motorradChrome,
    description:
      'Motorradfotografie: Bildserien für Custom Bikes, Werkstätten, Händler und private Maschinen - Silhouette, Mechanik, Haltung und Detail.',
    title: 'Motorradfotografie - Matthias Ramahi',
  },
  'portraitfotografie.html': {
    ...portraitChrome,
    description:
      'Portraitfotografie: Personal Branding, Business Portraits, Editorial, Team und Presse - professionell, ruhig, nahbar und nicht glattgebügelt.',
    title: 'Portraitfotografie - Matthias Ramahi',
  },
  'landschaftsfotografie.html': {
    ...landscapeChrome,
    description:
      'Landschaftsfotografie: Fine-Art-Prints, Wandbilder, Editionen und großformatige Arbeiten für private Räume, Praxen, Hotels und Sammlungen.',
    title: 'Landschaftsfotografie - Matthias Ramahi',
  },
  'portfolio.html': {
    bodyClass: 'has-mr-footer',
    current: 'portfolio',
    description:
      'Bildarchiv von Matthias Ramahi - Portrait, Automobil, Sportwagen, Oldtimer, Motorrad und Landschaft aus Düsseldorf und NRW.',
    ogImage: '/assets/optimized/assets-portfolio-dsc3879-1920.webp',
    scripts: ['/assets/native-home.js', ...siteChromeScript, '/assets/portfolio-page.js'],
    stylesheets: [...sharedStyles, '/assets/portfolio-page.css'],
    title: 'Portfolio - Matthias Ramahi',
  },
  'leistungen.html': {
    bodyClass: 'has-mr-footer',
    current: 'leistungen',
    description:
      'Weitere Dienstleistungen von Matthias Ramahi: Fotografie, Druck, Webdesign, Videografie und visuelle Produktion in Düsseldorf, NRW und Deutschland.',
    ogImage: '/assets/services/portfolio_webp_full_057-1.webp',
    scripts: siteChromeScript,
    stylesheets: ['/assets/native-services.css', ...sharedStyles],
    title: 'Weitere Dienstleistungen - Matthias Ramahi',
  },
  'contact.html': {
    bodyClass: 'has-mr-footer',
    current: 'kontakt',
    description:
      'Direkt anfragen: Projektart, Ort und Zeitraum reichen für den ersten Schritt. Antwort innerhalb von 24 Stunden, Düsseldorf & NRW.',
    ogImage: '/assets/portraits/_DSC9301-Enhanced-NR.webp',
    scripts: [...siteChromeScript, '/assets/contact-page.js'],
    stylesheets: [...sharedStyles, '/assets/contact-page.css'],
    title: 'Kontakt - Matthias Ramahi · Fotografie aus Düsseldorf',
  },
  'ueber-mich.html': {
    bodyClass: 'has-mr-footer',
    current: 'ueber-mich',
    description:
      'Editorial geführte Bildserien für Automobile, Oldtimer, Sportwagen, Motorräder, Portraits und Landschaften.',
    ogImage: '/mpissxxj-portfolio_webp_full_063-1.webp',
    preloadImages: ['/mpissxxj-portfolio_webp_full_063-1.webp'],
    scripts: siteChromeScript,
    stylesheets: [
      ...sharedStyles,
      '/assets/native-about-inline.css',
      '/assets/native-home.css',
      '/assets/native-about.css',
    ],
    title: 'Über mich - Matthias Ramahi, Fotograf aus Düsseldorf',
  },
  'blog.html': {
    bodyClass: 'has-mr-footer',
    current: 'blog',
    description:
      'Journal von Matthias Ramahi: Einblicke in Automotive-Fotografie, Portraits, Landschaft, Bildauswahl, Druck und visuelle Inszenierung in Düsseldorf.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    scripts: siteChromeScript,
    stylesheets: ['/assets/native-journal.css', ...sharedStyles],
    title: 'Blog / Journal - Matthias Ramahi',
  },
  'radikale-fotografie-portfolio-konzepte.html': {
    bodyClass: 'has-mr-footer',
    current: 'portfolio',
    description:
      'Portfolio als kuratierter Erlebnisraum: kuratierte Fotografie-Serien von Matthias Ramahi aus Duesseldorf fuer Portfolio, Marke, Print und digitale Nutzung.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    scripts: siteChromeScript,
    stylesheets: sharedStyles,
    title: 'Radikale Fotografie Portfolio Konzepte | Matthias Ramahi',
  },
  'floating-archive.html': {
    bodyClass: 'has-mr-footer',
    current: 'portfolio',
    description:
      'Das Gedaechtnis des Fotografen als begehbarer Raum: Fotografie und visuelle Produktion von Matthias Ramahi in Duesseldorf, NRW und Deutschland.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    scripts: siteChromeScript,
    stylesheets: sharedStyles,
    title: 'Floating Archive | Matthias Ramahi',
  },
  'narrative-stage.html': {
    bodyClass: 'has-mr-footer',
    current: 'portfolio',
    description:
      'Jede Serie betritt die Buehne anders: Fotografie und visuelle Produktion von Matthias Ramahi in Duesseldorf, NRW und Deutschland.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    scripts: siteChromeScript,
    stylesheets: sharedStyles,
    title: 'Narrative Stage | Matthias Ramahi',
  },
  'experimental-lens.html': {
    bodyClass: 'has-mr-footer',
    current: 'portfolio',
    description:
      'Das Werk wird optisch untersucht: Fotografie und visuelle Produktion von Matthias Ramahi in Duesseldorf, NRW und Deutschland.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    scripts: siteChromeScript,
    stylesheets: sharedStyles,
    title: 'Experimental Lens | Matthias Ramahi',
  },
  'webdesign-seo-duesseldorf.html': {
    ...serviceMiniChrome('/assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-scaled.webp'),
    description:
      'Webdesign und SEO in Düsseldorf: moderne Websites, lokale Sichtbarkeit, Performance, Bildsprache, Landingpages und suchmaschinenfreundliche Struktur.',
    title: 'Webdesign & SEO Düsseldorf - Matthias Ramahi',
  },
  'videografie-duesseldorf.html': {
    ...serviceMiniChrome('/assets/services/portfolio_webp_full_058-1.webp'),
    description:
      'Videografie in Düsseldorf: Imagefilm, Musikvideo, Eventfilm und redaktionelles Bewegtbild - über Sophia Ramahi und das Kreativnetzwerk aus dem Rheinland.',
    title: 'Videografie Düsseldorf - Matthias Ramahi',
  },
  'werbetechnik-duesseldorf.html': {
    ...serviceMiniChrome('/assets/services/Catoir_Ramahi-1-32-768x512-1.webp'),
    description:
      'Werbetechnik in Düsseldorf: Fahrzeugbeschriftung, Schaufenster, Beschilderung, Folierung und LED-Lichtwerbung - über Matthias Ramahi und das Partnernetzwerk vor Ort.',
    title: 'Werbetechnik Düsseldorf - Matthias Ramahi',
  },
  'grossformatdruck-duesseldorf.html': {
    ...serviceMiniChrome('/assets/services/Catoir_Ramahi-1-106-768x512-1.webp'),
    description:
      'Großformatdruck in Düsseldorf: hochauflösende Wandbilder, Schaufensterfolien, Messebanner und individuelle Großformate für Marken, Showrooms und Galerien.',
    title: 'Großformatdruck Düsseldorf - Matthias Ramahi',
  },
  'drucke-sonderanfertigungen-duesseldorf.html': {
    ...serviceMiniChrome('/assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp'),
    description:
      'Drucke und Sonderanfertigungen in Düsseldorf: individuelle Fotodrucke, Sonderformate, Materialtests, Interior-Präsentationen und hochwertige Objektlösungen.',
    title: 'Drucke & Sonderanfertigungen Düsseldorf - Matthias Ramahi',
  },
  'fotolabor-druck-duesseldorf.html': {
    current: 'leistungen',
    description:
      'Fotolabor und Druck in Düsseldorf - FineArt-Prints auf Hahnemühle, Canson und Ilford, Acrylglas, Alu-Dibond, Leinwand.',
    ogImage: '/assets/services/portfolio_webp_full_057-1.webp',
    preloadImages: ['/assets/services/portfolio_webp_full_057-1.webp'],
    scripts: siteChromeScript,
    stylesheets: [...sharedStyles, '/assets/native-fotolabor.css'],
    title: 'Fotolabor & Druck Düsseldorf - Matthias Ramahi',
  },
  'viola-musik-duesseldorf.html': {
    ...serviceMiniChrome('/assets/services/portfolio_webp_full_004-2.webp'),
    description:
      'Viola und Geigenmusik in Düsseldorf: Empfehlung über das Partnernetzwerk von Matthias Ramahi - Hochzeit, Empfang, Trauerfeier und private Anlässe.',
    title: 'Viola Musik Düsseldorf - Matthias Ramahi',
  },
}

export function getAdoptedPageChrome(legacyFile?: string | null): AdoptedPageChrome {
  const normalizedFile = (legacyFile || '').replace(/^\/+/, '').toLowerCase()
  const exact = exactChrome[normalizedFile]
  const family = localSeoLayoutFamilyForSlug(normalizedFile)
  const chrome = exact || (family ? familyChrome[family] : {})

  return {
    bodyClass: chrome.bodyClass || 'has-mr-footer',
    current: chrome.current,
    description: chrome.description,
    headerTheme: chrome.headerTheme,
    inlineCriticalCss: chrome.inlineCriticalCss,
    ogImage: chrome.ogImage ? rootRelative(chrome.ogImage) : undefined,
    preloadImages: unique(chrome.preloadImages),
    scripts: unique(chrome.scripts?.length ? chrome.scripts : siteChromeScript),
    stylesheets: unique(chrome.stylesheets?.length ? chrome.stylesheets : sharedStyles),
    title: chrome.title,
  }
}

export function mergeAssetLists(...lists: Array<string[] | undefined>) {
  return unique(lists.flatMap((list) => list || []))
}
