import type { Tab } from 'payload'

import { mediaRelationshipField } from './editorialImages'

/**
 * Strukturierte Inhalte der Themen-Seiten (Sportwagen, Automobil, Oldtimer, Motorrad,
 * Portrait, Landschaft) — pro Sektion einzeln im CMS pflegbar.
 *
 * WICHTIG: Alle Felder sind optional. Bleibt eine Sektion leer, rendert die Seite
 * weiterhin ihren eingebauten Standardinhalt (Fallback im jeweiligen Astro-Component).
 * Dadurch ist das Hinzufügen dieser Felder rückwärtskompatibel — nichts bricht, wenn
 * ein Doc die Felder noch nicht gesetzt hat.
 */
export const serviceSectionsTab: Tab = {
  label: 'Themen-Sektionen',
  description:
    'Inhalte der Themen-Seite pro Sektion. Jede Sektion ist optional — leer lassen nutzt den eingebauten Standardinhalt.',
  fields: [
    {
      name: 'heroPanels',
      label: 'Hero-Panels (Triptychon, max. 3 Bilder)',
      type: 'array',
      maxRows: 3,
      admin: {
        initCollapsed: true,
        description: 'Die drei Bilder des Hero-Triptychons (Desktop). Auf dem Handy wird das erste Bild groß gezeigt.',
      },
      fields: [mediaRelationshipField({ name: 'image', label: 'Bild', required: true, galleryDefaultOpen: true })],
    },
    {
      name: 'heroLine2',
      label: 'Hero-Titel — zweite Zeile',
      type: 'text',
      admin: { description: 'Z. B. „Fotografie." Leer lassen = automatisch aus dem Seitentyp.' },
    },
    {
      name: 'statement',
      label: 'Statement-Sektion',
      type: 'group',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'emphasis', label: 'Hervorgehobenes Wort (kursiv)', type: 'text' },
        {
          name: 'body',
          label: 'Absätze',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
        },
      ],
    },
    {
      name: 'shootingStyles',
      label: 'Aufnahme-Stile (Karussell)',
      type: 'array',
      maxRows: 8,
      admin: { initCollapsed: true, description: 'Die Bild-/Aufnahme-Perspektiven (Exterieur, Interieur, Detail, Cinematic …).' },
      fields: [
        mediaRelationshipField({ name: 'image', label: 'Bild' }),
        { name: 'title', label: 'Titel', type: 'text', required: true },
        { name: 'text', label: 'Beschreibung', type: 'textarea' },
      ],
    },
    {
      name: 'portfolioTiles',
      label: 'Aktuelle Arbeiten (Galerie)',
      type: 'array',
      maxRows: 12,
      admin: { initCollapsed: true },
      fields: [
        mediaRelationshipField({ name: 'image', label: 'Bild' }),
        { name: 'label', label: 'Label', type: 'text' },
      ],
    },
    {
      name: 'audienceCards',
      label: 'Für wen (Liste)',
      type: 'array',
      maxRows: 8,
      admin: { initCollapsed: true, description: 'Zielgruppen mit Bild, Nummer, Titel und kurzer Beschreibung.' },
      fields: [
        mediaRelationshipField({ name: 'image', label: 'Bild' }),
        { name: 'number', label: 'Nummer / Kürzel', type: 'text' },
        { name: 'title', label: 'Titel', type: 'text', required: true },
        { name: 'text', label: 'Beschreibung', type: 'textarea' },
      ],
    },
  ],
}
