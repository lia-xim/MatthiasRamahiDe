import { APIError, type CollectionBeforeValidateHook } from 'payload'

type RequiredField = {
  path: string
  label: string
}

type RequiredMediaReference = {
  path: string
  label: string
}

const hasValue = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && typeof value !== 'undefined'
}

const valueAtPath = (data: Record<string, unknown> | undefined, path: string) =>
  path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[segment]
  }, data)

export const requireFieldsForPublish =
  (fields: RequiredField[]): CollectionBeforeValidateHook =>
  ({ data, originalDoc, collection }) => {
    const merged = {
      ...(originalDoc as Record<string, unknown> | undefined),
      ...(data as Record<string, unknown> | undefined),
    }

    if (merged._status !== 'published') return data

    const missing = fields.filter((field) => !hasValue(valueAtPath(merged, field.path)))

    if (missing.length > 0) {
      throw new APIError(
        `Veroeffentlichung blockiert: ${missing.map((field) => field.label).join(', ')} fehlt.`,
        400,
        {
          collection: collection.slug,
          errors: missing.map((field) => ({
            path: field.path,
            message: `${field.label} ist vor der Veroeffentlichung erforderlich.`,
          })),
        },
        true,
      )
    }

    return data
  }

const collectValuesAtPath = (value: unknown, segments: string[]): unknown[] => {
  if (segments.length === 0) return [value]
  if (Array.isArray(value)) return value.flatMap((item) => collectValuesAtPath(item, segments))
  if (!value || typeof value !== 'object') return []

  const [head, ...tail] = segments
  return collectValuesAtPath((value as Record<string, unknown>)[head], tail)
}

const relationIdFrom = (value: unknown) => {
  if (!hasValue(value)) return undefined
  if (typeof value === 'string' || typeof value === 'number') return value
  if (!value || typeof value !== 'object') return undefined
  const record = value as Record<string, unknown>
  return (record.id || record.value) as string | number | undefined
}

const relationHasAlt = (value: unknown) => {
  if (!value || typeof value !== 'object') return false
  return hasValue((value as Record<string, unknown>).alt)
}

export const requireMediaAltForPublish =
  (fields: RequiredMediaReference[]): CollectionBeforeValidateHook =>
  async ({ data, originalDoc, collection, req }) => {
    const merged = {
      ...(originalDoc as Record<string, unknown> | undefined),
      ...(data as Record<string, unknown> | undefined),
    }

    if (merged._status !== 'published') return data

    const missing: RequiredMediaReference[] = []
    const checkedIds = new Map<string | number, boolean>()

    for (const field of fields) {
      const values = collectValuesAtPath(merged, field.path.split('.')).filter(hasValue)

      for (const value of values) {
        if (relationHasAlt(value)) continue

        const id = relationIdFrom(value)
        if (!id) continue

        if (!checkedIds.has(id)) {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id,
              depth: 0,
              overrideAccess: true,
            })
            checkedIds.set(id, hasValue((media as unknown as Record<string, unknown>).alt))
          } catch {
            checkedIds.set(id, false)
          }
        }

        if (!checkedIds.get(id)) {
          missing.push(field)
          break
        }
      }
    }

    if (missing.length > 0) {
      throw new APIError(
        `Veroeffentlichung blockiert: Alt-Text fehlt fuer ${missing.map((field) => field.label).join(', ')}.`,
        400,
        {
          collection: collection.slug,
          errors: missing.map((field) => ({
            path: field.path,
            message: `${field.label} braucht ein Medium mit Alt-Text vor der Veroeffentlichung.`,
          })),
        },
        true,
      )
    }

    return data
  }
