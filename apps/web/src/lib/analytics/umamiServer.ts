/* =====================================================================
   Server-seitiges Umami-Tracking
   ---------------------------------------------------------------------
   Sendet ein Event direkt an die Umami-Collect-API (/api/send) — fuer
   verlaessliche Conversions, die NICHT vom Browser-JS/Beacon abhaengen
   (z. B. bestaetigter Mailversand im Kontakt-Endpoint).

   - Original-User-Agent + Client-IP (X-Forwarded-For) werden weitergereicht,
     damit Umami das Event demselben Besucher/derselben Sitzung zuordnet wie
     die clientseitigen Events.
   - Nur fuer die Produktionsdomain aktiv (analog zu data-domains im Tracker),
     damit lokale/Preview-Aufrufe die Statistik nicht verfaelschen.
   - Schlaegt nie auf die eigentliche Anfrage durch: Fehler/Timeout werden
     verschluckt; 2,5s-Cap.
   ===================================================================== */

function env(name: string, fallback = '') {
  const value = (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name]
  return value || fallback
}

const UMAMI_HOST = env('UMAMI_HOST', 'https://analytics.contextter.com').replace(/\/+$/, '')
const UMAMI_WEBSITE_ID = env('UMAMI_WEBSITE_ID', 'be66c314-29d1-4d96-8a3e-9c842d472210')
const TRACKED_HOSTS = env('UMAMI_TRACKED_HOSTS', 'matthiasramahi.de,www.matthiasramahi.de')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean)

type ServerEvent = {
  name: string
  url?: string
  hostname?: string
  referrer?: string
  data?: Record<string, string | number | boolean>
}

export async function trackServerEvent(request: Request, event: ServerEvent): Promise<void> {
  try {
    if (!UMAMI_HOST || !UMAMI_WEBSITE_ID) return

    const hostname = (event.hostname || '').toLowerCase()
    // Nur Produktionsdomain tracken — verhindert Dev-/Preview-Rauschen.
    if (TRACKED_HOSTS.length && hostname && !TRACKED_HOSTS.includes(hostname)) return
    if (!hostname && TRACKED_HOSTS.length) return // ohne bekannten Host nicht senden

    const userAgent = request.headers.get('user-agent') || 'MatthiasRamahi-Server/1.0'
    const forwardedFor =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)

    await fetch(`${UMAMI_HOST}/api/send`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'user-agent': userAgent,
        ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: UMAMI_WEBSITE_ID,
          hostname,
          url: event.url || '/',
          referrer: event.referrer || '',
          name: event.name.slice(0, 50),
          data: event.data || {},
          language: 'de',
        },
      }),
    }).finally(() => clearTimeout(timeout))
  } catch {
    // Analytics darf die Anfrage niemals zum Scheitern bringen.
  }
}
