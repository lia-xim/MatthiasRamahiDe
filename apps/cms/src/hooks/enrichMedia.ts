import fs from 'node:fs/promises'
import path from 'node:path'

import type { CollectionAfterChangeHook } from 'payload'
import sharp from 'sharp'

const localMediaPath = (filename?: unknown) => {
  if (typeof filename !== 'string' || !filename) return ''
  return path.resolve(process.cwd(), 'media', filename)
}

const orientationFor = (width?: unknown, height?: unknown) => {
  if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) return undefined
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

export const enrichMediaAfterChange: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if ((context as Record<string, unknown> | undefined)?.skipMediaEnrichment) return doc
  if (process.env.S3_BUCKET) return doc

  const filename = (doc as Record<string, unknown>).filename
  const resolved = localMediaPath(filename)
  if (!resolved) return doc

  try {
    await fs.access(resolved)

    const update: Record<string, unknown> = {}
    const current = doc as Record<string, unknown>

    if (!current.orientation) {
      update.orientation = orientationFor(current.width, current.height)
    }

    if (!current.dominantColor) {
      const { data } = await sharp(resolved).resize(1, 1, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true })
      update.dominantColor = hexFromPixel(data)
    }

    if (!current.blurDataUrl) {
      const blur = await sharp(resolved).resize({ width: 24, withoutEnlargement: true }).webp({ quality: 35 }).toBuffer()
      update.blurDataUrl = `data:image/webp;base64,${blur.toString('base64')}`
    }

    const cleanUpdate = Object.fromEntries(Object.entries(update).filter(([, value]) => value))
    if (Object.keys(cleanUpdate).length === 0) return doc

    await req.payload.update({
      collection: 'media',
      id: doc.id,
      data: cleanUpdate,
      context: { skipMediaEnrichment: true },
      overrideAccess: true,
    })
  } catch {
    return doc
  }

  return doc
}
