import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  admin: {
    description: 'Suchsnippet und Social Preview. Leer lassen, wenn die Seite automatisch aus Titel/Intro ableiten soll.',
  },
  fields: [
    {
      name: 'title',
      label: 'SEO-Titel',
      type: 'text',
      maxLength: 70,
    },
    {
      name: 'description',
      label: 'Meta-Beschreibung',
      type: 'textarea',
      maxLength: 170,
    },
    {
      name: 'canonicalUrl',
      label: 'Kanonische URL',
      type: 'text',
      admin: {
        placeholder: 'https://matthiasramahi.de/portfolio.html',
      },
    },
    {
      name: 'ogImage',
      label: 'Social-Bild',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'noIndex',
      label: 'Nicht indexieren',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Nur für Entwürfe, Übergangsseiten oder bewusst private Inhalte aktivieren.',
      },
    },
  ],
}
