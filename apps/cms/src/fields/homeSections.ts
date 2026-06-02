import type { Tab } from 'payload'

import { mediaGalleryPickerComponent, mediaRelationshipField } from './editorialImages'
import { hrefField } from './links'

/**
 * Inhalte der Startseite — pro Sektion einzeln im CMS pflegbar.
 *
 * WICHTIG: Alle Felder sind optional. Bleibt eine Sektion (oder ein einzelnes Feld)
 * leer, rendert die Startseite weiterhin ihren eingebauten Standardinhalt
 * (Fallback in NativeHomePage.astro / nativeContent.ts). Dadurch ist das Hinzufügen
 * dieser Felder vollständig rückwärtskompatibel — nichts bricht, wenn ein Doc die
 * Felder noch nicht gesetzt hat.
 *
 * Bewusst NICHT im CMS (technische Möblierung, bleibt Code):
 * srcset/sizes/width/height, CSS-Klassen, Marquee-Logik, Theme-Attribute.
 */

// Wiederkehrendes Headline-Paar: Haupttext + optional kursiv hervorgehobenes Wort.
// Leer lassen = die eingebaute Marken-Headline der Sektion bleibt stehen.
const headlineFields = (description = 'Optional. Leer lassen = eingebaute Headline bleibt.'): Tab['fields'] => [
  {
    type: 'row',
    fields: [
      { name: 'headline', label: 'Headline', type: 'text', admin: { width: '60%', description } },
      {
        name: 'headlineEmphasis',
        label: 'Hervorgehobenes Wort (kursiv)',
        type: 'text',
        admin: { width: '40%', description: 'Optional. Wird kursiv/akzentuiert gesetzt.' },
      },
    ],
  },
]

export const homeSectionsTab: Tab = {
  label: 'Startseite',
  description:
    'Alle Inhalte der Startseite, sektionsweise. Jede Sektion ist optional — leer lassen nutzt den eingebauten Standardinhalt. Reine Technik (Bildgrößen, Layout) wird automatisch gesetzt.',
  fields: [
    // 1) Statement: „Bilder, die einen Raum verändern."
    {
      name: 'homeStatement',
      label: 'Sektion: Statement',
      type: 'group',
      admin: { description: 'Heller Block direkt unter dem Hero („Bilder, die einen Raum verändern.").' },
      fields: [
        ...headlineFields(),
        {
          name: 'body',
          label: 'Absätze',
          type: 'array',
          maxRows: 3,
          admin: { initCollapsed: true, description: 'Fließtext rechts neben der Headline.' },
          fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
        },
      ],
    },

    // 2) „Sechs Bereiche. Eine Linse." — die sechs Themen-Kacheln
    {
      name: 'homeChapters',
      label: 'Sektion: Bereiche („Sechs Bereiche")',
      type: 'group',
      admin: { description: 'Dunkles Raster mit den Fotografie-Bereichen.' },
      fields: [
        ...headlineFields(),
        { name: 'intro', label: 'Intro-Text', type: 'textarea', admin: { description: 'Kurzer Text unter der Headline.' } },
        {
          name: 'items',
          label: 'Bereich-Kacheln',
          type: 'array',
          maxRows: 8,
          labels: { singular: 'Kachel', plural: 'Kacheln' },
          admin: {
            initCollapsed: true,
            description: 'Reihenfolge = Anzeige-Reihenfolge. Die Kacheln erscheinen bewusst ohne Meta-Nummern.',
            components: {
              beforeInput: [
                mediaGalleryPickerComponent({
                  buttonLabel: 'Bilder als Kacheln übernehmen',
                  rowDefaults: { title: '', href: '' },
                  title: 'Bereich-Kacheln visuell zusammenstellen',
                }),
              ],
            },
          },
          fields: [
            mediaRelationshipField({ name: 'image', label: 'Bild', required: true }),
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Titel', type: 'text', required: true, admin: { width: '100%' } },
              ],
            },
            hrefField('Link-Ziel'),
          ],
        },
      ],
    },

    // 3) „Ausgewählte Arbeiten" — Portfolio-Teaser (Bilder laufen automatisch)
    {
      name: 'homeSelectedWorks',
      label: 'Sektion: Ausgewählte Arbeiten',
      type: 'group',
      admin: {
        description:
          'Heller Portfolio-Teaser. Die laufenden Bilder werden automatisch aus dem Portfolio gezogen — hier nur Headline und Intro.',
      },
      fields: [
        ...headlineFields(),
        { name: 'intro', label: 'Intro-Text', type: 'textarea' },
      ],
    },

    // 4) „Hinter der Kamera" — Über-mich-Block mit Portrait
    {
      name: 'homeAbout',
      label: 'Sektion: Hinter der Kamera',
      type: 'group',
      admin: { description: 'Dunkler Über-mich-Block mit Portrait links und Text rechts.' },
      fields: [
        { name: 'kicker', label: 'Kicker (kleine Zeile oben)', type: 'text', admin: { description: 'Optional, z. B. „Über mich".' } },
        ...headlineFields(),
        mediaRelationshipField({ name: 'image', label: 'Portrait-Bild', description: 'Optional. Leer = eingebautes Portrait.' }),
        {
          name: 'body',
          label: 'Absätze',
          type: 'array',
          maxRows: 3,
          admin: { initCollapsed: true },
          fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
        },
      ],
    },

    // 5) „Weitere Leistungen" — die Leistungs-Zeilen
    {
      name: 'homeServices',
      label: 'Sektion: Weitere Leistungen',
      type: 'group',
      admin: { description: 'Helle Liste mit den weiteren Dienstleistungen.' },
      fields: [
        ...headlineFields(),
        { name: 'intro', label: 'Intro-Text', type: 'textarea' },
        {
          name: 'items',
          label: 'Leistungs-Zeilen',
          type: 'array',
          maxRows: 12,
          labels: { singular: 'Zeile', plural: 'Zeilen' },
          admin: { initCollapsed: true, description: 'Reihenfolge = Anzeige-Reihenfolge.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Titel', type: 'text', required: true, admin: { width: '100%' } },
              ],
            },
            { name: 'text', label: 'Kurzbeschreibung', type: 'textarea' },
            hrefField('Link-Ziel'),
          ],
        },
      ],
    },

    // 6) „Journal" — die drei Journal-Karten
    {
      name: 'homeJournal',
      label: 'Sektion: Journal',
      type: 'group',
      admin: { description: 'Dunkler Journal-Teaser mit Karten.' },
      fields: [
        ...headlineFields('Optional. Leer lassen = „Journal.".'),
        { name: 'intro', label: 'Intro-Text', type: 'textarea' },
        {
          name: 'items',
          label: 'Journal-Karten',
          type: 'array',
          maxRows: 6,
          labels: { singular: 'Karte', plural: 'Karten' },
          admin: {
            initCollapsed: true,
            description: 'Reihenfolge = Anzeige-Reihenfolge.',
            components: {
              beforeInput: [
                mediaGalleryPickerComponent({
                  buttonLabel: 'Bilder als Karten übernehmen',
                  rowDefaults: { title: '', text: '', href: '' },
                  title: 'Journal-Karten visuell zusammenstellen',
                }),
              ],
            },
          },
          fields: [
            mediaRelationshipField({ name: 'image', label: 'Bild', required: true }),
            { name: 'title', label: 'Titel', type: 'text', required: true },
            { name: 'text', label: 'Kurztext', type: 'textarea' },
            hrefField('Link-Ziel'),
          ],
        },
      ],
    },
  ],
}
