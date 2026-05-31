import { sitemapEntries, sitemapXmlHeaders, urlsetXml } from '../lib/sitemap'

export const prerender = false

export async function GET() {
  return new Response(urlsetXml(await sitemapEntries('services')), {
    headers: sitemapXmlHeaders(),
  })
}
