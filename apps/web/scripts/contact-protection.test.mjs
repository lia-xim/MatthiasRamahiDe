import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(path.join(root, 'package.json'))
const astroRequire = createRequire(require.resolve('astro/package.json'))
const { createServer } = await import(pathToFileURL(astroRequire.resolve('vite')).href)
const server = await createServer({
  root, configFile: false, mode: 'test', envFile: false,
  server: { middlewareMode: true, watch: null },
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
})

const originalFetch = globalThis.fetch
const originalEnv = { ...process.env }
process.env.TURNSTILE_SECRET_KEY = 'test-private-secret'
process.env.RESEND_API_KEY = 'test-mail-key'
process.env.CONTACT_QUEUE_DIR = path.join(root, '..', '..', '.tmp', 'contact-protection-test-empty-queue')
let verification = { success: true, hostname: 'matthiasramahi.de', action: 'contact' }
let verificationStatus = 200
let verificationThrows = false
let calls = []
let requestNumber = 0

globalThis.fetch = async (url, options) => {
  calls.push({ url: String(url), body: JSON.parse(options.body) })
  if (String(url).endsWith('/siteverify')) {
    if (verificationThrows) throw new Error('Cloudflare unavailable')
    return Response.json(verification, { status: verificationStatus })
  }
  if (String(url) === 'https://api.resend.com/emails') return Response.json({ id: 'mock-delivery' })
  throw new Error(`Unexpected external request: ${url}`)
}

try {
  const { POST } = await server.ssrLoadModule('/src/pages/api/contact.ts')
  const { isBlockedContact } = await server.ssrLoadModule('/src/lib/contact/protection.ts')
  const base = { name: 'Legitimate inquiry', contact: 'inquiry@example.org', consent: true, 'cf-turnstile-response': 'fresh-token' }
  async function submit(overrides = {}, form = false, headers = {}) {
    calls = []
    const payload = { ...base, contact: `inquiry${++requestNumber}@example.org`, ...overrides }
    const response = await POST({ request: new Request('https://matthiasramahi.de/api/contact', {
      method: 'POST',
      headers: { 'content-type': form ? 'application/x-www-form-urlencoded' : 'application/json', 'x-forwarded-for': `192.0.2.${requestNumber}`, ...headers },
      body: form ? new URLSearchParams(payload).toString() : JSON.stringify(payload),
    }) })
    return { response, body: await response.json() }
  }
  async function rejected(overrides, status = 403, form = false) {
    const result = await submit(overrides, form)
    assert.equal(result.response.status, status)
    assert.equal(result.body.ok, false)
    assert.equal(calls.filter(call => call.url.includes('resend.com')).length, 0, 'rejected requests must never send any mail')
  }

  for (const contact of ['rrsztjgs2296@hotmail.com', 'ROBERTGULLEDGE51652@AOL.COM']) {
    await rejected({ contact })
    assert.equal(calls.length, 0, 'blocklist runs before Cloudflare and mail')
  }
  await rejected({ phone: '+7 999 000 00 00' })
  await rejected({ phone: '0079990000000' }, 403, true)
  assert.equal(isBlockedContact('other@hotmail.com', '+79991234567'), false)
  process.env.CONTACT_BLOCKED_EMAILS = 'additional@example.org'
  process.env.CONTACT_BLOCKED_PHONES = '+4912345678'
  await rejected({ contact: 'ADDITIONAL@example.org' })
  await rejected({ phone: '+49 (123) 45678' })
  await rejected({ 'cf-turnstile-response': undefined })
  await rejected({ 'cf-turnstile-response': ' ' }, 403, true)
  await rejected({ 'cf-turnstile-response': { forged: true } })
  await rejected({ 'cf-turnstile-response': 'x'.repeat(2049) })
  assert.equal(calls.length, 0)
  await rejected({ consent: false }, 400)
  verification = { success: false, 'error-codes': ['invalid-input-response'] }
  await rejected({})
  verification = { success: false, 'error-codes': ['timeout-or-duplicate'] }
  await rejected({})
  verification = { success: true, hostname: 'untrusted.example', action: 'contact' }
  await rejected({})
  verification = { success: true, hostname: 'matthiasramahi.de', action: 'login' }
  await rejected({})
  verification = { success: true }
  await rejected({})
  verificationStatus = 503
  await rejected({}, 503)
  verificationStatus = 200
  verificationThrows = true
  await rejected({}, 503)
  verificationThrows = false
  verification = { success: false, 'error-codes': ['invalid-input-secret'] }
  await rejected({}, 503)
  delete process.env.TURNSTILE_SECRET_KEY
  await rejected({}, 503)
  assert.equal(calls.length, 0)
  process.env.TURNSTILE_SECRET_KEY = 'test-private-secret'
  verification = { success: true, hostname: 'matthiasramahi.de', action: 'contact' }
  const result = await submit({ message: '' })
  assert.equal(result.response.status, 200)
  assert.equal(result.body.ok, true)
  assert.equal(calls.length, 3, 'one verification, admin mail and confirmation mail')
  assert.deepEqual(calls[0].body, { secret: 'test-private-secret', response: 'fresh-token' }, 'no inquiry or personal fields sent to Siteverify')
  assert.equal(calls[1].body.tags[1].value, 'new_inquiry')
  assert.equal(calls[2].body.tags[1].value, 'sender_confirmation')
  verification = { success: true, hostname: 'www.matthiasramahi.de', action: 'contact' }
  const native = await submit({}, true)
  assert.equal(native.response.status, 200)
  console.log('PASS: contact endpoint rejects blocked contacts, missing/forged/expired/reused tokens, wrong hostname/action and unavailable verification without sending mail; verified JSON and native-form inquiries send admin and confirmation emails (mocked providers).')
} finally {
  globalThis.fetch = originalFetch
  for (const name of Object.keys(process.env)) if (!(name in originalEnv)) delete process.env[name]
  Object.assign(process.env, originalEnv)
  await server.close()
}
