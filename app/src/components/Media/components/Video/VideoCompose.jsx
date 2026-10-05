import { useInView } from "framer-motion";
import NextImage from "next/image";
import { useRef, useState, useEffect } from "react";

import { useVideoPlayer } from "@/components/Media/hooks/useVideoPlayer";

import Video from "./Video";
import Placeholder from "../Placeholder";

import styles from "../../Media.module.css";

const VideoCompose = ({
  medium,
  className,
  eager = false,
  objectFit = "cover",
  objectPosition = "center",
  paused,
  playVideo = true,
  showPlaceholder = true,
  showVideoPoster = true,
}) => {
  const videoRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  // Calculate the media's width upon loading

  const [aspectWidth, aspectHeight] = medium.aspect_ratio.split(":");
  const aspectRatio = aspectWidth / aspectHeight;
  const poster = `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=1200`;

  const playerState = { eager, isLoaded, setIsLoaded, isInView: eager || isInView };
  const playerControls = useVideoPlayer();
  const controlledPlayerControls = { ...playerControls, paused: paused ?? playerControls.paused };

  return (
    <div className={`${styles.mediaContainer} ${className}`}>
      <div ref={videoRef} className={styles.videoPlayer} style={{ aspectRatio: aspectRatio }}>
        {playVideo ? (
          <>
            {showPlaceholder ? (
              <Placeholder medium={medium} isLoaded={isLoaded} objectFit={objectFit} objectPosition={objectPosition} />
            ) : null}
            <Video
              medium={medium}
              objectFit={objectFit}
              objectPosition={objectPosition}
              playerState={playerState}
              playerControls={controlledPlayerControls}
              showPoster={showVideoPoster}
            />
          </>
        ) : (
          <NextImage
            src={poster}
            alt={medium.caption || "Video thumbnail"}
            fill
            unoptimized
            draggable={false}
            sizes="(min-width: 1280px) 33vw, 100vw"
            style={{
              objectFit,
              objectPosition,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VideoCompose;
