import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://matthiasramahi.de'
const DEFAULT_IMAGE = `${SITE}/assets/optimized/assets-photos-automobil-sunset-1920.webp`

const noIndexFiles = new Set([
  'blog-journal.html',
  'experimental-lens.html',
  'floating-archive.html',
  'matthias-ramahi-portfolio.html',
  'narrative-stage.html',
  'portfolio-1-tunnel.html',
  'radikale-fotografie-portfolio-konzepte.html',
  'weitere-dienstleistungen.html',
])

const canonicalOverrides = new Map([
  ['blog-journal.html', `${SITE}/blog.html`],
  ['matthias-ramahi-portfolio.html', `${SITE}/portfolio.html`],
  ['weitere-dienstleistungen.html', `${SITE}/leistungen.html`],
])

const titleOverrides = new Map([
  ['automobil-fotografie-duesseldorf.html', 'Automobilfotografie Düsseldorf | Matthias Ramahi'],
  ['blog-automotive-fotografie-duesseldorf.html', 'Automotive-Fotografie Düsseldorf | Matthias Ramahi'],
  ['fotografie-deutschland.html', 'Fotografie Deutschland | Übersicht | Matthias Ramahi'],
  ['fotografie-duesseldorf.html', 'Fotografie Düsseldorf | Übersicht | Matthias Ramahi'],
  ['fotografie-nrw.html', 'Fotografie NRW | Übersicht | Matthias Ramahi'],
  ['landschaftsfotografie-duesseldorf.html', 'Landschaftsfotografie Düsseldorf | Matthias Ramahi'],
  ['motorrad-fotografie-duesseldorf.html', 'Motorradfotografie Düsseldorf | Matthias Ramahi'],
  ['oldtimer-fotografie-duesseldorf.html', 'Oldtimer-Fotografie Düsseldorf | Matthias Ramahi'],
  ['portraitfotografie-duesseldorf.html', 'Portraitfotografie Düsseldorf | Matthias Ramahi'],
  ['sportwagen-fotografie-duesseldorf.html', 'Sportwagenfotografie Düsseldorf | Matthias Ramahi'],
])

const descriptionOverrides = new Map([
  [
    'automobil-fotografie-duesseldorf.html',
    'Automobilfotografie Düsseldorf: hochwertige Fahrzeugbilder für Marke, Showroom, Verkauf und Kampagne — Exterieur, Interieur, Details und Bildserie.',
  ],
  [
    'blog-automotive-fotografie-duesseldorf.html',
    'Automotive-Fotografie in Düsseldorf: Licht, Standort und Karosserie bewusst planen, damit Fahrzeugbilder für Verkauf, Marke und Kampagne funktionieren.',
  ],
  [
    'fotografie-deutschland.html',
    'Fotografie Deutschland als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — sechs spezialisierte Bereiche mit eigenem Einstieg.',
  ],
  [
    'fotografie-duesseldorf.html',
    'Fotografie Düsseldorf als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — sechs spezialisierte Bereiche mit eigenem Einstieg.',
  ],
  [
    'fotografie-nrw.html',
    'Fotografie NRW als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — sechs spezialisierte Bereiche für Rheinland und Ruhrgebiet.',
  ],
  [
    'index.html',
    'Matthias Ramahi Fotografie in Düsseldorf und NRW: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft für Marke, Verkauf, Print und Kampagne.',
  ],
  [
    'impressum.html',
    'Impressum von Matthias Ramahi: Anbieterkennzeichnung, Kontakt und rechtliche Angaben zur Fotografie-Website aus Düsseldorf.',
  ],
  [
    'leistungen.html',
    'Weitere Dienstleistungen von Matthias Ramahi: Fotografie, Druck, Webdesign, Videografie und visuelle Produktion in Düsseldorf, NRW und Deutschland.',
  ],
  [
    'landschaftsfotografie-duesseldorf.html',
    'Landschaftsfotografie Düsseldorf: Fine-Art-Prints, Wandbilder, Editionen und großformatige Arbeiten für private Räume, Praxen, Hotels und Sammlungen.',
  ],
  [
    'motorrad-fotografie-duesseldorf.html',
    'Motorradfotografie Düsseldorf: Bildserien für Custom Bikes, Werkstätten, Händler und private Maschinen — Silhouette, Mechanik, Haltung und Detail.',
  ],
  [
    'oldtimer-fotografie-duesseldorf.html',
    'Oldtimer-Fotografie Düsseldorf: Bildserien für Sammlung, Verkauf, Auktion und Ausstellung — Karosserie, Lack, Chrom, Leder, Patina und Herkunft.',
  ],
  [
    'portraitfotografie-duesseldorf.html',
    'Portraitfotografie Düsseldorf: Personal Branding, Business Portraits, Editorial, Team und Presse — professionell, ruhig, nahbar und nicht glattgebügelt.',
  ],
  [
    'sportwagen-fotografie-duesseldorf.html',
    'Sportwagenfotografie Düsseldorf: hochwertige Serien für Performance Cars, Sammlerfahrzeuge, Händler und Marken — Exterieur, Interieur und Details.',
  ],
])

const photographyOverviews = new Set(['fotografie-duesseldorf.html', 'fotografie-nrw.html', 'fotografie-deutschland.html'])

const photographyScopes = new Map(
  [
    ['duesseldorf', 'Düsseldorf'],
    ['koeln', 'Köln'],
    ['essen', 'Essen'],
    ['dortmund', 'Dortmund'],
    ['duisburg', 'Duisburg'],
    ['bochum', 'Bochum'],
    ['wuppertal', 'Wuppertal'],
    ['leverkusen', 'Leverkusen'],
    ['oberhausen', 'Oberhausen'],
    ['krefeld', 'Krefeld'],
    ['moenchengladbach', 'Mönchengladbach'],
    ['moers', 'Moers'],
    ['gelsenkirchen', 'Gelsenkirchen'],
    ['bergisch-gladbach', 'Bergisch Gladbach'],
    ['solingen', 'Solingen'],
    ['remscheid', 'Remscheid'],
    ['mettmann', 'Mettmann'],
    ['hilden', 'Hilden'],
    ['dormagen', 'Dormagen'],
    ['neuss', 'Neuss'],
    ['nrw', 'NRW'],
    ['deutschland', 'Deutschland'],
  ],
)

const photographyCategories = [
  { key: 'automobil', slug: 'automobil-fotografie', file: 'automobil-fotografie-duesseldorf.html', name: 'Automobilfotografie' },
  { key: 'sportwagen', slug: 'sportwagen-fotografie', file: 'sportwagen-fotografie-duesseldorf.html', name: 'Sportwagenfotografie' },
  { key: 'oldtimer', slug: 'oldtimer-fotografie', file: 'oldtimer-fotografie-duesseldorf.html', name: 'Oldtimer-Fotografie' },
  { key: 'motorrad', slug: 'motorrad-fotografie', file: 'motorrad-fotografie-duesseldorf.html', name: 'Motorradfotografie' },
  { key: 'portrait', slug: 'portraitfotografie', file: 'portraitfotografie-duesseldorf.html', name: 'Portraitfotografie' },
  { key: 'landschaft', slug: 'landschaftsfotografie', file: 'landschaftsfotografie-duesseldorf.html', name: 'Landschaftsfotografie' },
]

const photographyKeywordFiles = new Set([
  'automotive-fotografie-duesseldorf.html',
  'autofotografie-duesseldorf.html',
  'fahrzeugfotografie-duesseldorf.html',
  'autohaus-fotografie-duesseldorf.html',
  'autoverkauf-fotos-duesseldorf.html',
  'sportwagen-shooting-duesseldorf.html',
  'sportwagen-fotoshooting-duesseldorf.html',
  'performance-car-fotografie-duesseldorf.html',
  'exotic-car-fotografie-duesseldorf.html',
  'supersportwagen-fotografie-duesseldorf.html',
  'classic-car-fotografie-duesseldorf.html',
  'oldtimer-shooting-duesseldorf.html',
  'youngtimer-fotografie-duesseldorf.html',
  'sammlerfahrzeug-fotografie-duesseldorf.html',
  'oldtimer-verkaufsfotos-duesseldorf.html',
  'motorrad-shooting-duesseldorf.html',
  'bike-fotografie-duesseldorf.html',
  'custom-bike-fotografie-duesseldorf.html',
  'motorrad-verkaufsfotos-duesseldorf.html',
  'biker-portrait-duesseldorf.html',
  'business-portrait-duesseldorf.html',
  'headshot-fotograf-duesseldorf.html',
  'personal-branding-fotografie-duesseldorf.html',
  'unternehmensportrait-duesseldorf.html',
  'pressefoto-duesseldorf.html',
  'landschaftsbilder-kaufen.html',
  'fine-art-prints-landschaft.html',
  'wandbilder-landschaftsfotografie.html',
  'naturfotografie-prints.html',
  'landschaftsfotografie-print-deutschland.html',
])

const serviceTerms = [
  'fotografie',
  'fotos',
  'shooting',
  'portrait',
  'headshot',
  'druck',
  'webdesign',
  'seo',
  'videografie',
  'werbetechnik',
  'viola',
]

const esc = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const attr = (value) => esc(value).replace(/"/g, '&quot;')
const decodeEntities = (value) => {
  let text = String(value || '')
  for (let i = 0; i < 8; i += 1) {
    const decoded = text
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    if (decoded === text) return decoded
    text = decoded
  }
  return text
}
const stripTags = (value) => decodeEntities(String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const absolute = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url.replace('https://www.matthiasramahi.de', SITE)
  if (/^(mailto:|tel:|data:|#)/i.test(url)) return url
  return `${SITE}/${url.replace(/^\/+/, '')}`
}

function htmlFiles() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

function metaContent(html, key, type = 'name') {
  const re = new RegExp(`<meta\\b(?=[^>]*\\b${type}=["']${key}["'])[^>]*\\bcontent=["']([^"']*)["'][^>]*>`, 'i')
  return decodeEntities(html.match(re)?.[1] || '')
}

function firstImage(html) {
  const og = metaContent(html, 'og:image', 'property')
  if (og) return absolute(og)
  const img = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)?.[1]
  return img ? absolute(img) : DEFAULT_IMAGE
}

function titleFromFile(file) {
  if (file === 'index.html') return 'Matthias Ramahi Fotografie'
  return file
    .replace(/\.html$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .replace(/\bDuesseldorf\b/g, 'Düsseldorf')
    .concat(' | Matthias Ramahi')
}

function descriptionFrom(file, title, html) {
  const h1 = stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
  const base = h1 || title.replace(/\s*\|\s*Matthias Ramahi\s*$/, '')
  if (file === 'index.html') {
    return 'Matthias Ramahi Fotografie in Düsseldorf und NRW: Automobil, Portrait, Landschaft, Motorrad, Print und visuelle Produktion.'
  }
  if (file.includes('blog')) {
    return `${base}: Journal-Beitrag von Matthias Ramahi über Fotografie, Bildauswahl, Licht, Orte und visuelle Produktion in Düsseldorf.`
  }
  if (file.includes('portfolio')) {
    return `${base}: kuratierte Fotografie-Serien von Matthias Ramahi aus Düsseldorf für Portfolio, Marke, Print und digitale Nutzung.`
  }
  return `${base}: Fotografie und visuelle Produktion von Matthias Ramahi in Düsseldorf, NRW und Deutschland. Kuratierte Bildserien für Web, Print, Marke und Verkauf.`
}

function trimDescription(description, maxLength = 168) {
  if (description.length <= maxLength) return description

  const sentence = description
    .split(/(?<=[.!?])\s+/)
    .find((part) => part.length >= 70 && part.length <= maxLength)
  if (sentence) return sentence

  const cut = description.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 90 ? lastSpace : maxLength - 1).replace(/[,:;—-]\s*$/, '')}.`
}

function tuneSnippet(file, title, description) {
  const tunedTitle = titleOverrides.get(file) || title
  const overrideDescription = descriptionOverrides.get(file)
  const normalizedDescription = (overrideDescription || description).replace(
    /: eigenständiger Einstieg in den ([^—]+) — gleiche Art Direction, gleiche Bildsprache, gezielt auf diese Suchintention formuliert\./,
    ': Einstieg in den $1 mit klarer Bildsprache, Art Direction und passender Suchintention.',
  )
  return {
    title: tunedTitle,
    description: trimDescription(normalizedDescription),
  }
}

function setTitle(html, title) {
  const tag = `<title>${esc(title)}</title>`
  if (/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, tag)
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (match) => `${match}\n  ${tag}`)
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`)
}

function setMeta(html, key, content, type = 'name') {
  const tag = `<meta ${type}="${key}" content="${attr(content)}" />`
  const re = new RegExp(`<meta\\b(?=[^>]*\\b${type}=["']${key}["'])[^>]*>`, 'i')
  if (re.test(html)) return html.replace(re, tag)
  const viewport = /<meta\b(?=[^>]*\bname=["']viewport["'])[^>]*>/i
  if (viewport.test(html)) return html.replace(viewport, (match) => `${match}\n  ${tag}`)
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `  ${tag}\n</head>`)
  return html.replace(/<head\b[^>]*>/i, (match) => `${match}\n  ${tag}`)
}

function setCanonical(html, href) {
  const tag = `<link rel="canonical" href="${attr(href)}" />`
  const re = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`)
}

function photographyScopeFromFile(file) {
  if (file === 'fotografie-duesseldorf.html') return { slug: 'duesseldorf', place: 'Düsseldorf' }
  if (file === 'fotografie-nrw.html') return { slug: 'nrw', place: 'NRW' }
  if (file === 'fotografie-deutschland.html') return { slug: 'deutschland', place: 'Deutschland' }
  if (photographyKeywordFiles.has(file)) return { slug: 'duesseldorf', place: 'Düsseldorf' }

  for (const category of photographyCategories) {
    if (file === category.file) {
      return { slug: 'duesseldorf', place: 'Düsseldorf', category }
    }

    const prefix = `${category.slug}-`
    if (file.startsWith(prefix) && file.endsWith('.html')) {
      const slug = file.slice(prefix.length, -'.html'.length)
      const place = photographyScopes.get(slug)
      if (place) return { slug, place, category }
    }
  }

  return null
}

function isPhotographyClusterFile(file) {
  return Boolean(photographyOverviews.has(file) || photographyScopeFromFile(file))
}

function categoryHref(category, scopeSlug) {
  if (scopeSlug === 'duesseldorf') return `${SITE}/${category.file}`
  return `${SITE}/${category.slug}-${scopeSlug}.html`
}

function overviewHref(scopeSlug) {
  if (scopeSlug === 'nrw' || scopeSlug === 'deutschland') return `${SITE}/fotografie-${scopeSlug}.html`
  return `${SITE}/fotografie-duesseldorf.html`
}

function photographyItemList(scopeSlug = 'duesseldorf') {
  return {
    '@type': 'ItemList',
    itemListElement: photographyCategories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      url: categoryHref(category, scopeSlug),
    })),
  }
}

function isServicePage(file) {
  if (photographyOverviews.has(file)) return false
  return serviceTerms.some((term) => file.includes(term)) && !file.startsWith('blog')
}

function pageType(file) {
  if (file.startsWith('blog-')) return 'BlogPosting'
  if (file === 'blog.html' || file === 'blog-journal.html') return 'Blog'
  if (photographyOverviews.has(file)) return 'CollectionPage'
  if (file.includes('portfolio')) return 'CollectionPage'
  if (file === 'contact.html') return 'ContactPage'
  if (isServicePage(file)) return 'Service'
  return 'WebPage'
}

function graphFor({ file, title, description, canonical, image }) {
  const type = pageType(file)
  const photographyScope = photographyScopeFromFile(file)
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE}/` },
  ]

  if (photographyScope && file !== `fotografie-${photographyScope.slug}.html`) {
    const overviewName =
      photographyScope.slug === 'duesseldorf' || photographyScope.slug === 'nrw' || photographyScope.slug === 'deutschland'
        ? `Fotografie ${photographyScope.place}`
        : 'Fotografie Übersicht'
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: overviewName,
      item: overviewHref(photographyScope.slug),
    })
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: title,
    item: canonical,
  })

  const webpage = {
    '@type': type === 'Service' ? 'WebPage' : type,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: 'de-DE',
    isPartOf: { '@id': `${SITE}/#website` },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: image } : undefined,
  }

  if (type === 'CollectionPage' && photographyOverviews.has(file)) {
    webpage.about = photographyCategories.map((category) => category.name)
    webpage.mainEntity = photographyItemList(photographyScope?.slug || 'duesseldorf')
  }

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Matthias Ramahi Fotografie',
      inLanguage: 'de-DE',
      publisher: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: 'Matthias Ramahi',
      url: `${SITE}/`,
      email: 'info@matthiasramahi.de',
      jobTitle: 'Fotograf',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
    webpage,
  ]

  if (type === 'Service') {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: title,
      description,
      serviceType: photographyScope?.category?.name || title.replace(/\s*[|—].*$/, ''),
      provider: { '@id': `${SITE}/#person` },
      areaServed: photographyScope
        ? [{ '@type': photographyScope.slug === 'deutschland' ? 'Country' : photographyScope.slug === 'nrw' ? 'AdministrativeArea' : 'City', name: photographyScope.place }]
        : ['Düsseldorf', 'NRW', 'Deutschland'],
      url: canonical,
      image,
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

function setTechnicalJsonLd(html, graph, replaceAll = false) {
  const block = `  <script type="application/ld+json" data-seo="technical">${JSON.stringify(graph)}</script>`
  html = replaceAll
    ? html.replace(/\s*<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '')
    : html.replace(/\s*<script\b(?=[^>]*\bdata-seo=["']technical["'])[^>]*>[\s\S]*?<\/script>/gi, '')
  return html.replace(/<\/head>/i, `${block}\n</head>`)
}

function writeFileWithRetry(filePath, content) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      fs.writeFileSync(filePath, content, 'utf8')
      return
    } catch (error) {
      if (attempt === 3) throw error
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150)
    }
  }
}

function fixLinks(html) {
  return html
    .replace(/https:\/\/www\.matthiasramahi\.de\//g, `${SITE}/`)
    .replace(/http:\/\/www\.matthiasramahi\.de\//g, `${SITE}/`)
    .replace(/,\s*"sameAs"\s*:\s*\[\s*\]/g, '')
    .replace(/"sameAs"\s*:\s*\[\s*\]\s*,/g, '')
    .replace(/assets\/atmosphere\/bokeh-amber\.mp4/g, 'assets/atmosphere/bokeh.mp4')
    .replace(/(<video\b(?=[^>]*\bclass=["'][^"']*\bhero-mp__bokeh\b)[^>]*\bpreload=)["']auto["']/gi, '$1"metadata"')
    .replace(/<img([^>]*\bclass=["'][^"']*\blb-img\b[^"']*["'][^>]*)\balt=["'][^"']*["']([^>]*)>/gi, '<img$1alt="Vergroesserte Portfolioansicht"$2>')
    .replace(/<img([^>]*\bclass=["'][^"']*\blb-img\b[^"']*["'][^>]*)(?<!\/)>/gi, '<img$1 alt="Vergroesserte Portfolioansicht">')
}

function fixAnchors(file, html) {
  if (file === 'fotografie-landing-experience.html' && !/\bid=["']fotografie["']/i.test(html)) {
    html = html.replace('<section class="photo-scene auto" id="auto"', '<section class="photo-scene auto" id="fotografie"')
    html = html.replace(/href="#auto"/g, 'href="#fotografie"')
  }

  if (file === 'weitere-dienstleistungen.html' && !/\bid=["']services["']/i.test(html)) {
    html = html.replace('<section class="intro" id="top"', '<section class="intro" id="services"')
  }

  return html
}

function hardenFile(file) {
  const fullPath = path.join(ROOT, file)
  const before = fs.readFileSync(fullPath, 'utf8')
  let html = before
  const existingTitle = stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
  const initialTitle = existingTitle || titleFromFile(file)
  const initialDescription = metaContent(html, 'description') || descriptionFrom(file, initialTitle, html)
  const { title, description } = tuneSnippet(file, initialTitle, initialDescription)
  const canonical = canonicalOverrides.get(file) || (file === 'index.html' ? `${SITE}/` : `${SITE}/${file}`)
  const image = firstImage(html)
  const robots = noIndexFiles.has(file)
    ? 'noindex,follow,max-image-preview:large'
    : 'index,follow,max-image-preview:large,max-snippet:-1'

  html = fixAnchors(file, fixLinks(html))
  html = setTitle(html, title)
  html = setMeta(html, 'description', description)
  html = setMeta(html, 'author', 'Matthias Ramahi')
  html = setMeta(html, 'robots', robots)
  html = setCanonical(html, canonical)
  html = setMeta(html, 'og:type', file.startsWith('blog-') ? 'article' : 'website', 'property')
  html = setMeta(html, 'og:site_name', 'Matthias Ramahi Fotografie', 'property')
  html = setMeta(html, 'og:locale', 'de_DE', 'property')
  html = setMeta(html, 'og:title', title, 'property')
  html = setMeta(html, 'og:description', description, 'property')
  html = setMeta(html, 'og:url', canonical, 'property')
  html = setMeta(html, 'og:image', image, 'property')
  html = setMeta(html, 'og:image:alt', title, 'property')
  html = setMeta(html, 'twitter:card', 'summary_large_image')
  html = setMeta(html, 'twitter:title', title)
  html = setMeta(html, 'twitter:description', description)
  html = setMeta(html, 'twitter:image', image)
  html = setTechnicalJsonLd(html, graphFor({ file, title, description, canonical, image }), isPhotographyClusterFile(file))

  if (html !== before) writeFileWithRetry(fullPath, html)
  return html !== before
}

let changed = 0
for (const file of htmlFiles()) {
  if (hardenFile(file)) changed += 1
}

console.log(JSON.stringify({ checked: htmlFiles().length, changed, noIndex: [...noIndexFiles] }, null, 2))
