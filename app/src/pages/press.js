import { useCallback, useMemo, useState } from "react";

import FullscreenView from "@/components/FullscreenView/FullscreenView";
import Media from "@/components/Media/Media";
import { getPress, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/Press.module.scss";

export default function Press({ press }) {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const gallery = useMemo(() => press?.map((entry) => ({ medium: entry.cover?.medium })) || [], [press]);

  const navigateFullscreen = useCallback(
    (direction) => {
      setFullscreenIndex((currentIndex) => {
        if (currentIndex === null || gallery.length === 0) return currentIndex;

        return (currentIndex + direction + gallery.length) % gallery.length;
      });
    },
    [gallery.length],
  );

  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        {press?.map((entry, index) => (
          <button
            key={entry._id}
            className={styles.cover}
            type="button"
            onClick={() => setFullscreenIndex(index)}
          >
            <Media medium={entry.cover?.medium} />
          </button>
        ))}
      </main>
      <FullscreenView
        activeIndex={fullscreenIndex}
        gallery={gallery}
        onClose={() => setFullscreenIndex(null)}
        onNavigate={navigateFullscreen}
      />
    </div>
  );
}

export async function getStaticProps() {
  const [site, press] = await Promise.all([getSite(), getPress()]);

  return {
    props: {
      site,
      press,
    },
    revalidate: 60,
  };
}
