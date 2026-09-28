import {defineField, defineType, defineArrayMember} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],

  fields: [
    orderRankField({type: 'project'}),
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'portableText',
    }),
    defineField({name: 'thumbnail', title: 'Thumbnail', type: 'mediaAsset'}),
    defineField({name: 'gallery', title: 'Gallery', type: 'gallery'}),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
        }),
      ],
    }),
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
    defineField({
      name: 'slug',
      title: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      thumbnail: 'thumbnail.0.file',
    },
    prepare({title, thumbnail}) {
      return {
        title,
        media: thumbnail,
      }
    },
  },
})
