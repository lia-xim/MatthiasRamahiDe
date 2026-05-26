import type { Field, GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

const linkFields = (): Field[] => [
  { name: 'label', label: 'Label', type: 'text', required: true },
  { name: 'href', label: 'URL', type: 'text', required: true },
]

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer / Kontakt / Social Links',
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
      name: 'statement',
      label: 'Footer-Statement',
      type: 'textarea',
      defaultValue:
        'Fotografie, die Räume öffnet. Portfolio, Aufträge und visuelle Produktion in Düsseldorf / NRW - klar kuratiert, technisch sauber und bereit für Print, Web und Kampagne.',
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Kontakt-E-Mail', type: 'email', defaultValue: 'info@matthiasramahi.de', required: true },
        { name: 'phone', label: 'Telefon', type: 'text' },
      ],
    },
    {
      name: 'locationLabel',
      label: 'Standortzeile',
      type: 'text',
      defaultValue: 'Düsseldorf / NRW',
    },
    {
      name: 'primaryLinks',
      label: 'Footer Hauptlinks',
      type: 'array',
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Leistungen', href: '/services' },
        { label: 'Journal', href: '/journal' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
      fields: linkFields(),
    },
    {
      name: 'serviceLinks',
      label: 'Fotografie & Services',
      type: 'array',
      fields: linkFields(),
    },
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      fields: [
        ...linkFields(),
        {
          name: 'platform',
          label: 'Plattform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Behance', value: 'behance' },
            { label: 'Sonstiges', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      label: 'Rechtliches',
      type: 'array',
      defaultValue: [
        { label: 'Impressum', href: '/impressum' },
        { label: 'Datenschutz', href: '/datenschutz' },
      ],
      fields: linkFields(),
    },
  ],
}
