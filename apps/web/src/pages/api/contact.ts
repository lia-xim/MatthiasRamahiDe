import type { APIContext } from 'astro'

import {
  parseContactPayload,
  retryQueuedContactRequests,
  sendOrQueueContactRequest,
  validateContactRequest,
} from '../../lib/contact/email'

export const prerender = false

const rateLimitWindowMs = 10 * 60 * 1000
const maxRequestsPerWindow = 8
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function rateLimitKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for') || ''
  return forwarded.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
}

function isRateLimited(request: Request) {
  const now = Date.now()
  const key = rateLimitKey(request)
  const current = rateBuckets.get(key)
  if (!current || current.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs })
    return false
  }

  current.count += 1
  return current.count > maxRequestsPerWindow
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
  if (isRateLimited(request)) {
    return json({ ok: false, error: 'Zu viele Anfragen. Bitte spaeter erneut versuchen.' }, 429)
  }

  const payload = await readJson(request).catch(() => null)
  const contactRequest = parseContactPayload(payload, request)
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
