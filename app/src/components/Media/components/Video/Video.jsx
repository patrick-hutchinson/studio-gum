import { useEffect } from "react";
import MuxVideo from "@mux/mux-video/react";

import { getVideoSource } from "@/components/Media/lib/getVideoUrl";

const Video = ({
  medium,
  objectFit = "cover",
  objectPosition = "center",
  playerState,
  playerControls,
  showPoster = true,
}) => {
  const source = getVideoSource(medium);
  const VideoElement = source?.type === "hls" ? MuxVideo : "video";

  useEffect(() => {
    const player = playerControls.playerRef.current;
    if (!player) return;

    player.muted = playerControls.muted ?? true;

    if (playerControls.paused) {
      player.pause();
      return;
    }

    const playPromise = player.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }, [playerControls.muted, playerControls.paused, playerControls.playerRef]);

  if (!playerState.isInView || !source?.url) return null;

  return (
    <VideoElement
      ref={playerControls.playerRef}
      src={source.url}
      autoPlay
      playsInline
      loop
      muted={playerControls.muted ?? true}
      preload={playerState.eager ? "auto" : "metadata"}
      poster={showPoster ? `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=1200` : undefined}
      style={{
        position: "relative",
        opacity: 1,
        zIndex: 0,
        width: "100%",
        height: "100%",
        objectFit,
        objectPosition,
      }}
      onCanPlay={() => playerState.setIsLoaded(true)}
      onTimeUpdate={playerControls.onTimeUpdate}
      onLoadedMetadata={playerControls.onLoadedMetadata}
    />
  );
};

export default Video;
