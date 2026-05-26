import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

export const GlobalCtas: GlobalConfig = {
  slug: 'global-ctas',
  label: 'Globale CTAs',
  admin: {
    group: 'Global',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [triggerAstroRebuildAfterGlobalChange],
  },
  fields: [
    {
      name: 'primary',
      label: 'Standard CTA',
      type: 'group',
      fields: [
        { name: 'label', label: 'Button-Text', type: 'text', defaultValue: 'Anfrage senden', required: true },
        { name: 'href', label: 'Ziel-URL', type: 'text', defaultValue: 'mailto:info@matthiasramahi.de?subject=Projektanfrage', required: true },
      ],
    },
    {
      name: 'contactModule',
      label: 'Globales Kontaktmodul',
      type: 'group',
      fields: [
        { name: 'eyebrow', label: 'Kicker', type: 'text', defaultValue: 'Anfrage' },
        { name: 'headline', label: 'Headline', type: 'text', defaultValue: 'Projekt anfragen.' },
        {
          name: 'text',
          label: 'Kurztext',
          type: 'textarea',
          defaultValue:
            'Projektart, Ort, Zeitraum und gewünschte Nutzung reichen für den ersten Schritt. Ich melde mich mit Rückfragen oder einem nächsten Vorschlag per E-Mail.',
        },
        { name: 'buttonLabel', label: 'Button-Text', type: 'text', defaultValue: 'Anfrage per E-Mail senden' },
        { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text', defaultValue: 'Projektanfrage' },
      ],
    },
  ],
}
