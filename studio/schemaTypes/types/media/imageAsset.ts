import {defineType, defineField} from 'sanity'

const formatDate = (value?: string) => {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return new Date().toLocaleDateString()
  return date.toLocaleDateString()
}

const formatMegabytes = (bytes?: number) => {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes <= 0) return null
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)}MB`
}

const getPreviewString = (value?: string | {value?: string}[]) => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.find((entry) => entry?.value)?.value || ''
  return ''
}

export const imageAsset = defineType({
  name: 'imageAsset',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'file',
      title: 'File',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'caption', type: 'string', hidden: true}),
    defineField({
      name: 'credit',
      title: 'Credit',
      description:
        'Compila solo se questa immagine ha un credito diverso da quello della galleria.',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      file: 'file',
      caption: 'caption',
      credit: 'credit',
      uploadedAt: 'file.asset._createdAt',
      size: 'file.asset.size',
    },
    prepare({file, caption, credit, uploadedAt, size}) {
      const title = getPreviewString(caption).trim() || 'Image'
      const subtitleParts = [credit?.trim() || `Uploaded ${formatDate(uploadedAt)}`]
      const sizeLabel = formatMegabytes(size)

      if (sizeLabel) subtitleParts.push(sizeLabel)
      if (typeof size === 'number' && size > 2 * 1024 * 1024) {
        subtitleParts.push('⚠️ File is above 2 MB')
      }

      const subtitle = subtitleParts.join(' • ')

      return {
        title,
        media: file,
        subtitle,
      }
    },
  },
})
