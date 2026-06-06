/**
 * Fill missing visual defaults for the six canonical service pages.
 *
 * This is intentionally fill-only: existing CMS image selections stay untouched.
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
    const key = t.slice(0, i).trim()
    if (!process.env[key]) process.env[key] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

type Row = Record<string, any>

type VisualConfig = {
  statement?: string
  shootingStyles?: string[]
  portfolioTiles?: string[]
  audienceCards?: string[]
}

const configs: Record<string, VisualConfig> = {
  'automobil-fotografie': {
    statement: 'assets-portfolio-dsc3879-1920.webp',
    shootingStyles: [
      'assets-portfolio-dsc3879-1920.webp',
      '_DSC9301-Enhanced-NR.webp',
      'assets-portfolio-dsc3892-1920.webp',
      'assets-portfolio-dsc3982-1920.webp',
    ],
    portfolioTiles: [
      'assets-portfolio-dsc3879-1920.webp',
      '_DSC9301-Enhanced-NR.webp',
      'assets-portfolio-dsc3892-1920.webp',
      'assets-portfolio-dsc3982-1920.webp',
      'assets-portfolio-dsc2316-1920.webp',
      'assets-portfolio-dsc2310-1920.webp',
      'assets-portfolio-dsc3032-generase-1-1920.webp',
      'assets-portfolio-dsc6982-1920.webp',
      'assets-portfolio-dsc8032-1920.webp',
    ],
  },
  'oldtimer-fotografie': {
    statement: 'assets-photos-oldtimer-stage-1920.webp',
    shootingStyles: [
      'assets-photos-oldtimer-stage-1920.webp',
      '_DSC3892-2.webp',
      '_DSC2986-2.webp',
      '_DSC3032_genErase (1)-2.webp',
    ],
    portfolioTiles: [
      '_DSC0470-Enhanced-NR-2.webp',
      '_DSC3032_genErase (2)-2.webp',
      '_DSC3892-2.webp',
      '_DSC2986-2.webp',
      '_DSC3032_genErase (1)-2.webp',
      'assets-photos-oldtimer-stage-1920.webp',
    ],
  },
  'motorrad-fotografie': {
    statement: 'assets-photos-motorrad-ninja-road-1921.webp',
    shootingStyles: [
      'assets-photos-motorrad-ninja-road-1921.webp',
      'assets-portfolio-dsc3892-1920.webp',
      'assets-photos-motorrad-duke-1921.webp',
      'assets-photos-motorrad-ninja-road-1921.webp',
      'assets-portfolio-dsc2986-1921.webp',
      '_DSC9321-Enhanced-NR-2.webp',
    ],
    portfolioTiles: [
      'assets-photos-motorrad-1920.webp',
      'assets-portfolio-dsc3892-1920.webp',
      'assets-portfolio-dsc2986-1921.webp',
      '_DSC9321-Enhanced-NR-2.webp',
      '_DSC8032-2.webp',
      'assets-portfolio-dsc3878-1921.webp',
    ],
  },
  portraitfotografie: {
    statement: 'portrait-warm-1.webp',
    audienceCards: [
      'portrait-warm-1.webp',
      'assets-portraits-dsc3908-1921.webp',
      'assets-portraits-20250605-dsc04020-1921.webp',
      'assets-portraits-dsc2744-1921.webp',
      'assets-portraits-dsc2986-1921.webp',
    ],
    portfolioTiles: [
      'portrait-warm-1.webp',
      '_DSC0470-Enhanced-NR-2.webp',
      'assets-portraits-dsc3908-1921.webp',
      'assets-portraits-dsc3878-1921.webp',
      'assets-portraits-dsc2986-1921.webp',
      'assets-portraits-dsc2744-1921.webp',
      'assets-portraits-20250605-dsc04020-1921.webp',
      'assets-portraits-dsc2358-1921.webp',
      'assets-portraits-dsc2310-1921.webp',
    ],
  },
  landschaftsfotografie: {
    statement: 'Wettberwerb_Foto5_Wunder_der_Natur2-1.webp',
    audienceCards: [
      'Wettberwerb_Foto6_Wunder_der_Natur-1.webp',
      'Wettberwerb_Foto10_Wunder_der_natur-1.webp',
      '20250414-DSC00341-2.webp',
      '20250327-DSC01550-2.webp',
    ],
    portfolioTiles: [
      'Wettberwerb_Foto5_Wunder_der_Natur2-1.webp',
      'Wettberwerb_Foto6_Wunder_der_Natur-1.webp',
      'Wettberwerb_Foto10_Wunder_der_natur-1.webp',
      '20250605-DSC04020-2.webp',
      '20250605-DSC03978-2.webp',
      '20250605-DSC03816-2.webp',
      '20250605-DSC03793-2.webp',
      '20250605-DSC03756-2.webp',
      '20250414-DSC00341-2.webp',
    ],
  },
}

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

async function mediaId(filename: string) {
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  })
  const media = result.docs[0]
  if (!media?.id) throw new Error(`Media not found: ${filename}`)
  return media.id
}

function imageIsEmpty(row: Row | undefined) {
  return !row?.image
}

function fillArrayImages(rows: Row[] | undefined, ids: Array<number | string>) {
  const next = Array.isArray(rows) ? rows.map((row) => ({ ...row })) : []
  let touched = false

  ids.forEach((id, index) => {
    const row = next[index] || {}
    if (imageIsEmpty(row)) {
      row.image = id
      next[index] = row
      touched = true
    }
  })

  return touched ? next : undefined
}

for (const [slug, visualConfig] of Object.entries(configs)) {
  const result = await payload.find({
    collection: 'service-pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  const doc = result.docs[0] as Row | undefined
  if (!doc?.id) throw new Error(`Service page not found: ${slug}`)

  const data: Row = {}
  const filled: string[] = []

  if (visualConfig.statement && !doc.statement?.image) {
    data.statement = { ...(doc.statement || {}), image: await mediaId(visualConfig.statement) }
    filled.push('statement.image')
  }

  for (const key of ['shootingStyles', 'portfolioTiles', 'audienceCards'] as const) {
    const filenames = visualConfig[key]
    if (!filenames?.length) continue
    const ids = await Promise.all(filenames.map((filename) => mediaId(filename)))
    const nextRows = fillArrayImages(doc[key], ids)
    if (nextRows) {
      data[key] = nextRows
      filled.push(key)
    }
  }

  if (!filled.length) {
    console.log(`UNCHANGED service-pages/${slug}`)
    continue
  }

  await payload.update({
    id: doc.id,
    collection: 'service-pages',
    data,
    draft: false,
    overrideAccess: true,
  })
  console.log(`UPDATED service-pages/${slug} -> ${filled.join(', ')}`)
}

