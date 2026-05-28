import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { adminGroups } from '../admin/structure'
import { hrefField } from '../fields/links'
import { normalizeGlobalLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

export const GlobalCtas: GlobalConfig = {
  slug: 'global-ctas',
  label: 'Globale CTAs',
  admin: {
    group: adminGroups.globals,
    hideAPIURL: true,
    description: 'Standard-Anfragebutton und globales Kontaktmodul fuer wiederkehrende Website-Bereiche.',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Button',
          description: 'Globaler Standard-CTA fuer Buttons und kurze Linkziele.',
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
          ],
        },
        {
          label: 'Kontaktmodul',
          description: 'Text fuer wiederverwendete Kontaktbereiche.',
          fields: [
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
                    'Projektart, Ort, Zeitraum und gewuenschte Nutzung reichen fuer den ersten Schritt. Ich melde mich mit Rueckfragen oder einem naechsten Vorschlag per E-Mail.',
                },
                { name: 'buttonLabel', label: 'Button-Text', type: 'text', defaultValue: 'Projekt anfragen' },
                { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text', defaultValue: 'Projektanfrage' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
