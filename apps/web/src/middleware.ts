import { defineMiddleware } from 'astro:middleware'

import { getLegacyRedirectTarget, getNativeHtmlFileForPath, isCmsAdoptedLegacyFile } from './lib/adoptedRoutes'
import { envFlagNotFalse } from './lib/envFlags'
import { localSeoLayoutFamilyForSlug, localSeoParentLegacyFiles } from './lib/localSeoLayoutFamilies'

const permanentRedirect = (location: string) =>
  new Response(null, {
    status: 308,
    headers: {
      location,
    },
  })

const enableAdoptedRouteRewrite = envFlagNotFalse('ASTRO_ENABLE_ADOPTED_ROUTES')
const enableLocalSeoAdoptedRouteRewrite = envFlagNotFalse('ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES')
const adoptedRouteCacheControl = import.meta.env.DEV ? 'no-store' : 'public, max-age=300, stale-while-revalidate=86400'

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname
  const noindexPrefixes = ['/preview/']

  const nativeHtmlFile = getNativeHtmlFileForPath(pathname)
  const redirectTarget = getLegacyRedirectTarget(nativeHtmlFile)

  if (redirectTarget) {
    return permanentRedirect(`/${redirectTarget}${context.url.search}`)
  }

  if (pathname === '/index.html' || pathname === '/index' || pathname === '/index/') {
    return permanentRedirect('/')
  }

  if (/^\/[^/.]+\/?$/i.test(pathname)) {
    const legacyFile = getNativeHtmlFileForPath(pathname)

    if (legacyFile && legacyFile !== 'index.html') {
      return permanentRedirect(`/${getLegacyRedirectTarget(legacyFile) || legacyFile}${context.url.search}`)
    }
  }

  if (noindexPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const response = await next()
    response.headers.set('x-robots-tag', 'noindex, nofollow')
    return response
  }

  if (enableAdoptedRouteRewrite && /^\/[^/]+\.html$/i.test(pathname)) {
    const legacyFile = nativeHtmlFile

    if (legacyFile && isCmsAdoptedLegacyFile(legacyFile, { includeLocalSeo: enableLocalSeoAdoptedRouteRewrite })) {
      const slug = legacyFile.replace(/\.html$/i, '')
      const response = await context.rewrite(`/native/${slug}${context.url.search}`)
      response.headers.set('cache-control', adoptedRouteCacheControl)
      response.headers.set('x-migration-render', 'adopted-astro-payload')
      const family = localSeoLayoutFamilyForSlug(legacyFile)
      if (family) {
        response.headers.set('x-cms-render-source', 'local-seo-family-layout')
        response.headers.set('x-cms-layout-family', family)
        response.headers.set('x-cms-layout-parent', localSeoParentLegacyFiles[family])
      }
      return response
    }
  }

  return next()
})
