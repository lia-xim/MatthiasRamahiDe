import type { Field, GlobalConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { triggerAstroRebuildAfterGlobalChange } from '../hooks/rebuild'

const linkFields = (): Field[] => [
  { name: 'label', label: 'Label', type: 'text', required: true },
  { name: 'href', label: 'URL', type: 'text', required: true },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
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
      label: 'Hauptnavigation',
      type: 'array',
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'Fotografie', href: '/fotografie' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Über mich', href: '/ueber-mich' },
        { label: 'Journal', href: '/journal' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
      fields: linkFields(),
    },
    {
      name: 'photographyLinks',
      label: 'Fotografie-Unterseiten',
      type: 'array',
      defaultValue: [
        { label: 'Automobil', href: '/automobil-fotografie-duesseldorf' },
        { label: 'Sportwagen', href: '/sportwagen-fotografie-duesseldorf' },
        { label: 'Oldtimer', href: '/oldtimer-fotografie-duesseldorf' },
        { label: 'Motorrad', href: '/motorrad-fotografie-duesseldorf' },
        { label: 'Portrait', href: '/portraitfotografie-duesseldorf' },
        { label: 'Landschaft', href: '/landschaftsfotografie-duesseldorf' },
      ],
      fields: linkFields(),
    },
    {
      name: 'footerLinks',
      label: 'Footer-Links',
      type: 'array',
      fields: linkFields(),
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
    {
      name: 'cta',
      label: 'Header CTA',
      type: 'group',
      fields: [
        { name: 'label', label: 'Label', type: 'text', defaultValue: 'Anfrage' },
        { name: 'href', label: 'URL', type: 'text', defaultValue: 'mailto:info@matthiasramahi.de?subject=Projektanfrage' },
      ],
    },
  ],
}
