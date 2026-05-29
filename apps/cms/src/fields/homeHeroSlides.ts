import type { Field } from 'payload'

import { mediaGalleryPickerComponent, mediaRelationshipField } from './editorialImages'

export const homeHeroSlides: Field = {
  name: 'heroSlides',
  label: 'Hero-Slider',
  type: 'array',
  minRows: 1,
  maxRows: 8,
  labels: {
    singular: 'Slide',
    plural: 'Slides',
  },
  admin: {
    components: {
      beforeInput: [
        mediaGalleryPickerComponent({
          buttonLabel: 'Bilder als Slides uebernehmen',
          intro: 'Mehrere Hero-Bilder in grosser Vorschau auswaehlen. Die Slide-Texte kannst du danach pro Zeile feinziehen.',
          rowDefaults: {
            headlineLine1: 'Fotografie',
            headlineLine2: '',
            lead: '',
            primaryHref: '#anfrage',
            primaryLabel: 'Projekt anfragen',
            secondaryHref: '/portfolio.html',
            secondaryLabel: 'Arbeiten ansehen',
          },
          title: 'Hero-Slider visuell zusammenstellen',
        }),
      ],
    },
    initCollapsed: true,
    description:
      'Startseiten-Slideshow: Pro Slide ein Bild, Titel, Kurztext und optionale Buttons. Die Reihenfolge hier ist die sichtbare Reihenfolge im Hero.',
  },
  fields: [
    mediaRelationshipField({
      name: 'image',
      label: 'Slide-Bild',
      required: true,
      description: 'Dieses Bild wird fuer den aktuellen Hero-Slide verwendet.',
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'headlineLine1',
          label: 'Titel Zeile 1',
          type: 'text',
          required: true,
          defaultValue: 'Fotografie',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'headlineLine2',
          label: 'Titel Zeile 2',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Optional. Leer lassen, wenn der Slide nur eine Titelzeile braucht.',
          },
        },
      ],
    },
    {
      name: 'lead',
      label: 'Kurztext',
      type: 'textarea',
      admin: {
        description: 'Optionaler Text unter dem Titel. Kurz halten, damit der Hero ruhig bleibt.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryLabel',
          label: 'Button 1 Text',
          type: 'text',
          defaultValue: 'Projekt anfragen',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'primaryHref',
          label: 'Button 1 Ziel',
          type: 'text',
          defaultValue: '#anfrage',
          admin: {
            width: '50%',
            placeholder: '#anfrage',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'secondaryLabel',
          label: 'Button 2 Text',
          type: 'text',
          defaultValue: 'Arbeiten ansehen',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'secondaryHref',
          label: 'Button 2 Ziel',
          type: 'text',
          defaultValue: '/portfolio.html',
          admin: {
            width: '50%',
            placeholder: '/portfolio.html',
          },
        },
      ],
    },
  ],
}
