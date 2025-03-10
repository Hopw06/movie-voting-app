import { List } from '@/endpoints/movie/list'
import type { CollectionConfig, FieldHook } from 'payload'
import { tr } from 'payload/i18n/tr'

const format = (val: string): string => 
    val.replace(/ /g, '-')
        .replace(/[^\w-/]+/g, '')
        .toLowerCase()

const formatSlug = (fallback: string): FieldHook => 
({ value, originalDoc, data }) => {
    
    if(typeof value === 'string') {
        return format(value)
    }

    const fallbackData = data?.[fallback] || originalDoc?.[fallback]

    if(fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
    }

    return value
}


export const Movie: CollectionConfig = {
    slug: 'movie',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
        delete: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
        update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
        read: () => true
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'url',
            type: 'text',
            required: true
        },
        {
            name: 'votes',
            type: 'number',
            required: true,
            access: {
                update: () => true
            }
        },
        {
            name: 'poster',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'overview',
            type: 'text',
            required: true
        },
        {
            name: 'tagline',
            type: 'text',
            required: false
        },
        {
            name: 'genres',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text'
                }
            ],
            required: true
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            admin: {
                position: 'sidebar'
            },
            hooks: {
                beforeValidate: [formatSlug('name')]
            }
        },
    ],
    endpoints: [List]
}
  