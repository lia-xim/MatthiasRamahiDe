const numberFromEnv = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export const livePageCacheControl = (options: { sMaxAge?: number; staleWhileRevalidate?: number } = {}) => {
  const seconds = numberFromEnv(
    import.meta.env.ASTRO_LIVE_PAGE_CACHE_SECONDS ?? process.env.ASTRO_LIVE_PAGE_CACHE_SECONDS,
    options.sMaxAge ?? 3600,
  )
  const staleSeconds = numberFromEnv(
    import.meta.env.ASTRO_LIVE_PAGE_STALE_SECONDS ?? process.env.ASTRO_LIVE_PAGE_STALE_SECONDS,
    options.staleWhileRevalidate ?? 86400,
  )

  if (import.meta.env.DEV || seconds <= 0) return 'no-store'
  return `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`
}
