import {site} from './site'

import {pages} from './pages'
import {project} from './project'
import {imageAsset} from './types/media/imageAsset'
import {videoAsset} from './types/media/videoAsset'
import {mediaAsset} from './types/media/mediaAsset'
import {portableText} from './types/portableText'
import {link} from './types/link'
import {gallery} from './types/media/gallery'

export const schemaTypes = [
  site,
  project,
  ...pages,
  imageAsset,
  videoAsset,
  mediaAsset,
  gallery,
  portableText,
  link,
]
