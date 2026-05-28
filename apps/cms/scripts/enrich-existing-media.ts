import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'
import sharp from 'sharp'

import { printPayloadScriptError } from './lib/errors'

type MediaDoc = {
  id: string | number
  filename?: string | null
  width?: number | null
  height?: number | null
  orientation?: string | null
  dominantColor?: string | null
  blurDataUrl?: string | null
}

const hasValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && typeof value !== 'undefined'
}

const orientationFor = (width?: number | null, height?: number | null) => {
  if (!width || !height || width <= 0 || height <= 0) return undefined
  const ratio = width / height
  if (ratio > 2.05) return 'panorama'
  if (ratio > 1.12) return 'landscape'
  if (ratio < 0.88) return 'portrait'
  return 'square'
}

const hexFromPixel = (pixel: Buffer) =>
  `#${[pixel[0], pixel[1], pixel[2]]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`

const mediaPathFor = (filename?: string | null) => {
  if (!filename) return ''
  return path.resolve(process.cwd(), 'media', filename)
}

async function findAllMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  const docs: MediaDoc[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      draft: true,
      limit: 100,
      overrideAccess: true,
      page,
    })
    docs.push(...(result.docs as MediaDoc[]))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return docs
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const docs = await findAllMedia(cms)
  let enriched = 0
  let skippedMissingFiles = 0
  let unchanged = 0

  for (const doc of docs) {
    const update: Record<string, unknown> = {}
    const mediaPath = mediaPathFor(doc.filename)
    const fileExists = mediaPath && fs.existsSync(mediaPath)

    let width = doc.width
    let height = doc.height

    if ((!width || !height) && fileExists) {
      const metadata = await sharp(mediaPath).metadata()
      width = metadata.width || width
      height = metadata.height || height
    }

    if (!hasValue(doc.orientation)) {
      const orientation = orientationFor(width, height)
      if (orientation) update.orientation = orientation
    }

    if ((!hasValue(doc.dominantColor) || !hasValue(doc.blurDataUrl)) && !fileExists) {
      skippedMissingFiles += 1
    }

    if (!hasValue(doc.dominantColor) && fileExists) {
      const { data } = await sharp(mediaPath).resize(1, 1, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true })
      update.dominantColor = hexFromPixel(data)
    }

    if (!hasValue(doc.blurDataUrl) && fileExists) {
      const blur = await sharp(mediaPath).resize({ width: 24, withoutEnlargement: true }).webp({ quality: 35 }).toBuffer()
      update.blurDataUrl = `data:image/webp;base64,${blur.toString('base64')}`
    }

    if (Object.keys(update).length === 0) {
      unchanged += 1
      continue
    }

    await cms.update({
      collection: 'media',
      id: doc.id,
      data: update,
      context: { skipMediaEnrichment: true },
      overrideAccess: true,
    })
    enriched += 1
  }

  console.log('Existing media enrichment complete')
  console.log(`Media docs: ${docs.length}`)
  console.log(`Updated: ${enriched}`)
  console.log(`Unchanged: ${unchanged}`)
  console.log(`Missing local files: ${skippedMissingFiles}`)
} catch (error) {
  printPayloadScriptError(error, 'Existing media enrichment')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}
