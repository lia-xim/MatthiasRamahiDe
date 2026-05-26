import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',
  labels: { singular: 'Portfolio-Kategorie', plural: 'Portfolio-Kategorien' },
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'slug', 'sortOrder', 'updatedAt'],
  },
  versions: { drafts: true },
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
      name: 'sortOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
    { name: 'intro', label: 'Kurzbeschreibung', type: 'textarea' },
    { name: 'coverImage', label: 'Coverbild', type: 'relationship', relationTo: 'media' },
    seoFields,
  ],
}
