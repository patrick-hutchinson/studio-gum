import {createElement} from 'react'
import {defineType, defineField} from 'sanity'
import {MuxVideoPreview} from '../../../components/MuxVideoPreview'

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
      asset: 'file.asset',
      file: 'file',
      subtitle: 'caption',
    },
    prepare({asset, file, subtitle}) {
      return {
        title: 'Video',
        media: asset ? () => createElement(MuxVideoPreview, {asset}) : file,
        subtitle: subtitle,
      }
    },
  },
})
