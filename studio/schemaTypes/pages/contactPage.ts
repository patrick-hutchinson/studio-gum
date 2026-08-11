import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',

  fields: [
    defineField({
      name: 'lead',
      title: 'Lead Text',
      type: 'portableText',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Contact Page'}),
  },
})
