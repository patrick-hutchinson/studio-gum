import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',

  fields: [
    defineField({
      name: 'lead',
      title: 'Lead Text',
      type: 'portableText',
    }),

    defineField({name: 'portrait', type: 'mediaAsset'}),

    defineField({
      name: 'credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({
              name: 'entries',
              title: 'Entries',
              type: 'array',
              of: [{type: 'string', name: 'entry'}],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'About Page'}),
  },
})
