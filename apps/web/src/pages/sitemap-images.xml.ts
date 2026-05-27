import { imageSitemapEntries, urlsetXml } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(urlsetXml(await imageSitemapEntries(), { images: true }), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  })
}
