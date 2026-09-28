import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',

  fields: [
    defineField({name: 'portrait', type: 'mediaAsset'}),
    defineField({
      name: 'lead',
      title: 'Lead Text',
      type: 'portableText',
    }),
    defineField({
      name: 'currentTeam',
      title: 'Current Team',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'pastTeam',
      title: 'Past Team',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'About Page'}),
  },
})
