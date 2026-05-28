import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { adminGroups, editorPagination } from '../admin/structure'
import { advancedSettings } from '../fields/advancedSettings'
import { contentBlocks } from '../fields/contentBlocks'
import { mediaRelationshipField } from '../fields/editorialImages'
import { legacyMigrationFields } from '../fields/legacyMigration'
import { linkFields } from '../fields/links'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { applyEditorialDefaults } from '../hooks/autoDefaults'
import { normalizeLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { requireFieldsForPublish, requireMediaAltForPublish } from '../hooks/validatePublishedContent'
import { buildPreviewUrl } from '../livePreview'

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  labels: { singular: 'Journal-Beitrag', plural: 'Journal-Beitraege' },
  admin: {
    useAsTitle: 'title',
    group: adminGroups.journal,
    defaultColumns: ['coverImage', 'title', 'slug', 'category', '_status', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'category', 'excerpt', 'tags', 'seo.title', 'seo.description', 'legacy.sourceFile'],
    pagination: editorPagination,
    hideAPIURL: true,
    description: 'Journal-Beitrag mit Cover, Excerpt, Artikel-SEO, internen Links und Vorschau.',
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
    beforeValidate: [
      normalizeLinksBeforeValidate,
      applyEditorialDefaults({
        collection: 'journal-posts',
        descriptionFields: ['excerpt', 'legacy.extractedText'],
        imageFields: ['coverImage'],
      }),
      requireFieldsForPublish([
        { path: 'title', label: 'Titel' },
        { path: 'slug', label: 'Slug' },
        { path: 'category', label: 'Kategorie' },
        { path: 'publishedAt', label: 'Veroeffentlichungsdatum' },
        { path: 'coverImage', label: 'Coverbild' },
        { path: 'excerpt', label: 'Kurztext' },
        { path: 'seo.title', label: 'SEO-Titel' },
        { path: 'seo.description', label: 'Meta-Beschreibung' },
      ]),
      requireMediaAltForPublish([
        { path: 'coverImage', label: 'Coverbild' },
        { path: 'seo.ogImage', label: 'Social-Bild' },
        { path: 'blocks.items.image', label: 'Bildsequenz' },
      ]),
    ],
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
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Kategorie, Datum und Kurztext. Datum und SEO werden bei Bedarf automatisch gesetzt.',
          fields: [
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
            {
              name: 'publishedAt',
              label: 'Veroeffentlichungsdatum',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            { name: 'excerpt', label: 'Kurztext', type: 'textarea', required: true },
          ],
        },
        {
          label: 'Bilder',
          description: 'Coverbild fuer Artikel, Listing und Social Preview.',
          fields: [
            mediaRelationshipField({
              name: 'coverImage',
              label: 'Coverbild',
              required: true,
              description: 'Wird als Artikelbild und als Social-Bild genutzt, wenn kein OG-Bild gesetzt ist.',
            }),
          ],
        },
        {
          label: 'Inhalt',
          description: 'Tags, passende Links und Artikelmodule.',
          fields: [
            { name: 'tags', label: 'Tags', type: 'text', hasMany: true },
            {
              name: 'relatedPages',
              label: 'Passende Links',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: linkFields(),
            },
            contentBlocks,
          ],
        },
        {
          label: 'Advanced',
          description: 'Lesezeit, SEO und Legacy-Migration.',
          fields: [
            advancedSettings([
              {
                name: 'readingTime',
                label: 'Lesezeit in Minuten',
                type: 'number',
                admin: {
                  description: 'Wird aus Inhalt und Excerpt geschaetzt, wenn leer.',
                },
              },
              seoFields,
              legacyMigrationFields,
            ]),
          ],
        },
      ],
    },
  ],
}
