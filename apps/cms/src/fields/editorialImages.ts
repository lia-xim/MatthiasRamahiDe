import type { Field } from 'payload'

type MediaFieldOptions = {
  adminCondition?: NonNullable<Field['admin']>['condition']
  name: string
  label: string
  description?: string
  required?: boolean
  width?: string
}

export const mediaGalleryPickerComponent = (clientProps: Record<string, unknown>) => ({
  path: '/src/admin/components/MediaGalleryPicker#MediaGalleryPicker',
  clientProps,
})

export const mediaRelationshipField = ({
  adminCondition,
  name,
  label,
  description,
  required = false,
  width,
}: MediaFieldOptions): Field => ({
  name,
  label,
  type: 'relationship',
  relationTo: 'media',
  required,
  admin: {
    allowCreate: true,
    allowEdit: true,
    appearance: 'drawer',
    condition: adminCondition,
    description:
      description ||
      'Bild aus dem Medienarchiv waehlen. Neue Bilder koennen direkt im Drawer hochgeladen und bearbeitet werden.',
    width,
  },
})

export const imageRoleField = (defaultValue = 'sequence'): Field => ({
  name: 'role',
  label: 'Rolle',
  type: 'select',
  defaultValue,
  admin: {
    description: 'Nur fuer die Bildregie. Die wichtigsten Rollen sind Hero, Sequenz, Detail und Abschluss.',
  },
  options: [
    { label: 'Hero / Leitmotiv', value: 'hero' },
    { label: 'Sequenz', value: 'sequence' },
    { label: 'Detail', value: 'detail' },
    { label: 'Abschlussmotiv', value: 'closing' },
  ],
})

export const portfolioGalleryField = (): Field => ({
  name: 'gallery',
  label: 'Bildstrecke',
  type: 'array',
  minRows: 1,
  admin: {
    initCollapsed: true,
    components: {
      beforeInput: [
        mediaGalleryPickerComponent({
          rowDefaults: {
            caption: '',
            role: 'sequence',
          },
          title: 'Bildstrecke visuell zusammenstellen',
        }),
      ],
    },
    description:
      'Die Reihenfolge ist die sichtbare Reihenfolge im Portfolio. Fuer einen schnellen Austausch reicht meistens: Bild oeffnen, anderes Medium waehlen, speichern.',
  },
  fields: [
    mediaRelationshipField({
      name: 'image',
      label: 'Bild',
      required: true,
      description: 'Dieses Motiv wird an dieser Position in der Bildstrecke angezeigt.',
    }),
    { name: 'caption', label: 'Caption', type: 'text' },
    imageRoleField(),
  ],
})
