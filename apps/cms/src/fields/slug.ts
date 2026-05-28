import type { Field, TextFieldSingleValidation } from 'payload'

export const formatSlug = (input: unknown): string =>
  String(input ?? '')
    .toLowerCase()
    .replace(/\u00e4/g, 'ae')
    .replace(/\u00f6/g, 'oe')
    .replace(/\u00fc/g, 'ue')
    .replace(/\u00df/g, 'ss')
    .replace(/\u00c3\u00a4/g, 'ae')
    .replace(/\u00c3\u00b6/g, 'oe')
    .replace(/\u00c3\u00bc/g, 'ue')
    .replace(/\u00c3\u009f/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const validateSlug: TextFieldSingleValidation = (value) => {
  if (!value) return 'Slug ist erforderlich.'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'Nur Kleinbuchstaben, Zahlen und Bindestriche verwenden.'
  }
  return true
}

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  label: 'URL-Slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  validate: validateSlug,
  admin: {
    description: 'Wird aus dem Titel erzeugt, kann aber bewusst angepasst werden.',
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return formatSlug(value)
        return formatSlug(data?.[sourceField])
      },
    ],
  },
})
