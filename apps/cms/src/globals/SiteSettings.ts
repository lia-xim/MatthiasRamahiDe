import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { adminGroups } from '../admin/structure'
import { mediaRelationshipField } from '../fields/editorialImages'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
  admin: {
    group: adminGroups.globals,
    hideAPIURL: true,
    description: 'Website-weite Defaults fuer Marke, Kontakt und SEO-Fallbacks.',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Website-Identitaet und Live-Domain.',
          fields: [
            { name: 'siteName', label: 'Website-Name', type: 'text', defaultValue: 'Matthias Ramahi Fotografie', required: true },
            { name: 'siteUrl', label: 'Live-URL', type: 'text', defaultValue: 'https://matthiasramahi.de', required: true },
            { name: 'locale', label: 'Locale', type: 'text', defaultValue: 'de_DE', required: true },
            { name: 'ownerName', label: 'Inhaber / Fotograf', type: 'text', defaultValue: 'Matthias Ramahi' },
          ],
        },
        {
          label: 'Kontakt',
          description: 'Globale Kontaktdaten und Social-Profil.',
          fields: [
            { name: 'email', label: 'Kontakt-E-Mail', type: 'email', defaultValue: 'info@matthiasramahi.de', required: true },
            { name: 'phone', label: 'Telefon', type: 'text' },
            { name: 'instagramUrl', label: 'Instagram', type: 'text' },
          ],
        },
        {
          label: 'SEO Defaults',
          description: 'Fallbacks, wenn einzelne Seiten keine eigenen SEO-Werte haben.',
          fields: [
            { name: 'defaultMetaTitle', label: 'Standard SEO-Titel', type: 'text' },
            { name: 'defaultMetaDescription', label: 'Standard Meta-Beschreibung', type: 'textarea' },
            mediaRelationshipField({
              name: 'defaultOgImage',
              label: 'Standard Social-Bild',
              description: 'Fallback fuer Open Graph und Social Preview, wenn keine Seite ein eigenes Bild setzt.',
            }),
          ],
        },
        {
          label: 'Advanced',
          description: 'Legacy-Fallbacks und selten genutzte globale Texte.',
          fields: [
            {
              name: 'footerStatement',
              label: 'Footer-Statement',
              type: 'textarea',
              defaultValue:
                'Fotografie, die Raeume oeffnet. Portfolio, Auftraege und visuelle Produktion in Duesseldorf / NRW - klar kuratiert, technisch sauber und bereit fuer Print, Web und Kampagne.',
            },
          ],
        },
      ],
    },
  ],
}
