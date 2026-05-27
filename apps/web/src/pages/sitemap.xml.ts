import { sitemapIndexXml } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(sitemapIndexXml(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  })
}
