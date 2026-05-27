import { APIError, type CollectionBeforeValidateHook } from 'payload'

type RequiredField = {
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
