import type { CollectionBeforeValidateHook, GlobalBeforeValidateHook } from 'payload'

import { normalizeHref } from '../fields/links'

type DataRecord = Record<string, unknown>

const normalizeLinksInValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalizeLinksInValue)
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as DataRecord).map(([key, entry]) => [
      key,
      key === 'href' && typeof entry === 'string' ? normalizeHref(entry) : normalizeLinksInValue(entry),
    ]),
  )
}

export const normalizeLinksBeforeValidate: CollectionBeforeValidateHook = ({ data }) => {
  if (!data || typeof data !== 'object') return data
  return normalizeLinksInValue(data) as Record<string, unknown>
}

export const normalizeGlobalLinksBeforeValidate: GlobalBeforeValidateHook = ({ data }) => {
  if (!data || typeof data !== 'object') return data
  return normalizeLinksInValue(data) as Record<string, unknown>
}
