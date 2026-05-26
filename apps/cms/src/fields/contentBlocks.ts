import type { Field } from 'payload'

export const contentBlocks: Field = {
  name: 'blocks',
  label: 'Inhaltsblöcke',
  type: 'blocks',
  blocks: [
    {
      slug: 'textBlock',
      labels: { singular: 'Textblock', plural: 'Textblöcke' },
      fields: [
        { name: 'eyebrow', label: 'Kicker', type: 'text' },
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'body', label: 'Text', type: 'richText' },
      ],
    },
    {
      slug: 'imageSequence',
      labels: { singular: 'Bildsequenz', plural: 'Bildsequenzen' },
      fields: [
        { name: 'headline', label: 'Interner Titel', type: 'text' },
        {
          name: 'layout',
          label: 'Präsentation',
          type: 'select',
          defaultValue: 'editorial-strip',
          options: [
            { label: 'Editorialer Bildstreifen', value: 'editorial-strip' },
            { label: 'Kontaktbogen', value: 'contact-sheet' },
            { label: 'Bühnenmoment', value: 'stage' },
            { label: 'Grosses ruhiges Motiv', value: 'single-large' },
          ],
        },
        {
          name: 'items',
          label: 'Bilder',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'image', label: 'Bild', type: 'relationship', relationTo: 'media', required: true },
            { name: 'caption', label: 'Bildunterschrift', type: 'text' },
            {
              name: 'cropIntent',
              dbName: 'crop',
              label: 'Crop-Hinweis',
              type: 'select',
              defaultValue: 'auto',
              options: [
                { label: 'Automatisch', value: 'auto' },
                { label: 'Gesicht / Detail schützen', value: 'protect-detail' },
                { label: 'Weite / Atmosphäre schützen', value: 'protect-space' },
                { label: 'Dramatisch anschneiden', value: 'dramatic-crop' },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'quoteBlock',
      labels: { singular: 'Zitat / Statement', plural: 'Zitate / Statements' },
      fields: [
        { name: 'quote', label: 'Zitat', type: 'textarea', required: true },
        { name: 'attribution', label: 'Quelle', type: 'text' },
      ],
    },
    {
      slug: 'faqBlock',
      labels: { singular: 'FAQ-Block', plural: 'FAQ-Blöcke' },
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        {
          name: 'items',
          label: 'Fragen',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'question', label: 'Frage', type: 'text', required: true },
            { name: 'answer', label: 'Antwort', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      slug: 'linkList',
      labels: { singular: 'Linkliste', plural: 'Linklisten' },
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'label', label: 'Label', type: 'text', required: true },
            { name: 'href', label: 'URL', type: 'text', required: true },
            { name: 'description', label: 'Beschreibung', type: 'textarea' },
          ],
        },
      ],
    },
    {
      slug: 'ctaBlock',
      labels: { singular: 'Kontakt-CTA', plural: 'Kontakt-CTAs' },
      fields: [
        { name: 'headline', label: 'Headline', type: 'text', required: true },
        { name: 'text', label: 'Kurztext', type: 'textarea' },
        { name: 'buttonLabel', label: 'Button-Text', type: 'text', defaultValue: 'Anfrage senden' },
        { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text' },
      ],
    },
  ],
}
