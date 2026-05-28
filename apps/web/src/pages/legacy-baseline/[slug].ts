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

const isBaselineEnabled = () => import.meta.env.DEV || process.env.ASTRO_ENABLE_LEGACY_BASELINE === 'true'

const normalizeLegacyAssetUrls = (html: string) => {
  const normalized = html
    .replace(/(?<![A-Za-z0-9:/])assets\//g, '/assets/')
    .replace(
      /((?:src|href|poster|content)=["'])(?!\/|https?:|data:)([^"']+\.(?:avif|css|gif|jpe?g|js|json|mp4|png|svg|txt|webm|webp|xml))/gi,
      '$1/$2',
    )
    .replace(
      /url\((["']?)(?!\/|https?:|data:|#)([^"')]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp))\1\)/gi,
      'url($1/$2$1)',
    )

  return /<base\s/i.test(normalized) ? normalized : normalized.replace(/<head([^>]*)>/i, '<head$1>\n<base href="/">')
}

export async function GET({ params, props }: EndpointContext) {
  if (!isBaselineEnabled()) {
    return new Response('Not found', { status: 404 })
  }

  const slug = params.slug || 'index'
  const legacyFile = props.legacyFile || getLegacyFileForPath(slug === 'index' ? '/' : `/${slug}.html`)

  if (!legacyFile) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(normalizeLegacyAssetUrls(await readLegacyPage(legacyFile)), { headers: htmlHeaders })
}
