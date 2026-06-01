/**
 * Seed authored cluster-hub content (repo) -> Payload `service-pages` docs (the 6 family parents).
 *
 * FILL-ONLY-EMPTY by default: a field is written to Payload only when the CMS
 * value is still empty. This seeds the defaults once (notably the missing
 * localFaq on the parents) and then NEVER clobbers anything you later edit in
 * the admin — re-running is a no-op for fields you've touched. Mirrors the
 * runtime merge (mergeAuthoredLocalSeoContent): Payload wins, JSON fills gaps.
 *
 * Run on the server like the local-seo sync:
 *   SYNC_DRY_RUN=true pnpm --filter cms tsx scripts/sync-service-page-content.ts   # preview
 *   pnpm --filter cms tsx scripts/sync-service-page-content.ts                      # apply (fill empty only)
 *   SYNC_FORCE=true   pnpm --filter cms tsx scripts/sync-service-page-content.ts    # overwrite even non-empty
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
  }
}
loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const DRY = process.env.SYNC_DRY_RUN === 'true'
const FORCE = process.env.SYNC_FORCE === 'true'
const truncate = (v: string, max: number) => (typeof v === 'string' && v.length > max ? v.slice(0, max - 3).replace(/\s+\S*$/, '') + '...' : v)

type Entry = {
  slug: string
  heroLine2?: string
  statement?: { headline?: string; emphasis?: string; body?: string[] }
  audienceCards?: Array<{ number?: string; title: string; text: string }>
  localFaq?: Array<{ question: string; answer: string }>
  intro?: string
  seo: { title: string; description: string }
}

const isEmpty = (value: unknown) =>
  value == null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)
const hasStatement = (s: any) => Boolean(s && (s.headline || s.emphasis || (Array.isArray(s.body) && s.body.length)))

const entries = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../content/service-page-content.json'), 'utf8')) as Entry[]
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

let updated = 0
let unchanged = 0
const errors: string[] = []
for (const e of entries) {
  try {
    const res = await payload.find({ collection: 'service-pages', limit: 1, overrideAccess: true, depth: 0, where: { slug: { equals: e.slug } } })
    const doc = res.docs[0] as Record<string, any> | undefined
    if (!doc?.id) { errors.push(`${e.slug}: no service-pages doc`); continue }

    const data: Record<string, unknown> = {}
    const filled: string[] = []
    const set = (key: string, currentlyEmpty: boolean, value: unknown) => {
      if (value == null || (Array.isArray(value) && value.length === 0)) return
      if (FORCE || currentlyEmpty) { data[key] = value; filled.push(key) }
    }

    if (e.intro) set('intro', isEmpty(doc.intro), e.intro)
    if (e.heroLine2) set('heroLine2', isEmpty(doc.heroLine2), e.heroLine2)
    if (e.statement && (e.statement.headline || e.statement.body?.length)) {
      set('statement', !hasStatement(doc.statement), { headline: e.statement.headline || '', emphasis: e.statement.emphasis || '', body: (e.statement.body || []).filter(Boolean).map((text) => ({ text })) })
    }
    if (e.audienceCards?.length) {
      set('audienceCards', isEmpty(doc.audienceCards), e.audienceCards.map((c, i) => ({ number: c.number || String(i + 1).padStart(2, '0'), title: c.title, text: c.text })))
    }
    // ServicePages expose the FAQ array as `faq` (LocalSeoPages use `localFaq`).
    // The authored JSON keeps everything under `localFaq`, so map across here.
    if (e.localFaq?.length) {
      set('faq', isEmpty(doc.faq), e.localFaq.filter((f) => f.question && f.answer).map((f) => ({ question: f.question, answer: f.answer })))
    }

    const prevSeo = (doc.seo as Record<string, unknown>) || {}
    const seo: Record<string, unknown> = { ...prevSeo }
    let seoTouched = false
    if (e.seo?.title && (FORCE || isEmpty(prevSeo.title))) { seo.title = truncate(e.seo.title, 70); seoTouched = true }
    if (e.seo?.description && (FORCE || isEmpty(prevSeo.description))) { seo.description = truncate(e.seo.description, 170); seoTouched = true }
    if (isEmpty(prevSeo.legacyUrl)) { seo.legacyUrl = `${e.slug}.html`; seoTouched = true }
    if (isEmpty(prevSeo.canonicalUrl)) { seo.canonicalUrl = `https://matthiasramahi.de/${e.slug}.html`; seoTouched = true }
    if (seoTouched) { data.seo = seo; filled.push('seo') }

    if (filled.length === 0) { unchanged++; continue }
    if (DRY) { console.log(`UPDATE service-pages/${e.slug} -> fills: ${filled.join(', ')}`); updated++; continue }
    await payload.update({ id: doc.id, collection: 'service-pages', data: data as any, draft: false, overrideAccess: true })
    console.log(`UPDATED service-pages/${e.slug} -> ${filled.join(', ')}`)
    updated++
  } catch (err) {
    errors.push(`${e.slug}: ${(err as Error).message}`)
  }
}
console.log(`\n${DRY ? '[DRY RUN] ' : ''}${FORCE ? '[FORCE] ' : ''}service-page hub sync: updated=${updated} unchanged=${unchanged} errors=${errors.length}`)
if (errors.length) { console.log(errors.join('\n')); process.exitCode = 1 }
process.exit(process.exitCode || 0)
