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
  'blog-journal.html': 'blog.html',
  'fotografie-landing-experience.html': 'fotografie-duesseldorf.html',
  'matthias-ramahi-portfolio.html': 'portfolio.html',
  'portfolio-1-tunnel.html': 'portfolio.html',
  'portraitfotografie-experience.html': 'portraitfotografie-duesseldorf.html',
  'weitere-dienstleistungen.html': 'leistungen.html',
} as const

export type LegacyRedirectFile = keyof typeof legacyRedirectTargets

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
  'autofotografie',
  'autohaus-fotografie',
  'automotive-fotografie',
  'autoverkauf-fotos',
  'fahrzeugfotografie',
  'bike-fotografie',
  'biker-portrait',
  'business-portrait',
  'classic-car-fotografie',
  'custom-bike-fotografie',
  'exotic-car-fotografie',
  'headshot-fotograf',
  'motorrad-shooting',
  'motorrad-verkaufsfotos',
  'oldtimer-shooting',
  'oldtimer-verkaufsfotos',
  'performance-car-fotografie',
  'personal-branding-fotografie',
  'pressefoto',
  'sammlerfahrzeug-fotografie',
  'sportwagen-fotoshooting',
  'sportwagen-shooting',
  'supersportwagen-fotografie',
  'unternehmensportrait',
  'youngtimer-fotografie',
] as const

const standaloneKeywordFiles = [
  'autofotografie.html',
  'autohaus-fotografie.html',
  'automotive-fotografie.html',
  'bike-fotografie.html',
  'classic-car-fotografie.html',
  'custom-bike-fotografie.html',
  'exotic-car-fotografie.html',
  'fahrzeugfotografie.html',
  'fine-art-prints-landschaft.html',
  'landschaftsbilder-kaufen.html',
  'naturfotografie-prints.html',
  'performance-car-fotografie.html',
  'personal-branding-fotografie.html',
  'sammlerfahrzeug-fotografie.html',
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
