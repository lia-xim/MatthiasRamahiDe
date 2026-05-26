import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { contentBlocks } from '../fields/contentBlocks'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { buildPreviewUrl } from '../livePreview'

export const SitePages: CollectionConfig = {
  slug: 'site-pages',
  labels: { singular: 'Standardseite', plural: 'Standardseiten' },
  admin: {
    useAsTitle: 'title',
    group: 'Website-Seiten',
    defaultColumns: ['title', 'pageType', 'slug', 'updatedAt'],
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
    afterChange: [triggerAstroRebuildAfterChange],
    afterDelete: [triggerAstroRebuildAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', required: true },
    slugField(),
    {
      name: 'pageType',
      label: 'Seitentyp',
      type: 'select',
      required: true,
      options: [
        { label: 'Startseite', value: 'home' },
        { label: 'Über mich', value: 'about' },
        { label: 'Kontakt', value: 'contact' },
        { label: 'Portfolio-Übersicht', value: 'portfolio-index' },
        { label: 'Leistungsübersicht', value: 'services-index' },
        { label: 'Journal-Übersicht', value: 'journal-index' },
        { label: 'Legal / Pflichtseite', value: 'legal' },
      ],
    },
    { name: 'heroImage', label: 'Hero-Bild', type: 'relationship', relationTo: 'media' },
    { name: 'teaserImage', label: 'Teaser-Bild', type: 'relationship', relationTo: 'media' },
    { name: 'intro', label: 'Einleitung', type: 'textarea' },
    {
      name: 'contactOverride',
      label: 'Kontaktmodul überschreiben',
      type: 'group',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'text', label: 'Kurztext', type: 'textarea' },
        { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text' },
      ],
    },
    contentBlocks,
    seoFields,
  ],
}
