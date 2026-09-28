export const mediaAssetFragment = `{
  "medium": {
    "type": select(_type == "imageAsset" => "image", _type == "videoAsset" => "video"),

    "_id": select(
      _type == "imageAsset" => file.asset->_id,
      _type == "videoAsset" => file.asset->assetId,
      true => null
    ),

    "url": select(_type == "imageAsset" => file.asset->url, true => null),
    "extension": select(_type == "imageAsset" => file.asset->extension, true => null),
    "mimeType": select(_type == "imageAsset" => file.asset->mimeType, true => null),
    
    "lqip": select(_type == "imageAsset" => file.asset->metadata.lqip, true => null),
    "width": select(_type == "imageAsset" => file.asset->metadata.dimensions.width, true => null),
    "height": select(_type == "imageAsset" => file.asset->metadata.dimensions.height, true => null),


    "status": select(_type == "videoAsset" => file.asset->status, true => null),
    "assetId": select(_type == "videoAsset" => file.asset->assetId, true => null),
    "playbackId": select(_type == "videoAsset" => file.asset->playbackId, true => null),
    "duration": select(_type == "videoAsset" => file.asset->data.duration, true => null),
    "staticRenditions": select(
      _type == "videoAsset" => coalesce(file.asset->data.static_renditions.files, file.asset->static_renditions.files, []),
      true => null
    ),
    "aspect_ratio": select(_type == "videoAsset" => file.asset->data.aspect_ratio,
      true => null
    ),


    "credit": select(
      _type == "imageAsset" => credit,
      _type == "videoAsset" => credit,
      true => null
    ),

    "caption": select(
      _type == "imageAsset" => caption,
      _type == "videoAsset" => caption,
      true => null
    ),

    "subcaption": select(
      _type == "imageAsset" => subcaption,
      _type == "videoAsset" => subcaption,
      true => null
    ),
  }
}`;

export const imageAssetFragment = `{
  "medium": {
    "type": "image",

    "_id": file.asset->_id,

    "url": file.asset->url,
    "extension": file.asset->extension,
    "mimeType": file.asset->mimeType,
    
    "lqip": file.asset->metadata.lqip,
    "width": file.asset->metadata.dimensions.width,
    "height": file.asset->metadata.dimensions.height,

    credit,
    caption,
    subcaption,
  }
}`;
