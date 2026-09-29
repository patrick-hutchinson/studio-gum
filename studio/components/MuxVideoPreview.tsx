import {useEffect, useState} from 'react'
import {useClient} from 'sanity'

type MuxVideoAsset = {
  _ref?: string
  playbackId?: string
  thumbTime?: number
}

const apiVersion = '2025-01-01'

function getThumbnailUrl(playbackId: string, thumbTime?: number) {
  const params = new URLSearchParams({
    width: '160',
    fit_mode: 'crop',
  })

  if (Number.isFinite(thumbTime)) {
    params.set('time', String(thumbTime))
  }

  return `https://image.mux.com/${playbackId}/thumbnail.jpg?${params.toString()}`
}

export function MuxVideoPreview({asset}: {asset?: MuxVideoAsset}) {
  const client = useClient({apiVersion})
  const [muxAsset, setMuxAsset] = useState<MuxVideoAsset | undefined>(asset)

  useEffect(() => {
    if (asset?.playbackId || !asset?._ref) {
      setMuxAsset(asset)
      return
    }

    let isMounted = true

    client
      .fetch<MuxVideoAsset | null>(
        '*[_id == $id][0]{playbackId, thumbTime}',
        {id: asset._ref},
        {perspective: 'previewDrafts'},
      )
      .then((result) => {
        if (isMounted) setMuxAsset(result || asset)
      })
      .catch(() => {
        if (isMounted) setMuxAsset(asset)
      })

    return () => {
      isMounted = false
    }
  }, [asset, client])

  if (!muxAsset?.playbackId) return null

  return (
    <img
      alt=""
      src={getThumbnailUrl(muxAsset.playbackId, muxAsset.thumbTime)}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'cover',
      }}
    />
  )
}
