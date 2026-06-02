'use client'

import React from 'react'

import { getMediaOptimizationStatus, type MediaLike } from '../../lib/mediaOptimizationStatus'

type Props = {
  rowData?: MediaLike & Record<string, unknown>
}

export function MediaOptimizationCell({ rowData }: Props) {
  if (!rowData) return <span style={{ opacity: 0.5 }}>-</span>
  const status = getMediaOptimizationStatus(rowData)

  return (
    <span
      title={status.hint}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 9px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.6,
        color: status.color,
        background: `${status.color}1a`,
        border: `1px solid ${status.color}55`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color }} />
      {status.label}
      {status.missingBlur ? <span style={{ opacity: 0.7, fontWeight: 400 }}>· kein Blur</span> : null}
    </span>
  )
}
