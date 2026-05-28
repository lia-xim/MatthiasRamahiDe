export type LegacyLink = {
  label: string
  href: string
  navKey?: string
}

export type LegacyFooterColumn = {
  id: string
  label: string
  links: LegacyLink[]
}

export const legacyContent = {
  brand: {
    label: 'Matthias Ramahi',
    href: 'index.html',
    lines: ['Matthias', 'Ramahi'],
  },
  navigation: {
    primary: [
      { label: 'Home', href: 'index.html', navKey: 'home' },
      { label: 'Portfolio', href: 'portfolio.html', navKey: 'portfolio' },
      { label: 'Über mich', href: 'ueber-mich.html', navKey: 'ueber-mich' },
      { label: 'Blog', href: 'blog.html', navKey: 'blog' },
      { label: 'Weitere Dienstleistungen', href: 'leistungen.html', navKey: 'leistungen' },
      { label: 'Kontakt', href: 'contact.html', navKey: 'kontakt' },
    ] satisfies LegacyLink[],
    photographyOverview: { label: 'Fotografie', href: 'fotografie-duesseldorf.html', navKey: 'fotografie' },
    photographyLinks: [
      { label: 'Automobil', href: 'automobil-fotografie-duesseldorf.html' },
      { label: 'Sportwagen', href: 'sportwagen-fotografie-duesseldorf.html' },
      { label: 'Oldtimer', href: 'oldtimer-fotografie-duesseldorf.html' },
      { label: 'Motorrad', href: 'motorrad-fotografie-duesseldorf.html' },
      { label: 'Portrait', href: 'portraitfotografie-duesseldorf.html' },
      { label: 'Landschaft', href: 'landschaftsfotografie-duesseldorf.html' },
    ] satisfies LegacyLink[],
    cta: {
      label: 'Projekt anfragen',
      mobileLabel: 'Projekt anfragen',
      href: 'contact.html#anfrage',
    },
  },
  home: {
    meta: {
      title: 'Matthias Ramahi — Fotografie Düsseldorf & NRW',
      description:
        'Matthias Ramahi — Fotografie in Düsseldorf und NRW. Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft. Kuratierte Bildserien für Verkauf, Marke, Sammlung, Print und Kampagne.',
    },
    hero: {
      ariaLabel: 'Intro',
      images: [
        '/assets/optimized/mpik8b82-dsc3879-1920.webp',
        '/assets/optimized/assets-photos-automobil-neon-1920.webp',
        '/assets/optimized/assets-photos-landschaft-1920.webp',
        '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
        '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
        '/assets/optimized/assets-photos-motorrad-1920.webp',
      ],
      titleLines: ['Fotografie', 'Düsseldorf'],
      lead:
        'Automobil-, Portrait- und Landschaftsfotografie aus Düsseldorf für Marken, Sammler und Menschen mit Anspruch.',
      actions: [
        { label: 'Projekt anfragen', href: '#anfrage', variant: 'primary' },
        { label: 'Arbeiten ansehen', href: 'portfolio.html', variant: 'secondary' },
      ],
      cycleTitles: [['Fotografie', 'Düsseldorf'], ['Automobil'], ['Landschaft'], ['Oldtimer'], ['Portrait'], ['Motorrad']],
    },
    statement: {
      headline: 'Bilder, die einen Raum verändern.',
      lead:
        'Seit über zehn Jahren entstehen meine Serien im Spannungsfeld von Präzision und Atmosphäre — Automobile, Oldtimer, Sportwagen, Motorräder, Portraits und Landschaften. Jede Arbeit folgt einer ruhigen redaktionellen Logik: Licht, Komposition, Material, Zeit.',
      text:
        'Auftraggeber sind Marken, Sammler, Manufakturen und private Eigentümer aus Düsseldorf, Köln, Essen, Dortmund und dem gesamten Rheinland — überall dort, wo Bilder über Auflage, Sammlung oder Markenwert mitentscheiden.',
    },
  },
  siteSettings: {
    siteName: 'Matthias Ramahi — Fotografie',
    siteUrl: 'https://matthiasramahi.de',
    locale: 'de_DE',
    ownerName: 'Matthias Ramahi',
    email: 'info@matthiasramahi.de',
    phone: '+49 176 42 44 98 58',
    instagramUrl: 'https://www.instagram.com/',
    defaultMetaTitle: 'Matthias Ramahi — Fotografie Düsseldorf & NRW',
    defaultMetaDescription:
      'Kuratierte Fotografie aus Düsseldorf — Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft. Für Verkauf, Marke, Sammlung, Print und Kampagne.',
  },
  footer: {
    statementPrefix: 'Fotografie aus Düsseldorf — kuratiert für ',
    statementHighlight: 'Marke, Sammlung und Druck',
    statementSuffix: '. Editorial geführt, technisch ruhig, bereit für die nächste Ausgabe.',
    statement:
      'Fotografie aus Düsseldorf — kuratiert für Marke, Sammlung und Druck. Editorial geführt, technisch ruhig, bereit für die nächste Ausgabe.',
    aboutLink: { label: 'Über mich', href: 'ueber-mich.html' },
    email: 'info@matthiasramahi.de',
    phone: '+49 176 42 44 98 58',
    phoneHref: 'tel:+4917642449858',
    locationLabel: 'Düsseldorf · NRW',
    copyright: '© 2026 Matthias Ramahi',
    socialLinks: [{ label: 'Instagram ↗', href: 'https://www.instagram.com/', platform: 'instagram' }],
    legalLinks: [
      { label: 'Impressum', href: 'impressum.html' },
      { label: 'Datenschutz', href: 'datenschutz.html' },
    ] satisfies LegacyLink[],
    columns: [
      {
        id: 'foto',
        label: 'Fotografie',
        links: [
          { label: 'Übersicht', href: 'fotografie-duesseldorf.html' },
          { label: 'Automobil', href: 'automobil-fotografie-duesseldorf.html' },
          { label: 'Sportwagen', href: 'sportwagen-fotografie-duesseldorf.html' },
          { label: 'Oldtimer', href: 'oldtimer-fotografie-duesseldorf.html' },
          { label: 'Motorrad', href: 'motorrad-fotografie-duesseldorf.html' },
          { label: 'Portrait', href: 'portraitfotografie-duesseldorf.html' },
          { label: 'Landschaft', href: 'landschaftsfotografie-duesseldorf.html' },
        ],
      },
      {
        id: 'about',
        label: 'Über mich',
        links: [
          { label: 'Home', href: 'index.html' },
          { label: 'Portfolio', href: 'portfolio.html' },
          { label: 'Über mich', href: 'ueber-mich.html' },
          { label: 'Journal', href: 'blog.html' },
          { label: 'Kontakt', href: 'contact.html' },
        ],
      },
      {
        id: 'services',
        label: 'Weitere Dienstleistungen',
        links: [
          { label: 'Übersicht', href: 'leistungen.html' },
          { label: 'Fotolabor & Druck', href: 'fotolabor-druck-duesseldorf.html' },
          { label: 'Webdesign & SEO', href: 'webdesign-seo-duesseldorf.html' },
          { label: 'Videografie', href: 'videografie-duesseldorf.html' },
          { label: 'Drucke & Sonderanfertigungen', href: 'drucke-sonderanfertigungen-duesseldorf.html' },
        ],
      },
    ] satisfies LegacyFooterColumn[],
  },
  sitePages: [
    {
      title: 'Matthias Ramahi',
      slug: 'home',
      pageType: 'home',
      intro:
        'Seit über zehn Jahren entstehen meine Serien im Spannungsfeld von Präzision und Atmosphäre — Automobile, Oldtimer, Sportwagen, Motorräder, Portraits und Landschaften.',
      seo: {
        title: 'Matthias Ramahi — Fotografie Düsseldorf & NRW',
        description:
          'Matthias Ramahi — Fotografie in Düsseldorf und NRW. Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft. Kuratierte Bildserien für Verkauf, Marke, Sammlung, Print und Kampagne.',
        canonicalUrl: 'https://matthiasramahi.de/',
      },
    },
    {
      title: 'Bildarchiv.',
      slug: 'portfolio',
      pageType: 'portfolio-index',
      intro: 'Sechs Genres — kuratiert, nicht gefiltert.',
      seo: {
        title: 'Portfolio — Matthias Ramahi',
        description:
          'Bildarchiv von Matthias Ramahi — Portrait, Automobil, Sportwagen, Oldtimer, Motorrad und Landschaft aus Düsseldorf und NRW.',
        canonicalUrl: 'https://matthiasramahi.de/portfolio.html',
      },
    },
    {
      title: 'Alles aus einer Hand.',
      slug: 'leistungen',
      pageType: 'services-index',
      intro:
        'Für Projekte, die über die Fotografie hinausgehen: hochwertige Drucke, Großformat, Werbetechnik, Webdesign, Video und musikalische Begleitung — seriös koordiniert, visuell abgestimmt und über erfahrene Partner in Düsseldorf und NRW umgesetzt.',
      seo: {
        title: 'Weitere Dienstleistungen — Matthias Ramahi',
        description:
          'Fotolabor, Großformatdruck, Werbetechnik, Webdesign, Videografie und ergänzende Leistungen für visuelle Projekte in Düsseldorf und NRW.',
        canonicalUrl: 'https://matthiasramahi.de/leistungen.html',
      },
    },
    {
      title: 'Matthias Ramahi.',
      slug: 'ueber-mich',
      pageType: 'about',
      intro: '23 Jahre, kreativ besessen — Fotografie als Handwerk, Haltung und ein leises Stück Inszenierung.',
      seo: {
        title: 'Über mich — Matthias Ramahi, Fotograf aus Düsseldorf',
        description:
          'Matthias Ramahi — Fotograf aus Düsseldorf, spezialisiert auf Portrait- und Automobilfotografie. Über mich, Schwerpunkte, Arbeitsweise und Zusammenarbeit.',
        canonicalUrl: 'https://matthiasramahi.de/ueber-mich.html',
      },
    },
    {
      title: 'Kontakt',
      slug: 'contact',
      pageType: 'contact',
      intro: 'Direkt anfragen: Projektart, Ort und Zeitraum reichen für den ersten Schritt.',
      seo: {
        title: 'Kontakt — Matthias Ramahi · Fotografie aus Düsseldorf',
        description:
          'Direkt anfragen: Projektart, Ort und Zeitraum reichen für den ersten Schritt. Antwort innerhalb von 24 Stunden, Düsseldorf & NRW.',
        canonicalUrl: 'https://matthiasramahi.de/contact.html',
      },
    },
    {
      title: 'Notizen aus Licht.',
      slug: 'blog',
      pageType: 'journal-index',
      intro:
        'Ein kuratiertes Journal über Fotografie, Orte, Bildauswahl und Präsentation — ruhig, persönlich, ohne Content-Masse.',
      seo: {
        title: 'Blog / Journal — Matthias Ramahi',
        description:
          'Journal von Matthias Ramahi: Einblicke in Automotive-Fotografie, Portraits, Landschaft, Bildauswahl, Druck und visuelle Inszenierung in Düsseldorf.',
        canonicalUrl: 'https://matthiasramahi.de/blog.html',
      },
    },
  ],
} as const

export default legacyContent
