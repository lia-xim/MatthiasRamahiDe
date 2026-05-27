import type { APIContext } from 'astro'

import { retryQueuedContactRequests } from '../../lib/contact/email'

export const prerender = false

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function authorized(request: Request) {
  const secret = process.env.CONTACT_RETRY_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  return token === secret
}

export async function POST({ request }: APIContext) {
  if (!authorized(request)) return json({ ok: false, error: 'Unauthorized' }, 401)
  const result = await retryQueuedContactRequests(100)
  return json({ ok: true, ...result })
}
