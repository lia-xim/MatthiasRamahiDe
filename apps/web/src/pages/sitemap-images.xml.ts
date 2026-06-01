import { imageSitemapEntries, sitemapXmlHeaders, urlsetXml } from '../lib/sitemap'

export const prerender = true

export async function GET() {
  return new Response(urlsetXml(await imageSitemapEntries(), { images: true }), {
    headers: sitemapXmlHeaders(),
  })
}
