import type { APIContext } from 'astro'
import { createHash } from 'node:crypto'

import { trackServerEvent } from '../../lib/analytics/umamiServer'
import {
  type ContactRequest,
  parseContactPayload,
  retryQueuedContactRequests,
  sendOrQueueContactRequest,
  validateContactRequest,
} from '../../lib/contact/email'

export const prerender = false

const rateLimitWindowMs = 10 * 60 * 1000
const maxRequestsPerWindow = 6
const contactRateLimitWindowMs = 60 * 60 * 1000
const maxContactRequestsPerWindow = 3
const dailyRateLimitWindowMs = 24 * 60 * 60 * 1000
const maxRequestsPerDay = 40
const maxPayloadBytes = 16 * 1024
const rateBuckets = new Map<string, { count: number; resetAt: number }>()
let lastBucketPrune = 0

function env(name: string, fallback = '') {
  const value = (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name]
  return value || fallback
}

function json(body: Record<string, unknown>, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  })
}

function rateLimitKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for') || ''
  return forwarded.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
}

function hashKey(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 32)
}

function pruneRateBuckets(now: number) {
  if (now - lastBucketPrune < rateLimitWindowMs) return
  lastBucketPrune = now
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt < now) rateBuckets.delete(key)
  }
}

function consumeRateBucket(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  pruneRateBuckets(now)
  const current = rateBuckets.get(key)
  if (!current || current.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false, retryAfter: 0 }
  }

  current.count += 1
  return {
    limited: current.count > limit,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  }
}

function checkRateLimit(request: Request, contactRequest?: ContactRequest, includeIp = true) {
  const ip = rateLimitKey(request)
  const checks = includeIp
    ? [
        consumeRateBucket(`ip:short:${ip}`, maxRequestsPerWindow, rateLimitWindowMs),
        consumeRateBucket(`ip:day:${ip}`, maxRequestsPerDay, dailyRateLimitWindowMs),
      ]
    : []

  if (contactRequest?.contact) {
    checks.push(
      consumeRateBucket(
        `contact:${hashKey(contactRequest.contact.toLowerCase())}`,
        maxContactRequestsPerWindow,
        contactRateLimitWindowMs,
      ),
    )
  }

  const limited = checks.find((check) => check.limited)
  return limited || { limited: false, retryAfter: 0 }
}

function allowedOrigins(request: Request) {
  const origins = new Set<string>()
  try {
    origins.add(new URL(request.url).origin)
  } catch {}

  for (const raw of [env('ASTRO_PUBLIC_SITE_URL'), env('CONTACT_ALLOWED_ORIGINS')]) {
    for (const entry of raw.split(',')) {
      const value = entry.trim()
      if (!value) continue
      try {
        origins.add(new URL(value).origin)
      } catch {}
    }
  }

  return origins
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return allowedOrigins(request).has(new URL(origin).origin)
  } catch {
    return false
  }
}

function hasOversizedPayload(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  return Number.isFinite(contentLength) && contentLength > maxPayloadBytes
}

function pageLocation(pageUrl?: string, source?: string) {
  try {
    const url = new URL(String(pageUrl))
    return { hostname: url.hostname, url: url.pathname + url.search }
  } catch {
    return { hostname: '', url: source || '/' }
  }
}

async function readJson(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return request.json()
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    return Object.fromEntries(formData.entries())
  }
  return {}
}

export async function POST({ request }: APIContext) {
  if (!hasTrustedOrigin(request)) {
    return json({ ok: false, error: 'Die Anfrage wurde aus Sicherheitsgruenden abgelehnt.' }, 403)
  }

  if (hasOversizedPayload(request)) {
    return json({ ok: false, error: 'Die Anfrage ist zu gross. Bitte kuerzer formulieren.' }, 413)
  }

  const preflightLimit = checkRateLimit(request)
  if (preflightLimit.limited) {
    return json(
      { ok: false, error: 'Zu viele Anfragen. Bitte spaeter erneut versuchen.' },
      429,
      { 'retry-after': String(preflightLimit.retryAfter) },
    )
  }

  const payload = await readJson(request).catch(() => null)
  const contactRequest = parseContactPayload(payload, request)
  const contactLimit = checkRateLimit(request, contactRequest, false)
  if (contactLimit.limited) {
    return json(
      { ok: false, error: 'Zu viele Anfragen. Bitte spaeter erneut versuchen.' },
      429,
      { 'retry-after': String(contactLimit.retryAfter) },
    )
  }

  const validation = validateContactRequest(contactRequest)

  if (!validation.ok) {
    return json({ ok: false, error: validation.error }, 400)
  }

  if (validation.spam) {
    return json({ ok: true, id: contactRequest.id, spam: true })
  }

  const result = await sendOrQueueContactRequest(contactRequest)
  retryQueuedContactRequests(5).catch((error) => {
    console.error('Contact queue opportunistic retry failed', error)
  })

  if (result.ok || result.queued) {
    const loc = pageLocation(contactRequest.pageUrl, contactRequest.source)
    await trackServerEvent(request, {
      name: 'server-conversion',
      hostname: loc.hostname,
      url: loc.url,
      referrer: contactRequest.lastCta || '',
      data: {
        transport: result.ok ? 'resend' : 'queued',
        queued: Boolean(result.queued),
        subject: contactRequest.subject || 'Projektanfrage',
        intent: contactRequest.intentLabel || '',
        lastCta: contactRequest.lastCta || '',
        hasMessage: Boolean(contactRequest.message),
      },
    })
  }

  if (result.ok) {
    return json({
      ok: true,
      id: contactRequest.id,
      resendId: result.id,
      message: 'Danke. Die Anfrage wurde versendet.',
    })
  }

  if (result.queued) {
    return json(
      {
        ok: true,
        queued: true,
        id: contactRequest.id,
        message: 'Danke. Die Anfrage wurde gesichert und wird automatisch erneut zugestellt.',
      },
      202,
    )
  }

  return json({ ok: false, error: 'Die Anfrage konnte nicht versendet werden.' }, 502)
}
