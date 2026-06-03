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
