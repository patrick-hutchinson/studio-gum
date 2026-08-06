import {defineField, defineType} from 'sanity'

export const site = defineType({
  name: 'site',
  title: 'Site',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Website Name',
      description: 'As seen on Google Search Results and Tab Bar',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Website Description',
      type: 'string',
      description: 'As seen on Google Search Results (max. 160 characters)',
      validation: (Rule) =>
        Rule.required()
          .error('Website description is required.')
          .max(160)
          .error('Website description must be 160 characters or fewer.'),
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon Source Image',
      description:
        'Upload a square image (recommended 512x512 or larger). The site will generate all favicon sizes from this source.',
      type: 'image',
      options: {
        hotspot: false,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'themeColors',
      type: 'object',
      options: {columns: 2},
      fields: [
        defineField({
          name: 'regular',
          title: 'Regular ⚪️',
          type: 'object',
          fields: [
            defineField({
              name: 'fontColor',
              title: 'Font Color',
              description:
                'Hex color used for the font when default mode is active (example: #0050ff)',
              type: 'string',
              validation: (Rule) =>
                Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
                  name: 'hex color',
                  invert: false,
                }),
            }),
            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              description:
                'Hex color used for the background when default mode is active (example: #66a3ff)',
              type: 'string',
              validation: (Rule) =>
                Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
                  name: 'hex color',
                  invert: false,
                }),
            }),
          ],
        }),
        defineField({
          name: 'yellow',
          title: 'Yellow 🟡',
          type: 'object',
          fields: [
            defineField({
              name: 'fontColor',
              title: 'Font Color',
              description:
                'Hex color used for the font when yellow mode is active (example: #0050ff)',
              type: 'string',
              validation: (Rule) =>
                Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
                  name: 'hex color',
                  invert: false,
                }),
            }),
            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              description:
                'Hex color used for the background when yellow mode is active (example: #66a3ff)',
              type: 'string',
              validation: (Rule) =>
                Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
                  name: 'hex color',
                  invert: false,
                }),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'address',
      type: 'object',
      options: {
        columns: 3,
      },
      fields: [
        {
          name: 'street',
          title: 'Street',
          type: 'string',
          options: {columns: 3}, // full width
        },
        {
          name: 'postcode',
          title: 'Post code',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      type: 'string',
    }),
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'string'},
            {name: 'link', title: 'url', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'taxCode',
      type: 'string',
    }),
    defineField({
      name: 'vatNo',
      type: 'string',
    }),
    defineField({
      name: 'sdiCode',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site'}),
  },
})
