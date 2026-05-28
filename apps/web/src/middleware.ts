import { defineMiddleware } from 'astro:middleware'

import { isCmsAdoptedLegacyFile } from './lib/adoptedRoutes'
import { envFlag, envFlagNotFalse } from './lib/envFlags'
import { getLegacyFileForPath } from './lib/legacy'
import { localSeoLayoutFamilyForSlug, localSeoParentLegacyFiles } from './lib/localSeoLayoutFamilies'

const permanentRedirect = (location: string) =>
  new Response(null, {
    status: 308,
    headers: {
      location,
    },
  })

const legacyRedirects: Record<string, string> = {
  '/weitere-dienstleistungen.html': '/leistungen.html',
}
const enableComponentizedLegacyRewrite = envFlag('ASTRO_ENABLE_COMPONENTIZED_LEGACY')
const enableAdoptedRouteRewrite = envFlagNotFalse('ASTRO_ENABLE_ADOPTED_ROUTES')
const enableLocalSeoAdoptedRouteRewrite = envFlagNotFalse('ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES')

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname
  const noindexPrefixes = ['/preview/', '/componentized/', '/componentized-home/', '/legacy-baseline/']

  if (legacyRedirects[pathname]) {
    return permanentRedirect(`${legacyRedirects[pathname]}${context.url.search}`)
  }

  if (pathname === '/index.html' || pathname === '/index' || pathname === '/index/') {
    return permanentRedirect('/')
  }

  if (/^\/[^/.]+\/?$/i.test(pathname)) {
    const legacyFile = getLegacyFileForPath(pathname)

    if (legacyFile && legacyFile !== 'index.html') {
      return permanentRedirect(`/${legacyFile}${context.url.search}`)
    }
  }

  if (noindexPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const response = await next()
    response.headers.set('x-robots-tag', 'noindex, nofollow')
    return response
  }

  if (enableAdoptedRouteRewrite && /^\/[^/]+\.html$/i.test(pathname)) {
    const legacyFile = getLegacyFileForPath(pathname)

    if (legacyFile && isCmsAdoptedLegacyFile(legacyFile, { includeLocalSeo: enableLocalSeoAdoptedRouteRewrite })) {
      const slug = legacyFile.replace(/\.html$/i, '')
      const response = await context.rewrite(`/native/${slug}${context.url.search}`)
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

  if (enableComponentizedLegacyRewrite && /^\/[^/]+\.html$/i.test(pathname)) {
    const legacyFile = getLegacyFileForPath(pathname)

    if (legacyFile && legacyFile !== 'index.html') {
      const slug = legacyFile.replace(/\.html$/i, '')
      const response = await context.rewrite(`/componentized/${slug}${context.url.search}`)
      response.headers.set('x-legacy-render', 'componentized')
      return response
    }
  }

  return next()
})
