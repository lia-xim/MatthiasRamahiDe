import { getTinaRelativePathByLegacyUrl, getTinaRelativePathBySlug, normalizeTinaDocument } from './tinaContent'
import type { PayloadDoc } from './payload'

type VisualCollection = 'pages' | 'servicePages' | 'localSeoPages' | 'portfolioProjects' | 'journalPosts'
type QueryResult = Record<string, unknown>
type TinaClientResult = {
  data: QueryResult
  query: string
  variables: Record<string, unknown>
}
type TinaQueryClient = {
  queries: Record<VisualCollection, (args: { relativePath: string }) => Promise<TinaClientResult>>
}

const collectionAliases: Record<VisualCollection, string> = {
  pages: 'site-pages',
  servicePages: 'service-pages',
  localSeoPages: 'local-seo-pages',
  portfolioProjects: 'portfolio-projects',
  journalPosts: 'journal-posts',
}

const payloadCollectionToVisual: Record<string, VisualCollection> = {
  'site-pages': 'pages',
  pages: 'pages',
  'service-pages': 'servicePages',
  servicePages: 'servicePages',
  'local-seo-pages': 'localSeoPages',
  localSeoPages: 'localSeoPages',
  'portfolio-projects': 'portfolioProjects',
  portfolioProjects: 'portfolioProjects',
  'journal-posts': 'journalPosts',
  journalPosts: 'journalPosts',
}

const queryDocument = async (tinaClient: TinaQueryClient, collection: VisualCollection, relativePath: string) => {
  switch (collection) {
    case 'pages':
      return tinaClient.queries.pages({ relativePath })
    case 'servicePages':
      return tinaClient.queries.servicePages({ relativePath })
    case 'localSeoPages':
      return tinaClient.queries.localSeoPages({ relativePath })
    case 'portfolioProjects':
      return tinaClient.queries.portfolioProjects({ relativePath })
    case 'journalPosts':
      return tinaClient.queries.journalPosts({ relativePath })
  }
}

export const tinaRelativePathForSlug = (slug: string) => `${slug.replace(/\.json$/i, '')}.json`

export const visualCollectionForPayloadCollection = (collection: string): VisualCollection | null =>
  payloadCollectionToVisual[collection] || null

export const isTinaEditRequest = (request: Request) => {
  const url = new URL(request.url)
  if (url.searchParams.get('tina-edit') === '1') return true

  if (
    request.headers
      .get('cookie')
      ?.split(';')
      .some((cookie) => {
        const [name, value] = cookie.trim().split('=')
        return name === '__tina_edit' && value === '1'
      })
  ) {
    return true
  }

  const destination = request.headers.get('sec-fetch-dest')
  const referer = request.headers.get('referer') || ''
  try {
    const refererUrl = new URL(referer)
    return (
      refererUrl.host === url.host &&
      refererUrl.pathname.startsWith('/admin/') &&
      (!destination || destination === 'iframe')
    )
  } catch {
    return false
  }
}

export async function getTinaVisualDocument(
  collection: VisualCollection,
  relativePath: string,
): Promise<PayloadDoc | null> {
  const [{ requestWithMetadata }, { default: tinaClient }] = await Promise.all([
    import('@tinacms/astro/data'),
    import('../../tina/__generated__/client'),
  ])
  const source = queryDocument(tinaClient as TinaQueryClient, collection, relativePath) as Promise<TinaClientResult>
  const result = await requestWithMetadata<QueryResult>(source, { priority: 'primary' })
  const data = result.data as QueryResult
  const doc = data[collection]

  if (!doc || typeof doc !== 'object') return null

  return normalizeTinaDocument(doc as Record<string, unknown>, collectionAliases[collection], relativePath)
}

export async function getTinaVisualDocumentBySlug(
  collection: VisualCollection,
  slug: string,
  options: { requireExisting?: boolean } = {},
): Promise<PayloadDoc | null> {
  const relativePath = getTinaRelativePathBySlug(collectionAliases[collection], slug, { draft: true })
  if (!relativePath && options.requireExisting) return null

  const fallbackRelativePath = relativePath || tinaRelativePathForSlug(slug)
  return getTinaVisualDocument(collection, fallbackRelativePath)
}

export async function getTinaVisualDocumentByLegacyUrl(
  collection: VisualCollection,
  legacyUrl: string,
): Promise<PayloadDoc | null> {
  const relativePath = getTinaRelativePathByLegacyUrl(collectionAliases[collection], legacyUrl, { draft: true })
  return relativePath ? getTinaVisualDocument(collection, relativePath) : null
}

export async function getTinaVisualDocumentForLegacyRoute(
  legacyUrl: string,
  collections: VisualCollection[] = ['pages', 'servicePages', 'localSeoPages', 'journalPosts'],
): Promise<{ collection: string; doc: PayloadDoc } | null> {
  const slug = legacyUrl
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/\.html$/i, '')

  for (const collection of collections) {
    const doc =
      (await getTinaVisualDocumentByLegacyUrl(collection, legacyUrl)) ||
      (slug ? await getTinaVisualDocumentBySlug(collection, slug, { requireExisting: true }) : null)
    if (doc) return { collection: collectionAliases[collection], doc }
  }

  return null
}
