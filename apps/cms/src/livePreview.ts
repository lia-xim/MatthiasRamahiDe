import type { CollectionSlug } from 'payload'

type PreviewInput = {
  collection: CollectionSlug | string
  slug?: unknown
}

export const getWebUrl = () =>
  process.env.ASTRO_PREVIEW_URL || process.env.ASTRO_PUBLIC_SITE_URL || 'http://localhost:4321'

export const buildPreviewUrl = ({ collection, slug }: PreviewInput) => {
  const safeSlug = typeof slug === 'string' && slug.length > 0 ? slug : 'new'
  const previewSecret = process.env.PREVIEW_SECRET || ''
  const params = new URLSearchParams()

  if (previewSecret) params.set('secret', previewSecret)

  return `${getWebUrl()}/preview/${collection}/${encodeURIComponent(safeSlug)}${
    params.size ? `?${params.toString()}` : ''
  }`
}
