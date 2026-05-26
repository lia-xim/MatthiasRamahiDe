import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { contentBlocks } from '../fields/contentBlocks'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { triggerAstroRebuildAfterChange, triggerAstroRebuildAfterDelete } from '../hooks/rebuild'
import { buildPreviewUrl } from '../livePreview'

export const LocalSeoPages: CollectionConfig = {
  slug: 'local-seo-pages',
  labels: { singular: 'Lokale SEO-Seite', plural: 'Lokale SEO-Seiten' },
  admin: {
    useAsTitle: 'title',
    group: 'SEO-Cluster',
    defaultColumns: ['title', 'city', 'service', 'canonicalServicePage', 'updatedAt'],
    preview: (data) => buildPreviewUrl({ collection: 'local-seo-pages', slug: data?.slug }),
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
    { name: 'title', label: 'Titel / H1', type: 'text', required: true },
    slugField(),
    {
      name: 'priority',
      label: 'Migrations-/SEO-Priorität',
      type: 'select',
      defaultValue: 'later',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Hoch', value: 'high' },
        { label: 'Mittel', value: 'medium' },
        { label: 'Später', value: 'later' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', label: 'Stadt / Region', type: 'text', required: true },
        { name: 'service', label: 'Leistung', type: 'text', required: true },
      ],
    },
    {
      name: 'canonicalServicePage',
      label: 'Kanonische Hauptseite',
      type: 'relationship',
      relationTo: 'service-pages',
      admin: {
        description: 'Zum Beispiel: Portraitfotografie Düsseldorf als Hauptseite für lokale Varianten.',
      },
    },
    { name: 'heroImage', label: 'Hero-Bild', type: 'relationship', relationTo: 'media' },
    {
      name: 'targetKeyword',
      label: 'Primäres Keyword',
      type: 'text',
      admin: { description: 'Nur zur redaktionellen Orientierung, nicht automatisch plump ausgeben.' },
    },
    { name: 'intro', label: 'Lokale Einleitung', type: 'textarea', required: true },
    {
      name: 'localProof',
      label: 'Lokale Vertrauenssignale',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'text', label: 'Text', type: 'textarea', required: true },
      ],
    },
    {
      name: 'localFaq',
      label: 'Lokale FAQ',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'question', label: 'Frage', type: 'text', required: true },
        { name: 'answer', label: 'Antwort', type: 'textarea', required: true },
      ],
    },
    contentBlocks,
    seoFields,
  ],
}
