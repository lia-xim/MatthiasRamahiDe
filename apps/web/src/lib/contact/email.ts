import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

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
  return process.env[name] || fallback
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
  const suffix = request.project ? ` · ${request.project.slice(0, 64)}` : ''
  return `[Website] ${rawSubject}${suffix}`
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/Berlin',
    }).format(new Date(date))
  } catch {
    return date
  }
}

function detailRows(request: ContactRequest) {
  return [
    ['Name', request.name],
    ['Kontakt', request.contact],
    ['Telefon', request.phone || 'Noch offen'],
    ['Projekt / Motiv', request.project || 'Noch offen'],
    ['Zeitraum', request.date || 'Noch offen'],
    ['Nutzung', request.use || 'Noch offen'],
    ['Quelle', request.source || 'Unbekannt'],
    ['URL', request.pageUrl || 'Unbekannt'],
    ['Kontext', request.intentLabel || 'Unbekannt'],
    ['Letzter CTA', request.lastCta || 'Unbekannt'],
    ['Seite', request.pageTitle || 'Unbekannt'],
    ['Eingang', formatDate(request.createdAt)],
    ['Referenz', request.id],
  ]
}

function renderAdminHtml(request: ContactRequest, delayed = false) {
  const rows = detailRows(request)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;color:#6c706b;font:700 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #e8e5de;width:170px;">${stripTags(label)}</td>
          <td style="padding:12px 0;color:#111319;font:500 15px/1.45 Arial,sans-serif;border-bottom:1px solid #e8e5de;">${stripTags(value)}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="de">
  <body style="margin:0;background:#f4f1ea;padding:0;color:#111319;">
    <div style="display:none;max-height:0;overflow:hidden;">Neue Website-Anfrage von ${stripTags(request.name)}.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;">
      <tr>
        <td align="center" style="padding:36px 18px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#fff;border:1px solid #e4dfd4;">
            <tr>
              <td style="padding:32px 34px 18px;background:#111319;color:#f6f1e7;">
                <div style="font:700 11px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#b9afa0;">Matthias Ramahi · Website Anfrage</div>
                <h1 style="margin:18px 0 8px;font:800 34px/1.02 Arial,sans-serif;letter-spacing:-.03em;">${delayed ? 'Nachgelieferte Anfrage' : 'Neue Anfrage'}</h1>
                <p style="margin:0;color:#d7d0c4;font:400 15px/1.55 Arial,sans-serif;">${stripTags(request.subject || 'Projektanfrage')}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 34px;">
                <p style="margin:0 0 20px;color:#111319;font:500 17px/1.55 Arial,sans-serif;white-space:pre-wrap;">${stripTags(request.message)}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
                <div style="margin-top:28px;padding:18px 20px;background:#f4f1ea;border:1px solid #e4dfd4;color:#4a4d48;font:400 13px/1.5 Arial,sans-serif;">
                  Antworten am besten direkt an: <strong>${stripTags(request.contact)}</strong>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function renderPlainText(request: ContactRequest, delayed = false) {
  return [
    delayed ? 'Nachgelieferte Website-Anfrage' : 'Neue Website-Anfrage',
    '',
    request.message,
    '',
    ...detailRows(request).map(([label, value]) => `${label}: ${value}`),
  ].join('\n')
}

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
  const payload: Record<string, unknown> = {
    from: fromAddress(),
    to: adminRecipients(),
    subject: subjectFor(request),
    html: renderAdminHtml(request, delayed),
    text: renderPlainText(request, delayed),
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
  if (!request.name || !request.contact || !request.message) {
    return { ok: false, error: 'Bitte Name, Kontaktweg und Projektbeschreibung ausfuellen.' }
  }
  if (request.name.length < 2 || request.message.length < 12) {
    return { ok: false, error: 'Bitte die Anfrage etwas genauer beschreiben.' }
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
