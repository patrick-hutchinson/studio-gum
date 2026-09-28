import {defineArrayMember, defineField, defineType} from 'sanity'

export const videoPage = defineType({
  name: 'videoPage',
  title: 'Video Page',
  type: 'document',

  fields: [
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [defineArrayMember({type: 'videoAsset'})],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Video Page'}),
  },
})
