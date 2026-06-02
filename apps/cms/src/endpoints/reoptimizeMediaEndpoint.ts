import type { Endpoint } from 'payload'

import { reoptimizeMedia } from '../lib/mediaReoptimize'
import { isMediaQualityPreset, type MediaQualityPreset } from '../lib/mediaQuality'

/**
 * POST /api/media/:id/reoptimize
 * Authenticated. Regenerates the full responsive variant set + blur placeholder
 * for one media doc and applies the globally configured quality preset
 * (Website-Einstellungen → Bilder). The media ID is preserved.
 */
export const reoptimizeEndpoint: Endpoint = {
  path: '/:id/reoptimize',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ ok: false, reason: 'Nicht autorisiert.' }, { status: 401 })
    }

    const id = (req.routeParams?.id as string | undefined) || ''
    if (!id) {
      return Response.json({ ok: false, reason: 'Keine Medien-ID.' }, { status: 400 })
    }

    let preset: MediaQualityPreset = 'standard'
    try {
      const settings = (await req.payload.findGlobal({ slug: 'site-settings', depth: 0 })) as {
        mediaQualityPreset?: unknown
      }
      if (isMediaQualityPreset(settings?.mediaQualityPreset)) preset = settings.mediaQualityPreset
    } catch {
      /* fall back to standard */
    }

    try {
      const result = await reoptimizeMedia(req.payload, id, { preset })
      return Response.json(result, { status: result.ok ? 200 : 422 })
    } catch (error) {
      req.payload.logger.error({ msg: 'Media reoptimize failed', id, err: error })
      return Response.json(
        { ok: false, reason: error instanceof Error ? error.message : 'Unbekannter Fehler.' },
        { status: 500 },
      )
    }
  },
}
