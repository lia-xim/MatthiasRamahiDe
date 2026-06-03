import type { Tab } from 'payload'

import { mediaGalleryPickerComponent, mediaRelationshipField } from './editorialImages'
import { normalizeHref } from './links'

const headlineFields = (description = 'Optional. Leer lassen = eingebauter Standardinhalt bleibt.'): Tab['fields'] => [
  {
    type: 'row',
    fields: [
      { name: 'headline', label: 'Headline', type: 'text', admin: { width: '60%', description } },
      {
        name: 'headlineEmphasis',
        label: 'Hervorgehobenes Wort (kursiv)',
        type: 'text',
        admin: { width: '40%', description: 'Optional. Wird kursiv/akzentuiert gesetzt.' },
      },
    ],
  },
]

const namedHrefField = (name: string, label = 'Link-Ziel'): Tab['fields'][number] => ({
  name,
  label,
  type: 'text',
  admin: {
    description:
      'Interne Links am besten root-relativ eintragen, z. B. /portfolio. Vollstaendige eigene URLs werden automatisch gekuerzt.',
    placeholder: '/portfolio',
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

export const aboutSectionsTab: Tab = {
  label: 'Ueber mich',
  description:
    'Alle Inhalte der Ueber-mich-Seite, sektionsweise. Jede Sektion ist optional und nutzt bei leeren Feldern den eingebauten Standardinhalt.',
  fields: [
    {
      name: 'aboutHero',
      label: 'Sektion: Hero',
      type: 'group',
      admin: { description: 'Intro-Buehne oben auf der Seite.' },
      fields: [
        { name: 'kicker', label: 'Kicker', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'titleLine1', label: 'Titel Zeile 1', type: 'text', admin: { width: '50%' } },
            { name: 'titleLine2', label: 'Titel Zeile 2', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'lead', label: 'Lead-Text', type: 'textarea' },
        mediaRelationshipField({
          name: 'image',
          label: 'Hero-Bild',
          description: 'Optional. Leer = eingebautes Portraitmotiv.',
        }),
        {
          type: 'row',
          fields: [
            { name: 'primaryLabel', label: 'Button 1 Text', type: 'text', admin: { width: '50%' } },
            namedHrefField('primaryHref', 'Button 1 Link'),
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'secondaryLabel', label: 'Button 2 Text', type: 'text', admin: { width: '50%' } },
            namedHrefField('secondaryHref', 'Button 2 Link'),
          ],
        },
      ],
    },
    {
      name: 'aboutStatement',
      label: 'Sektion: Haltung',
      type: 'group',
      admin: { description: 'Heller Statement-Block unter dem Hero.' },
      fields: [
        ...headlineFields(),
        { name: 'lead', label: 'Lead-Absatz', type: 'textarea' },
        {
          name: 'body',
          label: 'Absatz',
          type: 'textarea',
          admin: { description: 'Zweiter Textabsatz.' },
        },
        {
          type: 'row',
          fields: [
            { name: 'primaryLabel', label: 'Button 1 Text', type: 'text', admin: { width: '50%' } },
            namedHrefField('primaryHref', 'Button 1 Link'),
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'secondaryLabel', label: 'Button 2 Text', type: 'text', admin: { width: '50%' } },
            namedHrefField('secondaryHref', 'Button 2 Link'),
          ],
        },
      ],
    },
    {
      name: 'aboutChapters',
      label: 'Sektion: Sechs Bereiche',
      type: 'group',
      admin: { description: 'Dunkles Raster mit den sechs fotografischen Schwerpunkten.' },
      fields: [
        ...headlineFields(),
        { name: 'intro', label: 'Intro-Text', type: 'textarea' },
        {
          name: 'items',
          label: 'Bereich-Kacheln',
          type: 'array',
          maxRows: 8,
          labels: { singular: 'Bereich', plural: 'Bereiche' },
          admin: {
            initCollapsed: true,
            description: 'Reihenfolge = Anzeige-Reihenfolge.',
            components: {
              beforeInput: [
                mediaGalleryPickerComponent({
                  buttonLabel: 'Bilder als Bereiche uebernehmen',
                  rowDefaults: { title: '', alt: '', href: '' },
                  title: 'Ueber-mich-Bereiche visuell zusammenstellen',
                }),
              ],
            },
          },
          fields: [
            mediaRelationshipField({ name: 'image', label: 'Bild', required: true }),
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Titel', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'alt', label: 'Alt-Text Fallback', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'linkLabel', label: 'Link-Text', type: 'text', defaultValue: 'Bereich ansehen ->' },
            namedHrefField('href'),
          ],
        },
      ],
    },
    {
      name: 'aboutSister',
      label: 'Sektion: Sophia / Video',
      type: 'group',
      admin: { description: 'Heller Empfehlungsblock fuer bewegte Bilder.' },
      fields: [
        { name: 'kicker', label: 'Kicker', type: 'text' },
        ...headlineFields(),
        { name: 'lead', label: 'Lead-Absatz', type: 'textarea' },
        { name: 'body', label: 'Absatz', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'buttonLabel', label: 'Button-Text', type: 'text', admin: { width: '50%' } },
            namedHrefField('href', 'Button-Link'),
          ],
        },
        {
          name: 'plate',
          label: 'Visitentafel',
          type: 'group',
          fields: [
            { name: 'tag', label: 'Tag', type: 'text' },
            { name: 'nameLine1', label: 'Name Zeile 1', type: 'text' },
            { name: 'nameLine2', label: 'Name Zeile 2 (kursiv)', type: 'text' },
            {
              name: 'roles',
              label: 'Rollen / Leistungen',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: [{ name: 'label', label: 'Eintrag', type: 'text', required: true }],
            },
            { name: 'location', label: 'Ort', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'aboutContact',
      label: 'Sektion: Kontakt',
      type: 'group',
      admin: { description: 'Text fuer das Kontaktmodul am Ende der Seite.' },
      fields: [
        { name: 'subject', label: 'E-Mail-Betreff', type: 'text' },
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'lead', label: 'Lead-Text', type: 'textarea' },
      ],
    },
  ],
}
