import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { contentBlocks } from '../fields/contentBlocks'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { buildPreviewUrl } from '../livePreview'

export const ServicePages: CollectionConfig = {
  slug: 'service-pages',
  labels: { singular: 'Service-Seite', plural: 'Service-Seiten' },
  admin: {
    useAsTitle: 'title',
    group: 'Website-Seiten',
    defaultColumns: ['title', 'slug', 'serviceType', 'featured', 'updatedAt'],
    preview: (data) => buildPreviewUrl({ collection: 'service-pages', slug: data?.slug }),
  },
  versions: { drafts: { autosave: { interval: 3000 } }, maxPerDoc: 20 },
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
      label: 'Auf Übersichten hervorheben',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
    {
      name: 'serviceType',
      label: 'Leistungstyp',
      type: 'select',
      required: true,
      options: [
        { label: 'Automobilfotografie', value: 'automotive' },
        { label: 'Sportwagenfotografie', value: 'sportwagen' },
        { label: 'Oldtimer-Fotografie', value: 'oldtimer' },
        { label: 'Motorrad-Fotografie', value: 'motorrad' },
        { label: 'Portraitfotografie', value: 'portrait' },
        { label: 'Landschaftsfotografie', value: 'landschaft' },
        { label: 'Fotolabor & Druck', value: 'fotolabor' },
        { label: 'Grossformatdruck', value: 'grossformatdruck' },
        { label: 'Werbetechnik', value: 'werbetechnik' },
        { label: 'Webdesign & SEO', value: 'webdesign-seo' },
        { label: 'Videografie', value: 'videografie' },
        { label: 'Sonstiges', value: 'other' },
      ],
    },
    { name: 'heroImage', label: 'Hero-Bild', type: 'relationship', relationTo: 'media', required: true },
    { name: 'teaserImage', label: 'Teaser-Bild', type: 'relationship', relationTo: 'media' },
    { name: 'intro', label: 'Einleitung', type: 'textarea', required: true },
    {
      name: 'audience',
      label: 'Für wen geeignet',
      type: 'array',
      maxRows: 8,
      fields: [{ name: 'item', label: 'Zielgruppe / Einsatz', type: 'text', required: true }],
    },
    {
      name: 'proofPoints',
      label: 'Beweispunkte / Nutzen',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'text', label: 'Text', type: 'textarea', required: true },
      ],
    },
    {
      name: 'faq',
      label: 'FAQ',
      type: 'array',
      fields: [
        { name: 'question', label: 'Frage', type: 'text', required: true },
        { name: 'answer', label: 'Antwort', type: 'textarea', required: true },
      ],
    },
    {
      name: 'relatedPages',
      label: 'Verwandte Seiten',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'href', label: 'URL', type: 'text', required: true },
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
