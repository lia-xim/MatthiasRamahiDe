import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medium',
    plural: 'Medien',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Bildarchiv',
    defaultColumns: ['filename', 'title', 'category', 'orientation', 'updatedAt'],
    description: 'Zentrale Bildbibliothek mit SEO-Alttexten, Bildstimmung, Verwendungszweck und responsiven Derivaten.',
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
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 360, height: 360, position: 'centre' },
      { name: 'mobile', width: 760, withoutEnlargement: true },
      { name: 'card', width: 1100, withoutEnlargement: true },
      { name: 'hero', width: 1920, withoutEnlargement: true },
      { name: 'wide', width: 2560, withoutEnlargement: true },
    ],
  },
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
        description: 'Beschreibt das Bild knapp für SEO und Barrierefreiheit.',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'textarea',
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'select',
      index: true,
      options: [
        { label: 'Portrait', value: 'portrait' },
        { label: 'Automotive', value: 'automotive' },
        { label: 'Oldtimer', value: 'oldtimer' },
        { label: 'Motorrad', value: 'motorrad' },
        { label: 'Landschaft', value: 'landschaft' },
        { label: 'Service / Produktion', value: 'service' },
        { label: 'Atmosphäre / Detail', value: 'atmosphere' },
      ],
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Freie Schlagworte, z. B. Düsseldorf, Nacht, Showroom, Detail, Kampagne.',
      },
    },
    {
      name: 'orientation',
      label: 'Ausrichtung',
      type: 'select',
      index: true,
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
        description: 'Hilft später beim Filtern und Wiederfinden geeigneter Bilder.',
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
        { label: 'Warm / atmosphärisch', value: 'warm-atmospheric' },
        { label: 'Kalt / technisch', value: 'cool-technical' },
        { label: 'Detail / Textur', value: 'detail-texture' },
      ],
    },
    {
      name: 'usagePurpose',
      label: 'Verwendungszweck',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Teaser / Karte', value: 'teaser' },
        { label: 'Galerie', value: 'gallery' },
        { label: 'Open Graph / Social Preview', value: 'social' },
        { label: 'SEO-Seite', value: 'local-seo' },
        { label: 'Print / Referenz', value: 'print' },
        { label: 'Nicht öffentlich verwenden', value: 'internal-only' },
      ],
    },
    {
      name: 'featured',
      label: 'Featured / Favorit',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Für besonders starke Motive, die als Hero oder Portfolio-Teaser in Frage kommen.',
      },
    },
    {
      name: 'usageNotes',
      label: 'Einsatz-Hinweise',
      type: 'textarea',
      admin: {
        description: 'Zum Beispiel: gutes Hero-Motiv, nicht stark beschneiden, für Portfolio-Teaser geeignet.',
      },
    },
  ],
}
