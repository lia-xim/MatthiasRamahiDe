import { readLegacyPage } from '../../lib/legacy'

export const prerender = false

const htmlHeaders = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
}

const normalizeLegacyAssetUrls = (html: string) => {
  return html
    .replace(/(?<![A-Za-z0-9:/])assets\//g, '/assets/')
    .replace(
      /((?:src|href|poster|content)=["'])(?!\/|https?:|data:)([^"']+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp))/gi,
      '$1/$2',
    )
}

export async function GET() {
  if (!import.meta.env.DEV && import.meta.env.ASTRO_ENABLE_LEGACY_BASELINE !== 'true') {
    return new Response('Not found', { status: 404 })
  }

  return new Response(normalizeLegacyAssetUrls(await readLegacyPage('index.html')), { headers: htmlHeaders })
}
