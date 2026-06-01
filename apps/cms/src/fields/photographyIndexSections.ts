import type { Tab } from 'payload'

import { mediaGalleryPickerComponent, mediaRelationshipField } from './editorialImages'
import { hrefField } from './links'

/**
 * Inhalte der Fotografie-Übersicht (SitePages, pageType 'photography-index').
 *
 * WICHTIG: Alle Felder optional. Leer = eingebauter Standardinhalt (Fallback in
 * NativePhotographyPage.astro / nativeContent.ts `photographyTopics`). Rückwärtskompatibel.
 *
 * Bewusst NICHT im CMS (Code-Möblierung): der code-definierte Übersichts-Hero
 * (Titel je Legacy-Variante), Theme-Wechsel (dark/light), CSS-Klassen, Bildmaße.
 */
export const photographyIndexSectionsTab: Tab = {
  label: 'Fotografie-Übersicht',
  description:
    'Die Themen-Bereiche der Fotografie-Übersicht und der Einstiegstext. Leer lassen nutzt den eingebauten Standardinhalt.',
  fields: [
    {
      name: 'photographyIndex',
      type: 'group',
      label: 'Fotografie-Übersicht',
      admin: { hideGutter: true },
      fields: [
        {
          name: 'clusterIntro',
          label: 'Einstiegstext (Absätze)',
          type: 'array',
          maxRows: 4,
          admin: { initCollapsed: true, description: 'Die Absätze im hellen „Ein Einstieg, sechs Bereiche."-Block.' },
          fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
        },
        {
          name: 'topics',
          label: 'Themen-Bereiche',
          type: 'array',
          maxRows: 10,
          labels: { singular: 'Bereich', plural: 'Bereiche' },
          admin: {
            initCollapsed: true,
            description:
              'Die Fotografie-Bereiche (Automobil, Sportwagen, …). Reihenfolge = Anzeige-Reihenfolge; heller/dunkler Wechsel wird automatisch gesetzt.',
            components: {
              beforeInput: [
                mediaGalleryPickerComponent({
                  buttonLabel: 'Bilder als Bereiche übernehmen',
                  rowDefaults: { title: '', emphasis: 'Fotografie.', text: '', linkLabel: '', href: '' },
                  title: 'Themen-Bereiche visuell zusammenstellen',
                }),
              ],
            },
          },
          fields: [
            mediaRelationshipField({ name: 'image', label: 'Bild', required: true }),
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Titel', type: 'text', required: true, admin: { width: '50%', placeholder: 'Automobil.' } },
                { name: 'emphasis', label: 'Zusatz (kursiv)', type: 'text', admin: { width: '50%', placeholder: 'Fotografie.' } },
              ],
            },
            { name: 'text', label: 'Beschreibung', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'linkLabel', label: 'Link-Text', type: 'text', admin: { width: '50%', placeholder: 'Zur Automobil Fotografie →' } },
              ],
            },
            hrefField('Link-Ziel'),
          ],
        },
      ],
    },
  ],
}
