type JournalSourceLink = {
  description?: string
  href?: string
  label?: string
}

export type JournalArticleImage = {
  caption?: string
  cropIntent?: string
  image?: string
}

export type JournalArticleBlock =
  | { _template: 'textBlock'; body?: string; eyebrow?: string; headline?: string; style?: 'section' | 'bridge' }
  | { _template: 'imageSequence'; headline?: string; items?: JournalArticleImage[]; layout?: string }
  | { _template: 'quoteBlock'; attribution?: string; quote?: string }
  | { _template: 'faqBlock'; headline?: string; items?: Array<{ answer?: string; question?: string }> }
  | { _template: 'linkList'; headline?: string; links?: JournalSourceLink[] }
  | { _template: 'ctaBlock'; buttonLabel?: string; emailSubject?: string; headline?: string; text?: string }

type JournalSourceDocument = {
  blocks?: JournalArticleBlock[]
  category?: string
  coverAlt?: string
  coverImage?: string
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  relatedPages?: JournalSourceLink[]
  seo?: { description?: string; legacyUrl?: string; title?: string }
  slug?: string
  status?: string
  tags?: string[]
  title?: string
}

const journalModules = import.meta.glob('../../content/journal-posts/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, JournalSourceDocument>

export type JournalCluster =
  | 'automotive'
  | 'sports-car'
  | 'classic-car'
  | 'motorcycle'
  | 'portrait'
  | 'landscape-print'
  | 'process'

export type JournalArticleLink = {
  description?: string
  href: string
  label: string
}

export type JournalArticleCard = JournalArticleLink & {
  category: string
  image: string
  imageAlt: string
  minutes: string
  text: string
  title: string
}

export type JournalArticleSection = {
  id: string
  kicker?: string
  title: string
  paragraphs?: string[]
}

export type JournalArticle = {
  blocks: JournalArticleBlock[]
  category: string
  categoryHref?: string
  cluster: JournalCluster
  commercialHref: string
  dateLabel: string
  dateTime: string
  description: string
  faq?: Array<{ answer: string; question: string }>
  heroImage: string
  heroImageAlt: string
  legacyFile: string
  links: JournalArticleLink[]
  minutes: string
  sections: JournalArticleSection[]
  seoDescription: string
  seoTitle?: string
  title: string
  tags: string[]
}

export const journalClusterProfiles: Record<
  JournalCluster,
  { filter: string; href: string; label: string; tags: string[] }
> = {
  automotive: {
    filter: 'automotive',
    href: 'automobil-fotografie.html',
    label: 'Automotive',
    tags: ['Automotive', 'Licht', 'Bildserie'],
  },
  'sports-car': {
    filter: 'sportwagen',
    href: 'sportwagen-fotografie.html',
    label: 'Sportwagen',
    tags: ['Sportwagen', 'Licht', 'Bildserie'],
  },
  'classic-car': {
    filter: 'oldtimer',
    href: 'oldtimer-fotografie.html',
    label: 'Oldtimer',
    tags: ['Oldtimer', 'Verkauf', 'Bildserie'],
  },
  motorcycle: {
    filter: 'motorrad',
    href: 'motorrad-fotografie.html',
    label: 'Motorrad',
    tags: ['Motorrad', 'Sicherheit', 'Bildserie'],
  },
  portrait: {
    filter: 'portrait',
    href: 'portraitfotografie.html',
    label: 'Portrait',
    tags: ['Portrait', 'Licht', 'Bildserie'],
  },
  'landscape-print': {
    filter: 'print',
    href: 'landschaftsfotografie.html',
    label: 'Landschaft & Print',
    tags: ['Fine Art', 'Print', 'Kuration'],
  },
  process: {
    filter: 'prozess',
    href: 'fotografie.html',
    label: 'Prozess',
    tags: ['Briefing', 'Kuration', 'Bildserie'],
  },
}

const clusterValues = new Set<JournalCluster>(Object.keys(journalClusterProfiles) as JournalCluster[])

function clusterForDocument(document: JournalSourceDocument): JournalCluster {
  if (document.category && clusterValues.has(document.category as JournalCluster)) {
    return document.category as JournalCluster
  }

  const haystack = `${document.category || ''} ${document.slug || ''}`.toLowerCase()
  if (haystack.includes('sportwagen')) return 'sports-car'
  if (haystack.includes('oldtimer') || haystack.includes('classic')) return 'classic-car'
  if (haystack.includes('motorrad') || haystack.includes('bike')) return 'motorcycle'
  if (haystack.includes('portrait') || haystack.includes('musiker')) return 'portrait'
  if (haystack.includes('druck') || haystack.includes('print') || haystack.includes('landschaft')) return 'landscape-print'
  if (haystack.includes('prozess') || haystack.includes('location') || haystack.includes('kurati')) return 'process'
  return 'automotive'
}

const normalizeHref = (href?: string) => (href || '').replace(/^\//, '')

function usefulLinks(document: JournalSourceDocument, profile: (typeof journalClusterProfiles)[JournalCluster]) {
  const links: JournalArticleLink[] = (document.relatedPages || [])
    .filter((link) => Boolean(link.href && link.label))
    .map((link) => ({ description: link.description, href: normalizeHref(link.href), label: link.label || '' }))
    .filter((link) => !['', 'index.html', 'blog.html', 'ueber-mich.html'].includes(link.href))

  if (!links.some((link) => link.href === profile.href)) {
    links.unshift({ href: profile.href, label: `${profile.label}-Fotografie` })
  }

  return links.slice(0, 5)
}

function slugify(value: string, fallback: string) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || fallback
}

function dateLabel(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function articleFromDocument(document: JournalSourceDocument, modulePath: string): JournalArticle | null {
  if (document.status === 'draft' || !document.slug || !document.title || !document.coverImage) return null

  const cluster = clusterForDocument(document)
  const profile = journalClusterProfiles[cluster]
  const blocks = document.blocks || []
  const sections = blocks.flatMap((block, index): JournalArticleSection[] => {
    if (block._template !== 'textBlock' || !block.headline || !block.body) return []
    return [{
      id: slugify(block.headline, `abschnitt-${index + 1}`),
      kicker: block.eyebrow,
      title: block.headline,
      paragraphs: block.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    }]
  })
  const faqBlock = blocks.find((block) => block._template === 'faqBlock')
  const faq = faqBlock?._template === 'faqBlock'
    ? (faqBlock.items || [])
        .filter((item) => Boolean(item.answer && item.question))
        .map((item) => ({ answer: item.answer || '', question: item.question || '' }))
    : undefined
  const filename = modulePath.split('/').pop()?.replace(/\.json$/i, '') || document.slug
  const legacyFile = normalizeHref(document.seo?.legacyUrl) || `blog-${filename}.html`

  return {
    blocks,
    category: profile.label,
    categoryHref: profile.href,
    cluster,
    commercialHref: profile.href,
    dateLabel: dateLabel(document.publishedAt),
    dateTime: (document.publishedAt || '').slice(0, 10),
    description: document.excerpt || '',
    faq,
    heroImage: document.coverImage.replace(/^\//, ''),
    heroImageAlt: document.coverAlt || `${document.title} – Fotografie von Matthias Ramahi`,
    legacyFile,
    links: usefulLinks(document, profile),
    minutes: `${Math.max(1, Number(document.readingTime) || 5)} Min`,
    sections,
    seoDescription: document.seo?.description || document.excerpt || '',
    seoTitle: document.seo?.title,
    tags: Array.from(new Set([...(document.tags || []), ...profile.tags])).slice(0, 6),
    title: document.title,
  }
}

export const journalArticles: JournalArticle[] = Object.entries(journalModules)
  .map(([modulePath, document]) => articleFromDocument(document, modulePath))
  .filter((article): article is JournalArticle => Boolean(article))
  .sort((left, right) => right.dateTime.localeCompare(left.dateTime))

export function journalClusterFor(article: JournalArticle): JournalCluster {
  return article.cluster
}

export function getRelatedJournalArticles(article: JournalArticle, limit = 3): JournalArticle[] {
  const currentTags = new Set(article.tags.map((tag) => tag.toLocaleLowerCase('de-DE')))
  const existingTargets = new Set(article.links.map((link) => normalizeHref(link.href)))

  return journalArticles
    .filter((candidate) => candidate.legacyFile !== article.legacyFile && !existingTargets.has(candidate.legacyFile))
    .map((candidate) => {
      const tagOverlap = candidate.tags.filter((tag) => currentTags.has(tag.toLocaleLowerCase('de-DE'))).length
      const sameCommercialPath = candidate.commercialHref === article.commercialHref ? 1 : 0
      const score = (candidate.cluster === article.cluster ? 100 : 0) + tagOverlap * 15 + sameCommercialPath * 20
      return { candidate, score }
    })
    .sort((left, right) => right.score - left.score || right.candidate.dateTime.localeCompare(left.candidate.dateTime))
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export const journalArticleByLegacyFile = Object.fromEntries(
  journalArticles.map((article) => [article.legacyFile, article]),
) as Record<string, JournalArticle>
