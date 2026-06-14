import tinaMediaManifestJson from '../data/tinaMediaManifest.json'
import type { CmsMedia, CmsMediaSize } from './cmsContentContract'

type TinaManifestItem = {
  id: string
  title?: string | null
  alt?: string | null
  caption?: string | null
  filename?: string | null
  url?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filesize?: number | null
  focalX?: number | null
  focalY?: number | null
  dominantColor?: string | null
  blurDataUrl?: string | null
  updatedAt?: string | null
  sizes?: Record<string, CmsMediaSize>
}

type TinaMediaManifest = {
  indexes?: {
    byFilename?: Record<string, number>
    byId?: Record<string, number>
  }
  items?: TinaManifestItem[]
}

const manifest = tinaMediaManifestJson as TinaMediaManifest
const items = manifest.items || []

function itemToMedia(item?: TinaManifestItem): CmsMedia | null {
  if (!item) return null

  return {
    id: item.id,
    filename: item.filename || undefined,
    title: item.title || undefined,
    alt: item.alt || undefined,
    caption: item.caption || undefined,
    url: item.url || undefined,
    width: item.width || undefined,
    height: item.height || undefined,
    mimeType: item.mimeType || undefined,
    filesize: item.filesize || undefined,
    focalX: item.focalX || undefined,
    focalY: item.focalY || undefined,
    dominantColor: item.dominantColor || undefined,
    blurDataUrl: item.blurDataUrl || undefined,
    updatedAt: item.updatedAt || undefined,
    sizes: item.sizes || undefined,
  }
}

function indexLookup(index: Record<string, number> | undefined, key: string) {
  const position = index?.[key]
  return typeof position === 'number' ? items[position] : undefined
}

function withoutQuery(value: string) {
  return value.split('#')[0].split('?')[0]
}

function decodeKey(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function mediaLookupKeys(value: string) {
  const clean = decodeKey(withoutQuery(value)).replaceAll('\\', '/')
  const noLeadingSlash = clean.replace(/^\/+/, '')
  const noUploads = noLeadingSlash.replace(/^uploads\//, '')
  const basename = noUploads.split('/').pop() || clean

  return [...new Set([value, clean, noLeadingSlash, noUploads, basename].filter(Boolean))]
}

export function tinaMediaById(id?: string | number | null) {
  if (id == null || id === '') return null
  return itemToMedia(indexLookup(manifest.indexes?.byId, String(id)))
}

export function tinaMediaByFilename(filename?: string | null) {
  if (!filename) return null
  return itemToMedia(indexLookup(manifest.indexes?.byFilename, filename))
}

export function resolveTinaMediaRef(ref?: CmsMedia | string | number | null) {
  if (!ref) return null
  if (typeof ref === 'object') return ref

  const value = String(ref)
  for (const key of mediaLookupKeys(value)) {
    const media = tinaMediaById(key) || tinaMediaByFilename(key)
    if (media) return media
  }
  return null
}

export const tinaMediaStats = tinaMediaManifestJson.stats
