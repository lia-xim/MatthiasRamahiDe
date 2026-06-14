import type { PayloadDoc } from './payload'

type AuthoredFaq = { answer?: string; question?: string }
type AuthoredAudienceCard = { number?: string; text?: string; title?: string }
type AuthoredEntry = {
  audienceCards?: AuthoredAudienceCard[]
  city?: string
  heroLine2?: string
  intro?: string
  legacyFile?: string
  localFaq?: AuthoredFaq[]
  seo?: { canonicalUrl?: string; description?: string; legacyUrl?: string; title?: string }
  service?: string
  slug?: string
  statement?: { body?: Array<string | { text?: string }>; emphasis?: string; headline?: string }
  targetKeyword?: string
  title?: string
}

const localSeoContent = import.meta.glob<AuthoredEntry>('../../content/local-seo-pages/*.json', {
  eager: true,
  import: 'default',
})
const servicePageContent = import.meta.glob<AuthoredEntry>('../../content/service-pages/*.json', {
  eager: true,
  import: 'default',
})

const slugFromModulePath = (modulePath: string) => modulePath.split('/').pop()?.replace(/\.json$/i, '') || ''
const legacyFileFor = (entry: AuthoredEntry, modulePath: string) =>
  entry.legacyFile || entry.seo?.legacyUrl || `${entry.slug || slugFromModulePath(modulePath)}.html`

const entries = [
  ...Object.entries(localSeoContent).map(([modulePath, entry]) => ({ ...entry, legacyFile: legacyFileFor(entry, modulePath) })),
  ...Object.entries(servicePageContent).map(([modulePath, entry]) => ({ ...entry, legacyFile: legacyFileFor(entry, modulePath) })),
]

const byLegacyFile = new Map(
  entries
    .filter((entry) => entry.legacyFile)
    .map((entry) => [String(entry.legacyFile).toLowerCase(), entry]),
)

const authoredStatement = (entry: AuthoredEntry) =>
  entry.statement && (entry.statement.headline || entry.statement.emphasis || entry.statement.body?.length)
    ? {
        headline: entry.statement.headline || '',
        emphasis: entry.statement.emphasis || '',
        body: (entry.statement.body || [])
          .map((item) => (typeof item === 'string' ? item : item.text || ''))
          .filter(Boolean)
          .map((text) => ({ text })),
      }
    : undefined

const authoredAudienceCards = (entry: AuthoredEntry) =>
  entry.audienceCards?.length
    ? entry.audienceCards
        .filter((card) => card.title || card.text)
        .map((card, index) => ({
          number: card.number || String(index + 1).padStart(2, '0'),
          title: card.title || '',
          text: card.text || '',
        }))
    : undefined

const authoredFaq = (entry: AuthoredEntry) =>
  entry.localFaq?.length
    ? entry.localFaq
        .filter((faq) => faq.question && faq.answer)
        .map((faq) => ({ question: faq.question || '', answer: faq.answer || '' }))
    : undefined

export function getAuthoredLocalSeoContent(legacyFile: string) {
  return byLegacyFile.get(legacyFile.toLowerCase()) || null
}

const hasStatement = (statement?: PayloadDoc['statement']) =>
  Boolean(statement && (statement.headline || statement.emphasis || statement.body?.length))

export function mergeAuthoredLocalSeoContent(legacyFile: string, doc?: PayloadDoc | null): PayloadDoc | null {
  const authored = getAuthoredLocalSeoContent(legacyFile)
  if (!authored) return doc || null

  // Tina wins: the CMS doc is the base, and authored JSON only fills fields
  // the CMS left empty.
  const targetKeyword = authored.targetKeyword || [authored.service, authored.city].filter(Boolean).join(' ')
  const next: PayloadDoc = {
    id: doc?.id || `authored-${authored.slug || legacyFile.replace(/\.html$/i, '')}`,
    ...(doc || {}),
  }

  if (!next.slug && authored.slug) next.slug = authored.slug
  if (!next.title && authored.title) next.title = authored.title
  if (!next.city && authored.city) next.city = authored.city
  if (!next.service && authored.service) next.service = authored.service
  if (!next.targetKeyword && targetKeyword) next.targetKeyword = targetKeyword

  if (!next.intro && authored.intro) next.intro = authored.intro
  if (!next.heroLine2 && authored.heroLine2) next.heroLine2 = authored.heroLine2

  if (!hasStatement(next.statement)) {
    const statement = authoredStatement(authored)
    if (statement) next.statement = statement
  }

  if (!next.audienceCards?.length) {
    const audienceCards = authoredAudienceCards(authored)
    if (audienceCards) next.audienceCards = audienceCards
  }

  // ServicePages store FAQ under `faq`, LocalSeoPages under `localFaq`. Treat
  // either as "the CMS already has FAQ" so authored JSON only fills a true gap.
  if (!next.localFaq?.length && !next.faq?.length) {
    const localFaq = authoredFaq(authored)
    if (localFaq) next.localFaq = localFaq
  }

  next.seo = { ...(next.seo || {}) }
  if (!next.seo.title && authored.seo?.title) next.seo.title = authored.seo.title
  if (!next.seo.description && authored.seo?.description) next.seo.description = authored.seo.description
  if (!next.seo.legacyUrl) next.seo.legacyUrl = legacyFile
  if (!next.seo.canonicalUrl) next.seo.canonicalUrl = `https://matthiasramahi.de/${legacyFile}`

  return next
}
