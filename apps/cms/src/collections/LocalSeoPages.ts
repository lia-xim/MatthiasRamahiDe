import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
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

export const LocalSeoPages: CollectionConfig = {
  slug: 'local-seo-pages',
  labels: { singular: 'Lokale SEO-Seite', plural: 'Lokale SEO-Seiten' },
  admin: {
    useAsTitle: 'title',
    group: 'SEO-Cluster',
    defaultColumns: ['heroImage', 'title', 'slug', 'city', 'service', '_status', 'priority', 'updatedAt'],
    description: 'Lokale SEO-Seiten fuer bestehende und neue Suchcluster, inklusive URL-Erhalt und Canonical-Strategie.',
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
    beforeValidate: [
      normalizeLinksBeforeValidate,
      applyEditorialDefaults({
        collection: 'local-seo-pages',
        descriptionFields: ['intro', 'legacy.extractedText'],
        imageFields: ['heroImage'],
      }),
      requireFieldsForPublish([
        { path: 'title', label: 'Titel' },
        { path: 'slug', label: 'Slug' },
        { path: 'city', label: 'Stadt / Region' },
        { path: 'service', label: 'Leistung' },
        { path: 'intro', label: 'Lokale Einleitung' },
        { path: 'seo.title', label: 'SEO-Titel' },
        { path: 'seo.description', label: 'Meta-Beschreibung' },
      ]),
    ],
    afterChange: [triggerAstroRebuildAfterChange],
    afterDelete: [triggerAstroRebuildAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Titel / H1', type: 'text', required: true },
    slugField(),
    {
      name: 'priority',
      label: 'Migrations-/SEO-Prioritaet',
      type: 'select',
      defaultValue: 'later',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Hoch', value: 'high' },
        { label: 'Mittel', value: 'medium' },
        { label: 'Spaeter', value: 'later' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Nur Stadt, Leistung und lokale Einleitung muessen redaktionell sitzen.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'city', label: 'Stadt / Region', type: 'text', required: true },
                { name: 'service', label: 'Leistung', type: 'text', required: true },
              ],
            },
            { name: 'intro', label: 'Lokale Einleitung', type: 'textarea', required: true },
          ],
        },
        {
          label: 'Bilder',
          description: 'Optionales lokales Hero-Motiv. Sonst greifen Fallbacks aus SEO/Site Settings.',
          fields: [mediaRelationshipField({ name: 'heroImage', label: 'Hero-Bild' })],
        },
        {
          label: 'Inhalt',
          description: 'Lokale Vertrauenssignale, FAQ und optionale Inhaltsmodule.',
          fields: [
            {
              name: 'localProof',
              label: 'Lokale Vertrauenssignale',
              type: 'array',
              maxRows: 4,
              admin: { initCollapsed: true },
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
              admin: { initCollapsed: true },
              fields: [
                { name: 'question', label: 'Frage', type: 'text', required: true },
                { name: 'answer', label: 'Antwort', type: 'textarea', required: true },
              ],
            },
            contentBlocks,
          ],
        },
        {
          label: 'Advanced',
          description: 'Canonical-Zuordnung, Keyword-Notiz, SEO und Legacy-Migration.',
          fields: [
            advancedSettings([
              {
                name: 'canonicalServicePage',
                label: 'Kanonische Hauptseite',
                type: 'relationship',
                relationTo: 'service-pages',
                admin: {
                  allowCreate: false,
                  allowEdit: true,
                  appearance: 'drawer',
                  description: 'Zum Beispiel: Portraitfotografie Duesseldorf als Hauptseite fuer lokale Varianten.',
                },
              },
              {
                name: 'targetKeyword',
                label: 'Primaeres Keyword',
                type: 'text',
                admin: { description: 'Wird aus Leistung und Stadt vorgeschlagen, kann aber bewusst angepasst werden.' },
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
