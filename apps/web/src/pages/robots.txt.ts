import { configuredSiteUrl } from '../lib/payload'

export const prerender = true

export function GET() {
  const siteUrl = configuredSiteUrl()
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /preview/',
      'Disallow: /componentized/',
      'Disallow: /componentized-home/',
      'Disallow: /legacy-baseline/',
      'Disallow: /_server-islands/',
      'Disallow: /_actions/',
      '',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n'),
    {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    },
  )
}
