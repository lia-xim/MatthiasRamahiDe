import { tinaField } from '@tinacms/astro/tina-field'

export function tinaAttrs(object: unknown, property?: string, index?: number) {
  const field = tinaField(object as never, property as never, index)
  return field ? { 'data-tina-field': field } : {}
}
