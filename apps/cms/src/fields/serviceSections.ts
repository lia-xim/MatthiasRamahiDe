import type { Field, Tab } from 'payload'

import { mediaRelationshipField } from './editorialImages'

/**
 * Strukturierte Inhalte der Themen-Seiten (Sportwagen, Automobil, Oldtimer, Motorrad,
 * Portrait, Landschaft) - pro Sektion einzeln im CMS pflegbar.
 *
 * WICHTIG: Alle Felder sind optional. Bleibt eine Sektion leer, rendert die Seite
 * weiterhin ihren eingebauten Standardinhalt (Fallback im jeweiligen Astro-Component).
 * Dadurch ist das Hinzufuegen dieser Felder rueckwaertskompatibel.
 */
export const serviceHeroPanels: Field = {
  name: 'heroPanels',
  label: 'Hero-Bilder fuer das Seiten-Design',
  type: 'array',
  maxRows: 6,
  admin: {
    initCollapsed: true,
    description:
      'Layout-spezifische Hero-Bilder. Automobil/Oldtimer: 1 Hauptbild. Sportwagen/Motorrad: 3 Bilder. Portrait: 4 Bilder. Landschaft: 5 Bilder. Leer lassen = eingebauter Design-Fallback.',
  },
  fields: [mediaRelationshipField({ name: 'image', label: 'Bild', required: true, galleryDefaultOpen: true })],
}

const sectionHeadingFields: Field[] = [
  { name: 'headline', label: 'Headline', type: 'text' },
  { name: 'emphasis', label: 'Hervorgehobener Teil (kursiv)', type: 'text' },
]

const linkListField = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    ...sectionHeadingFields,
    {
      name: 'items',
      label: 'Links',
      type: 'array',
      maxRows: 40,
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'href', label: 'Link', type: 'text', required: true },
      ],
    },
  ],
})

export const serviceSectionsTab: Tab = {
  label: 'Themen-Sektionen',
  description:
    'Inhalte der Themen-Seite pro Sektion. Jede Sektion ist optional - leer lassen nutzt den eingebauten Standardinhalt.',
  fields: [
    {
      name: 'heroLine2',
      label: 'Hero-Titel - zweite Zeile',
      type: 'text',
      admin: { description: 'Z. B. "Fotografie." Leer lassen = automatisch aus dem Seitentyp.' },
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
          label: 'Absaetze',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [{ name: 'text', label: 'Absatz', type: 'textarea', required: true }],
        },
      ],
    },
    {
      name: 'focusSection',
      label: 'Fokus-Sektion',
      type: 'group',
      admin: {
        description:
          'Ueberschrift und Intro der Perspektiven-/Kachel-Sektion, z. B. "Form, Material, Druckqualitaet."',
      },
      fields: [...sectionHeadingFields, { name: 'lead', label: 'Introtext', type: 'textarea' }],
    },
    {
      name: 'shootingStyles',
      label: 'Aufnahme-Stile / Perspektiven',
      type: 'array',
      maxRows: 8,
      admin: {
        initCollapsed: true,
        description: 'Bild-/Aufnahme-Perspektiven wie Exterieur, Interieur, Details oder Cinematic.',
      },
      fields: [
        mediaRelationshipField({ name: 'image', label: 'Bild' }),
        { name: 'title', label: 'Titel', type: 'text', required: true },
        { name: 'text', label: 'Beschreibung', type: 'textarea' },
      ],
    },
    {
      name: 'gallerySection',
      label: 'Galerie-Sektion',
      type: 'group',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'lead', label: 'Introtext', type: 'textarea' },
      ],
    },
    {
      name: 'portfolioTiles',
      label: 'Aktuelle Arbeiten / Galerie-Kacheln',
      type: 'array',
      maxRows: 12,
      admin: { initCollapsed: true },
      fields: [
        mediaRelationshipField({ name: 'image', label: 'Bild' }),
        { name: 'label', label: 'Label', type: 'text' },
      ],
    },
    {
      name: 'audienceSection',
      label: 'Zielgruppen-Sektion',
      type: 'group',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'lead', label: 'Introtext', type: 'textarea' },
      ],
    },
    {
      name: 'audienceCards',
      label: 'Fuer wen / passende Anfragen',
      type: 'array',
      maxRows: 8,
      admin: { initCollapsed: true, description: 'Zielgruppen mit Bild, Nummer, Titel und kurzer Beschreibung.' },
      fields: [
        mediaRelationshipField({ name: 'image', label: 'Bild' }),
        { name: 'number', label: 'Nummer / Kuerzel', type: 'text' },
        { name: 'title', label: 'Titel', type: 'text', required: true },
        { name: 'text', label: 'Beschreibung', type: 'textarea' },
      ],
    },
    {
      name: 'relatedSection',
      label: 'Verwandte Bereiche',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        { name: 'lead', label: 'Introtext', type: 'textarea' },
        {
          name: 'items',
          label: 'Karten',
          type: 'array',
          maxRows: 8,
          admin: { initCollapsed: true },
          fields: [
            mediaRelationshipField({ name: 'image', label: 'Bild' }),
            { name: 'title', label: 'Titel', type: 'text', required: true },
            { name: 'href', label: 'Link', type: 'text', required: true },
            { name: 'alt', label: 'Alt-Text', type: 'text' },
          ],
        },
      ],
    },
    linkListField('locationLinksSection', 'Vor-Ort-Links'),
    linkListField('searchLinksSection', 'Suchbegriffe'),
    {
      name: 'contactSection',
      label: 'Anfrage-Sektion',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        { name: 'lead', label: 'Introtext', type: 'textarea' },
        { name: 'emailSubject', label: 'E-Mail-Betreff', type: 'text' },
      ],
    },
  ],
}
