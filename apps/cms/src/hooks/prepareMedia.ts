import type { CollectionBeforeValidateHook } from 'payload'

type DataRecord = Record<string, unknown>

const asRecord = (value: unknown): DataRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as DataRecord) : {}

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const hasValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && typeof value !== 'undefined'
}

const readableName = (filename: string) =>
  filename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const inferCategory = (text: string) => {
  const value = text.toLowerCase()
  if (value.includes('portrait') || value.includes('headshot') || value.includes('business')) return 'portrait'
  if (value.includes('oldtimer') || value.includes('youngtimer') || value.includes('classic')) return 'oldtimer'
  if (value.includes('motorrad') || value.includes('bike') || value.includes('biker')) return 'motorrad'
  if (value.includes('auto') || value.includes('car') || value.includes('fahrzeug') || value.includes('sportwagen')) {
    return 'automotive'
  }
  if (value.includes('land') || value.includes('natur') || value.includes('print')) return 'landschaft'
  if (value.includes('service') || value.includes('produktion') || value.includes('labor')) return 'service'
  if (value.includes('detail') || value.includes('atmos')) return 'atmosphere'
  return 'uncategorized'
}

const inferUsagePurpose = (category: unknown) => {
  if (category === 'uncategorized') return ['gallery']
  if (category === 'service') return ['teaser', 'gallery']
  return ['gallery']
}

export const prepareMediaBeforeValidate: CollectionBeforeValidateHook = ({ data, originalDoc, req }) => {
  const incoming = asRecord(data)
  const original = asRecord(originalDoc)
  const uploadFile = asRecord((req as unknown as { file?: unknown }).file)
  const filename = asString(incoming.filename) || asString(original.filename) || asString(uploadFile.name)
  const title = asString(incoming.title) || asString(original.title) || (filename ? readableName(filename) : '')
  const category = asString(incoming.category) || asString(original.category) || inferCategory(`${title} ${filename}`)
  const next: DataRecord = { ...incoming }

  if (!hasValue(incoming.title) && !hasValue(original.title) && title) next.title = title
  if (!hasValue(incoming.alt) && !hasValue(original.alt) && title) next.alt = title
  if (!hasValue(incoming.category) && !hasValue(original.category)) next.category = category
  if (!hasValue(incoming.usagePurpose) && !hasValue(original.usagePurpose)) next.usagePurpose = inferUsagePurpose(category)

  return next
}
