import { sitemapEntries, urlsetXml } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(urlsetXml(await sitemapEntries('local-seo')), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  })
}
