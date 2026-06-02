'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button, toast, useDocumentInfo } from '@payloadcms/ui'

import { getMediaOptimizationStatus, type MediaLike } from '../../lib/mediaOptimizationStatus'

type MediaDoc = MediaLike & {
  id?: string | number
  filename?: string | null
  filesize?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null; filesize?: number | null } | undefined> | null
}

const humanBytes = (bytes?: number | null) => {
  if (!bytes || !Number.isFinite(bytes)) return '-'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const DISPLAY_TIERS: { key: string; avifKey: string; label: string }[] = [
  { key: 'mobile', avifKey: 'mobileAvif', label: 'Mobile 760' },
  { key: 'card', avifKey: 'cardAvif', label: 'Karte 1100' },
  { key: 'hero', avifKey: 'heroAvif', label: 'Hero 1920' },
  { key: 'wide', avifKey: 'wideAvif', label: 'Wide 2560' },
]

export function MediaOptimizationPanel() {
  const { id } = useDocumentInfo()
  const [doc, setDoc] = useState<MediaDoc | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/media/${id}?depth=0`, { credentials: 'include' })
      if (res.ok) setDoc((await res.json()) as MediaDoc)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const reoptimize = useCallback(async () => {
    if (!id) return
    setBusy(true)
    try {
      const res = await fetch(`/api/media/${id}/reoptimize`, { method: 'POST', credentials: 'include' })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string; recompressed?: number }
      if (res.ok && body.ok) {
        toast.success(`Neu optimiert${body.recompressed ? ` · ${body.recompressed} Varianten neu komprimiert` : ''}.`)
        await load()
      } else {
        toast.error(body.reason || 'Neu-Optimieren fehlgeschlagen.')
      }
    } catch {
      toast.error('Neu-Optimieren fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }, [id, load])

  if (!id) {
    return <p style={{ opacity: 0.6, fontSize: 13 }}>Bitte das Medium zuerst speichern, dann erscheint der Optimierungs-Status.</p>
  }

  const status = doc ? getMediaOptimizationStatus(doc) : null

  return (
    <div style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: 8, padding: 16, background: 'var(--theme-elevation-50)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {status ? (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 999,
                fontWeight: 600, color: status.color, background: `${status.color}1a`, border: `1px solid ${status.color}55`,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color }} />
              {status.label}
            </span>
          ) : (
            <span style={{ opacity: 0.6 }}>{loading ? 'Status wird geladen ...' : 'Kein Status'}</span>
          )}
          {status ? <span style={{ fontSize: 13, opacity: 0.75 }}>{status.variantCount}/10 Varianten</span> : null}
        </div>
        <Button buttonStyle="secondary" disabled={busy} onClick={() => void reoptimize()} size="small" type="button">
          {busy ? 'Optimiere ...' : 'Neu optimieren'}
        </Button>
      </div>

      {status ? <p style={{ fontSize: 13, opacity: 0.8, margin: '10px 0 0' }}>{status.hint}</p> : null}

      {doc ? (
        <div style={{ marginTop: 12, fontSize: 12.5 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', opacity: 0.85, marginBottom: 8 }}>
            <span>Original: {doc.width}×{doc.height} · {humanBytes(doc.filesize)}</span>
            <span>Blur-Placeholder: {doc.blurDataUrl ? '✓' : '✗ fehlt'}</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.6 }}>
                <th style={{ padding: '3px 6px', fontWeight: 500 }}>Größe</th>
                <th style={{ padding: '3px 6px', fontWeight: 500 }}>WebP</th>
                <th style={{ padding: '3px 6px', fontWeight: 500 }}>AVIF</th>
              </tr>
            </thead>
            <tbody>
              {DISPLAY_TIERS.map((tier) => {
                const webp = doc.sizes?.[tier.key]
                const avif = doc.sizes?.[tier.avifKey]
                return (
                  <tr key={tier.key} style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
                    <td style={{ padding: '3px 6px' }}>{tier.label}</td>
                    <td style={{ padding: '3px 6px' }}>{webp?.url ? humanBytes(webp.filesize) : <span style={{ color: '#dc2626' }}>fehlt</span>}</td>
                    <td style={{ padding: '3px 6px' }}>{avif?.url ? humanBytes(avif.filesize) : <span style={{ color: '#dc2626' }}>fehlt</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 11.5, opacity: 0.55, margin: '8px 0 0' }}>
            „Neu optimieren" erzeugt fehlende Varianten neu und wendet die globale Qualitätsstufe
            (Website-Einstellungen → Bilder) an. Die Live-Seite zeigt Änderungen nach dem nächsten Rebuild.
          </p>
        </div>
      ) : null}
    </div>
  )
}
