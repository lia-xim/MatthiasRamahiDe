import type { Field } from 'payload'

import { advancedSettings } from './advancedSettings'

type LinkFieldOptions = {
  description?: boolean
  platform?: boolean
}

const internalHosts = new Set(['matthiasramahi.de', 'www.matthiasramahi.de', 'localhost', '127.0.0.1'])

const canonicalInternalHrefAliases: Record<string, string> = {
  '/about': '/ueber-mich.html',
  '/blog': '/blog.html',
  '/contact': '/contact.html',
  '/index': '/',
  '/index.html': '/',
  '/journal': '/blog.html',
  '/kontakt': '/contact.html',
  '/leistungen': '/leistungen.html',
  '/portfolio': '/portfolio.html',
  '/services': '/leistungen.html',
  '/ueber-mich': '/ueber-mich.html',
}

const canonicalizeInternalHref = (href: string) => {
  const [pathWithSearch, hash = ''] = href.split('#')
  const [rawPath, search = ''] = pathWithSearch.split('?')
  const suffix = `${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
  const path = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '')
  const lowerPath = path.toLowerCase()

  if (canonicalInternalHrefAliases[lowerPath]) return `${canonicalInternalHrefAliases[lowerPath]}${suffix}`
  if (/^\/[^/.]+$/i.test(path)) return `${path}.html${suffix}`

  return `${path || '/'}${suffix}`
}

export const normalizeHref = (value: unknown) => {
  const href = typeof value === 'string' ? value.trim() : ''
  if (!href) return href
  if (/^(mailto:|tel:|#)/i.test(href)) return href

  if (/^www\./i.test(href)) return `https://${href}`

  try {
    const url = new URL(href)
    if (internalHosts.has(url.hostname)) return canonicalizeInternalHref(`${url.pathname}${url.search}${url.hash}` || '/')
    return url.toString()
  } catch {
    return canonicalizeInternalHref(href.startsWith('/') ? href : `/${href}`)
  }
}

export const hrefField = (label = 'URL / interner Link', defaultValue?: string): Field => ({
  name: 'href',
  label,
  type: 'text',
  required: true,
  defaultValue,
  admin: {
    description:
      'Interne Links am besten root-relativ eintragen, z. B. /portfolio. Vollstaendige eigene URLs werden automatisch gekuerzt.',
    placeholder: '/portfolio',
  },
  hooks: {
    beforeValidate: [({ value }) => normalizeHref(value)],
  },
  validate: (value: unknown) => {
    const href = normalizeHref(value)
    if (!href) return 'URL ist erforderlich.'
    if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(href)) return true
    return 'Bitte internen Pfad mit /, vollstaendige URL, mailto:, tel: oder #anker verwenden.'
  },
})

export const linkFields = ({ description = false, platform = false }: LinkFieldOptions = {}): Field[] => [
  { name: 'label', label: 'Label', type: 'text', required: true },
  hrefField(),
  ...(description ? [{ name: 'description', label: 'Beschreibung', type: 'textarea' } satisfies Field] : []),
  advancedSettings([
    {
      name: 'seoPurpose',
      label: 'Link-Zweck',
      type: 'select',
      defaultValue: 'contextual',
      options: [
        { label: 'Kontext / interne Verlinkung', value: 'contextual' },
        { label: 'Navigation', value: 'navigation' },
        { label: 'Conversion / Anfrage', value: 'conversion' },
        { label: 'Quelle / externer Beleg', value: 'citation' },
        { label: 'Rechtliches', value: 'legal' },
        { label: 'Social / Profil', value: 'social' },
      ],
    },
    {
      name: 'rel',
      label: 'Suchmaschinen-Relation',
      type: 'select',
      defaultValue: 'follow',
      options: [
        { label: 'Follow', value: 'follow' },
        { label: 'NoFollow', value: 'nofollow' },
        { label: 'Sponsored', value: 'sponsored' },
        { label: 'UGC', value: 'ugc' },
      ],
    },
    {
      name: 'openInNewTab',
      label: 'In neuem Tab oeffnen',
      type: 'checkbox',
      defaultValue: false,
    },
    ...(platform
      ? [
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
          } satisfies Field,
        ]
      : []),
  ]),
]
