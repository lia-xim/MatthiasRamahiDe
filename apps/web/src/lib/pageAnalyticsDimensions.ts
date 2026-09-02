import {
  localSeoLayoutFamilyForSlug,
  localSeoParentLegacyFiles,
  normalizeLocalSeoSlug,
  type LocalSeoLayoutFamily,
} from './localSeoLayoutFamilies.ts'

export type PageAnalyticsDimensions = {
  pageFamily: LocalSeoLayoutFamily | 'crawl-foundry' | 'other' | 'portfolio'
  pageRole:
    | 'case-study'
    | 'child'
    | 'guide'
    | 'local-hub'
    | 'other'
    | 'pillar'
    | 'proof'
    | 'regional-hub'
}

const guideSlugs = new Set([
  'auto-fotografieren-tipps',
  'portraitfotografie-beleuchtung',
])

const normalizePath = (value?: string | null) => {
  const path = (value || '/')
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .split(/[?#]/, 1)[0]
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')

  return path || '/'
}

export function pageAnalyticsDimensions(value?: string | null): PageAnalyticsDimensions {
  const path = normalizePath(value)
  const slug = normalizeLocalSeoSlug(path)

  if (slug === 'keyword-datenbank-seo') {
    return { pageFamily: 'crawl-foundry', pageRole: 'case-study' }
  }

  const portfolioMatch = path.match(/^portfolio\/portfolio-auswahl-([^/]+)$/)
  if (portfolioMatch) {
    return {
      pageFamily: (portfolioMatch[1] as LocalSeoLayoutFamily) || 'portfolio',
      pageRole: 'proof',
    }
  }

  const family = localSeoLayoutFamilyForSlug(slug)
  if (!family) return { pageFamily: 'other', pageRole: 'other' }

  const parentSlug = normalizeLocalSeoSlug(localSeoParentLegacyFiles[family])
  if (slug === parentSlug) return { pageFamily: family, pageRole: 'pillar' }
  if (guideSlugs.has(slug)) return { pageFamily: family, pageRole: 'guide' }
  if (slug === `${parentSlug}-duesseldorf`) return { pageFamily: family, pageRole: 'local-hub' }
  if (slug === `${parentSlug}-nrw`) return { pageFamily: family, pageRole: 'regional-hub' }

  return { pageFamily: family, pageRole: 'child' }
}
