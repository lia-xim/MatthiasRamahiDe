const SITE_ORIGIN = 'https://matthiasramahi.de'

const normalizedSitePath = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed, SITE_ORIGIN)
    if (url.origin !== SITE_ORIGIN) return ''
    return url.pathname.replace(/^\/+|\/+$/g, '') || 'index.html'
  } catch {
    return trimmed.split(/[?#]/, 1)[0]?.replace(/^\/+|\/+$/g, '') || ''
  }
}

export const isCurrentPageHref = (href: string, currentPage: string): boolean =>
  normalizedSitePath(href) === normalizedSitePath(currentPage)
