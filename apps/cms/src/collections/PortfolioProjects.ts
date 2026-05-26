import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { contentBlocks } from '../fields/contentBlocks'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { buildPreviewUrl } from '../livePreview'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: { singular: 'Portfolio-Projekt', plural: 'Portfolio-Projekte' },
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'category', 'featured', 'year', 'updatedAt'],
    preview: (data) => buildPreviewUrl({ collection: 'portfolio-projects', slug: data?.slug }),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 3000,
      },
    },
    maxPerDoc: 20,
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [triggerAstroRebuildAfterChange],
    afterDelete: [triggerAstroRebuildAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', required: true },
    slugField(),
    {
      name: 'featured',
      label: 'Featured-Projekt',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Kleinere Werte erscheinen weiter oben.' },
    },
    {
      name: 'publishedAt',
      label: 'Veröffentlichungsdatum',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: 'portfolio-categories',
      required: true,
    },
    {
      name: 'presentationMode',
      label: 'Art Direction',
      type: 'select',
      defaultValue: 'floating-archive',
      options: [
        { label: 'Floating Archive', value: 'floating-archive' },
        { label: 'Narrative Stage', value: 'narrative-stage' },
        { label: 'Experimental Lens', value: 'experimental-lens' },
        { label: 'Ruhige Editorial-Seite', value: 'editorial' },
      ],
      admin: {
        description: 'Steuert die visuelle Logik im Astro-Template.',
      },
    },
    { name: 'excerpt', label: 'Kurztext', type: 'textarea', required: true },
    {
      name: 'usageSummary',
      label: 'Nutzung / Ausgabe',
      type: 'textarea',
      admin: {
        description: 'Kurz notieren, wofür die Serie gedacht ist: Verkauf, Kampagne, Print, Website, freie Arbeit.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'year', label: 'Jahr', type: 'text' },
        { name: 'location', label: 'Ort', type: 'text' },
        { name: 'client', label: 'Kunde / Kontext', type: 'text' },
      ],
    },
    { name: 'coverImage', label: 'Coverbild', type: 'relationship', relationTo: 'media', required: true },
    {
      name: 'relatedServices',
      label: 'Passende Leistungen',
      type: 'relationship',
      relationTo: 'service-pages',
      hasMany: true,
    },
    {
      name: 'gallery',
      label: 'Bildstrecke',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', label: 'Bild', type: 'relationship', relationTo: 'media', required: true },
        { name: 'caption', label: 'Caption', type: 'text' },
        {
          name: 'role',
          label: 'Rolle im Projekt',
          type: 'select',
          defaultValue: 'sequence',
          options: [
            { label: 'Hero / Leitmotiv', value: 'hero' },
            { label: 'Sequenz', value: 'sequence' },
            { label: 'Detail', value: 'detail' },
            { label: 'Abschlussmotiv', value: 'closing' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      label: 'Seitenspezifischer CTA',
      type: 'group',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'text', label: 'Kurztext', type: 'textarea' },
        { name: 'buttonLabel', label: 'Button-Text', type: 'text' },
        { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text' },
      ],
    },
    contentBlocks,
    seoFields,
  ],
}
