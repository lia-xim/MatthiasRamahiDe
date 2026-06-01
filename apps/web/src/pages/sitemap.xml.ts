import { sitemapIndexXml, sitemapXmlHeaders } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(sitemapIndexXml(), {
    headers: sitemapXmlHeaders(),
  })
}
