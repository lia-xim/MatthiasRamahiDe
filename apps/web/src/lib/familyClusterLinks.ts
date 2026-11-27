import { getLegacyRedirectTarget } from './adoptedRoutes'
import { isCurrentPageHref } from './pageLinks'

export type FamilyLinkTuple = readonly [href: string, label: string]

export type FamilyIntentLink = {
  key: string
  label: string
  genericHref: string
  duesseldorfHref: string
}

type CurateFamilyClusterLinksOptions = {
  allCityLinks: readonly FamilyLinkTuple[]
  currentPage: string
  defaultLegacyFile: string
  familyLabel: string
  intentLinks: readonly FamilyIntentLink[]
  intentNeighbors?: Readonly<Record<string, readonly string[]>>
  isParentPage: boolean
  primaryIntentKeys: readonly string[]
  scopeSlug: string
}

const normalizeHrefFile = (href: string) => href.replace(/^\/+|\/+$/g, '').split(/[?#]/, 1)[0] || ''

const resolveCanonicalHref = (href: string): string => {
  const file = normalizeHrefFile(href)
  const redirectTarget = getLegacyRedirectTarget(file)
  if (redirectTarget === null) return href
  return redirectTarget ? (href.startsWith('/') ? `/${redirectTarget}` : redirectTarget) : '/'
}

const isRedirectedHref = (href: string) => getLegacyRedirectTarget(normalizeHrefFile(href)) !== null

const uniqueLinks = (links: readonly FamilyLinkTuple[]) => {
  const seen = new Set<string>()
  return links.filter(([href]) => {
    const key = normalizeHrefFile(href)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function curateFamilyClusterLinks({
  allCityLinks,
  currentPage,
  defaultLegacyFile,
  familyLabel,
  intentLinks,
  intentNeighbors = {},
  isParentPage,
  primaryIntentKeys,
  scopeSlug,
}: CurateFamilyClusterLinksOptions) {
  const baseSlug = defaultLegacyFile.replace(/\.html$/, '')
  const duesseldorfHref = `${baseSlug}-duesseldorf.html`
  const nrwHref = `${baseSlug}-nrw.html`
  const parentLink: FamilyLinkTuple = [defaultLegacyFile, `${familyLabel} Übersicht`]
  const indexableCityLinks = uniqueLinks(
    allCityLinks.filter(([href]) => !/-deutschland\.html(?:$|[?#])/.test(href) && !isRedirectedHref(href)),
  )
  const allLocationLinks = uniqueLinks([parentLink, ...indexableCityLinks])
  const findLocationLink = (href: string) =>
    allLocationLinks.find(([candidate]) => isCurrentPageHref(candidate, href))
  const pickLocationLinks = (hrefs: readonly string[]) =>
    hrefs.flatMap((href) => {
      const link = findLocationLink(href)
      return link ? [link] : []
    })

  const isFamilyLocationPage =
    isParentPage || indexableCityLinks.some(([href]) => isCurrentPageHref(href, currentPage))
  const isDuesseldorfFamilyPage = isCurrentPageHref(duesseldorfHref, currentPage)
  const isNrwFamilyPage = isCurrentPageHref(nrwHref, currentPage)
  const priorityLocationHrefs = [
    duesseldorfHref,
    nrwHref,
    `${baseSlug}-bochum.html`,
    `${baseSlug}-dortmund.html`,
    `${baseSlug}-essen.html`,
    `${baseSlug}-duisburg.html`,
    `${baseSlug}-koeln.html`,
    `${baseSlug}-wuppertal.html`,
    `${baseSlug}-moenchengladbach.html`,
    `${baseSlug}-krefeld.html`,
  ]
  const regionalNeighbors: Record<string, readonly string[]> = {
    bochum: ['essen', 'dortmund', 'duisburg'],
    dortmund: ['bochum', 'essen', 'wuppertal'],
    essen: ['bochum', 'duisburg', 'krefeld'],
    duisburg: ['essen', 'krefeld', 'moenchengladbach'],
    koeln: ['wuppertal', 'moenchengladbach', 'krefeld'],
    wuppertal: ['bochum', 'koeln', 'essen'],
    krefeld: ['duisburg', 'moenchengladbach', 'essen'],
    moenchengladbach: ['krefeld', 'koeln', 'duisburg'],
  }
  const neighborHrefs = (regionalNeighbors[scopeSlug] || []).map((city) => `${baseSlug}-${city}.html`)

  const cityLinks = (
    isNrwFamilyPage
      ? allLocationLinks
      : isParentPage
        ? pickLocationLinks(priorityLocationHrefs)
        : isDuesseldorfFamilyPage
          ? pickLocationLinks([
              defaultLegacyFile,
              nrwHref,
              `${baseSlug}-bochum.html`,
              `${baseSlug}-dortmund.html`,
              `${baseSlug}-essen.html`,
              `${baseSlug}-duisburg.html`,
              `${baseSlug}-koeln.html`,
              `${baseSlug}-wuppertal.html`,
              `${baseSlug}-krefeld.html`,
              `${baseSlug}-moenchengladbach.html`,
            ])
          : pickLocationLinks([defaultLegacyFile, duesseldorfHref, nrwHref, ...neighborHrefs])
  ).filter(([href]) => !isCurrentPageHref(href, currentPage))

  const intentLinkByKey = new Map(intentLinks.map((link) => [link.key, link]))
  const currentIntent = intentLinks.find(
    (link) =>
      isCurrentPageHref(resolveCanonicalHref(link.genericHref), currentPage) ||
      isCurrentPageHref(resolveCanonicalHref(link.duesseldorfHref), currentPage),
  )
  const resolveIntentKeys = (keys: readonly string[]) =>
    uniqueLinks(
      keys.flatMap((key) => {
        const link = intentLinkByKey.get(key)
        if (!link) return []
        const rawHref = !isParentPage && scopeSlug === 'duesseldorf' ? link.duesseldorfHref : link.genericHref
        const canonicalHref = resolveCanonicalHref(rawHref)
        if (isCurrentPageHref(canonicalHref, defaultLegacyFile) || isCurrentPageHref(canonicalHref, duesseldorfHref)) {
          return []
        }
        return [[canonicalHref, link.label] as FamilyLinkTuple]
      }),
    ).filter(([href]) => !isCurrentPageHref(href, currentPage))

  const searchLinks = isParentPage
    ? resolveIntentKeys(intentLinks.map((link) => link.key))
    : isDuesseldorfFamilyPage || isNrwFamilyPage
      ? resolveIntentKeys(primaryIntentKeys)
      : !isFamilyLocationPage && currentIntent && intentNeighbors[currentIntent.key]
        ? resolveIntentKeys([...intentNeighbors[currentIntent.key], ...primaryIntentKeys]).slice(0, 4)
        : resolveIntentKeys(primaryIntentKeys).slice(0, 4)

  return {
    cityHeading:
      isParentPage || isNrwFamilyPage
        ? `${familyLabel} <em>vor Ort.</em>`
        : `${familyLabel} <em>in der Region.</em>`,
    cityLinks,
    intentHeading: isParentPage
      ? `${familyLabel} <em>nach Anliegen.</em>`
      : `${familyLabel} <em>nach Anliegen.</em>`,
    isDuesseldorfFamilyPage,
    isFamilyLocationPage,
    isNrwFamilyPage,
    searchLinks,
    showCrossFamilyCluster: isDuesseldorfFamilyPage || isNrwFamilyPage,
  }
}
