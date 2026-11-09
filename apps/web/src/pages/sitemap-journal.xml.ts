import { getPublicJournalCards } from '../lib/journalIndexContent'
import { journalIndexPath, journalTopics } from '../lib/journalIndexRoutes'
import { toAbsoluteSiteUrl } from '../lib/payload'
import { sitemapEntries, sitemapXmlHeaders, urlsetXml, type SitemapEntry } from '../lib/sitemap'

export const prerender = false

// Themen-Uebersichten (/journal/thema/...) sind eigenstaendige Hubs mit
// eigenem Titel und Intro und werden deshalb gelistet. Reine Folgeseiten
// (/journal/seite/N) bleiben draussen: Google findet sie ueber die Paginierung.
function journalTopicEntries(): SitemapEntry[] {
  const cards = getPublicJournalCards()
  return journalTopics.flatMap((topic) => {
    const topicCards = cards.filter((card) => card.category === topic.filter)
    if (topicCards.length === 0) return []
    const newest = topicCards.map((card) => card.dateTime || '').sort().at(-1)
    return [{ loc: toAbsoluteSiteUrl(journalIndexPath(topic)), lastmod: newest ? newest.slice(0, 10) : undefined }]
  })
}

export async function GET() {
  const entries = [...(await sitemapEntries('journal')), ...journalTopicEntries()]
  return new Response(urlsetXml(entries), {
    headers: { ...sitemapXmlHeaders(), 'cache-control': 'no-store' },
  })
}
