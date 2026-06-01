import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { adminGroups } from '../admin/structure'
import { hrefField, linkFields } from '../fields/links'
import { normalizeGlobalLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: adminGroups.globals,
    hideAPIURL: true,
    description: 'Hauptnavigation, Fotografie-Dropdown und Header-CTA passend zur sichtbaren Website-Struktur.',
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
          label: 'Header',
          description: 'Was oben auf jeder Seite sichtbar ist.',
          fields: [
            {
              name: 'primary',
              label: 'Hauptnavigation',
              type: 'array',
              defaultValue: [
                { label: 'Home', href: '/' },
                { label: 'Fotografie', href: '/fotografie.html' },
                { label: 'Portfolio', href: '/portfolio.html' },
                { label: 'Ueber mich', href: '/ueber-mich.html' },
                { label: 'Journal', href: '/blog.html' },
                { label: 'Kontakt', href: '/contact.html#anfrage' },
              ],
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
            {
              name: 'cta',
              label: 'Header CTA',
              type: 'group',
              fields: [
                { name: 'label', label: 'Label', type: 'text', defaultValue: 'Anfrage' },
                hrefField('URL', 'mailto:info@matthiasramahi.de?subject=Projektanfrage'),
              ],
            },
          ],
        },
        {
          label: 'Fotografie-Menue',
          description: 'Dropdown-/Mobile-Links unter Fotografie.',
          fields: [
            {
              name: 'photographyLinks',
              label: 'Fotografie-Unterseiten',
              type: 'array',
              defaultValue: [
                { label: 'Automobil', href: '/automobil-fotografie.html' },
                { label: 'Sportwagen', href: '/sportwagen-fotografie.html' },
                { label: 'Oldtimer', href: '/oldtimer-fotografie.html' },
                { label: 'Motorrad', href: '/motorrad-fotografie.html' },
                { label: 'Portrait', href: '/portraitfotografie.html' },
                { label: 'Landschaft', href: '/landschaftsfotografie.html' },
              ],
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
          ],
        },
        {
          label: 'Weitere Links',
          description: 'Sekundaere Navigation und rechtliche Links.',
          fields: [
            {
              name: 'footerLinks',
              label: 'Footer-Links',
              type: 'array',
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
            {
              name: 'legalLinks',
              label: 'Rechtliches',
              type: 'array',
              defaultValue: [
                { label: 'Impressum', href: '/impressum.html' },
                { label: 'Datenschutz', href: '/datenschutz.html' },
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
