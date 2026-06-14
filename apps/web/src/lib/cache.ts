const versionSource =
  import.meta.env.PUBLIC_ASSET_VERSION ||
  import.meta.env.ASTRO_ASSET_VERSION ||
  process.env.ASTRO_ASSET_VERSION ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.VERCEL_DEPLOYMENT_ID ||
  process.env.VERCEL_URL ||
  (import.meta.env.DEV ? 'dev' : '')

const sanitizeVersion = (value: unknown) =>
  String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(0, 48)

export const staticAssetVersion = sanitizeVersion(versionSource) || 'static'

export function addUrlVersion(url: string, version: unknown, param = 'v') {
  const cleanVersion = sanitizeVersion(version)
  if (!url || !cleanVersion || /^(data:|mailto:|tel:|#)/i.test(url)) return url

  const hashIndex = url.indexOf('#')
  const beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : ''
  const encodedVersion = encodeURIComponent(cleanVersion)
  const existingParam = new RegExp(`([?&])${param}=[^&#]*`)
  if (existingParam.test(beforeHash)) return `${beforeHash.replace(existingParam, `$1${param}=${encodedVersion}`)}${hash}`

  const separator = beforeHash.includes('?') ? '&' : '?'

  return `${beforeHash}${separator}${param}=${encodedVersion}${hash}`
}

export function isLocalStaticAsset(url: string) {
  if (!url || /^(data:|mailto:|tel:|#)/i.test(url)) return false

  if (/^\/?(?:assets|uploads)\//i.test(url)) return true

  try {
    const parsed = new URL(url)
    return (
      ['matthiasramahi.de', 'www.matthiasramahi.de', 'localhost', '127.0.0.1'].includes(parsed.hostname) &&
      /^\/(?:assets|uploads)\//i.test(parsed.pathname)
    )
  } catch {
    return false
  }
}

export function versionStaticAssetUrl(url: string) {
  return isLocalStaticAsset(url) ? addUrlVersion(url, staticAssetVersion) : url
}

export function mediaCacheVersion(media: {
  filename?: string
  filesize?: number
  id?: string
  updatedAt?: string
  sizes?: Record<string, { filename?: string; filesize?: number; url?: string } | undefined>
}) {
  const sizeEntries = Object.values(media.sizes || {})
  const sizeFingerprint = sizeEntries
    .map((size) => [size?.filename, size?.filesize].filter(Boolean).join('-'))
    .filter(Boolean)
    .join('.')

  return sanitizeVersion(media.updatedAt || sizeFingerprint || media.filesize || media.filename || media.id)
}

export function versionCmsMediaUrl(url: string, media: Parameters<typeof mediaCacheVersion>[0] | undefined) {
  const version = media ? mediaCacheVersion(media) : ''
  return version ? addUrlVersion(url, version, 'm') : url
}
