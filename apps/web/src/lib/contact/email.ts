import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { renderAdminEmail, renderConfirmationEmail } from '../../emails'

type ContactPayload = {
  name: string
  contact: string
  message: string
  project?: string
  date?: string
  use?: string
  phone?: string
  subject?: string
  source?: string
  pageUrl?: string
  pageTitle?: string
  intentLabel?: string
  lastCta?: string
  website?: string
}

export type ContactRequest = ContactPayload & {
  id: string
  createdAt: string
  ipHash: string
  userAgent: string
  status?: 'queued' | 'sent'
  lastError?: string
  attempts?: number
}

type SendResult = {
  ok: boolean
  id?: string
  queued?: boolean
  error?: string
}

const defaultAdminEmail = 'info@matthiasramahi.de'
const defaultFrom = 'Matthias Ramahi <anfrage@matthiasramahi.de>'
const maxFieldLength = 2_000
const maxMessageLength = 8_000
const resendEndpoint = 'https://api.resend.com/emails'

function env(name: string, fallback = '') {
  // Astro/Vite expose .env via import.meta.env in dev; Vercel exposes runtime
  // vars via process.env. Read both so the contact form works in both places.
  const value = (import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name]
  return value || fallback
}

function clean(value: unknown, limit = maxFieldLength) {
  return String(value || '')
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, limit)
}

function stripTags(value: string) {
  return value.replace(/[<>&"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[char] || char)
}

function firstEmail(value: string) {
  return value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ''
}

function queueDir() {
  return path.resolve(env('CONTACT_QUEUE_DIR', path.join(process.cwd(), '.contact-queue')))
}

function submissionPath(request: ContactRequest) {
  return path.join(queueDir(), `${request.createdAt.slice(0, 10)}-${request.id}.json`)
}

function adminRecipients() {
  return env('CONTACT_TO_EMAIL', defaultAdminEmail)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

function fromAddress() {
  return env('CONTACT_FROM_EMAIL', defaultFrom)
}

function alertRecipients() {
  return env('CONTACT_ALERT_EMAIL', env('CONTACT_TO_EMAIL', defaultAdminEmail))
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

function subjectFor(request: ContactRequest) {
  const rawSubject = clean(request.subject || 'Projektanfrage', 120)
  return `[Website] ${rawSubject}`
}

// Interne Queue-Warnung an den Betreiber. Bleibt als schlankes String-Template
// (kein Marken-Mailing) â€” die kundenseitigen Mails laufen ueber src/emails (react-email).
function renderAlertHtml(request: ContactRequest, error: string) {
  return `<!doctype html><html lang="de"><body style="margin:0;background:#fff7f5;color:#1b1b1b;font-family:Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:32px 18px;">
      <div style="border:1px solid #efc7bd;background:#fff;padding:28px;">
        <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:#b04432;font-weight:700;">Kontaktformular Warnung</p>
        <h1 style="margin:0 0 14px;font-size:28px;line-height:1.1;">Anfrage wurde zwischengespeichert</h1>
        <p style="margin:0 0 18px;line-height:1.5;">Resend konnte die Anfrage nicht sofort verschicken. Sie liegt in der lokalen Queue und wird beim naechsten Retry erneut versendet.</p>
        <pre style="white-space:pre-wrap;background:#f7f2ef;padding:16px;border:1px solid #eadbd5;">${stripTags(error)}</pre>
        <p style="margin:18px 0 0;">Referenz: <strong>${stripTags(request.id)}</strong></p>
      </div>
    </div>
  </body></html>`
}

async function resendSend(payload: Record<string, unknown>, idempotencyKey: string) {
  const apiKey = env('RESEND_API_KEY')
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  const response = await fetch(resendEndpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
      'idempotency-key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  })
  const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string; error?: string; name?: string }

  if (!response.ok) {
    const message = data.message || data.error || `Resend HTTP ${response.status}`
    throw new Error(message)
  }

  return data.id || ''
}

async function sendAdminEmail(request: ContactRequest, delayed = false) {
  const replyTo = firstEmail(request.contact)
  const { html, text } = await renderAdminEmail(request, delayed)
  const payload: Record<string, unknown> = {
    from: fromAddress(),
    to: adminRecipients(),
    subject: subjectFor(request),
    html,
    text,
    tags: [
      { name: 'source', value: 'contact_form' },
      { name: 'kind', value: delayed ? 'queued_retry' : 'new_inquiry' },
    ],
  }
  if (replyTo) payload.reply_to = replyTo

  return resendSend(payload, request.id)
}

async function sendFailureAlert(request: ContactRequest, error: string) {
  const payload = {
    from: fromAddress(),
    to: alertRecipients(),
    subject: `[Kontaktformular] Anfrage in Queue: ${request.id}`,
    html: renderAlertHtml(request, error),
    text: `Kontaktformular Warnung\n\nAnfrage wurde zwischengespeichert.\nReferenz: ${request.id}\nFehler: ${error}`,
    tags: [
      { name: 'source', value: 'contact_form' },
      { name: 'kind', value: 'failure_alert' },
    ],
  }

  return resendSend(payload, `${request.id}-alert`)
}

// Bestaetigung an den Absender. Nur moeglich, wenn der Kontaktweg eine E-Mail
// enthaelt (bei reiner Telefonnummer wird uebersprungen). reply_to zeigt auf
// das Admin-Postfach, damit Antworten direkt bei Matthias landen.
async function sendSenderConfirmation(request: ContactRequest) {
  const to = firstEmail(request.contact)
  if (!to) return ''
  const { html, text } = await renderConfirmationEmail(request)
  const payload: Record<string, unknown> = {
    from: fromAddress(),
    to: [to],
    reply_to: adminRecipients(),
    subject: 'Deine Anfrage ist angekommen - Matthias Ramahi',
    html,
    text,
    tags: [
      { name: 'source', value: 'contact_form' },
      { name: 'kind', value: 'sender_confirmation' },
    ],
  }

  return resendSend(payload, `${request.id}-confirm`)
}

export function parseContactPayload(input: unknown, request: Request): ContactRequest {
  const payload = (input || {}) as Record<string, unknown>
  const website = clean(payload.website, 240)
  const id = randomUUID()
  const forwarded = request.headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  const ipHash = createHash('sha256').update(`${ip}:${env('CONTACT_IP_HASH_SALT', 'matthias-ramahi')}`).digest('hex')

  return {
    id,
    createdAt: new Date().toISOString(),
    name: clean(payload.name, 160),
    contact: clean(payload.contact || payload.email, 240),
    message: clean(payload.message, maxMessageLength),
    project: clean(payload.project || payload.motiv, 240),
    date: clean(payload.date, 160),
    use: clean(payload.use, 160),
    phone: clean(payload.phone, 80),
    subject: clean(payload.subject, 160),
    source: clean(payload.source, 500),
    pageUrl: clean(payload.pageUrl, 500),
    pageTitle: clean(payload.pageTitle || payload.title, 240),
    intentLabel: clean(payload.intentLabel, 160),
    lastCta: clean(payload.lastCta, 240),
    website,
    ipHash,
    userAgent: clean(request.headers.get('user-agent'), 500),
    attempts: 0,
  }
}

export function validateContactRequest(request: ContactRequest) {
  if (request.website) return { ok: true, spam: true }
  // Nachricht ist optional: viele geben nur Name + Kontaktweg an und wollen
  // bewusst keinen Text schreiben. Pflicht sind daher nur Name und Kontakt.
  if (!request.name || !request.contact) {
    return { ok: false, error: 'Bitte Name und Kontaktweg (E-Mail oder Telefon) angeben.' }
  }
  return { ok: true, spam: false }
}

async function persistQueuedRequest(request: ContactRequest, error: string) {
  await fs.mkdir(queueDir(), { recursive: true })
  const queued: ContactRequest = {
    ...request,
    status: 'queued',
    attempts: (request.attempts || 0) + 1,
    lastError: error,
  }
  await fs.writeFile(submissionPath(queued), JSON.stringify(queued, null, 2), 'utf8')
}

async function removeQueuedRequest(filePath: string) {
  await fs.rm(filePath, { force: true })
}

export async function sendOrQueueContactRequest(request: ContactRequest): Promise<SendResult> {
  try {
    const id = await sendAdminEmail(request)
    // Eingangsbestaetigung an den Absender. Awaited, damit der Versand auch in
    // serverless Umgebungen abgeschlossen wird, aber nie die Anfrage scheitern laesst.
    try {
      await sendSenderConfirmation(request)
    } catch (confirmError) {
      const detail = confirmError instanceof Error ? confirmError.message : 'Unknown confirmation error'
      console.error('Contact confirmation failed', { id: request.id, error: detail })
    }
    return { ok: true, id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Resend error'
    await persistQueuedRequest(request, message)
    sendFailureAlert(request, message).catch((alertError) => {
      console.error('Contact failure alert failed', alertError)
    })
    console.error('Contact request queued', { id: request.id, error: message })
    return { ok: false, queued: true, error: message }
  }
}

export async function retryQueuedContactRequests(limit = 25) {
  const dir = queueDir()
  let files: string[] = []
  try {
    files = (await fs.readdir(dir)).filter((file) => file.endsWith('.json')).sort().slice(0, limit)
  } catch {
    return { attempted: 0, sent: 0, failed: 0 }
  }

  let sent = 0
  let failed = 0
  for (const file of files) {
    const filePath = path.join(dir, file)
    try {
      const request = JSON.parse(await fs.readFile(filePath, 'utf8')) as ContactRequest
      await sendAdminEmail(request, true)
      await removeQueuedRequest(filePath)
      sent += 1
    } catch (error) {
      failed += 1
      const message = error instanceof Error ? error.message : 'Unknown retry error'
      console.error('Queued contact retry failed', { file, error: message })
    }
  }

  return { attempted: files.length, sent, failed }
}
