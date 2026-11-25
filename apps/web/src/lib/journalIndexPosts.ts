import { localResponsiveImage } from '../data/localResponsiveThumbs'
import { getPublicJournalCards, journalHero, type JournalPostCard } from './journalIndexContent'
import { imageAlt, imageDimensions, imageDisplayUrl, imageSrcset, listDocuments, liveCmsFetchOptions, routeForDoc, type PayloadDoc, type PayloadMedia } from './payload'
import { JOURNAL_PAGE_SIZE, type JournalTopic } from './journalIndexRoutes'

export type EditableJournalPostCard = JournalPostCard & {
  source?: PayloadDoc
  srcset?: string
  avifSrcset?: string
}

const categoryToFilter: Record<string, string> = {
  automotive: 'automotive',
  'sports-car': 'sportwagen',
  sportwagen: 'sportwagen',
  'classic-car': 'oldtimer',
  oldtimer: 'oldtimer',
  motorcycle: 'motorrad',
  motorrad: 'motorrad',
  portrait: 'portrait',
  process: 'prozess',
  'behind-the-scenes': 'prozess',
  'landscape-print': 'print',
}

/**
 * Alle öffentlichen Journal-Beitraege, neueste zuerst. Code-Karten aus
 * journalArticleContent sind die Basis; CMS-Dokumente überschreiben pro URL
 * (Titel, Auszug, Bild) und ergänzen reine CMS-Beitraege.
 */
export async function getJournalIndexPosts(): Promise<EditableJournalPostCard[]> {
  const journalCards = getPublicJournalCards()
  const publicHrefs = new Set(journalCards.map((post) => post.href))
  const cmsPosts = await listDocuments('journal-posts', liveCmsFetchOptions({ limit: 1000, sort: '-publishedAt', depth: 2 }))
  const legacyPostBySlug = new Map(
    journalCards.flatMap((post) => {
      const routeSlug = post.href.replace(/^\//, '').replace(/\.html$/i, '')
      return [
        [routeSlug, post],
        [routeSlug.replace(/^blog-/, ''), post],
      ] as Array<[string, JournalPostCard]>
    }),
  )

  const cardVisual = (media: PayloadMedia | string | undefined, fallbackImg: string, width: number, height: number) => {
    const raw = (typeof media === 'object' && media ? imageDisplayUrl(media, 'mobile') : '') || imageDisplayUrl(media, 'card') || fallbackImg
    const cmsSrcset = typeof media === 'object' && media ? imageSrcset(media, ['mobile', 'card'], 'raster') || undefined : undefined
    const avifSrcset = typeof media === 'object' && media ? imageSrcset(media, ['mobile', 'card'], 'avif') || undefined : undefined
    if (!cmsSrcset && raw && !/^https?:\/\//i.test(raw) && !raw.startsWith('data:')) {
      const local = localResponsiveImage(raw, width, height)
      if (local.srcset) return { image: local.mobile, srcset: local.srcset, avifSrcset }
    }
    return { image: raw, srcset: cmsSrcset, avifSrcset }
  }

  const cmsCards = cmsPosts
    .map((post): EditableJournalPostCard | null => {
      const slug = post.slug || ''
      if (!slug) return null
      const fallback = legacyPostBySlug.get(slug)
      const legacyHref = typeof post.seo?.legacyUrl === 'string' && post.seo.legacyUrl ? `/${post.seo.legacyUrl}` : ''
      const href = legacyHref || routeForDoc('journal-posts', post)
      const dimensions = imageDimensions(post.coverImage, 'card')
      const width = dimensions.width || fallback?.width || 1920
      const height = dimensions.height || fallback?.height || 1280
      const vis = cardVisual(post.coverImage, fallback?.image || journalHero.image, width, height)
      return {
        avifSrcset: vis.avifSrcset,
        category: fallback?.category || categoryToFilter[String(post.category || '')] || 'prozess',
        dateTime: typeof post.publishedAt === 'string' ? post.publishedAt : fallback?.dateTime,
        height,
        href,
        image: vis.image,
        imageAlt: imageAlt(post.coverImage, post.title || fallback?.imageAlt || 'Journal-Bild'),
        readTime: typeof post.readingTime === 'number' ? `${post.readingTime} Min` : fallback?.readTime || '5 Min',
        source: post,
        srcset: vis.srcset,
        tags: Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string') : fallback?.tags || [],
        text: post.excerpt || fallback?.text || '',
        title: post.title || fallback?.title || 'Journal-Beitrag',
        width,
      }
    })
    .filter(Boolean) as EditableJournalPostCard[]

  const enhancedJournalCards = journalCards.map((post): EditableJournalPostCard => {
    const vis = cardVisual(undefined, post.image, post.width, post.height)
    return { ...post, image: vis.image, srcset: vis.srcset }
  })

  const cmsCardByHref = new Map(cmsCards.map((post) => [post.href, post]))
  return [
    ...enhancedJournalCards.map((post) => cmsCardByHref.get(post.href) || post),
    ...cmsCards.filter((post) => !publicHrefs.has(post.href)),
  ].sort((left, right) => (right.dateTime || '').localeCompare(left.dateTime || ''))
}

export type JournalIndexSlice = {
  posts: EditableJournalPostCard[]
  total: number
  totalPages: number
  page: number
}

export function sliceJournalPosts(posts: EditableJournalPostCard[], topic: JournalTopic | null, page: number): JournalIndexSlice {
  const filtered = topic ? posts.filter((post) => post.category === topic.filter) : posts
  const totalPages = Math.max(1, Math.ceil(filtered.length / JOURNAL_PAGE_SIZE))
  const start = (page - 1) * JOURNAL_PAGE_SIZE
  return { posts: filtered.slice(start, start + JOURNAL_PAGE_SIZE), total: filtered.length, totalPages, page }
}

export function countJournalTopics(posts: EditableJournalPostCard[]): Record<string, number> {
  return posts.reduce<Record<string, number>>((counts, post) => {
    counts[post.category] = (counts[post.category] || 0) + 1
    return counts
  }, {})
}
