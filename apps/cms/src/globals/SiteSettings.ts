import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
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
    { name: 'siteName', label: 'Website-Name', type: 'text', defaultValue: 'Matthias Ramahi Fotografie', required: true },
    { name: 'siteUrl', label: 'Live-URL', type: 'text', defaultValue: 'https://matthiasramahi.de', required: true },
    { name: 'locale', label: 'Locale', type: 'text', defaultValue: 'de_DE', required: true },
    { name: 'defaultMetaTitle', label: 'Standard SEO-Titel', type: 'text' },
    { name: 'defaultMetaDescription', label: 'Standard Meta-Beschreibung', type: 'textarea' },
    { name: 'ownerName', label: 'Inhaber / Fotograf', type: 'text', defaultValue: 'Matthias Ramahi' },
    { name: 'email', label: 'Kontakt-E-Mail', type: 'email', defaultValue: 'info@matthiasramahi.de', required: true },
    { name: 'phone', label: 'Telefon', type: 'text' },
    { name: 'instagramUrl', label: 'Instagram', type: 'text' },
    { name: 'defaultOgImage', label: 'Standard Social-Bild', type: 'relationship', relationTo: 'media' },
    {
      name: 'footerStatement',
      label: 'Footer-Statement',
      type: 'textarea',
      defaultValue:
        'Fotografie, die Räume öffnet. Portfolio, Aufträge und visuelle Produktion in Düsseldorf / NRW — klar kuratiert, technisch sauber und bereit für Print, Web und Kampagne.',
    },
  ],
}
