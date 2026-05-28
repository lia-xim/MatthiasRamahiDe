import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'
import { adminGroups, editorPagination } from '../admin/structure'
import { enrichMediaAfterChange } from '../hooks/enrichMedia'
import { prepareMediaBeforeValidate } from '../hooks/prepareMedia'

const fastImportImageSizes = process.env.PAYLOAD_FAST_MEDIA_IMPORT === 'true'
const imageSizes = fastImportImageSizes
  ? [{ name: 'thumb', width: 360, height: 360, position: 'centre' as const, formatOptions: { format: 'webp' as const, options: { quality: 82 } } }]
  : [
      { name: 'thumb', width: 360, height: 360, position: 'centre' as const, formatOptions: { format: 'webp' as const, options: { quality: 82 } } },
      { name: 'mobile', width: 760, withoutEnlargement: true, formatOptions: { format: 'webp' as const, options: { quality: 82 } } },
      { name: 'card', width: 1100, withoutEnlargement: true, formatOptions: { format: 'webp' as const, options: { quality: 84 } } },
      { name: 'hero', width: 1920, withoutEnlargement: true, formatOptions: { format: 'webp' as const, options: { quality: 84 } } },
      { name: 'wide', width: 2560, withoutEnlargement: true, formatOptions: { format: 'webp' as const, options: { quality: 84 } } },
      { name: 'thumbAvif', width: 360, height: 360, position: 'centre' as const, formatOptions: { format: 'avif' as const, options: { quality: 58 } } },
      { name: 'mobileAvif', width: 760, withoutEnlargement: true, formatOptions: { format: 'avif' as const, options: { quality: 58 } } },
      { name: 'cardAvif', width: 1100, withoutEnlargement: true, formatOptions: { format: 'avif' as const, options: { quality: 60 } } },
      { name: 'heroAvif', width: 1920, withoutEnlargement: true, formatOptions: { format: 'avif' as const, options: { quality: 60 } } },
      { name: 'wideAvif', width: 2560, withoutEnlargement: true, formatOptions: { format: 'avif' as const, options: { quality: 60 } } },
    ]

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medium',
    plural: 'Medien',
  },
  admin: {
    useAsTitle: 'title',
    group: adminGroups.media,
    defaultColumns: ['filename', 'title', 'alt', 'category', 'orientation', 'featured', 'updatedAt'],
    listSearchableFields: ['filename', 'title', 'alt', 'caption', 'category', 'tags', 'imageType', 'usagePurpose', 'legacySourcePath'],
    pagination: editorPagination,
    hideAPIURL: true,
    description:
      'Zentrale Bildbibliothek mit Vorschau, Alt-Texten, Bildstimmung, Verwendungszweck, Focal Point und responsiven Derivaten.',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumb',
    displayPreview: true,
    crop: true,
    focalPoint: true,
    imageSizes,
  },
  hooks: {
    beforeValidate: [prepareMediaBeforeValidate],
    afterChange: [enrichMediaAfterChange],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Nur das, was beim schnellen Bildwechsel wirklich wichtig ist.',
          fields: [
            {
              name: 'title',
              label: 'Bildtitel',
              type: 'text',
              required: true,
              admin: {
                description: 'Redaktioneller Name, nicht nur Dateiname.',
              },
            },
            {
              name: 'alt',
              label: 'Alt-Text',
              type: 'text',
              required: true,
              admin: {
                description: 'Pflichtfeld: beschreibt das Bild knapp fuer SEO und Barrierefreiheit.',
              },
            },
            {
              name: 'caption',
              label: 'Caption',
              type: 'textarea',
              admin: {
                description: 'Optionaler sichtbarer Begleittext fuer Galerien, Journal oder Portfolio.',
              },
            },
            {
              name: 'featured',
              label: 'Featured / Favorit',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Fuer besonders starke Motive, die als Hero oder Portfolio-Teaser in Frage kommen.',
              },
            },
          ],
        },
        {
          label: 'Advanced',
          description: 'Filter, Mood und redaktionelle Auswahl fuer Hero, Teaser und Galerien.',
          fields: [
            {
              name: 'category',
              label: 'Kategorie',
              type: 'select',
              defaultValue: 'uncategorized',
              index: true,
              options: [
                { label: 'Noch nicht einsortiert', value: 'uncategorized' },
                { label: 'Portrait', value: 'portrait' },
                { label: 'Automotive', value: 'automotive' },
                { label: 'Oldtimer', value: 'oldtimer' },
                { label: 'Motorrad', value: 'motorrad' },
                { label: 'Landschaft', value: 'landschaft' },
                { label: 'Service / Produktion', value: 'service' },
                { label: 'Atmosphaere / Detail', value: 'atmosphere' },
              ],
            },
            {
              name: 'tags',
              label: 'Tags',
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Freie Schlagworte, z. B. Duesseldorf, Nacht, Showroom, Detail, Kampagne.',
              },
            },
            {
              name: 'orientation',
              label: 'Ausrichtung',
              type: 'select',
              index: true,
              admin: {
                description: 'Wird beim Upload automatisch vorbelegt und kann manuell korrigiert werden.',
              },
              options: [
                { label: 'Hochformat', value: 'portrait' },
                { label: 'Querformat', value: 'landscape' },
                { label: 'Quadrat', value: 'square' },
                { label: 'Panorama', value: 'panorama' },
              ],
            },
            {
              name: 'imageType',
              label: 'Bildtyp / Motiv',
              type: 'select',
              hasMany: true,
              index: true,
              options: [
                { label: 'Portrait', value: 'portrait' },
                { label: 'Automotive', value: 'automotive' },
                { label: 'Landschaft', value: 'landscape' },
                { label: 'Motorrad', value: 'motorcycle' },
                { label: 'Detail', value: 'detail' },
                { label: 'Editorial', value: 'editorial' },
                { label: 'Atmosphere', value: 'atmosphere' },
                { label: 'Making-of', value: 'behind-the-scenes' },
              ],
              admin: {
                description: 'Hilft spaeter beim Filtern und Wiederfinden geeigneter Bilder.',
              },
            },
            {
              name: 'visualTone',
              label: 'Bildstimmung',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Dunkel / cineastisch', value: 'dark-cinematic' },
                { label: 'Hell / editorial', value: 'light-editorial' },
                { label: 'Warm / atmosphaerisch', value: 'warm-atmospheric' },
                { label: 'Kalt / technisch', value: 'cool-technical' },
                { label: 'Detail / Textur', value: 'detail-texture' },
              ],
            },
            {
              name: 'usagePurpose',
              label: 'Verwendungszweck',
              type: 'select',
              hasMany: true,
              defaultValue: ['gallery'],
              options: [
                { label: 'Hero', value: 'hero' },
                { label: 'Teaser / Karte', value: 'teaser' },
                { label: 'Galerie', value: 'gallery' },
                { label: 'Open Graph / Social Preview', value: 'social' },
                { label: 'SEO-Seite', value: 'local-seo' },
                { label: 'Print / Referenz', value: 'print' },
                { label: 'Nicht oeffentlich verwenden', value: 'internal-only' },
              ],
            },
            {
              name: 'usageNotes',
              label: 'Einsatz-Hinweise',
              type: 'textarea',
              admin: {
                description: 'Zum Beispiel: gutes Hero-Motiv, nicht stark beschneiden, fuer Portfolio-Teaser geeignet.',
              },
            },
          ],
        },
        {
          label: 'Technik',
          description: 'Automatisch erzeugte Performance-Daten fuer Blur-Placeholder und Farb-Fallback.',
          fields: [
            {
              name: 'dominantColor',
              label: 'Dominante Farbe',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Automatisch fuer Platzhalter-Hintergruende erzeugt.',
              },
            },
            {
              name: 'blurDataUrl',
              label: 'Blur/LQIP Placeholder',
              type: 'textarea',
              admin: {
                readOnly: true,
                description: 'Automatisch erzeugte Mini-WebP-Version als Data URL.',
              },
            },
            {
              name: 'legacySourcePath',
              label: 'Legacy-Bildpfad',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Pfad aus der alten HTML-/Assets-Struktur, damit Bildverwendung nachvollziehbar bleibt.',
              },
            },
          ],
        },
      ],
    },
  ],
}
