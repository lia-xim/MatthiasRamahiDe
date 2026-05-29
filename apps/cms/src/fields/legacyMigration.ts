import type { Field } from 'payload'

export const legacyMigrationFields: Field = {
  name: 'legacy',
  label: 'Legacy-Migration',
  type: 'group',
  admin: {
    description:
      'Technische Herkunft aus der alten HTML-Website. Hilft beim URL-Erhalt, Review und schrittweisen 1:1-Nachbau.',
  },
  fields: [
    {
      name: 'sourceFile',
      label: 'Alte HTML-Datei',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'sourceUrl',
      label: 'Alte URL',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'migrationStatus',
      label: 'Migrationsstatus',
      type: 'select',
      defaultValue: 'seeded',
      options: [
        { label: 'Seeded aus Legacy', value: 'seeded' },
        { label: 'Redaktionell geprueft', value: 'reviewed' },
        { label: 'Astro-Komponente 1:1 nachgebaut', value: 'componentized' },
        { label: 'Live aus CMS', value: 'live' },
      ],
    },
    {
      name: 'renderSource',
      label: 'Aktive Render-Quelle',
      type: 'select',
      defaultValue: 'legacy-file',
      admin: {
        readOnly: true,
        description:
          'Technischer Status fuer Astro: legacy-file und payload-legacy-html sind reine Migrations-/Archivzustaende. native-component und structured-blocks sind release-faehige Ausgabeformen ohne rohes Body-HTML.',
      },
      options: [
        { label: 'Alte HTML-Datei (nur Migration)', value: 'legacy-file' },
        { label: 'Payload HTML-Archiv (nicht release-faehig)', value: 'payload-legacy-html' },
        { label: 'Native Astro-Komponente', value: 'native-component' },
        { label: 'Strukturierte CMS-Bloecke', value: 'structured-blocks' },
      ],
    },
    {
      name: 'renderedHeadHtml',
      label: 'Render-Head HTML',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'Aus der alten Seite extrahierter Head fuer die 1:1-Vorschau und Parity-Routen.',
      },
    },
    {
      name: 'renderedBodyHtml',
      label: 'Render-Body HTML',
      type: 'textarea',
      admin: {
        readOnly: true,
        description:
          'Header und Footer sind entfernt. Astro rendert diesen Body aus Payload, solange der Seitentyp noch nicht komplett in strukturierte Komponenten zerlegt ist.',
      },
    },
    {
      name: 'afterFooterHtml',
      label: 'Skripte nach Footer',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'Legacy-Skripte und Lightbox-Markup, die nach dem Footer standen.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'bodyClass',
          label: 'Body-Klasse',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'headerCurrent',
          label: 'Aktiver Header-Key',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'extractedHeadings',
      label: 'Extrahierte Ueberschriften',
      type: 'text',
      hasMany: true,
      admin: { readOnly: true },
    },
    {
      name: 'extractedImagePaths',
      label: 'Extrahierte Bildpfade',
      type: 'text',
      hasMany: true,
      admin: { readOnly: true },
    },
    {
      name: 'extractedText',
      label: 'Extrahierter Text',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'Reiner Text aus der alten Seite als redaktionelle Kontrollbasis.',
      },
    },
  ],
}
