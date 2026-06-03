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
  'automobil-fotografie.html': 'portfolio/portfolio-auswahl-automobil',
  'blog-journal.html': 'blog.html',
  'fotografie-landing-experience.html': 'fotografie-duesseldorf.html',
  'landschaftsfotografie.html': 'portfolio/portfolio-auswahl-landschaft',
  'matthias-ramahi-portfolio.html': 'portfolio.html',
  'motorrad-fotografie.html': 'portfolio/portfolio-auswahl-motorrad',
  'oldtimer-fotografie.html': 'portfolio/portfolio-auswahl-oldtimer',
  'portfolio-1-tunnel.html': 'portfolio.html',
  'portraitfotografie.html': 'portfolio/portfolio-auswahl-portrait',
  'portraitfotografie-experience.html': 'portraitfotografie-duesseldorf.html',
  'sportwagen-fotografie.html': 'portfolio/portfolio-auswahl-sportwagen',
  'weitere-dienstleistungen.html': 'leistungen.html',
} as const

export type LegacyRedirectFile = keyof typeof legacyRedirectTargets

export const legacyPathRedirectTargets = {
  'autofotografie': 'autofotografie.html',
  'autofotografie/autofotografie-duesseldorf': 'autofotografie-duesseldorf.html',
  'autofotografie/automobilfotografie-im-regen': 'autofotografie.html',
  'autofotografie-bochum': 'automobil-fotografie-bochum.html',
  'autofotografie-dortmund': 'automobil-fotografie-dortmund.html',
  'autofotografie-duesseldorf': 'autofotografie-duesseldorf.html',
  'autofotografie-guide': 'autofotografie.html',
  'autofotografie-wuppertal': 'automobil-fotografie-wuppertal.html',
  'fotografie': 'fotografie.html',
  'fotografie-musiker': 'portraitfotografie.html',
  'fotoshooting-mit-motorrad-duisburg-urbane-kulisse-industrielle-seele-echte-emotion':
    'motorrad-fotografie-duisburg.html',
  'motorradfotografie': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotografie-mit-gopros': 'motorrad-fotografie.html',
  'motorradfotografie-guide': 'motorrad-fotografie.html',
  'portraitfotografie/farbtheorie-in-der-fotografie': 'portraitfotografie.html',
  'portraitfotografie/low-key-fotografie-beleuchtung-und-high-key-fotografie': 'portraitfotografie.html',
  'portraitfotografie/mikrogesten-und-haende-im-charakterportraet-fuer-mehr-wirkung': 'portraitfotografie.html',
  'portraitfotografie/retro-looks-in-der-digitalen-fotografie': 'portraitfotografie.html',
  'vintage-portraets-fotografie': 'portraitfotografie.html',
} as const

export type LegacyPathRedirect = keyof typeof legacyPathRedirectTargets

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
  return legacyRedirectTargets[normalized as LegacyRedirectFile] || null
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
  return legacyPathRedirectTargets[normalized as LegacyPathRedirect] || null
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
