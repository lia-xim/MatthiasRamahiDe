import type { APIContext } from 'astro'
import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'

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
  const tokenBuffer = Buffer.from(token)
  const secretBuffer = Buffer.from(secret)
  return tokenBuffer.length === secretBuffer.length && timingSafeEqual(tokenBuffer, secretBuffer)
}

export async function POST({ request }: APIContext) {
  if (!authorized(request)) return json({ ok: false, error: 'Unauthorized' }, 401)
  const result = await retryQueuedContactRequests(100)
  return json({ ok: true, ...result })
}
