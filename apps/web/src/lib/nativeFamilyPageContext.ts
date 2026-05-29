import {
  localSeoFamilyContent,
  scopeFromSlug,
  serviceLabelFromSlug,
  siblingFamilyLinks,
  type LocalSeoScope,
} from './localSeoFamilyContent'
import type { LocalSeoLayoutFamily } from './localSeoLayoutFamilies'
import { routeForDoc, toRootRelativeHref, type PayloadDoc } from './payload'

export type NativeFamilyPreviewState = {
  collection: string
  publishedHref: string
  slug: string
  status?: string
}

type NativeFamilyPageContextOptions = {
  defaultLegacyFile: string
  doc?: PayloadDoc | null
  family: LocalSeoLayoutFamily
  legacyFile: string
  preview?: NativeFamilyPreviewState
}

export function nativeFamilyPageContext({
  defaultLegacyFile,
  doc,
  family,
  legacyFile,
  preview,
}: NativeFamilyPageContextOptions) {
  const familyContent = localSeoFamilyContent[family]
  const scope = scopeFromSlug(legacyFile)
  const isParentPage = legacyFile === defaultLegacyFile
  const isKeywordPage = scope.generic === true
  const serviceLabel = serviceLabelFromSlug(legacyFile, familyContent)
  const localSuffix = !isParentPage && !isKeywordPage ? ` ${scope.label}` : ''
  const clusterLinks = siblingFamilyLinks(scope, family)
  const publishedHref = preview?.publishedHref || (doc ? routeForDoc('local-seo-pages', doc) : `/${legacyFile}`)
  const clusterHeading = isKeywordPage ? 'Weitere Fotografie-Bereiche.' : `Weitere Fotografie-Bereiche <em>${scope.label}.</em>`
  const overviewHref =
    scope.slug === 'duesseldorf' || isKeywordPage
      ? 'fotografie-duesseldorf.html'
      : scope.slug === 'nrw' || scope.slug === 'deutschland'
        ? `fotografie-${scope.slug}.html`
        : 'fotografie-duesseldorf.html'

  return {
    clusterHeading,
    clusterLinks,
    familyContent,
    isKeywordPage,
    isParentPage,
    localSuffix,
    overviewHref: toRootRelativeHref(overviewHref),
    publishedHref,
    scope,
    serviceLabel,
  }
}

export function localScopePhrase(scope: LocalSeoScope) {
  return `${scope.label} wird als lokaler Suchraum mit klarer Planung, passendem Lichtfenster und sauberer Nutzung der Bildserie geführt.`
}
