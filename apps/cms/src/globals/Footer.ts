import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { linkFields } from '../fields/links'
import { normalizeGlobalLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

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
    beforeValidate: [normalizeGlobalLinksBeforeValidate],
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
      name: 'statementHighlight',
      label: 'Hervorgehobener Teil im Footer-Statement',
      type: 'text',
      defaultValue: 'Marke, Sammlung und Druck',
      admin: {
        description: 'Optionaler Text, der im Frontend innerhalb des Footer-Statements betont werden kann.',
      },
    },
    {
      name: 'studioLink',
      label: 'Studio-Link im Footer',
      type: 'group',
      fields: linkFields(),
    },
    {
      name: 'columns',
      label: 'Footer-Spalten',
      type: 'array',
      admin: {
        description: 'Canonical Footer-Struktur aus der Legacy-Seite. Jede Spalte bekommt eine Überschrift und Links.',
      },
      fields: [
        { name: 'label', label: 'Spaltenüberschrift', type: 'text', required: true },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          minRows: 1,
          fields: linkFields(),
        },
      ],
    },
    {
      name: 'copyright',
      label: 'Copyright-Zeile',
      type: 'text',
      defaultValue: '© 2026 Matthias Ramahi',
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
        { label: 'Kontakt', href: '/contact.html#anfrage' },
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
      fields: linkFields({ platform: true }),
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
