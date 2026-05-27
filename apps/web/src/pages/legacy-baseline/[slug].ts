import { getLegacyFileForPath, readLegacyPage } from '../../lib/legacy'

export const prerender = false

type EndpointContext = {
  params: { slug?: string }
  props: { legacyFile?: string }
}

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

export async function GET({ params, props }: EndpointContext) {
  if (!import.meta.env.DEV && import.meta.env.ASTRO_ENABLE_LEGACY_BASELINE !== 'true') {
    return new Response('Not found', { status: 404 })
  }

  const slug = params.slug || 'index'
  const legacyFile = props.legacyFile || getLegacyFileForPath(slug === 'index' ? '/' : `/${slug}.html`)

  if (!legacyFile) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(normalizeLegacyAssetUrls(await readLegacyPage(legacyFile)), { headers: htmlHeaders })
}
