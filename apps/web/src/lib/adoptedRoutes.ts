import { localSeoCityTokens, localSeoPrefixes } from './localSeoLayoutFamilies'

export const adoptedLegacyFiles = [
  'fotografie.html',
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
] as const

export type AdoptedLegacyFile = (typeof adoptedLegacyFiles)[number]

const adoptedLegacyFileSet = new Set<string>(adoptedLegacyFiles)

export function isAdoptedLegacyFile(fileName?: string | null): fileName is AdoptedLegacyFile {
  return Boolean(fileName && adoptedLegacyFileSet.has(fileName))
}

export function isLocalSeoAdoptionCandidate(fileName?: string | null) {
  if (!fileName || !fileName.endsWith('.html') || isAdoptedLegacyFile(fileName)) return false

  const slug = fileName.replace(/\.html$/i, '')
  return localSeoPrefixes.some((prefix) => slug.startsWith(prefix)) && localSeoCityTokens.some((city) => slug.includes(`-${city}`))
}

export function isCmsAdoptedLegacyFile(fileName?: string | null, options: { includeLocalSeo?: boolean } = {}) {
  return isAdoptedLegacyFile(fileName) || Boolean(options.includeLocalSeo && isLocalSeoAdoptionCandidate(fileName))
}
