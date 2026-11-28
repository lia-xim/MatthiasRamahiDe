import { sitemapEntries, sitemapXmlHeaders, urlsetXml } from '../lib/sitemap'

export const prerender = false

// Themen-Archive (/journal/thema/...) und Paginierung (/journal/seite/N) bleiben
// bewusst ausserhalb der Sitemap (noindex, follow), damit nur kanonische Artikel
// und der Journal-Hub indexiert werden.
export async function GET() {
  const entries = await sitemapEntries('journal')
  return new Response(urlsetXml(entries), {
    headers: sitemapXmlHeaders(),
  })
}
