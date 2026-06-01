/**
 * Sync authored local-SEO content (repo) -> Payload `local-seo-pages` docs.
 *
 * Source of truth: apps/cms/content/local-seo-content.json (version-controlled).
 * Idempotent: matches an existing doc by seo.legacyUrl OR legacy.sourceFile and
 * UPDATES content fields; CREATES a published doc if none exists. Family PARENT
 * pages are skipped (they live in site-pages/service-pages, not local-seo-pages).
 *
 * Run on the server (where Payload has DB access), like the migrations:
 *   SYNC_DRY_RUN=true  pnpm --filter cms tsx scripts/sync-local-seo-content.ts   # preview
 *   pnpm --filter cms tsx scripts/sync-local-seo-content.ts                       # apply
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
const ONLY_FAMILY = process.env.SYNC_FAMILY // optional: limit to one family slug
const ONLY = (process.env.SYNC_ONLY || '').split(',').map((s) => s.trim()).filter(Boolean) // optional: limit to specific legacyFiles

type FaqEntry = { question: string; answer: string }
type AudienceCard = { number?: string; title: string; text: string }
type ContentEntry = {
  legacyFile: string
  slug: string
  family: string
  title: string
  city: string
  service: string
  targetKeyword?: string
  intro: string
  heroLine2?: string
  statement?: { headline?: string; emphasis?: string; body?: string[] }
  audienceCards?: AudienceCard[]
  localFaq?: FaqEntry[]
  seo: { title: string; description: string }
}

const PARENTS = new Set([
  'automobil-fotografie.html',
  'sportwagen-fotografie.html',
  'oldtimer-fotografie.html',
  'motorrad-fotografie.html',
  'portraitfotografie.html',
  'landschaftsfotografie.html',
])

const contentPath = path.resolve(import.meta.dirname, '../content/local-seo-content.json')
const entries = JSON.parse(fs.readFileSync(contentPath, 'utf8')) as ContentEntry[]

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

async function findDoc(legacyFile: string) {
  const res = await payload.find({
    collection: 'local-seo-pages',
    limit: 1,
    overrideAccess: true,
    depth: 0,
    where: { or: [{ 'seo.legacyUrl': { equals: legacyFile } }, { 'legacy.sourceFile': { equals: legacyFile } }] },
  })
  return res.docs[0] || null
}

// Reuse a sibling doc's heroImage for newly-created docs in the same service family.
const heroCache = new Map<string, number | null>()
async function heroForService(service: string): Promise<number | null> {
  if (heroCache.has(service)) return heroCache.get(service)!
  const res = await payload.find({
    collection: 'local-seo-pages',
    limit: 1,
    overrideAccess: true,
    depth: 0,
    where: { and: [{ service: { equals: service } }, { heroImage: { exists: true } }] },
  })
  const hero = (res.docs[0]?.heroImage as number | undefined) ?? null
  heroCache.set(service, hero)
  return hero
}

function truncate(value: string, maxLength: number) {
  if (typeof value !== 'string' || value.length <= maxLength) return value
  return value.slice(0, maxLength - 3).replace(/\s+\S*$/, '') + '...'
}

function contentData(e: ContentEntry, prevSeo: Record<string, unknown> = {}) {
  const data: Record<string, unknown> = { intro: e.intro }
  if (e.heroLine2) data.heroLine2 = e.heroLine2
  if (e.statement && (e.statement.headline || e.statement.body?.length)) {
    data.statement = {
      headline: e.statement.headline || '',
      emphasis: e.statement.emphasis || '',
      body: (e.statement.body || []).filter(Boolean).map((text) => ({ text })),
    }
  }
  if (e.audienceCards?.length) {
    data.audienceCards = e.audienceCards.map((c, i) => ({
      number: c.number || String(i + 1).padStart(2, '0'),
      title: c.title,
      text: c.text,
    }))
  }
  if (e.localFaq?.length) {
    data.localFaq = e.localFaq.filter((f) => f.question && f.answer).map((f) => ({ question: f.question, answer: f.answer }))
  }
  data.seo = { ...prevSeo, title: truncate(e.seo.title, 70), description: truncate(e.seo.description, 170), legacyUrl: e.legacyFile, canonicalUrl: `https://matthiasramahi.de/${e.legacyFile}` }
  return data
}

let created = 0
let updated = 0
let skipped = 0
const errors: string[] = []

for (const e of entries) {
  if (PARENTS.has(e.legacyFile)) { skipped++; continue }
  if (ONLY_FAMILY && e.family !== ONLY_FAMILY) { skipped++; continue }
  if (ONLY.length && !ONLY.includes(e.legacyFile)) { skipped++; continue }
  try {
    const existing = await findDoc(e.legacyFile)
    if (existing?.id) {
      const data = contentData(e, (existing.seo as Record<string, unknown>) || {})
      if (DRY) { console.log(`UPDATE ${e.legacyFile}`); updated++; continue }
      await payload.update({ id: existing.id, collection: 'local-seo-pages', data: data as any, draft: false, overrideAccess: true })
      updated++
    } else {
      const hero = await heroForService(e.service)
      const data: Record<string, unknown> = {
        title: e.title,
        slug: e.slug,
        city: e.city,
        service: e.service,
        priority: 'later',
        targetKeyword: e.targetKeyword || e.seo.title,
        ...(hero ? { heroImage: hero } : {}),
        ...contentData(e),
        legacy: { sourceFile: e.legacyFile, sourceUrl: `https://matthiasramahi.de/${e.legacyFile}`, migrationStatus: 'reviewed' },
        _status: 'published',
      }
      if (DRY) { console.log(`CREATE ${e.legacyFile} (hero=${hero})`); created++; continue }
      await payload.create({ collection: 'local-seo-pages', data: data as any, draft: false, overrideAccess: true })
      created++
    }
  } catch (err) {
    errors.push(`${e.legacyFile}: ${(err as Error).message}`)
  }
}

console.log(`\n${DRY ? '[DRY RUN] ' : ''}local-seo content sync: created=${created} updated=${updated} skipped(parents/filter)=${skipped} errors=${errors.length}`)
if (errors.length) { console.log('Errors:\n' + errors.join('\n')) ; process.exitCode = 1 }
process.exit(process.exitCode || 0)
