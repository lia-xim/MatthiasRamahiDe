import type { Access, CollectionConfig } from 'payload'

import { authenticated } from '../access/publishedOrAuthenticated'

const allowFirstUserOrAuthenticated: Access = async ({ req }) => {
  if (req.user) return true

  const existingUsers = await req.payload.count({ collection: 'users' })
  return existingUsers.totalDocs === 0
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  auth: {
    useAPIKey: true,
  },
  access: {
    read: authenticated,
    create: allowFirstUserOrAuthenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
  ],
}
