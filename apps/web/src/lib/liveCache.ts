const numberFromEnv = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export const livePageCacheControl = () => {
  const seconds = numberFromEnv(
    import.meta.env.ASTRO_LIVE_PAGE_CACHE_SECONDS ?? process.env.ASTRO_LIVE_PAGE_CACHE_SECONDS,
    0,
  )
  const staleSeconds = numberFromEnv(
    import.meta.env.ASTRO_LIVE_PAGE_STALE_SECONDS ?? process.env.ASTRO_LIVE_PAGE_STALE_SECONDS,
    300,
  )

  if (import.meta.env.DEV || seconds <= 0) return 'no-store'
  return `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`
}
