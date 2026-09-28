import {defineArrayMember, defineField, defineType} from 'sanity'
import GalleryDropzoneInput from '../../../components/GalleryDropzoneInput'

export const gallery = defineType({
  name: 'gallery',
  title: 'Image & Video Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'array',
      of: [defineArrayMember({type: 'imageAsset'}), defineArrayMember({type: 'videoAsset'})],
      components: {
        input: GalleryDropzoneInput,
      },
    }),
    defineField({
      name: 'credit',
      title: 'Foto Credit',
      description: 'Credito predefinito. Quello sulla singola immagine lo sostituisce.',
      type: 'string',
    }),
  ],
})

export const galleryRow = defineType({
  name: 'galleryRow',
  title: 'Gallery Row',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'gallery',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      media: 'media',
      previewImage: 'media.media.0.file',
    },
    prepare({media, previewImage}) {
      const count = media?.media?.length || 0

      return {
        title: `Gallery row`,
        subtitle: `${count} media item${count === 1 ? '' : 's'}`,
        media: previewImage,
      }
    },
  },
})
