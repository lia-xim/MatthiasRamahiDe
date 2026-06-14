import { defineConfig, LocalAuthProvider } from 'tinacms'

const getEnv = (name: string) =>
  typeof process !== 'undefined' ? process.env[name]?.trim() : undefined

const getDefaultContentApiUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/graphql`
  }

  return 'http://localhost:4001/graphql'
}

const branch = getEnv('TINA_BRANCH') || getEnv('VERCEL_GIT_COMMIT_REF') || getEnv('HEAD') || 'main'
const contentApiUrlOverride = getEnv('TINA_CONTENT_API_URL') || getDefaultContentApiUrl()

const textField = (name: string, label: string, options: Record<string, unknown> = {}) => ({
  type: 'string',
  name,
  label,
  ...options,
})

const textAreaField = (name: string, label: string, options: Record<string, unknown> = {}) =>
  textField(name, label, { ui: { component: 'textarea' }, ...options })

const numberField = (name: string, label: string, options: Record<string, unknown> = {}) => ({
  type: 'number',
  name,
  label,
  ...options,
})

const booleanField = (name: string, label: string, options: Record<string, unknown> = {}) => ({
  type: 'boolean',
  name,
  label,
  ...options,
})

const datetimeField = (name: string, label: string, options: Record<string, unknown> = {}) => ({
  type: 'datetime',
  name,
  label,
  ...options,
})

const imageField = (name: string, label: string, options: Record<string, unknown> = {}) => ({
  type: 'image',
  name,
  label,
  ...options,
})

const objectField = (
  name: string,
  label: string,
  fields: Array<Record<string, unknown>>,
  options: Record<string, unknown> = {},
) => ({
  type: 'object',
  name,
  label,
  fields,
  ...options,
})

const referenceField = (name: string, label: string, collections: string[], options: Record<string, unknown> = {}) => ({
  type: 'reference',
  name,
  label,
  collections,
  ...options,
})

const stringValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const textLength = (label: string, min: number, max: number) => (value: unknown) => {
  const text = stringValue(value)
  if (!text) return `${label} darf nicht leer sein.`
  if (text.length < min) return `${label} ist zu kurz (${text.length}/${min} Zeichen).`
  if (text.length > max) return `${label} ist zu lang (${text.length}/${max} Zeichen).`
  return undefined
}

const canonicalUrl = (value: unknown) => {
  const text = stringValue(value)
  if (!text) return 'Canonical URL darf nicht leer sein.'

  try {
    const url = new URL(text)
    if (url.protocol !== 'https:') return 'Canonical URL muss mit https:// beginnen.'
    if (url.hostname !== 'matthiasramahi.de') return 'Canonical URL muss auf matthiasramahi.de zeigen.'
    if (!url.pathname || url.pathname.includes('//')) return 'Canonical URL hat einen ungueltigen Pfad.'
  } catch {
    return 'Canonical URL ist keine gueltige URL.'
  }

  return undefined
}

const requiredImage = (label: string) => (value: unknown) => {
  if (!stringValue(value)) return `${label} darf nicht leer sein.`
  return undefined
}

type TinaDocument = {
  _sys?: { filename?: string }
  legacy?: { sourceFile?: string; sourceUrl?: string }
  pageType?: string
  seo?: { legacyUrl?: string }
  slug?: string
}

const cleanPath = (value?: string) => {
  if (!value) return ''

  try {
    const parsed = new URL(value)
    return parsed.pathname || ''
  } catch {
    return `/${value.replace(/^\/+/, '')}`
  }
}

const filenameOrSlug = (document: TinaDocument) => document.slug || document._sys?.filename || ''

const withTinaEditQuery = (route?: string) => {
  if (!route) return route

  const [pathAndSearch, hash] = route.split('#')
  const separator = pathAndSearch.includes('?') ? '&' : '?'
  return `${pathAndSearch}${separator}tina-edit=1${hash ? `#${hash}` : ''}`
}

const htmlRouteFor = (document: TinaDocument) => {
  const legacyPath = cleanPath(document.seo?.legacyUrl || document.legacy?.sourceUrl || document.legacy?.sourceFile)
  if (legacyPath) return withTinaEditQuery(legacyPath)

  const slug = filenameOrSlug(document)
  if (!slug || slug === 'home' || document.pageType === 'home') return withTinaEditQuery('/')
  return withTinaEditQuery(`/${slug}.html`)
}

const pagesRouter = ({ document }: { document: TinaDocument }) => htmlRouteFor(document)

const htmlCollectionRouter = ({ document }: { document: TinaDocument }) => htmlRouteFor(document)

const portfolioProjectRouter = ({ document }: { document: TinaDocument }) => {
  const slug = filenameOrSlug(document)
  return withTinaEditQuery(slug ? `/portfolio/${slug}` : undefined)
}

const linkFields = [
  textField('label', 'Label'),
  textField('href', 'Link'),
  textAreaField('description', 'Beschreibung'),
  textField('platform', 'Plattform'),
  booleanField('openInNewTab', 'In neuem Tab oeffnen'),
  textField('rel', 'Rel'),
  textField('seoPurpose', 'SEO-Zweck'),
]

const ctaFields = [
  textField('label', 'Label'),
  textField('href', 'Link'),
  textField('headline', 'Headline'),
  textAreaField('text', 'Text'),
  textField('buttonLabel', 'Button-Text'),
  textField('emailSubject', 'E-Mail-Betreff'),
]

const seoFields = objectField('seo', 'SEO', [
  textField('title', 'SEO-Titel', {
    description: '35 bis 65 Zeichen. Wird als Title-Tag, OG-Title und Twitter-Title ausgespielt.',
    required: true,
    validate: textLength('SEO-Titel', 35, 65),
  }),
  textAreaField('description', 'Meta-Beschreibung', {
    description: '70 bis 165 Zeichen. Wird als Meta Description, OG-Description und Twitter-Description genutzt.',
    required: true,
    validate: textLength('Meta-Beschreibung', 70, 165),
  }),
  textField('focusKeyword', 'Fokus-Keyword', {
    description: 'Eindeutiges Hauptkeyword fuer diese URL. Keine Dopplungen innerhalb der indexierbaren Seiten.',
    required: true,
    validate: textLength('Fokus-Keyword', 3, 80),
  }),
  textField('searchIntent', 'Suchintention', {
    description: 'Kurz festhalten, welche Suchabsicht diese Seite abdeckt.',
    required: true,
    validate: textLength('Suchintention', 20, 220),
  }),
  textField('canonicalUrl', 'Canonical URL', {
    description: 'Muss eine absolute https://matthiasramahi.de/... URL sein.',
    required: true,
    validate: canonicalUrl,
  }),
  textField('legacyUrl', 'Legacy URL'),
  imageField('ogImage', 'Social-Bild', {
    description: 'Pflichtbild fuer OpenGraph/Twitter und Social Previews.',
    required: true,
    validate: requiredImage('Social-Bild'),
  }),
  booleanField('noIndex', 'Nicht indexieren'),
])

const legacyFields = objectField('legacy', 'Legacy-Migration', [
  textField('sourceFile', 'Alte HTML-Datei'),
  textField('sourceUrl', 'Alte URL'),
  textField('migrationStatus', 'Migrationsstatus'),
  textField('renderSource', 'Render-Quelle'),
  textAreaField('renderedHeadHtml', 'Render-Head HTML'),
  textAreaField('renderedBodyHtml', 'Render-Body HTML'),
  textAreaField('afterFooterHtml', 'Nach-Footer HTML'),
  textField('bodyClass', 'Body-Klasse'),
  textField('headerCurrent', 'Aktiver Header-Key'),
  textAreaField('extractedText', 'Extrahierter Text'),
])

const heroSlidesField = objectField(
  'heroSlides',
  'Hero-Slides',
  [
    imageField('image', 'Bild'),
    textField('headlineLine1', 'Headline Zeile 1'),
    textField('headlineLine2', 'Headline Zeile 2'),
    textAreaField('lead', 'Lead'),
    numberField('durationSec', 'Dauer in Sekunden'),
    textField('primaryLabel', 'Button 1 Text'),
    textField('primaryHref', 'Button 1 Link'),
    textField('secondaryLabel', 'Button 2 Text'),
    textField('secondaryHref', 'Button 2 Link'),
  ],
  { list: true },
)

const heroPanelsField = objectField('heroPanels', 'Hero-Bilder Seiten-Design', [imageField('image', 'Bild')], {
  list: true,
})

const statementField = objectField('statement', 'Statement', [
  imageField('image', 'Bild'),
  textField('headline', 'Headline'),
  textField('emphasis', 'Hervorhebung'),
  objectField('body', 'Absaetze', [textAreaField('text', 'Absatz')], { list: true }),
])

const sectionHeadingFields = [
  textField('headline', 'Headline'),
  textField('emphasis', 'Hervorhebung'),
  textAreaField('lead', 'Lead'),
]

const linkSectionField = (name: string, label: string) =>
  objectField(name, label, [
    textField('headline', 'Headline'),
    textField('emphasis', 'Hervorhebung'),
    objectField('items', 'Links', [textField('label', 'Label'), textField('href', 'Link')], { list: true }),
  ])

const serviceSectionFields = [
  heroSlidesField,
  heroPanelsField,
  statementField,
  objectField('focusSection', 'Fokus-Sektion', sectionHeadingFields),
  objectField(
    'shootingStyles',
    'Aufnahme-Stile',
    [imageField('image', 'Bild'), textField('title', 'Titel'), textAreaField('text', 'Text')],
    { list: true },
  ),
  objectField('gallerySection', 'Galerie-Sektion', [textField('headline', 'Headline'), textAreaField('lead', 'Lead')]),
  objectField('portfolioTiles', 'Galerie-Kacheln', [imageField('image', 'Bild'), textField('label', 'Label')], {
    list: true,
  }),
  objectField('processSection', 'Ablauf-Sektion', sectionHeadingFields),
  objectField(
    'processSteps',
    'Ablauf-Schritte',
    [
      imageField('image', 'Bild'),
      textField('imageLabel', 'Bild-Label'),
      textField('title', 'Titel'),
      textAreaField('text', 'Text'),
    ],
    { list: true },
  ),
  objectField('audienceSection', 'Zielgruppen-Sektion', [textField('headline', 'Headline'), textAreaField('lead', 'Lead')]),
  objectField(
    'audienceCards',
    'Zielgruppen-Karten',
    [imageField('image', 'Bild'), textField('number', 'Nummer'), textField('title', 'Titel'), textAreaField('text', 'Text')],
    { list: true },
  ),
  objectField('relatedSection', 'Verwandte Bereiche', [
    ...sectionHeadingFields,
    objectField(
      'items',
      'Karten',
      [imageField('image', 'Bild'), textField('title', 'Titel'), textField('href', 'Link'), textField('alt', 'Alt-Text')],
      { list: true },
    ),
  ]),
  objectField('faq', 'FAQ', [textField('question', 'Frage'), textAreaField('answer', 'Antwort')], { list: true }),
  objectField('localFaq', 'Lokale FAQ', [textField('question', 'Frage'), textAreaField('answer', 'Antwort')], {
    list: true,
  }),
  linkSectionField('locationLinksSection', 'Vor-Ort-Links'),
  linkSectionField('searchLinksSection', 'Suchbegriffe'),
  objectField('contactSection', 'Anfrage-Sektion', [
    textField('headline', 'Headline'),
    textField('emphasis', 'Hervorhebung'),
    textAreaField('lead', 'Lead'),
    textField('emailSubject', 'E-Mail-Betreff'),
  ]),
]

const contentBlocksField = {
  type: 'object',
  name: 'blocks',
  label: 'Inhaltsbloecke',
  list: true,
  templates: [
    {
      name: 'textBlock',
      label: 'Textblock',
      fields: [textField('eyebrow', 'Kicker'), textField('headline', 'Headline'), textAreaField('body', 'Text')],
    },
    {
      name: 'imageSequence',
      label: 'Bildsequenz',
      fields: [
        textField('headline', 'Interner Titel'),
        textField('layout', 'Layout'),
        objectField(
          'items',
          'Bilder',
          [imageField('image', 'Bild'), textField('caption', 'Bildunterschrift'), textField('cropIntent', 'Crop-Hinweis')],
          { list: true },
        ),
      ],
    },
    {
      name: 'quoteBlock',
      label: 'Zitat / Statement',
      fields: [textAreaField('quote', 'Zitat'), textField('attribution', 'Quelle')],
    },
    {
      name: 'faqBlock',
      label: 'FAQ-Block',
      fields: [
        textField('headline', 'Headline'),
        objectField('items', 'Fragen', [textField('question', 'Frage'), textAreaField('answer', 'Antwort')], {
          list: true,
        }),
      ],
    },
    {
      name: 'linkList',
      label: 'Linkliste',
      fields: [textField('headline', 'Headline'), objectField('links', 'Links', linkFields, { list: true })],
    },
    {
      name: 'ctaBlock',
      label: 'Kontakt-CTA',
      fields: [
        textField('headline', 'Headline'),
        textAreaField('text', 'Text'),
        textField('buttonLabel', 'Button-Text'),
        textField('emailSubject', 'E-Mail-Betreff'),
      ],
    },
  ],
}

const systemFields = [
  textField('payloadId', 'Payload ID'),
  textField('status', 'Status'),
  datetimeField('createdAt', 'Erstellt am'),
  datetimeField('updatedAt', 'Aktualisiert am'),
]

const basePageFields = [
  ...systemFields,
  textField('title', 'Titel / H1', { isTitle: true, required: true }),
  textField('slug', 'Slug', { required: true }),
  textAreaField('intro', 'Intro'),
  imageField('heroImage', 'Hero-Bild'),
  seoFields,
  legacyFields,
]

const portfolioPhotoFields = [
  imageField('image', 'Bild'),
  imageField('fullImage', 'Grosses Bild'),
  textField('caption', 'Bildunterschrift'),
  textField('href', 'Link'),
]

const aboutFields = [
  objectField('aboutHero', 'Ueber-mich Hero', [
    textField('kicker', 'Kicker'),
    textField('titleLine1', 'Titel Zeile 1'),
    textField('titleLine2', 'Titel Zeile 2'),
    textAreaField('lead', 'Lead'),
    imageField('image', 'Bild'),
    textField('primaryLabel', 'Button 1 Text'),
    textField('primaryHref', 'Button 1 Link'),
    textField('secondaryLabel', 'Button 2 Text'),
    textField('secondaryHref', 'Button 2 Link'),
  ]),
  objectField('aboutStatement', 'Ueber-mich Statement', [
    textField('headline', 'Headline'),
    textField('headlineEmphasis', 'Hervorhebung'),
    textAreaField('lead', 'Lead'),
    textAreaField('body', 'Text'),
    textField('primaryLabel', 'Button 1 Text'),
    textField('primaryHref', 'Button 1 Link'),
    textField('secondaryLabel', 'Button 2 Text'),
    textField('secondaryHref', 'Button 2 Link'),
  ]),
  objectField('aboutChapters', 'Ueber-mich Schwerpunkte', [
    textField('headline', 'Headline'),
    textField('headlineEmphasis', 'Hervorhebung'),
    textAreaField('intro', 'Intro'),
    objectField(
      'items',
      'Schwerpunkt-Karten',
      [
        imageField('image', 'Bild'),
        textField('title', 'Titel'),
        textField('alt', 'Alt-Text'),
        textField('linkLabel', 'Link-Label'),
        textField('href', 'Link'),
      ],
      { list: true },
    ),
  ]),
  objectField('aboutSister', 'Ueber-mich Empfehlung Video', [
    textField('kicker', 'Kicker'),
    textField('headline', 'Headline'),
    textField('headlineEmphasis', 'Hervorhebung'),
    textAreaField('lead', 'Lead'),
    textAreaField('body', 'Text'),
    textField('buttonLabel', 'Button-Text'),
    textField('href', 'Link'),
    objectField('plate', 'Infotafel', [
      textField('tag', 'Tag'),
      textField('nameLine1', 'Name Zeile 1'),
      textField('nameLine2', 'Name Zeile 2'),
      objectField('roles', 'Rollen', [textField('label', 'Label')], { list: true }),
      textField('location', 'Ort'),
    ]),
  ]),
  objectField('aboutContact', 'Ueber-mich Anfrage', [
    textField('subject', 'E-Mail-Betreff'),
    textField('headline', 'Headline'),
    textAreaField('lead', 'Lead'),
  ]),
]

const collections = [
  {
    name: 'pages',
    label: 'Seiten',
    path: 'content/pages',
    format: 'json',
    ui: {
      router: pagesRouter,
    },
    fields: [
      ...basePageFields,
      textField('pageType', 'Seitentyp'),
      textField('presentationMode', 'Praesentation'),
      heroSlidesField,
      contentBlocksField,
      objectField('homeStatement', 'Startseite Statement', [
        textField('headline', 'Headline'),
        textField('headlineEmphasis', 'Hervorhebung'),
        objectField('body', 'Absaetze', [textAreaField('text', 'Absatz')], { list: true }),
      ]),
      objectField('homeChapters', 'Startseite Kapitel', [
        textField('headline', 'Headline'),
        textField('headlineEmphasis', 'Hervorhebung'),
        textAreaField('intro', 'Intro'),
        objectField(
          'items',
          'Kapitel',
          [imageField('image', 'Bild'), textField('title', 'Titel'), textField('meta', 'Meta'), textField('href', 'Link')],
          { list: true },
        ),
      ]),
      objectField('homeSelectedWorks', 'Startseite Ausgewaehlte Arbeiten', [
        textField('headline', 'Headline'),
        textField('headlineEmphasis', 'Hervorhebung'),
        textAreaField('intro', 'Intro'),
      ]),
      objectField('homeAbout', 'Startseite Ueber mich', [
        textField('kicker', 'Kicker'),
        textField('headline', 'Headline'),
        textField('headlineEmphasis', 'Hervorhebung'),
        imageField('image', 'Bild'),
        objectField('body', 'Absaetze', [textAreaField('text', 'Absatz')], { list: true }),
      ]),
      objectField('homeServices', 'Startseite Leistungen', [
        textField('headline', 'Headline'),
        textField('headlineEmphasis', 'Hervorhebung'),
        textAreaField('intro', 'Intro'),
        objectField(
          'items',
          'Leistungen',
          [
            textField('number', 'Nummer'),
            textField('title', 'Titel'),
            textAreaField('text', 'Text'),
            textField('href', 'Link'),
          ],
          { list: true },
        ),
      ]),
      objectField('photographyIndex', 'Fotografie-Uebersicht', [
        objectField('clusterIntro', 'Intro-Absaetze', [textAreaField('text', 'Absatz')], { list: true }),
        objectField(
          'topics',
          'Themen',
          [
            imageField('image', 'Bild'),
            textField('title', 'Titel'),
            textField('emphasis', 'Hervorhebung'),
            textAreaField('text', 'Text'),
            textField('linkLabel', 'Link-Label'),
            textField('href', 'Link'),
          ],
          { list: true },
        ),
      ]),
      objectField('portfolioIndex', 'Portfolio-Uebersicht', [
        textField('contextKicker', 'Kontext-Kicker'),
        textField('contextHeadline', 'Kontext-Headline'),
        objectField('contextBody', 'Kontext-Absaetze', [textAreaField('text', 'Absatz')], { list: true }),
        objectField(
          'slices',
          'Portfolio-Slices',
          [
            textField('anchor', 'Anchor'),
            textField('label', 'Label'),
            textField('heading', 'Heading'),
            textField('theme', 'Theme'),
            textField('href', 'Link'),
            textField('linkLabel', 'Link-Label'),
            objectField('photos', 'Fotos', portfolioPhotoFields, { list: true }),
          ],
          { list: true },
        ),
        objectField('archive', 'Archiv', [
          textField('headline', 'Headline'),
          numberField('batchSize', 'Initial sichtbare Bilder'),
          objectField('items', 'Archiv-Bilder', portfolioPhotoFields, { list: true }),
        ]),
        objectField('contact', 'Kontakt-CTA', [
          textField('subject', 'E-Mail-Betreff'),
          textField('headline', 'Headline'),
          textAreaField('lead', 'Lead'),
        ]),
      ]),
      objectField('servicesIndex', 'Leistungs-Uebersicht', [
        textField('overviewHeadline', 'Headline'),
        textField('overviewEmphasis', 'Hervorhebung'),
        textAreaField('overviewIntro', 'Intro'),
        objectField(
          'items',
          'Leistungen',
          [
            textField('number', 'Nummer'),
            textField('title', 'Titel'),
            textAreaField('text', 'Text'),
            textField('href', 'Link'),
            objectField(
              'images',
              'Bilder',
              [
                imageField('image', 'Bild'),
                textField('caption', 'Bildunterschrift'),
                textField('alt', 'Alt-Text'),
              ],
              { list: true },
            ),
          ],
          { list: true },
        ),
        objectField('whyCards', 'Warum-Karten', [textField('label', 'Label'), textField('headline', 'Headline'), textAreaField('text', 'Text')], {
          list: true,
        }),
      ]),
      ...aboutFields,
      objectField('journalIndex', 'Journal-Uebersicht', [
        objectField('tickerItems', 'Ticker', [textField('text', 'Text')], { list: true }),
        textField('indexHeadline', 'Index-Headline'),
        numberField('initialVisiblePostCount', 'Initial sichtbare Artikel'),
        textField('loadMoreLabel', 'Mehr laden Label'),
      ]),
    ],
  },
  {
    name: 'servicePages',
    label: 'Service-Seiten',
    path: 'content/service-pages',
    format: 'json',
    ui: {
      router: htmlCollectionRouter,
    },
    fields: [
      ...basePageFields,
      textField('serviceType', 'Service-Typ'),
      booleanField('featured', 'Featured'),
      numberField('sortOrder', 'Sortierung'),
      imageField('teaserImage', 'Teaser-Bild'),
      ...serviceSectionFields,
      contentBlocksField,
      objectField('relatedPages', 'Verwandte Seiten', linkFields, { list: true }),
      objectField('cta', 'CTA', ctaFields),
    ],
  },
  {
    name: 'localSeoPages',
    label: 'Lokale SEO-Seiten',
    path: 'content/local-seo-pages',
    format: 'json',
    ui: {
      router: htmlCollectionRouter,
    },
    fields: [
      ...basePageFields,
      textField('priority', 'Prioritaet'),
      textField('city', 'Stadt / Region'),
      textField('service', 'Leistung'),
      textField('heroLine2', 'Hero Zeile 2'),
      referenceField('canonicalServicePage', 'Kanonische Hauptseite', ['servicePages']),
      textField('targetKeyword', 'Primaeres Keyword'),
      objectField('localProof', 'Lokale Vertrauenssignale', [textField('label', 'Label'), textAreaField('text', 'Text')], {
        list: true,
      }),
      ...serviceSectionFields,
      contentBlocksField,
    ],
  },
  {
    name: 'portfolioProjects',
    label: 'Portfolio-Projekte',
    path: 'content/portfolio-projects',
    format: 'json',
    ui: {
      router: portfolioProjectRouter,
    },
    fields: [
      ...basePageFields,
      textAreaField('excerpt', 'Auszug'),
      referenceField('category', 'Kategorie', ['portfolioCategories']),
      imageField('coverImage', 'Cover-Bild'),
      objectField(
        'gallery',
        'Galerie',
        [imageField('image', 'Bild'), textField('caption', 'Bildunterschrift'), textField('role', 'Rolle')],
        { list: true },
      ),
      contentBlocksField,
    ],
  },
  {
    name: 'portfolioCategories',
    label: 'Portfolio-Kategorien',
    path: 'content/portfolio-categories',
    format: 'json',
    fields: [
      ...systemFields,
      textField('title', 'Titel', { isTitle: true, required: true }),
      textField('slug', 'Slug', { required: true }),
      textAreaField('description', 'Beschreibung'),
      numberField('sortOrder', 'Sortierung'),
    ],
  },
  {
    name: 'journalPosts',
    label: 'Journal',
    path: 'content/journal-posts',
    format: 'json',
    ui: {
      router: htmlCollectionRouter,
    },
    fields: [
      ...basePageFields,
      textAreaField('excerpt', 'Auszug'),
      textField('category', 'Kategorie'),
      datetimeField('publishedAt', 'Veroeffentlicht am'),
      imageField('coverImage', 'Cover-Bild'),
      contentBlocksField,
    ],
  },
  {
    name: 'siteSettings',
    label: 'Site Settings',
    path: 'content/globals/site-settings',
    match: { include: 'site-settings' },
    format: 'json',
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      textField('siteName', 'Site Name', { isTitle: true, required: true }),
      textField('siteUrl', 'Site URL'),
      textField('locale', 'Locale'),
      textField('defaultMetaTitle', 'Default Meta Title'),
      textAreaField('defaultMetaDescription', 'Default Meta Description'),
      imageField('defaultOgImage', 'Default OG Image'),
      textField('ownerName', 'Owner Name'),
      textField('email', 'E-Mail'),
      textField('phone', 'Telefon'),
      textField('instagramUrl', 'Instagram URL'),
      textAreaField('footerStatement', 'Footer Statement'),
    ],
  },
  {
    name: 'navigation',
    label: 'Navigation',
    path: 'content/globals/navigation',
    match: { include: 'navigation' },
    format: 'json',
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      objectField('primary', 'Hauptnavigation', linkFields, { list: true }),
      objectField('photographyLinks', 'Fotografie Links', linkFields, { list: true }),
      objectField('footerLinks', 'Footer Links', linkFields, { list: true }),
      objectField('legalLinks', 'Legal Links', linkFields, { list: true }),
      objectField('cta', 'Navigation CTA', ctaFields),
    ],
  },
  {
    name: 'globalCtas',
    label: 'Globale CTAs',
    path: 'content/globals/global-ctas',
    match: { include: 'global-ctas' },
    format: 'json',
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      objectField('primary', 'Primaerer CTA', ctaFields),
      objectField('contactModule', 'Kontaktmodul', [textField('eyebrow', 'Eyebrow'), ...ctaFields]),
    ],
  },
  {
    name: 'footer',
    label: 'Footer',
    path: 'content/globals/footer',
    match: { include: 'footer' },
    format: 'json',
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      textAreaField('statement', 'Statement'),
      textField('statementHighlight', 'Statement Highlight'),
      objectField('aboutLink', 'About Link', linkFields),
      textField('email', 'E-Mail'),
      textField('phone', 'Telefon'),
      textField('locationLabel', 'Standort'),
      textField('copyright', 'Copyright'),
      objectField(
        'columns',
        'Spalten',
        [textField('label', 'Label'), objectField('links', 'Links', linkFields, { list: true })],
        { list: true },
      ),
      objectField('primaryLinks', 'Primaere Links', linkFields, { list: true }),
      objectField('serviceLinks', 'Service Links', linkFields, { list: true }),
      objectField('socialLinks', 'Social Links', linkFields, { list: true }),
      objectField('legalLinks', 'Legal Links', linkFields, { list: true }),
    ],
  },
]

export default defineConfig({
  branch,
  clientId: getEnv('TINA_CLIENT_ID') || 'local',
  token: getEnv('TINA_TOKEN') || 'local',
  authProvider: new LocalAuthProvider(),
  telemetry: 'disabled',
  ui: {
    optOutOfUpdateCheck: true,
  },
  ...(contentApiUrlOverride ? { contentApiUrlOverride } : {}),
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections,
  },
} as any)
