import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { advancedSettings } from '../fields/advancedSettings'
import { mediaRelationshipField } from '../fields/editorialImages'
import { legacyMigrationFields } from '../fields/legacyMigration'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { applyEditorialDefaults } from '../hooks/autoDefaults'
import { normalizeLinksBeforeValidate } from '../hooks/normalizeLinks'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { requireFieldsForPublish } from '../hooks/validatePublishedContent'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',
  labels: { singular: 'Portfolio-Kategorie', plural: 'Portfolio-Kategorien' },
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['coverImage', 'title', 'slug', '_status', 'sortOrder', 'updatedAt'],
    description: 'Portfolio-Kategorien fuer Filter, Uebersichten und spaetere Migrationssteuerung.',
  },
  versions: { drafts: true },
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
        collection: 'portfolio-categories',
        descriptionFields: ['intro'],
        imageFields: ['coverImage'],
      }),
      requireFieldsForPublish([
        { path: 'title', label: 'Titel' },
        { path: 'slug', label: 'Slug' },
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
      name: 'sortOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Kategorie-Beschreibung fuer Portfolio-Uebersichten.',
          fields: [{ name: 'intro', label: 'Kurzbeschreibung', type: 'textarea' }],
        },
        {
          label: 'Bilder',
          description: 'Coverbild fuer Kategorie-Karten und Social-Fallbacks.',
          fields: [mediaRelationshipField({ name: 'coverImage', label: 'Coverbild' })],
        },
        {
          label: 'Advanced',
          description: 'SEO und Legacy-Migration.',
          fields: [advancedSettings([seoFields, legacyMigrationFields])],
        },
      ],
    },
  ],
}
