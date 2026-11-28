// Bühnenbild für den Journal-Kopf (Fokus-Beitrag auf /blog.html und
// Titelbild im Artikel). Karten bekommen nur 480/760er Varianten; auf der
// Bühne läuft das Bild aber deutlich breiter. Hier wird deshalb eine srcset
// bis 1920 px gebaut, aus den CMS-Größen oder aus den vorhandenen
// /assets/optimized/*-<breite>.webp Geschwistern.
import { versionStaticAssetUrl } from './cache'
import { imageDimensions, imageDisplayUrl, imageSrcset, type PayloadMedia } from './payload'
import { resolveTinaMediaRef } from './tinaMedia'

export type JournalStageImage = {
  src: string
  srcset: string
  width?: number
  height?: number
}

const OPTIMIZED_WIDTHS = [480, 720, 960, 1280, 1440, 1600, 1920]

export function journalStageImage(ref?: PayloadMedia | string | null): JournalStageImage | null {
  if (!ref) return null

  if (typeof ref === 'string') {
    const path = `/${ref.replace(/^\/+/, '').split(/[?#]/, 1)[0]}`
    const match = path.match(/^(\/assets\/optimized\/.+-)(\d{3,4})\.webp$/i)
    if (match) {
      const variants = OPTIMIZED_WIDTHS.map((width) => `${match[1]}${width}.webp`)
        .map((variant) => ({ path: variant, dims: imageDimensions(variant) }))
        .filter((variant) => variant.dims.width && variant.dims.height)
      if (variants.length > 0) {
        const largest = variants[variants.length - 1]
        const fallback = variants.find((variant) => (variant.dims.width || 0) >= 960) || largest
        return {
          src: versionStaticAssetUrl(fallback.path),
          srcset: variants.map((variant) => `${versionStaticAssetUrl(variant.path)} ${variant.dims.width}w`).join(', '),
          width: largest.dims.width,
          height: largest.dims.height,
        }
      }
    }
  }

  const media = typeof ref === 'object' ? ref : (resolveTinaMediaRef(ref) as PayloadMedia | null)
  if (media && typeof media === 'object') {
    const src = imageDisplayUrl(media, 'card', { allowOriginal: true })
    const srcset = imageSrcset(media, ['mobile', 'card', 'hero', 'wide'], 'raster')
    const dims = imageDimensions(media, 'hero')
    if (src && srcset) return { src, srcset, width: dims.width, height: dims.height }
  }

  return null
}
