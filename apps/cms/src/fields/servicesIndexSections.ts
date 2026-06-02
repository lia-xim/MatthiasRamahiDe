import type { Tab } from 'payload'

import { mediaRelationshipField } from './editorialImages'
import { hrefField } from './links'

/**
 * Inhalte der Leistungs-Übersicht (SitePages, pageType 'services-index').
 *
 * WICHTIG: Alle Felder optional. Leer = eingebauter Standardinhalt (Fallback in
 * NativeServicesIndexPage.astro / nativeContent.ts). Die Leistungs-Einträge werden
 * positionell mit den Code-Defaults gemerged: ein leeres Feld erbt den Default,
 * Bild-Layout/Theme/Übersicht-Reihenfolge bleiben Code-Möblierung.
 *
 * Headline + „Hervorgehobenes Wort": der Renderer setzt das hervorgehobene Wort als
 * Substring kursiv — funktioniert auch mitten im Wort (z. B. „Großformat__druck.__").
 */
export const servicesIndexSectionsTab: Tab = {
  label: 'Leistungs-Übersicht',
  description:
    'Inhalte der Leistungs-Übersicht: Überblick-Text, die einzelnen Leistungen und der „Warum"-Block. Leer lassen nutzt den eingebauten Standardinhalt. Hero und Bild-Layout bleiben im Code.',
  fields: [
    {
      name: 'servicesIndex',
      type: 'group',
      label: 'Leistungs-Übersicht',
      admin: { hideGutter: true },
      fields: [
        // Überblick-Kopf
        {
          type: 'row',
          fields: [
            { name: 'overviewHeadline', label: 'Überblick — Headline', type: 'text', admin: { width: '60%' } },
            { name: 'overviewEmphasis', label: 'Hervorgehobenes Wort', type: 'text', admin: { width: '40%' } },
          ],
        },
        { name: 'overviewIntro', label: 'Überblick — Intro', type: 'textarea' },

        // Die Leistungen
        {
          name: 'items',
          label: 'Leistungen',
          type: 'array',
          maxRows: 12,
          labels: { singular: 'Leistung', plural: 'Leistungen' },
          admin: {
            initCollapsed: true,
            description: 'Reihenfolge wie im Code. Leere Felder erben den eingebauten Standard der jeweiligen Leistung.',
          },
          fields: [
            { name: 'overviewLabel', label: 'Label (Übersicht-Kachel)', type: 'text', admin: { placeholder: 'Fine Art' } },
            {
              type: 'row',
              fields: [
                { name: 'headline', label: 'Headline', type: 'text', admin: { width: '60%', placeholder: 'Fotolabor & Druck.' } },
                { name: 'emphasis', label: 'Hervorgehobenes Wort', type: 'text', admin: { width: '40%', placeholder: 'Druck.' } },
              ],
            },
            { name: 'text', label: 'Beschreibung', type: 'textarea' },
            { name: 'tags', label: 'Tags (kommagetrennt)', type: 'text', admin: { placeholder: 'Fine Art Prints, Fotobücher, Spezialmaterial' } },
            hrefField('Link-Ziel'),
            mediaRelationshipField({ name: 'image1', label: 'Bild 1' }),
            { name: 'caption1', label: 'Bildunterschrift 1', type: 'text' },
            mediaRelationshipField({ name: 'image2', label: 'Bild 2' }),
            { name: 'caption2', label: 'Bildunterschrift 2', type: 'text' },
          ],
        },

        // „Warum"-Block
        {
          type: 'row',
          fields: [
            { name: 'whyKicker', label: 'Warum — Kicker', type: 'text', admin: { width: '30%', placeholder: 'Projektablauf' } },
            { name: 'whyHeadline', label: 'Warum — Headline', type: 'text', admin: { width: '45%' } },
            { name: 'whyEmphasis', label: 'Hervorgehoben', type: 'text', admin: { width: '25%' } },
          ],
        },
        { name: 'whyLead', label: 'Warum — Einleitung', type: 'textarea' },
        {
          name: 'whyCards',
          label: 'Warum — Karten',
          type: 'array',
          maxRows: 8,
          labels: { singular: 'Karte', plural: 'Karten' },
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', label: 'Label', type: 'text', admin: { width: '35%', placeholder: 'Koordination' } },
                { name: 'emphasis', label: 'Hervorgehobenes Wort', type: 'text', admin: { width: '65%' } },
              ],
            },
            { name: 'headline', label: 'Headline', type: 'text' },
            { name: 'text', label: 'Text', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
