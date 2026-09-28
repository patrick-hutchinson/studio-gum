import {defineType, defineField} from 'sanity'

export const videoAsset = defineType({
  name: 'videoAsset',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'file',
      title: 'File',
      type: 'mux.video',
      options: {
        collapsible: false,
        collapsed: false,
      },
    }),
    defineField({
      name: 'caption',
      type: 'string',
    }),
    defineField({
      name: 'subcaption',
      type: 'string',
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text (Wichtig für SEO and Barrierefreiheit)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      file: 'file',
      subtitle: 'caption',
    },
    prepare({file, subtitle}) {
      return {
        title: 'Video',
        media: file,
        subtitle: subtitle,
      }
    },
  },
})
