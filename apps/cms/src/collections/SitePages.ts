import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { adminGroups, editorPagination } from '../admin/structure'
import { advancedSettings } from '../fields/advancedSettings'
import { contentBlocks } from '../fields/contentBlocks'
import { mediaRelationshipField } from '../fields/editorialImages'
import { legacyMigrationFields } from '../fields/legacyMigration'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { applyEditorialDefaults } from '../hooks/autoDefaults'
import { normalizeLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { requireFieldsForPublish } from '../hooks/validatePublishedContent'
import { buildPreviewUrl } from '../livePreview'

export const SitePages: CollectionConfig = {
  slug: 'site-pages',
  labels: { singular: 'Standardseite', plural: 'Standardseiten' },
  admin: {
    useAsTitle: 'title',
    group: adminGroups.website,
    defaultColumns: ['teaserImage', 'title', 'pageType', 'slug', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'pageType', 'intro', 'seo.title', 'seo.description', 'legacy.sourceFile'],
    pagination: editorPagination,
    hideAPIURL: true,
    description: 'Standardseiten wie Startseite, About, Kontakt, Uebersichten und Legal-Seiten.',
    preview: (data) => buildPreviewUrl({ collection: 'site-pages', slug: data?.slug }),
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
        collection: 'site-pages',
        descriptionFields: ['intro', 'legacy.extractedText'],
        imageFields: ['heroImage', 'teaserImage'],
      }),
      requireFieldsForPublish([
        { path: 'title', label: 'Titel' },
        { path: 'slug', label: 'Slug' },
        { path: 'pageType', label: 'Seitentyp' },
        { path: 'seo.title', label: 'SEO-Titel' },
        { path: 'seo.description', label: 'Meta-Beschreibung' },
      ]),
    ],
    afterChange: [triggerAstroRebuildAfterChange],
    afterDelete: [triggerAstroRebuildAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', required: true },
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Seitentyp und kurzer Einstieg. SEO wird automatisch vorbereitet.',
          fields: [
            {
              name: 'pageType',
              label: 'Seitentyp',
              type: 'select',
              required: true,
              options: [
                { label: 'Startseite', value: 'home' },
                { label: 'Ueber mich', value: 'about' },
                { label: 'Kontakt', value: 'contact' },
                { label: 'Portfolio-Uebersicht', value: 'portfolio-index' },
                { label: 'Leistungsuebersicht', value: 'services-index' },
                { label: 'Journal-Uebersicht', value: 'journal-index' },
                { label: 'Legal / Pflichtseite', value: 'legal' },
              ],
            },
            { name: 'intro', label: 'Einleitung', type: 'textarea' },
          ],
        },
        {
          label: 'Bilder',
          description: 'Die zentralen Bildpositionen dieser Seite.',
          fields: [
            mediaRelationshipField({ name: 'heroImage', label: 'Hero-Bild' }),
            mediaRelationshipField({
              name: 'teaserImage',
              label: 'Teaser-Bild',
              description: 'Optional. Wenn leer, nutzt das System automatisch das Hero-Bild.',
            }),
          ],
        },
        {
          label: 'Inhalt',
          description: 'Optionale strukturierte Inhaltsmodule.',
          fields: [contentBlocks],
        },
        {
          label: 'Advanced',
          description: 'Kontakt-Override, SEO und Legacy-Migration.',
          fields: [
            advancedSettings([
              {
                name: 'contactOverride',
                label: 'Kontaktmodul ueberschreiben',
                type: 'group',
                fields: [
                  { name: 'headline', label: 'Headline', type: 'text' },
                  { name: 'text', label: 'Kurztext', type: 'textarea' },
                  { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text' },
                ],
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
