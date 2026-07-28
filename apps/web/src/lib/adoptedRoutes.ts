import { localSeoCityTokens, localSeoPrefixes } from './localSeoLayoutFamilies'

export const adoptedLegacyFiles = [
  'fotografie.html',
  'fotografie-duesseldorf.html',
  'fotografie-nrw.html',
  'fotografie-deutschland.html',
  'automobil-fotografie.html',
  'sportwagen-fotografie.html',
  'oldtimer-fotografie.html',
  'motorrad-fotografie.html',
  'portraitfotografie.html',
  'landschaftsfotografie.html',
  'portfolio.html',
  'leistungen.html',
  'contact.html',
  'ueber-mich.html',
  'blog.html',
  'impressum.html',
  'datenschutz.html',
  'fotolabor-druck-duesseldorf.html',
  'grossformatdruck-duesseldorf.html',
  'werbetechnik-duesseldorf.html',
  'webdesign-seo-duesseldorf.html',
  'keyword-datenbank-seo.html',
  'videografie-duesseldorf.html',
  'viola-musik-duesseldorf.html',
  'drucke-sonderanfertigungen-duesseldorf.html',
  'blog-automotive-fotografie-duesseldorf.html',
  'blog-fine-art-druck.html',
  'blog-location-scouting-duesseldorf.html',
  'blog-motorradfotografie-linien.html',
  'blog-oldtimer-wertobjekt.html',
  'blog-portraits-ohne-generische-posen.html',
  'blog-serie-kuratieren.html',
  'experimental-lens.html',
  'floating-archive.html',
  'narrative-stage.html',
  'radikale-fotografie-portfolio-konzepte.html',
] as const

export type AdoptedLegacyFile = (typeof adoptedLegacyFiles)[number]

const adoptedLegacyFileSet = new Set<string>(adoptedLegacyFiles)

export const legacyRedirectTargets = {
  'automobil-fotografie-deutschland.html': 'automobil-fotografie-duesseldorf.html',
  'blog-journal.html': 'blog.html',
  'fotografie-deutschland.html': 'fotografie-duesseldorf.html',
  'fotografie-landing-experience.html': 'fotografie-duesseldorf.html',
  'index.html': '',
  'landschaftsfotografie-deutschland.html': 'landschaftsfotografie-duesseldorf.html',
  'matthias-ramahi-portfolio.html': 'portfolio.html',
  'motorrad-fotografie-deutschland.html': 'motorrad-fotografie-duesseldorf.html',
  'oldtimer-fotografie-deutschland.html': 'oldtimer-fotografie-duesseldorf.html',
  'portfolio-1-tunnel.html': 'portfolio.html',
  'portraitfotografie-deutschland.html': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie-experience.html': 'portraitfotografie-duesseldorf.html',
  'sportwagen-fotografie-deutschland.html': 'sportwagen-fotografie-duesseldorf.html',
  'weitere-dienstleistungen.html': 'leistungen.html',
} as const

export type LegacyRedirectFile = keyof typeof legacyRedirectTargets

export const legacyPathRedirectTargets = {
  about: 'ueber-mich.html',
  'action-fotografie/motorrad-fotografie-mit-actioncams-und-gopros-leicht-gemacht': 'motorrad-fotografie.html',
  'autofotografie': 'autofotografie.html',
  'autofotografie/autofotografie-duesseldorf': 'autofotografie-duesseldorf.html',
  'autofotografie/automobilfotografie-im-regen': 'autofotografie.html',
  'autofotografie/autohaus-fotografie-ohne-blitzpark-perfektes-showroomlicht': 'autohaus-fotografie.html',
  'autofotografie/bts-auto-shoot-in-dortmund-mit-matthias-ramahi-fesselnd': 'automobil-fotografie-dortmund.html',
  'autofotografie/farbharmonie-mit-sportwagen-perfekte-komplementaere-folien': 'sportwagen-fotografie.html',
  'autofotografie/fahrzeugfotografie-portfolio-erfolgreich-aufbauen': 'fahrzeugfotografie.html',
  'autofotografie/lightpainting-porsche-perfekt-und-sicher-umsetzen': 'sportwagen-fotografie.html',
  'autofotografie/luxusauto-fotografie': 'sportwagen-fotografie.html',
  'autofotografie/marken-storytelling-fuer-autokunden-mit-serien-die-verkaufen': 'automotive-fotografie.html',
  'autofotografie/sportwagen-detailpflege-30-minuten-checkliste-glanz-pur': 'sportwagen-fotografie.html',
  'autofotografie-bochum': 'automobil-fotografie-bochum.html',
  'autofotografie-dortmund': 'automobil-fotografie-dortmund.html',
  'autofotografie-duisburg': 'automobil-fotografie-duisburg.html',
  'autofotografie-duesseldorf': 'autofotografie-duesseldorf.html',
  'autofotografie-essen': 'automobil-fotografie-essen.html',
  'autofotografie-guide': 'autofotografie.html',
  'autofotografie-wuppertal': 'automobil-fotografie-wuppertal.html',
  'auto-fotograf-duesseldorf': 'autofotografie-duesseldorf.html',
  'automobilfotografie/automobilfotografie-im-regen': 'automobil-fotografie.html',
  'business-portrait': 'business-portrait-duesseldorf.html',
  'contact-us': 'contact.html',
  datenschutzerklaerung: 'datenschutz.html',
  'fahrzeugfotografie-duesseldorf': 'fahrzeugfotografie-duesseldorf.html',
  'fine-art-portraets-fotografie': 'portraitfotografie.html',
  'fotografie': 'fotografie.html',
  'fotografie-mann': 'portraitfotografie.html',
  'fotografie-matthias-ramahi': 'ueber-mich.html',
  'fotografie-musiker': 'portraitfotografie.html',
  'fotoshooting-motorrad-wuppertal': 'motorrad-fotografie-wuppertal.html',
  'fotoshooting-mit-motorrad-duisburg-urbane-kulisse-industrielle-seele-echte-emotion':
    'motorrad-fotografie-duisburg.html',
  'front-page': '',
  'gruppen-fotografie': 'portraitfotografie.html',
  'grossformatdruck-duesseldorf': 'grossformatdruck-duesseldorf.html',
  'grundlagen-der-fotografie/lichtformer-fuer-portraitfotografie': 'portraitfotografie-beleuchtung.html',
  impressum: 'impressum.html',
  artikel: 'blog.html',
  kontakt: 'contact.html',
  'low-key-fotografie-beleuchtung-und-high-key-fotografie': 'portraitfotografie.html',
  'motorrad-fotografie': 'motorrad-fotografie.html',
  'motorrad-fotograf-dortmund': 'motorrad-fotografie-dortmund.html',
  'motorrad-fotoshooting-bochum': 'motorrad-fotografie-bochum.html',
  'motorrad-fotoshooting-essen': 'motorrad-fotografie-essen.html',
  'motorrad-fotoshooting-koeln': 'motorrad-fotografie-koeln.html',
  'motorradfotografie': 'motorrad-fotografie.html',
  'motorradfotografie/7-geniale-farblooks-und-bildstile-in-der-motorrad-fotografie': 'motorrad-fotografie.html',
  'motorradfotografie/custom-build-bike': 'custom-bike-fotografie.html',
  'motorradfotografie/extreme-perspektiven-motorrad-fotografie': 'motorrad-fotografie.html',
  'motorradfotografie/fotografie-motorrad': 'motorrad-fotografie.html',
  'motorradfotografie/geheime-motorrad-fotolocations-im-bergischen-mit-google-maps': 'motorrad-fotografie.html',
  'motorradfotografie/low-light-motorrad-fotografie': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-eventfotografie': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotografie-checkliste': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotografie-mit-gopros': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotografie-rechtliche-aspekte': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotografie-tipps': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotoshooting': 'motorrad-shooting-duesseldorf.html',
  'motorradfotografie/offroad-fotografie-outdoor': 'motorrad-fotografie.html',
  'motorradfotografie/regenfotografie-tipps': 'motorrad-fotografie.html',
  'motorradfotografie/rennstrecke-und-trackday': 'motorsport-fotografie.html',
  'motorradfotografie/rolling-shots-bike-fotografie': 'bike-fotografie.html',
  'motorradfotografie/sicherheit-motorrad-fotoshooting': 'motorrad-shooting-duesseldorf.html',
  'motorradfotografie/studiofotografie-motorraeder': 'motorrad-fotografie.html',
  'motorradfotografie/werkstatt-fotografie': 'custom-bike-fotografie.html',
  'motorradfotografie-guide': 'motorrad-fotografie.html',
  'musiker-fotografie': 'portraitfotografie.html',
  'oldtimer-fotografie': 'oldtimer-fotografie.html',
  'oldtimer-professionell-fotografieren': 'oldtimer-fotografie.html',
  oldtimerfotografie: 'oldtimer-fotografie.html',
  'oldtimerfotografie-wuppertal-klassische-eleganz-einzigartige-aufnahmen-bei-oldtimertreffen-und-classic-days':
    'oldtimer-fotografie-wuppertal.html',
  'oldtimerfotografie/classic-days-leise-dokumentieren-mit-herz-und-respekt': 'classic-car-fotografie.html',
  'oldtimerfotografie/oldtimer-vorbereiten-makellos-fuer-perfekte-detailfotos': 'oldtimer-verkaufsfotos-duesseldorf.html',
  'oldtimerfotografie/youngtimer-vs-oldtimer-bilder-voller-zeitgeist-70er-90er': 'youngtimer-fotografie.html',
  'oldtimerfotografie-guide': 'oldtimer-fotografie.html',
  'outdoor-portrait-fotografie': 'portraitfotografie.html',
  'outdoor-portraitfotografie': 'portraitfotografie.html',
  'portfolio-dating': 'dating-fotoshooting.html',
  'portfolio_category/architecture': 'portfolio.html',
  'portrait-fotografie': 'portraitfotografie.html',
  'portrait-im-chateau': 'portraitfotografie.html',
  'portrait-von-frauen': 'portraitfotografie.html',
  'portraitfotograf-duesseldorf': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie/bandshootings-im-ruhrgebiet-episch-urban-zu-leeren-plaetzen': 'portraitfotografie.html',
  'portraitfotografie/bildkomposition-fuer-portraits': 'portraitfotografie.html',
  'portraitfotografie/businessportraits-draussen-in-duesseldorf-im-besten-licht': 'business-portrait-duesseldorf.html',
  'portraitfotografie/charakterportrait-fotograf-duesseldorf': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie/farbtheorie-in-der-fotografie': 'portraitfotografie.html',
  'portraitfotografie/fuehrungslinien-meistern-fuer-kraftvolle-bildkomposition': 'portraitfotografie.html',
  'portraitfotografie/kompositionstechniken-fuer-fortgeschrittene-fotografie': 'portraitfotografie.html',
  'portraitfotografie/kreative-schattenfotografie-tipps-guide': 'portraitfotografie.html',
  'portraitfotografie/lichtformer-fuer-portraitfotografie': 'portraitfotografie-beleuchtung.html',
  'portraitfotografie/location-scouting-in-duesseldorf-sichere-top-checkliste': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie/low-key-fotografie-beleuchtung-und-high-key-fotografie': 'portraitfotografie.html',
  'portraitfotografie/mikrogesten-und-haende-im-charakterportraet-fuer-mehr-wirkung': 'portraitfotografie.html',
  'portraitfotografie/moody-portrait-fotografie': 'portraitfotografie.html',
  'portraitfotografie/moody-portrait-look-mit-flat-profile-sanft-unterbelichtet': 'portraitfotografie.html',
  'portraitfotografie/musiker-fotos-perfekter-look-fine-art-vs-documentary': 'portraitfotografie.html',
  'portraitfotografie/musikerportraits-on-location-authentisch-und-atmosphaerisch': 'portraitfotografie.html',
  'portraitfotografie/natuerliche-portraits-im-offenen-schatten-perfekte-hauttoene': 'portraitfotografie.html',
  'portraitfotografie/outdoor-shootings-wetterstrategien-fuer-magische-looks': 'portraitfotografie.html',
  'portraitfotografie/portraetfotografie-mit-natuerlichem-licht': 'portraitfotografie.html',
  'portraitfotografie/retro-looks-in-der-digitalen-fotografie': 'portraitfotografie.html',
  'portraitfotografie/schwarz-weiss-fotografie-lichtsetzung': 'schwarz-weiss-portrait-fotografie.html',
  'portraitfotografie/schwarz-weiss-portraitfotografie': 'schwarz-weiss-portrait-fotografie.html',
  'portraitfotografie/sieben-sichere-grundposen-fuer-alle-koerpertypen-begeistern': 'portraitfotografie.html',
  'portraitfotografie-guide': 'portraitfotografie.html',
  portratifotografie: 'portraitfotografie.html',
  project: 'portfolio.html',
  projects: 'portfolio.html',
  'retro-looks-in-der-digitalen-fotografie': 'portraitfotografie.html',
  'tinder-fotograf': 'dating-fotoshooting.html',
  'uncategorized/portrait-fotografie-beleuchtung': 'portraitfotografie-beleuchtung.html',
  'uncategorized/wetter-und-jahreszeiten-motorrad-fotografie': 'motorrad-fotografie.html',
  'viola-bratschenmusik-duesseldorf': 'viola-musik-duesseldorf.html',
  'vintage-portraets-fotografie': 'portraitfotografie.html',
  'vintage-portraets-fotografie-in-duesseldorf-matthias-ramahi': 'portraitfotografie-duesseldorf.html',
  'webdesign-seo-duesseldorf': 'webdesign-seo-duesseldorf.html',
  'werbetechnik-duesseldorf': 'werbetechnik-duesseldorf.html',
  'weitere-dienstleistungen': 'leistungen.html',
} as const

export type LegacyPathRedirect = keyof typeof legacyPathRedirectTargets

const legacyGonePathPrefixes = [
  'author/',
  'category/',
  'portfolio-category/',
  'portfolio-item/',
  'product-category/',
  'shop-2',
  'shop-sidebar',
  'tag/',
  'wp-',
  'wp-content/',
] as const

const legacyGonePaths = new Set([
  'agb',
  'cookie-richtlinie-eu',
  'echtheit-von-bewertungen',
  'how-it-works',
  'kasse',
  'live-fotograf',
  'rechtliches',
  'stills',
  'versandarten',
  'widerrufsbelehrung',
])

const legacyRedirectFileSet = new Set<string>(Object.keys(legacyRedirectTargets))

const extensionlessHtmlAliases: Record<string, string> = {
  about: 'ueber-mich.html',
  blog: 'blog.html',
  contact: 'contact.html',
  fotografie: 'fotografie.html',
  journal: 'blog.html',
  kontakt: 'contact.html',
  leistungen: 'leistungen.html',
  portfolio: 'portfolio.html',
  services: 'leistungen.html',
  'ueber-mich': 'ueber-mich.html',
}

const fullScopeLocalSeoPrefixes = [
  'automobil-fotografie',
  'sportwagen-fotografie',
  'oldtimer-fotografie',
  'motorrad-fotografie',
  'portraitfotografie',
  'landschaftsfotografie',
] as const

const duesseldorfScopedKeywordPrefixes = [
  'auto-fotoshooting',
  'auto-fotografieren-tipps',
  'autofotografie',
  'autohaus-fotografie',
  'automotive-fotografie',
  'autoverkauf-fotos',
  'fahrzeugfotografie',
  'bilder-mit-auto',
  'bike-fotografie',
  'biker-portrait',
  'business-portrait',
  'classic-car-fotografie',
  'custom-bike-fotografie',
  'dating-fotoshooting',
  'exotic-car-fotografie',
  'fotoshooting-gutschein',
  'fotoshooting-mit-auto',
  'fotoshooting-preise',
  'headshot-fotograf',
  'motorsport-fotografie',
  'motorsport-sportwagen-fotografie',
  'motorrad-shooting',
  'motorrad-verkaufsfotos',
  'oldtimer-shooting',
  'oldtimer-verkaufsfotos',
  'paarshooting-familienshooting',
  'performance-car-fotografie',
  'personal-branding-fotografie',
  'portrait-fotoshooting',
  'portraitfotografie-beleuchtung',
  'pressefoto',
  'sammlerfahrzeug-fotografie',
  'schwarz-weiss-portrait-fotografie',
  'sportwagen-fotoshooting',
  'sportwagen-shooting',
  'supersportwagen-fotografie',
  'unternehmensportrait',
  'youngtimer-fotografie',
] as const

const standaloneKeywordFiles = [
  'auto-fotoshooting.html',
  'auto-fotografieren-tipps.html',
  'autofotografie.html',
  'autohaus-fotografie.html',
  'automotive-fotografie.html',
  'bilder-mit-auto.html',
  'bike-fotografie.html',
  'classic-car-fotografie.html',
  'custom-bike-fotografie.html',
  'dating-fotoshooting.html',
  'exotic-car-fotografie.html',
  'fahrzeugfotografie.html',
  'fine-art-prints-landschaft.html',
  'fotoshooting-gutschein.html',
  'fotoshooting-mit-auto.html',
  'fotoshooting-preise.html',
  'landschaftsbilder-kaufen.html',
  'motorsport-fotografie.html',
  'motorsport-sportwagen-fotografie.html',
  'naturfotografie-prints.html',
  'paarshooting-familienshooting.html',
  'performance-car-fotografie.html',
  'personal-branding-fotografie.html',
  'portrait-fotoshooting.html',
  'portraitfotografie-beleuchtung.html',
  'sammlerfahrzeug-fotografie.html',
  'schwarz-weiss-portrait-fotografie.html',
  'supersportwagen-fotografie.html',
  'wandbilder-landschaftsfotografie.html',
  'youngtimer-fotografie.html',
] as const

const specialScopedKeywordFiles = ['landschaftsfotografie-print-deutschland.html'] as const

function generatedLocalSeoFiles() {
  const fullScopeFiles = fullScopeLocalSeoPrefixes.flatMap((prefix) => [
    `${prefix}.html`,
    ...localSeoCityTokens.map((scope) => `${prefix}-${scope}.html`),
  ])
  const duesseldorfFiles = duesseldorfScopedKeywordPrefixes.map((prefix) => `${prefix}-duesseldorf.html`)

  return [...fullScopeFiles, ...duesseldorfFiles, ...standaloneKeywordFiles, ...specialScopedKeywordFiles]
}

export function listNativeHtmlRouteFiles() {
  return [
    ...new Set([
      ...adoptedLegacyFiles,
      ...Object.keys(legacyRedirectTargets),
      ...generatedLocalSeoFiles(),
    ]),
  ].sort((a, b) => a.localeCompare(b))
}

const nativeHtmlRouteFileSet = new Set<string>(listNativeHtmlRouteFiles())

export function getLegacyRedirectTarget(fileName?: string | null) {
  const normalized = (fileName || '').replace(/^\/+/, '').toLowerCase()
  const target = legacyRedirectTargets[normalized as LegacyRedirectFile]
  return typeof target === 'string' ? target : null
}

export function normalizeLegacyPathRedirectPath(pathname?: string | null) {
  const withoutOrigin = decodeURIComponent(pathname || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/^https?:\/\/[^/]+/i, '')

  return withoutOrigin.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase()
}

export function getLegacyPathRedirectTarget(pathname?: string | null) {
  const normalized = normalizeLegacyPathRedirectPath(pathname)
  const explicitTarget = legacyPathRedirectTargets[normalized as LegacyPathRedirect]
  if (typeof explicitTarget === 'string') return explicitTarget

  const localSeoAliasTarget = getLocalSeoAliasRedirectTarget(normalized)
  if (localSeoAliasTarget) return localSeoAliasTarget

  return getLegacyArchiveRedirectTarget(normalized)
}

function getLocalSeoAliasRedirectTarget(normalized: string) {
  const city = localSeoCityTokens.find((token) => normalized.endsWith(`-${token}`))
  if (!city) return null

  if (normalized === `autofotografie-${city}`) {
    return city === 'duesseldorf' ? 'autofotografie-duesseldorf.html' : `automobil-fotografie-${city}.html`
  }

  if (normalized === `oldtimerfotografie-${city}`) return `oldtimer-fotografie-${city}.html`
  if (normalized === `motorrad-fotoshooting-${city}`) return `motorrad-fotografie-${city}.html`
  if (normalized === `fotoshooting-motorrad-${city}`) return `motorrad-fotografie-${city}.html`

  return null
}

function getLegacyArchiveRedirectTarget(normalized: string) {
  const archiveMatch = normalized.match(/^(?:tag|category)\/([^/]+)/)
  const archiveSlug = archiveMatch?.[1]
  if (!archiveSlug) return null

  if (/(motorrad|bike|biker)/.test(archiveSlug)) return 'motorrad-fotografie.html'
  if (/(oldtimer|youngtimer|classic|70er|80er)/.test(archiveSlug)) return 'oldtimer-fotografie.html'
  if (/(sportwagen|porsche|motorsport|performance|auto|automobil|car|lack|showroom)/.test(archiveSlug)) {
    return 'automobil-fotografie.html'
  }
  if (/(portrait|portraet|headshot|businessportrait|personal-branding|posing|model|koerpersprache|fensterlicht|low-key|high-key)/.test(archiveSlug)) {
    return 'portraitfotografie.html'
  }
  if (/(landschaft|natur|fine-art|wandbilder|prints)/.test(archiveSlug)) return 'landschaftsfotografie.html'

  return null
}

export function isLegacyGonePath(pathname?: string | null) {
  const normalized = normalizeLegacyPathRedirectPath(pathname)
  if (!normalized || getLegacyPathRedirectTarget(normalized)) return false

  if (legacyGonePaths.has(normalized)) return true

  return legacyGonePathPrefixes.some((prefix) => normalized === prefix.replace(/\/$/, '') || normalized.startsWith(prefix))
}

export function isLegacyRedirectFile(fileName?: string | null): fileName is LegacyRedirectFile {
  return Boolean(fileName && legacyRedirectFileSet.has(fileName))
}

export function normalizeHtmlRoutePath(pathname?: string | null) {
  const clean = decodeURIComponent(pathname || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase()

  if (!clean || clean === 'index.html') return 'index.html'
  if (extensionlessHtmlAliases[clean]) return extensionlessHtmlAliases[clean]
  return clean.endsWith('.html') ? clean : `${clean}.html`
}

export function getNativeHtmlFileForPath(pathname?: string | null) {
  const fileName = normalizeHtmlRoutePath(pathname)
  return nativeHtmlRouteFileSet.has(fileName) ? fileName : null
}

export function isAdoptedLegacyFile(fileName?: string | null): fileName is AdoptedLegacyFile {
  return Boolean(fileName && adoptedLegacyFileSet.has(fileName))
}

export function isLocalSeoAdoptionCandidate(fileName?: string | null) {
  if (!fileName || !fileName.endsWith('.html') || isAdoptedLegacyFile(fileName)) return false

  const slug = fileName.replace(/\.html$/i, '')
  return localSeoPrefixes.some((prefix) => slug.startsWith(prefix))
}

export function isCmsAdoptedLegacyFile(fileName?: string | null, options: { includeLocalSeo?: boolean } = {}) {
  return isAdoptedLegacyFile(fileName) || Boolean(options.includeLocalSeo && isLocalSeoAdoptionCandidate(fileName))
}
