const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

function env(name: string, fallback = '') {
  return process.env[name] || (import.meta.env as Record<string, string | undefined> | undefined)?.[name] || fallback
}

const knownSpamEmails = ['rrsztjgs2296@hotmail.com', 'robertgulledge51652@aol.com']
const knownSpamPhones = ['+79990000000']

function entries(name: string) {
  return env(name).split(',').map((value) => value.trim()).filter(Boolean)
}

function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, '').replace(/^00/, '')
}

export function isBlockedContact(contact: string, phone = '') {
  const emails = [...knownSpamEmails, ...entries('CONTACT_BLOCKED_EMAILS')]
  const phones = [...knownSpamPhones, ...entries('CONTACT_BLOCKED_PHONES')]
  return emails.some((value) => value.toLowerCase() === contact.trim().toLowerCase()) ||
    Boolean(phone && phones.some((value) => normalizePhone(value) === normalizePhone(phone)))
}

function allowedHostnames() {
  const hosts = new Set(['matthiasramahi.de', 'www.matthiasramahi.de'])
  for (const origin of [env('ASTRO_PUBLIC_SITE_URL'), ...entries('CONTACT_ALLOWED_ORIGINS')]) {
    try { hosts.add(new URL(origin).hostname) } catch {}
  }
  if (import.meta.env?.DEV) {
    hosts.add('localhost')
    hosts.add('127.0.0.1')
  }
  return hosts
}

export async function verifyContactTurnstile(payload: unknown) {
  const secret = env('TURNSTILE_SECRET_KEY')
  const unavailable = { ok: false, status: 503, error: 'Die Sicherheitsprüfung ist gerade nicht verfügbar. Bitte später erneut versuchen oder direkt Kontakt aufnehmen.' } as const
  if (!secret) return unavailable

  const token = payload && typeof payload === 'object'
    ? (payload as Record<string, unknown>)['cf-turnstile-response']
    : undefined
  const rejected = { ok: false, status: 403, error: 'Bitte die Sicherheitsprüfung abschließen und die Anfrage erneut senden.' } as const
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) return rejected

  try {
    // Only the proof is sent to Cloudflare, never inquiry fields or contact details.
    const response = await fetch(siteverifyUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return unavailable
    const result = await response.json() as { success?: boolean; hostname?: string; action?: string; 'error-codes'?: string[] }
    if (result['error-codes']?.some((code) => ['internal-error', 'invalid-input-secret', 'missing-input-secret'].includes(code))) return unavailable
    if (result.success !== true || result.action !== 'contact' || !allowedHostnames().has(result.hostname || '')) return rejected
    return { ok: true, status: 200 } as const
  } catch {
    return unavailable
  }
}
