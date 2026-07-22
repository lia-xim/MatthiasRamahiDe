import { sitemapIndexXml, sitemapXmlHeaders } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(await sitemapIndexXml(), {
    headers: sitemapXmlHeaders(),
  })
}
