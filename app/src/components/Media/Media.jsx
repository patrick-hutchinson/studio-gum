"use client";

import ImageCompose from "./components/Image/ImageCompose";
import VideoCompose from "./components/Video/VideoCompose";

const Media = ({
  className,
  medium,
  eager = false,
  objectFit = "contain",
  objectPosition = "center",
  onLoad,
  paused,
  playVideo = true,
  showPlaceholder = true,
  showVideoPoster = true,
}) => {
  if (!medium || (!medium.url && !medium.playbackId)) return undefined;

  switch (medium.type) {
    case "image":
      return (
        <ImageCompose
          medium={medium}
          className={className}
          eager={eager}
          objectFit={objectFit}
          objectPosition={objectPosition}
          onLoad={onLoad}
        />
      );
    case "video":
      return (
        <VideoCompose
          medium={medium}
          className={className}
          eager={eager}
          objectFit={objectFit}
          objectPosition={objectPosition}
          paused={paused}
          playVideo={playVideo}
          showPlaceholder={showPlaceholder}
          showVideoPoster={showVideoPoster}
        />
      );
    default:
      return null;
  }
};

Media.displayName = "Media";
export default Media;
