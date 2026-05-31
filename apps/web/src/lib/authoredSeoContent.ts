import localSeoContent from '../../../cms/content/local-seo-content.json'
import servicePageContent from '../../../cms/content/service-page-content.json'

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
  seo?: { description?: string; title?: string }
  service?: string
  slug?: string
  statement?: { body?: string[]; emphasis?: string; headline?: string }
  targetKeyword?: string
  title?: string
}

const entries = [
  ...(localSeoContent as AuthoredEntry[]),
  ...(servicePageContent as AuthoredEntry[]).map((entry) => ({ ...entry, legacyFile: `${entry.slug}.html` })),
]

const byLegacyFile = new Map(
  entries
    .filter((entry) => entry.legacyFile)
    .map((entry) => [String(entry.legacyFile).toLowerCase(), entry]),
)

const normalize = (value?: string) =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ue/g, 'u')
    .replace(/oe/g, 'o')
    .replace(/ae/g, 'a')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const includesTerm = (value: string | undefined, term?: string) => {
  if (!term) return true
  return normalize(value).includes(normalize(term))
}

const shouldUseAuthored = (current: string | undefined, authored: string | undefined, term?: string, minLength = 80) => {
  if (!authored) return false
  if (!current) return true
  if (current.length < minLength && authored.length > current.length) return true
  return Boolean(term && includesTerm(authored, term) && !includesTerm(current, term))
}

const authoredStatement = (entry: AuthoredEntry) =>
  entry.statement && (entry.statement.headline || entry.statement.emphasis || entry.statement.body?.length)
    ? {
        headline: entry.statement.headline || '',
        emphasis: entry.statement.emphasis || '',
        body: (entry.statement.body || []).filter(Boolean).map((text) => ({ text })),
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

export function mergeAuthoredLocalSeoContent(legacyFile: string, doc?: PayloadDoc | null): PayloadDoc | null {
  const authored = getAuthoredLocalSeoContent(legacyFile)
  if (!authored) return doc || null

  const city = authored.city || ''
  const targetKeyword = authored.targetKeyword || [authored.service, authored.city].filter(Boolean).join(' ')
  const next: PayloadDoc = {
    id: doc?.id || `authored-${authored.slug || legacyFile.replace(/\.html$/i, '')}`,
    ...(doc || {}),
  }

  if (!next.slug && authored.slug) next.slug = authored.slug
  if (!includesTerm(next.title, city) && authored.title) next.title = authored.title
  if (authored.city) next.city = authored.city
  if (authored.service) next.service = authored.service
  if (targetKeyword) next.targetKeyword = targetKeyword

  if (shouldUseAuthored(next.intro, authored.intro, city, 160)) next.intro = authored.intro
  if (shouldUseAuthored(next.heroLine2, authored.heroLine2, city, 20)) next.heroLine2 = authored.heroLine2

  const currentStatementText = next.statement?.body?.map((entry) => entry.text || '').join(' ') || ''
  const statement = authoredStatement(authored)
  if (statement && (!next.statement?.body?.length || shouldUseAuthored(currentStatementText, statement.body.map((entry) => entry.text).join(' '), city, 180))) {
    next.statement = statement
  }

  const currentAudienceText = next.audienceCards?.map((card) => `${card.title || ''} ${card.text || ''}`).join(' ') || ''
  const audienceCards = authoredAudienceCards(authored)
  if (audienceCards && ((next.audienceCards?.length || 0) < 4 || shouldUseAuthored(currentAudienceText, audienceCards.map((card) => `${card.title} ${card.text}`).join(' '), city, 220))) {
    next.audienceCards = audienceCards
  }

  const localFaq = authoredFaq(authored)
  if (localFaq && (next.localFaq?.filter((faq) => faq.question && faq.answer).length || 0) < 4) next.localFaq = localFaq

  next.seo = { ...(next.seo || {}) }
  if (authored.seo?.title && !includesTerm(next.seo.title, city)) next.seo.title = authored.seo.title
  if (shouldUseAuthored(next.seo.description, authored.seo?.description, city, 120)) next.seo.description = authored.seo?.description
  if (!next.seo.legacyUrl) next.seo.legacyUrl = legacyFile
  if (!next.seo.canonicalUrl) next.seo.canonicalUrl = `https://matthiasramahi.de/${legacyFile}`

  return next
}
