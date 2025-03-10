import type { CollectionConfig } from 'payload'

export const Session: CollectionConfig = {
  slug: 'session',
  access: {
    read: () => true,
  },
  fields: [
    {
        name: 'refreshToken',
        type: 'text',
        unique: true
    },
    {
        name: 'device',
        type: 'text',
    },
    {
        name: 'ip',
        type: 'text',
    },
    {
        name: 'createdAt',
        type: 'date'
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'InActive', value: 'inactive' },
        { label: 'Active', value: 'active' }
      ],
    }
  ]
}
