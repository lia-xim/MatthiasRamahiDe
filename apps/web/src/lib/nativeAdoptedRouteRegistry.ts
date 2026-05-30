import { isLocalSeoAdoptionCandidate } from './adoptedRoutes'
import { getConceptArchivePage } from './conceptArchiveContent'
import { journalArticleByLegacyFile } from './journalArticleContent'
import { nativeServiceDetailFiles } from './serviceDetailContent'

export type NativeAdoptedRouteKind =
  | 'about'
  | 'automobil'
  | 'concept'
  | 'contact'
  | 'home'
  | 'journal-detail'
  | 'journal-index'
  | 'landscape'
  | 'legal'
  | 'local-seo'
  | 'motorcycle'
  | 'oldtimer'
  | 'photography'
  | 'photography-overview'
  | 'portfolio-index'
  | 'portrait'
  | 'print-lab'
  | 'service-detail'
  | 'services-index'
  | 'sportscar'
  | 'werbetechnik'

const photographyOverviewFiles = new Set(['fotografie-duesseldorf.html', 'fotografie-nrw.html', 'fotografie-deutschland.html'])
const legalFiles = new Set(['impressum.html', 'datenschutz.html'])

const exactRouteKinds: Record<string, NativeAdoptedRouteKind> = {
  'index.html': 'home',
  'fotografie.html': 'photography',
  'automobil-fotografie.html': 'automobil',
  'sportwagen-fotografie.html': 'sportscar',
  'oldtimer-fotografie.html': 'oldtimer',
  'motorrad-fotografie.html': 'motorcycle',
  'portraitfotografie.html': 'portrait',
  'landschaftsfotografie.html': 'landscape',
  'blog.html': 'journal-index',
  'portfolio.html': 'portfolio-index',
  'fotolabor-druck-duesseldorf.html': 'print-lab',
  'werbetechnik-duesseldorf.html': 'werbetechnik',
  'leistungen.html': 'services-index',
  'contact.html': 'contact',
  'ueber-mich.html': 'about',
}

export function nativeAdoptedRouteKindForFile(fileName?: string | null): NativeAdoptedRouteKind | null {
  const file = (fileName || '').replace(/^\/+/, '').toLowerCase()
  if (!file) return null

  if (exactRouteKinds[file]) return exactRouteKinds[file]
  if (photographyOverviewFiles.has(file)) return 'photography-overview'
  if (legalFiles.has(file)) return 'legal'
  if (journalArticleByLegacyFile[file]) return 'journal-detail'
  if (nativeServiceDetailFiles.includes(file)) return 'service-detail'
  if (getConceptArchivePage(file)) return 'concept'
  if (isLocalSeoAdoptionCandidate(file)) return 'local-seo'

  return null
}

export function hasNativeAdoptedRenderer(fileName?: string | null) {
  return Boolean(nativeAdoptedRouteKindForFile(fileName))
}
