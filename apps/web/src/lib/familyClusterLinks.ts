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

const uniqueLinks = (links: readonly FamilyLinkTuple[]) => {
  const seen = new Set<string>()
  return links.filter(([href]) => {
    const key = href.replace(/^\/+|\/+$/g, '')
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
    allCityLinks.filter(([href]) => !/-deutschland\.html(?:$|[?#])/.test(href)),
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
    `${baseSlug}-erkrath.html`,
    `${baseSlug}-mettmann.html`,
    `${baseSlug}-ratingen.html`,
    `${baseSlug}-neuss.html`,
  ]

  const cityLinks = (
    isNrwFamilyPage
      ? allLocationLinks
      : isParentPage
        ? pickLocationLinks(priorityLocationHrefs)
        : isDuesseldorfFamilyPage
          ? pickLocationLinks([
              defaultLegacyFile,
              nrwHref,
              `${baseSlug}-erkrath.html`,
              `${baseSlug}-mettmann.html`,
              `${baseSlug}-ratingen.html`,
              `${baseSlug}-neuss.html`,
            ])
          : pickLocationLinks([defaultLegacyFile, duesseldorfHref, nrwHref])
  ).filter(([href]) => !isCurrentPageHref(href, currentPage))

  const intentLinkByKey = new Map(intentLinks.map((link) => [link.key, link]))
  const currentIntent = intentLinks.find(
    (link) =>
      isCurrentPageHref(link.genericHref, currentPage) ||
      isCurrentPageHref(link.duesseldorfHref, currentPage),
  )
  const selectedIntentKeys = isParentPage
    ? intentLinks.map((link) => link.key)
    : isDuesseldorfFamilyPage || isNrwFamilyPage
      ? primaryIntentKeys
      : !isFamilyLocationPage && currentIntent && intentNeighbors[currentIntent.key]
        ? intentNeighbors[currentIntent.key]
        : primaryIntentKeys.slice(0, 3)
  const searchLinks = uniqueLinks(
    selectedIntentKeys.flatMap((key) => {
      const link = intentLinkByKey.get(key)
      if (!link) return []
      const href = !isParentPage && scopeSlug === 'duesseldorf' ? link.duesseldorfHref : link.genericHref
      return [[href, link.label] as FamilyLinkTuple]
    }),
  ).filter(([href]) => !isCurrentPageHref(href, currentPage))

  return {
    cityHeading:
      isParentPage || isNrwFamilyPage
        ? `${familyLabel} <em>vor Ort.</em>`
        : `${familyLabel} <em>im Cluster.</em>`,
    cityLinks,
    intentHeading: isParentPage
      ? `${familyLabel} <em>nach Anliegen.</em>`
      : `Passende ${familyLabel} <em>nach Anliegen.</em>`,
    isDuesseldorfFamilyPage,
    isFamilyLocationPage,
    isNrwFamilyPage,
    searchLinks,
    showCrossFamilyCluster: isDuesseldorfFamilyPage || isNrwFamilyPage,
  }
}
