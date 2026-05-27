import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  label: 'SEO & Social Preview',
  type: 'group',
  admin: {
    description:
      'Wird beim Speichern automatisch aus Titel, Intro/Kurztext und Bildfeldern vorbereitet. Nur fuer bewusste Overrides oeffnen.',
  },
  fields: [
    {
      name: 'title',
      label: 'SEO-Titel',
      type: 'text',
      maxLength: 70,
      admin: {
        description: 'Optionaler Override. Wenn leer, wird der Titel automatisch aus dem Seitentitel erzeugt.',
        placeholder: 'Automobilfotografie Duesseldorf | Matthias Ramahi',
      },
    },
    {
      name: 'description',
      label: 'Meta-Beschreibung',
      type: 'textarea',
      maxLength: 170,
      admin: {
        description: 'Optionaler Override. Wenn leer, wird eine knappe Beschreibung aus Kurztext oder Intro erzeugt.',
      },
    },
    {
      name: 'focusKeyword',
      label: 'Fokus-Keyword',
      type: 'text',
      admin: {
        description: 'Optionaler redaktioneller Fokus fuer Snippet, interne Links und spaetere LLM-Vorschlaege.',
        placeholder: 'Automobilfotografie Duesseldorf',
      },
    },
    {
      name: 'secondaryKeywords',
      label: 'Nebenkeywords',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Optional: verwandte Suchbegriffe oder Clusterbegriffe. Nicht stumpf im Text wiederholen.',
      },
    },
    {
      name: 'searchIntent',
      label: 'Suchintention',
      type: 'select',
      options: [
        { label: 'Informational', value: 'informational' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Local / Standort', value: 'local' },
        { label: 'Transactional / Anfrage', value: 'transactional' },
        { label: 'Navigational / Marke', value: 'navigational' },
      ],
      admin: {
        description: 'Hilft beim Schreiben von Title, Description, H1 und internen Links.',
      },
    },
    {
      name: 'internalLinkAnchors',
      label: 'Interne Link-Anker',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Gewuenschte Anchor-Texte fuer interne Links zu dieser Seite.',
      },
    },
    {
      name: 'canonicalUrl',
      label: 'Kanonische URL',
      type: 'text',
      admin: {
        description: 'Optionaler Override. Legacy-URLs oder neue Routen werden automatisch vorgeschlagen.',
        placeholder: 'https://matthiasramahi.de/portfolio.html',
      },
    },
    {
      name: 'legacyUrl',
      label: 'Legacy-URL / alte Datei',
      type: 'text',
      admin: {
        description: 'Interne Migrationsnotiz, z. B. portfolio.html oder /automobil-fotografie-duesseldorf.html.',
        placeholder: 'portfolio.html',
      },
    },
    {
      name: 'ogImage',
      label: 'Social-Bild',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Fallback ist das Hero- oder Coverbild. Fuer Social Preview idealerweise 1200x630-nah.',
      },
    },
    {
      name: 'noIndex',
      label: 'Nicht indexieren',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Nur für Entwürfe, Übergangsseiten oder bewusst private Inhalte aktivieren.',
      },
    },
  ],
}
