import type { Tab } from 'payload'

import { mediaGalleryPickerComponent, mediaRelationshipField } from './editorialImages'
import { normalizeHref } from './links'

const namedHrefField = (name: string, label = 'Link-Ziel'): Tab['fields'][number] => ({
  name,
  label,
  type: 'text',
  admin: {
    description: 'Interne Links am besten root-relativ eintragen, z. B. /portraitfotografie-duesseldorf.html.',
    placeholder: '/portfolio.html',
  },
  hooks: {
    beforeValidate: [({ value }) => normalizeHref(value)],
  },
  validate: (value: unknown) => {
    const href = normalizeHref(value)
    if (!href) return true
    if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(href)) return true
    return 'Bitte internen Pfad mit /, vollstaendige URL, mailto:, tel: oder #anker verwenden.'
  },
})

const portfolioPhotoFields: Tab['fields'] = [
  mediaRelationshipField({
    name: 'image',
    label: 'Vorschaubild',
    required: true,
    description: 'Wird im Raster bzw. in der Bildstrecke angezeigt.',
  }),
  mediaRelationshipField({
    name: 'fullImage',
    label: 'Grossansicht',
    description: 'Optional. Wenn leer, wird das Vorschaubild fuer die Grossansicht verwendet.',
  }),
  { name: 'caption', label: 'Bildunterschrift / Alt-Fallback', type: 'text' },
  namedHrefField('href', 'Optionaler Direktlink'),
]

export const portfolioIndexSectionsTab: Tab = {
  label: 'Portfolio / Bildarchiv',
  description:
    'Eigene Inhalte der Portfolio-Seite: Kontexttexte, Bildstrecken/Slices, Archivbilder und Kontaktmodul. Leer lassen nutzt den eingebauten Standardinhalt.',
  fields: [
    {
      name: 'portfolioIndex',
      type: 'group',
      label: 'Portfolio / Bildarchiv',
      admin: { hideGutter: true },
      fields: [
        {
          name: 'contextKicker',
          label: 'Kontext: Kicker',
          type: 'text',
          defaultValue: 'Einordnung',
        },
        {
          name: 'contextHeadline',
          label: 'Kontext: Headline',
          type: 'text',
          defaultValue: 'Serien statt Sammelmappe.',
        },
        {
          name: 'contextBody',
          label: 'Kontext: Absatze',
          type: 'array',
          maxRows: 5,
          admin: { initCollapsed: true },
          fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
        },
        {
          name: 'slices',
          label: 'Bildstrecken / Slices',
          type: 'array',
          maxRows: 12,
          labels: { singular: 'Slice', plural: 'Slices' },
          admin: {
            initCollapsed: true,
            description:
              'Reihenfolge = Anzeige-Reihenfolge. Mindestens fuenf Standard-Slices sind vorgesehen; weitere koennen ergaenzt werden.',
            components: {
              beforeInput: [
                mediaGalleryPickerComponent({
                  buttonLabel: 'Bilder als Slice-Basis uebernehmen',
                  rowDefaults: { anchor: '', label: '', heading: '', theme: 'light', href: '', linkLabel: 'Zur Seite ->' },
                  title: 'Portfolio-Slices visuell zusammenstellen',
                }),
              ],
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'anchor', label: 'Anker / ID', type: 'text', admin: { width: '25%', placeholder: 'portrait' } },
                { name: 'label', label: 'Label', type: 'text', admin: { width: '25%', placeholder: 'Portrait' } },
                { name: 'heading', label: 'Headline', type: 'text', admin: { width: '50%', placeholder: 'Portrait' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'theme',
                  label: 'Theme',
                  type: 'text',
                  defaultValue: 'light',
                  admin: { width: '25%', description: 'light oder dark' },
                },
                { name: 'linkLabel', label: 'Link-Text', type: 'text', admin: { width: '35%' } },
                namedHrefField('href', 'Link-Ziel'),
              ],
            },
            {
              name: 'photos',
              label: 'Bilder',
              type: 'array',
              maxRows: 12,
              admin: { initCollapsed: true },
              fields: portfolioPhotoFields,
            },
          ],
        },
        {
          name: 'archive',
          label: 'Bildarchiv',
          type: 'group',
          fields: [
            { name: 'headline', label: 'Headline', type: 'text', defaultValue: 'Bildarchiv' },
            {
              name: 'batchSize',
              label: 'Anzahl zuerst sichtbarer Bilder',
              type: 'number',
              defaultValue: 12,
              min: 1,
              max: 60,
            },
            {
              name: 'items',
              label: 'Archivbilder',
              type: 'array',
              maxRows: 120,
              admin: {
                initCollapsed: true,
                components: {
                  beforeInput: [
                    mediaGalleryPickerComponent({
                      buttonLabel: 'Bilder ins Archiv uebernehmen',
                      rowDefaults: { caption: '' },
                      title: 'Portfolio-Archiv visuell zusammenstellen',
                    }),
                  ],
                },
              },
              fields: portfolioPhotoFields,
            },
          ],
        },
        {
          name: 'contact',
          label: 'Kontaktmodul',
          type: 'group',
          fields: [
            { name: 'subject', label: 'E-Mail-Betreff', type: 'text' },
            { name: 'headline', label: 'Headline', type: 'text' },
            { name: 'lead', label: 'Lead-Text', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
