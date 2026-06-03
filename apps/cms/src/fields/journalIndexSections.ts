import type { Tab } from 'payload'

import { normalizeHref } from './links'

const optionalHrefField = (name: string, label = 'Link-Ziel'): Tab['fields'][number] => ({
  name,
  label,
  type: 'text',
  admin: {
    description: 'Interne Links am besten root-relativ eintragen, z. B. /contact oder #journal.',
    placeholder: '#journal',
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

export const journalIndexSectionsTab: Tab = {
  label: 'Journal-Uebersicht',
  description:
    'Inhalte der Journal-Uebersicht: Ticker, Filter, Index-Headline, Lade-Button und Abschluss-CTA. Leer lassen nutzt den eingebauten Standardinhalt.',
  fields: [
    {
      name: 'journalIndex',
      type: 'group',
      label: 'Journal-Uebersicht',
      admin: { hideGutter: true },
      fields: [
        {
          name: 'tickerItems',
          label: 'Ticker-Eintraege',
          type: 'array',
          maxRows: 24,
          labels: { singular: 'Ticker-Eintrag', plural: 'Ticker-Eintraege' },
          admin: {
            initCollapsed: true,
            description: 'HTML fuer einfache Hervorhebungen ist erlaubt, z. B. <b>Automotive</b> Lichtfuehrung.',
          },
          fields: [{ name: 'text', label: 'Text', type: 'text', required: true }],
        },
        {
          type: 'row',
          fields: [
            { name: 'indexHeadline', label: 'Artikelbereich - Headline', type: 'text', admin: { width: '55%' } },
            {
              name: 'initialVisiblePostCount',
              label: 'Anfangs sichtbare Beitraege',
              type: 'number',
              min: 1,
              max: 24,
              defaultValue: 6,
              admin: { width: '25%' },
            },
            { name: 'loadMoreLabel', label: 'Button: mehr laden', type: 'text', admin: { width: '20%' } },
          ],
        },
        {
          name: 'loadStatusTemplate',
          label: 'Lade-Status',
          type: 'text',
          admin: {
            description: 'Optional. Platzhalter: {visible} und {total}.',
            placeholder: '{visible} von {total} Beitraegen sichtbar',
          },
        },
        {
          name: 'filters',
          label: 'Filter',
          type: 'array',
          maxRows: 12,
          labels: { singular: 'Filter', plural: 'Filter' },
          admin: {
            initCollapsed: true,
            description: 'Der Wert muss zu den Kategorien der Artikelkarten passen, z. B. all, automotive, portrait, prozess, print.',
          },
          fields: [
            { name: 'label', label: 'Label', type: 'text', required: true },
            { name: 'value', label: 'Filter-Wert', type: 'text', required: true },
          ],
        },
        {
          name: 'finalCta',
          label: 'Abschluss-CTA',
          type: 'group',
          fields: [
            { name: 'kicker', label: 'Kicker', type: 'text' },
            { name: 'headline', label: 'Headline', type: 'text', admin: { description: 'HTML fuer <em> ist erlaubt.' } },
            { name: 'text', label: 'Text', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'primaryLabel', label: 'Primaer-Button', type: 'text', admin: { width: '30%' } },
                optionalHrefField('primaryHref', 'Primaer-Link'),
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'secondaryLabel', label: 'Sekundaer-Button', type: 'text', admin: { width: '30%' } },
                optionalHrefField('secondaryHref', 'Sekundaer-Link'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
