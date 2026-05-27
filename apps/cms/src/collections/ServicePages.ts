import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
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
import { requireFieldsForPublish } from '../hooks/validatePublishedContent'
import { buildPreviewUrl } from '../livePreview'

export const ServicePages: CollectionConfig = {
  slug: 'service-pages',
  labels: { singular: 'Service-Seite', plural: 'Service-Seiten' },
  admin: {
    useAsTitle: 'title',
    group: 'Website-Seiten',
    defaultColumns: ['heroImage', 'title', 'slug', 'serviceType', '_status', 'featured', 'updatedAt'],
    description: 'Leistungsseite mit alter URL, Hero, Nutzenargumenten, FAQ, CTA und SEO.',
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
    beforeValidate: [
      normalizeLinksBeforeValidate,
      applyEditorialDefaults({
        collection: 'service-pages',
        descriptionFields: ['intro', 'legacy.extractedText'],
        imageFields: ['heroImage', 'teaserImage'],
      }),
      requireFieldsForPublish([
        { path: 'title', label: 'Titel' },
        { path: 'slug', label: 'Slug' },
        { path: 'serviceType', label: 'Leistungstyp' },
        { path: 'heroImage', label: 'Hero-Bild' },
        { path: 'intro', label: 'Einleitung' },
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
      label: 'Auf Uebersichten hervorheben',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Basis',
          description: 'Die wenigen Felder, die den Inhalt der Leistungsseite tragen.',
          fields: [
            {
              name: 'serviceType',
              label: 'Leistungstyp',
              type: 'select',
              required: true,
              admin: {
                description: 'Wird beim Speichern aus Titel oder Slug vorgeschlagen, falls leer.',
              },
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
            { name: 'intro', label: 'Einleitung', type: 'textarea', required: true },
          ],
        },
        {
          label: 'Bilder',
          description: 'Hero und Teaser sind die wichtigsten Austauschpunkte.',
          fields: [
            mediaRelationshipField({
              name: 'heroImage',
              label: 'Hero-Bild',
              required: true,
              description: 'Grosses Leitmotiv der Seite. Wird auch als Social-Bild genutzt, wenn kein OG-Bild gesetzt ist.',
            }),
            mediaRelationshipField({
              name: 'teaserImage',
              label: 'Teaser-Bild',
              description: 'Optional. Wenn leer, nutzt das System automatisch das Hero-Bild.',
            }),
          ],
        },
        {
          label: 'Inhalt',
          description: 'Nutzen, Zielgruppen, FAQ und optionale Module.',
          fields: [
            {
              name: 'audience',
              label: 'Fuer wen geeignet',
              type: 'array',
              maxRows: 8,
              admin: { initCollapsed: true },
              fields: [{ name: 'item', label: 'Zielgruppe / Einsatz', type: 'text', required: true }],
            },
            {
              name: 'proofPoints',
              label: 'Beweispunkte / Nutzen',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: [
                { name: 'label', label: 'Label', type: 'text', required: true },
                { name: 'text', label: 'Text', type: 'textarea', required: true },
              ],
            },
            {
              name: 'faq',
              label: 'FAQ',
              type: 'array',
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
          description: 'CTA, interne Links, SEO und Legacy-Migration.',
          fields: [
            advancedSettings([
              {
                name: 'relatedPages',
                label: 'Verwandte Seiten',
                type: 'array',
                maxRows: 6,
                admin: { initCollapsed: true },
                fields: linkFields(),
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
              seoFields,
              legacyMigrationFields,
            ]),
          ],
        },
      ],
    },
  ],
}
