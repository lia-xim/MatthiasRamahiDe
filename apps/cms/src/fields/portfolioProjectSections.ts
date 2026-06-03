import type { Tab } from 'payload'

export const portfolioProjectSectionsTab: Tab = {
  label: 'Projektseite',
  description:
    'Editierbare Inhalte der Portfolio-Projektseite: Bildstrecken-Label, Einordnungssektion und Kontakt-CTA. Leer lassen nutzt den eingebauten Standard.',
  fields: [
    {
      name: 'projectPage',
      type: 'group',
      label: 'Projektseite',
      admin: { hideGutter: true },
      fields: [
        { name: 'galleryEyebrow', label: 'Bildstrecke - Label', type: 'text', defaultValue: 'Bildstrecke' },
        {
          name: 'statement',
          label: 'Statement-Sektion',
          type: 'group',
          fields: [
            { name: 'quote', label: 'Grosses Zitat', type: 'text' },
            { name: 'accent', label: 'Hervorhebung im Zitat', type: 'text' },
            {
              name: 'stats',
              label: 'Kurzinfos',
              type: 'array',
              maxRows: 4,
              admin: { initCollapsed: true },
              fields: [
                { name: 'label', label: 'Label', type: 'text', required: true },
                { name: 'text', label: 'Text', type: 'text', required: true },
              ],
            },
            { name: 'buttonLabel', label: 'Button-Text', type: 'text' },
            { name: 'buttonHref', label: 'Button-Ziel', type: 'text' },
          ],
        },
        {
          name: 'context',
          label: 'Einordnungssektion',
          type: 'group',
          fields: [
            { name: 'kicker', label: 'Kicker', type: 'text', defaultValue: 'Einordnung' },
            { name: 'headline', label: 'Headline', type: 'text', defaultValue: 'Serie, Einsatz und Bildsprache' },
            {
              name: 'body',
              label: 'Absatze',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
            },
          ],
        },
        {
          name: 'perspectives',
          label: 'Blickwinkel / Bildsystem',
          type: 'array',
          maxRows: 8,
          admin: {
            initCollapsed: true,
            description: 'Sektion mit Bild, Titel, Text und Stichpunkten - z. B. Exterieur, Interieur, Details, Cinematic.',
          },
          fields: [
            { name: 'label', label: 'Tab / Label', type: 'text', required: true },
            { name: 'title', label: 'Titel', type: 'text', required: true },
            { name: 'text', label: 'Text', type: 'textarea', required: true },
            {
              name: 'image',
              label: 'Bild',
              type: 'relationship',
              relationTo: 'media',
              admin: { appearance: 'drawer' },
            },
            {
              name: 'bullets',
              label: 'Stichpunkte',
              type: 'array',
              maxRows: 5,
              admin: { initCollapsed: true },
              fields: [{ name: 'text', label: 'Stichpunkt', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'infoCards',
          label: 'Kacheln / Fuer wen',
          type: 'array',
          maxRows: 8,
          admin: { initCollapsed: true },
          fields: [
            { name: 'number', label: 'Nummer', type: 'text' },
            { name: 'title', label: 'Titel', type: 'text', required: true },
            { name: 'label', label: 'Label', type: 'text' },
            { name: 'href', label: 'Link', type: 'text', defaultValue: '#anfrage' },
          ],
        },
        {
          name: 'relatedCards',
          label: 'Verwandte Bereiche',
          type: 'array',
          maxRows: 8,
          admin: { initCollapsed: true },
          fields: [
            { name: 'label', label: 'Label', type: 'text' },
            { name: 'title', label: 'Titel', type: 'text', required: true },
            { name: 'href', label: 'Link', type: 'text', required: true },
            {
              name: 'image',
              label: 'Bild',
              type: 'relationship',
              relationTo: 'media',
              admin: { appearance: 'drawer' },
            },
          ],
        },
        {
          name: 'contact',
          label: 'Kontakt-CTA',
          type: 'group',
          fields: [
            { name: 'headline', label: 'Headline', type: 'text' },
            { name: 'text', label: 'Kurztext', type: 'textarea' },
            { name: 'buttonLabel', label: 'Button-Text', type: 'text' },
            { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text' },
          ],
        },
      ],
    },
  ],
}
