import { useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";

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
  const useMuxPlayer = Boolean(medium?.playbackId);

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

  if (!playerState.isInView || (!source?.url && !useMuxPlayer)) return null;

  if (useMuxPlayer) {
    return (
      <MuxPlayer
        ref={playerControls.playerRef}
        playbackId={medium.playbackId}
        streamType="on-demand"
        autoPlay
        controls
        playsInline
        loop
        muted={playerControls.muted ?? true}
        preload={playerState.eager ? "auto" : "metadata"}
        poster={showPoster ? `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=1200` : undefined}
        accentColor="var(--focus)"
        metadata={{
          video_id: medium.assetId || medium.playbackId,
          video_title: medium.caption || "Video",
        }}
        style={{
          "--media-accent-color": "var(--focus)",
          "--seek-backward-button": "none",
          "--seek-forward-button": "none",
          "--playback-rate-button": "none",
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
  }

  return (
    <video
      ref={playerControls.playerRef}
      src={source.url}
      autoPlay
      controls
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
