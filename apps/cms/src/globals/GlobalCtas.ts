import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { hrefField } from '../fields/links'
import { normalizeGlobalLinksBeforeValidate } from '../hooks/normalizeLinks'
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
    beforeValidate: [normalizeGlobalLinksBeforeValidate],
    afterChange: [triggerAstroRebuildAfterGlobalChange],
  },
  fields: [
    {
      name: 'primary',
      label: 'Standard CTA',
      type: 'group',
      fields: [
        { name: 'label', label: 'Button-Text', type: 'text', defaultValue: 'Projekt anfragen', required: true },
        hrefField('Ziel-URL', '/contact.html#anfrage'),
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
        { name: 'buttonLabel', label: 'Button-Text', type: 'text', defaultValue: 'Projekt anfragen' },
        { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text', defaultValue: 'Projektanfrage' },
      ],
    },
  ],
}
