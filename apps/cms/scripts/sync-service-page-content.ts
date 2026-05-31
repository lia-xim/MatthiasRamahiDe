/**
 * Sync authored cluster-hub content (repo) -> Payload `service-pages` docs (the 6 family parents).
 * UPDATE-only, matched by slug. Run on the server like the local-seo sync:
 *   SYNC_DRY_RUN=true pnpm --filter cms tsx scripts/sync-service-page-content.ts
 *   pnpm --filter cms tsx scripts/sync-service-page-content.ts
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
const truncate = (v: string, max: number) => (typeof v === 'string' && v.length > max ? v.slice(0, max - 3).replace(/\s+\S*$/, '') + '...' : v)

type Entry = {
  slug: string
  heroLine2?: string
  statement?: { headline?: string; emphasis?: string; body?: string[] }
  audienceCards?: Array<{ number?: string; title: string; text: string }>
  intro?: string
  seo: { title: string; description: string }
}

const entries = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../content/service-page-content.json'), 'utf8')) as Entry[]
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

let updated = 0
const errors: string[] = []
for (const e of entries) {
  try {
    const res = await payload.find({ collection: 'service-pages', limit: 1, overrideAccess: true, depth: 0, where: { slug: { equals: e.slug } } })
    const doc = res.docs[0]
    if (!doc?.id) { errors.push(`${e.slug}: no service-pages doc`); continue }
    const data: Record<string, unknown> = {}
    if (e.intro) data.intro = e.intro
    if (e.heroLine2) data.heroLine2 = e.heroLine2
    if (e.statement && (e.statement.headline || e.statement.body?.length)) data.statement = { headline: e.statement.headline || '', emphasis: e.statement.emphasis || '', body: (e.statement.body || []).filter(Boolean).map((text) => ({ text })) }
    if (e.audienceCards?.length) data.audienceCards = e.audienceCards.map((c, i) => ({ number: c.number || String(i + 1).padStart(2, '0'), title: c.title, text: c.text }))
    data.seo = { ...((doc.seo as Record<string, unknown>) || {}), title: truncate(e.seo.title, 70), description: truncate(e.seo.description, 170) }
    if (DRY) { console.log(`UPDATE service-pages/${e.slug}`); updated++; continue }
    await payload.update({ id: doc.id, collection: 'service-pages', data: data as any, draft: false, overrideAccess: true })
    updated++
  } catch (err) {
    errors.push(`${e.slug}: ${(err as Error).message}`)
  }
}
console.log(`\n${DRY ? '[DRY RUN] ' : ''}service-page hub sync: updated=${updated} errors=${errors.length}`)
if (errors.length) { console.log(errors.join('\n')); process.exitCode = 1 }
process.exit(process.exitCode || 0)
