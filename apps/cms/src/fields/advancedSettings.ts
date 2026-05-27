import type { Field } from 'payload'

export const advancedSettings = (fields: Field[]): Field => ({
  type: 'collapsible',
  label: 'Advanced Settings',
  admin: {
    initCollapsed: true,
    description: 'Nur bei gezielter SEO-, Migrations- oder technischer Feinsteuerung oeffnen.',
  },
  fields,
})
