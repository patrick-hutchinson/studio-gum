import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const press = defineType({
  name: 'press',

  type: 'document',
  orderings: [orderRankOrdering],

  fields: [
    defineField({name: 'title', type: 'string'}),
    orderRankField({type: 'press'}),
    defineField({name: 'cover', type: 'imageAsset'}),
  ],
  preview: {
    select: {
      title: 'title',
      firstImage: 'cover.file',
      count: 'gallery.length',
    },
    prepare({title, firstImage}) {
      const uploadedAt = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date())

      return {
        title: title || `Press Entry, uploaded ${uploadedAt}`,
        media: firstImage,
      }
    },
  },
})
