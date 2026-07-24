import type { APIContext } from 'astro'

import { configuredSiteUrl } from '../../lib/payload'
import { sitemapEntries } from '../../lib/sitemap'

export const prerender = false

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
// Der Key ist bewusst nicht geheim: IndexNow verlangt, dass er oeffentlich
// unter https://<host>/<key>.txt abrufbar ist (siehe apps/web/public/).
const FALLBACK_KEY = '6264b9277eabe63e38ded00c923c2480'
const DEFAULT_WINDOW_DAYS = 2
const MAX_URLS_PER_BATCH = 10000

const env = (name: string, fallback = '') => {
  const value = (import.meta.env as Record<string, unknown>)[name] ?? process.env[name] ?? fallback
  return typeof value === 'string' ? value.trim() : String(value).trim()
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store, private',
      'content-type': 'application/json; charset=utf-8',
    },
  })

// Vercel Cron sendet "Authorization: Bearer <CRON_SECRET>", sobald die
// Env-Variable CRON_SECRET im Projekt gesetzt ist. Ohne konfiguriertes
// Secret bleibt der Endpoint offen — er kann nur eigene URLs pingen und
// IndexNow selbst limitiert Wiederholungen, das Missbrauchsrisiko ist gering.
const isAuthorized = (request: Request, url: URL) => {
  const secret = env('CRON_SECRET')
  if (!secret) return true
  if (request.headers.get('authorization') === `Bearer ${secret}`) return true
  return url.searchParams.get('token') === secret
}

const chunk = <T,>(items: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size))
  return chunks
}

export async function GET({ request }: APIContext) {
  const url = new URL(request.url)
  if (!isAuthorized(request, url)) return json({ ok: false, error: 'Unauthorized.' }, 401)

  const mode = url.searchParams.get('mode') === 'all' ? 'all' : 'recent'
  const dryRun = url.searchParams.get('dry') === '1'
  const windowDays = Math.min(Math.max(Number(url.searchParams.get('days')) || DEFAULT_WINDOW_DAYS, 1), 30)

  const site = new URL(configuredSiteUrl())
  const key = env('INDEXNOW_KEY', FALLBACK_KEY)
  const entries = await sitemapEntries()

  // "recent" meldet nur Seiten, deren lastmod im Fenster liegt — der taegliche
  // Cron pingt damit genau die Inhalte, die sich seit dem letzten Lauf
  // geaendert haben, statt IndexNow mit der kompletten Sitemap zu fluten.
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const urls = entries
    .filter((entry) => mode === 'all' || (entry.lastmod && entry.lastmod >= cutoff))
    .map((entry) => entry.loc)

  if (urls.length === 0 || dryRun) {
    return json({ ok: true, mode, dryRun, cutoff: mode === 'recent' ? cutoff : null, totalUrls: entries.length, submitted: 0, urls: dryRun ? urls : undefined })
  }

  const results: Array<{ status: number; urls: number }> = []

  for (const urlList of chunk(urls, MAX_URLS_PER_BATCH)) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: site.hostname,
        key,
        keyLocation: `${site.origin}/${key}.txt`,
        urlList,
      }),
    })
    results.push({ status: response.status, urls: urlList.length })
  }

  const ok = results.every((result) => result.status === 200 || result.status === 202)
  return json({ ok, mode, cutoff: mode === 'recent' ? cutoff : null, totalUrls: entries.length, submitted: urls.length, results }, ok ? 200 : 502)
}
