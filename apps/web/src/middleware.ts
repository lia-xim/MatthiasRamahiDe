import { defineMiddleware } from 'astro:middleware'
import tinaMiddleware from '@tinacms/astro/middleware'

import {
  getLegacyPathRedirectTarget,
  getLegacyRedirectTarget,
  getNativeHtmlFileForPath,
  isCmsAdoptedLegacyFile,
} from './lib/adoptedRoutes'
import { envFlagNotFalse } from './lib/envFlags'
import { localSeoLayoutFamilyForSlug, localSeoParentLegacyFiles } from './lib/localSeoLayoutFamilies'
import { livePageCacheControl } from './lib/liveCache'

const permanentRedirect = (location: string) =>
  new Response(null, {
    status: 308,
    headers: {
      location,
    },
  })

const enableAdoptedRouteRewrite = envFlagNotFalse('ASTRO_ENABLE_ADOPTED_ROUTES')
const enableLocalSeoAdoptedRouteRewrite = envFlagNotFalse('ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES')

const tinaEditContext = (context: Parameters<typeof tinaMiddleware>[0]) => {
  if (context.isPrerendered) return context
  const referer = context.request.headers.get('referer') || ''
  const hasTinaEditCookie = context.request.headers.get('cookie')?.split(';').some((cookie) => {
    const [name, value] = cookie.trim().split('=')
    return name === '__tina_edit' && value === '1'
  })
  const isAdminPreviewRequest = (() => {
    try {
      const refererUrl = new URL(referer)
      return refererUrl.host === context.url.host && refererUrl.pathname.startsWith('/admin/')
    } catch {
      return false
    }
  })()

  if ((!isAdminPreviewRequest && !hasTinaEditCookie) || context.url.searchParams.get('tina-edit') === '1') {
    return context
  }

  const url = new URL(context.url)
  url.searchParams.set('tina-edit', '1')
  return {
    ...context,
    request: new Request(url, context.request),
    url,
  } as typeof context
}

const siteMiddleware = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname
  const noindexPrefixes = ['/preview/']

  if (pathname === '/admin' || pathname === '/admin/') {
    return permanentRedirect(`/admin/index.html${context.url.search}`)
  }

  const legacyPathRedirectTarget = getLegacyPathRedirectTarget(pathname)
  if (legacyPathRedirectTarget) {
    return permanentRedirect(`/${legacyPathRedirectTarget}${context.url.search}`)
  }

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
      response.headers.set('cache-control', livePageCacheControl())
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

export const onRequest = defineMiddleware((context, next) => {
  const contextForTina = tinaEditContext(context)
  return tinaMiddleware(contextForTina, async () => {
    const response = await siteMiddleware(contextForTina, next)
    return response || next()
  })
})
