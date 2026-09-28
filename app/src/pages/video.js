import { useCallback, useState } from "react";

import FullscreenView from "@/components/FullscreenView/FullscreenView";
import Media from "@/components/Media/Media";
import { useSampleColor } from "@/helpers/sampleColor";
import { getVideoPage } from "@/lib/sanity/fetch";
import styles from "@/styles/pages/VideoPage.module.scss";

function getMuxThumbnailMedium(medium) {
  if (!medium?.playbackId) return null;

  return {
    type: "image",
    url: `https://image.mux.com/${medium.playbackId}/thumbnail.jpg`,
  };
}

function VideoCard({ index, onOpen, video }) {
  const sampleMedium = getMuxThumbnailMedium(video.medium);
  const { canvasRef, elementRef, sampleColor } = useSampleColor(sampleMedium);

  return (
    <button
      ref={elementRef}
      key={video._key || video.medium?._id || index}
      className={styles.video}
      type="button"
      onClick={() => onOpen(index)}
      onPointerMove={sampleColor}
    >
      <Media medium={video.medium} className={styles.thumbnail} playVideo={false} objectFit="cover" />
      <canvas ref={canvasRef} className={styles.colorSampler} aria-hidden="true" />
    </button>
  );
}

const VideoPage = ({ videoPage }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const videos = videoPage?.videos || [];

  const navigateFullscreen = useCallback(
    (direction) => {
      setFullscreenIndex((currentIndex) => {
        if (currentIndex === null || videos.length === 0) return currentIndex;

        return (currentIndex + direction + videos.length) % videos.length;
      });
    },
    [videos.length],
  );

  return (
    <div className={`page`}>
      <main className={`${styles.main} main`}>
        {videos.map((video, index) => {
          return <VideoCard key={video._key || video.medium?._id || index} video={video} index={index} onOpen={setFullscreenIndex} />;
        })}
      </main>
      <FullscreenView
        activeIndex={fullscreenIndex}
        gallery={videos}
        onClose={() => setFullscreenIndex(null)}
        onNavigate={navigateFullscreen}
      />
    </div>
  );
};

export default VideoPage;

export async function getStaticProps() {
  const [videoPage] = await Promise.all([getVideoPage()]);

  return {
    props: {
      videoPage,
    },
    revalidate: 5,
  };
}
