import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { contentBlocks } from '../fields/contentBlocks'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { buildPreviewUrl } from '../livePreview'

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  labels: { singular: 'Journal-Beitrag', plural: 'Journal-Beiträge' },
  admin: {
    useAsTitle: 'title',
    group: 'Journal',
    defaultColumns: ['title', 'category', 'featured', 'publishedAt', 'updatedAt'],
    preview: (data) => buildPreviewUrl({ collection: 'journal-posts', slug: data?.slug }),
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
      label: 'Featured-Beitrag',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Behind the Scenes', value: 'behind-the-scenes' },
        { label: 'Automotive', value: 'automotive' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Landschaft / Print', value: 'landscape-print' },
        { label: 'Technik / Prozess', value: 'process' },
      ],
    },
    { name: 'publishedAt', label: 'Veröffentlichungsdatum', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'coverImage', label: 'Coverbild', type: 'relationship', relationTo: 'media', required: true },
    { name: 'excerpt', label: 'Kurztext', type: 'textarea', required: true },
    { name: 'readingTime', label: 'Lesezeit in Minuten', type: 'number', admin: { position: 'sidebar' } },
    { name: 'tags', label: 'Tags', type: 'text', hasMany: true },
    {
      name: 'relatedPages',
      label: 'Passende Links',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'href', label: 'URL', type: 'text', required: true },
      ],
    },
    contentBlocks,
    seoFields,
  ],
}
