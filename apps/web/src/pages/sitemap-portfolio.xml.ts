import { sitemapEntries, sitemapXmlHeaders, urlsetXml } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(urlsetXml(await sitemapEntries('portfolio')), {
    headers: sitemapXmlHeaders(),
  })
}
