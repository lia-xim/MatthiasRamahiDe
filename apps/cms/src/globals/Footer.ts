import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { adminGroups } from '../admin/structure'
import { linkFields } from '../fields/links'
import { normalizeGlobalLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer / Kontakt / Social Links',
  admin: {
    group: adminGroups.globals,
    hideAPIURL: true,
    description: 'Footer-Struktur, Kontaktzeile, Linkspalten, Social Links und rechtliche Links.',
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
          label: 'Basis',
          description: 'Footer-Text, Kontakt und Standort.',
          fields: [
            {
              name: 'statement',
              label: 'Footer-Statement',
              type: 'textarea',
              defaultValue:
                'Fotografie, die Raeume oeffnet. Portfolio, Auftraege und visuelle Produktion in Duesseldorf / NRW - klar kuratiert, technisch sauber und bereit fuer Print, Web und Kampagne.',
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
              defaultValue: 'Duesseldorf / NRW',
            },
            {
              name: 'copyright',
              label: 'Copyright-Zeile',
              type: 'text',
              defaultValue: '(c) 2026 Matthias Ramahi',
            },
          ],
        },
        {
          label: 'Linkspalten',
          description: 'Sichtbare Footer-Navigation und Service-Cluster.',
          fields: [
            {
              name: 'aboutLink',
              label: '?ber-mich-Link im Footer',
              type: 'group',
              fields: linkFields(),
            },
            {
              name: 'columns',
              label: 'Footer-Spalten',
              type: 'array',
              admin: {
                initCollapsed: true,
                description: 'Canonical Footer-Struktur aus der Legacy-Seite. Jede Spalte bekommt eine Ueberschrift und Links.',
              },
              fields: [
                { name: 'label', label: 'Spaltenueberschrift', type: 'text', required: true },
                {
                  name: 'links',
                  label: 'Links',
                  type: 'array',
                  minRows: 1,
                  admin: { initCollapsed: true },
                  fields: linkFields(),
                },
              ],
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
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
            {
              name: 'serviceLinks',
              label: 'Fotografie & Services',
              type: 'array',
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
          ],
        },
        {
          label: 'Social & Rechtliches',
          description: 'Social Profile und Pflichtseiten.',
          fields: [
            {
              name: 'socialLinks',
              label: 'Social Links',
              type: 'array',
              admin: { initCollapsed: true },
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
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
          ],
        },
      ],
    },
  ],
}
