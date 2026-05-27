import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { advancedSettings } from '../fields/advancedSettings'
import { contentBlocks } from '../fields/contentBlocks'
import { mediaRelationshipField, portfolioGalleryField } from '../fields/editorialImages'
import { legacyMigrationFields } from '../fields/legacyMigration'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { applyEditorialDefaults } from '../hooks/autoDefaults'
import { normalizeLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { requireFieldsForPublish } from '../hooks/validatePublishedContent'
import { buildPreviewUrl } from '../livePreview'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: { singular: 'Portfolio-Projekt', plural: 'Portfolio-Projekte' },
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['coverImage', 'title', 'slug', 'category', '_status', 'featured', 'updatedAt'],
    description: 'Kuratiertes Projekt mit Cover, Galerie, Kontext, SEO und Vorschau.',
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
    beforeValidate: [
      normalizeLinksBeforeValidate,
      applyEditorialDefaults({
        collection: 'portfolio-projects',
        descriptionFields: ['excerpt', 'usageSummary', 'legacy.extractedText'],
        imageFields: ['coverImage'],
      }),
      requireFieldsForPublish([
        { path: 'title', label: 'Titel' },
        { path: 'slug', label: 'Slug' },
        { path: 'category', label: 'Kategorie' },
        { path: 'coverImage', label: 'Coverbild' },
        { path: 'excerpt', label: 'Kurztext' },
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
      label: 'Veroeffentlichungsdatum',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Projektkontext und kurzer Teasertext.',
          fields: [
            {
              name: 'category',
              label: 'Kategorie',
              type: 'relationship',
              relationTo: 'portfolio-categories',
              required: true,
              admin: {
                allowCreate: true,
                allowEdit: true,
                appearance: 'drawer',
              },
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
                description: 'Advanced Art Direction. Der Default funktioniert fuer die meisten Serien.',
              },
            },
            { name: 'excerpt', label: 'Kurztext', type: 'textarea', required: true },
            {
              name: 'usageSummary',
              label: 'Nutzung / Ausgabe',
              type: 'textarea',
              admin: {
                description: 'Kurz notieren, wofuer die Serie gedacht ist: Verkauf, Kampagne, Print, Website, freie Arbeit.',
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
          ],
        },
        {
          label: 'Bilder',
          description: 'Hier wechselst du Cover und Bildstrecke am schnellsten.',
          fields: [
            mediaRelationshipField({
              name: 'coverImage',
              label: 'Coverbild',
              required: true,
              description: 'Leitmotiv fuer Projektseite, Portfolio-Karte und Social Preview.',
            }),
            portfolioGalleryField(),
          ],
        },
        {
          label: 'Inhalt',
          description: 'Optionale Module und Verknuepfungen.',
          fields: [
            {
              name: 'relatedServices',
              label: 'Passende Leistungen',
              type: 'relationship',
              relationTo: 'service-pages',
              hasMany: true,
              admin: {
                allowCreate: false,
                allowEdit: true,
                appearance: 'drawer',
              },
            },
            contentBlocks,
          ],
        },
        {
          label: 'Advanced',
          description: 'CTA, SEO und Legacy-Migration.',
          fields: [
            advancedSettings([
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
              seoFields,
              legacyMigrationFields,
            ]),
          ],
        },
      ],
    },
  ],
}
