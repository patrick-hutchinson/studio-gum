import Media from "@/components/Media/Media";
import { getVideoPage } from "@/lib/sanity/fetch";
import styles from "@/styles/pages/VideoPage.module.scss";

const VideoPage = ({ videoPage }) => {
  return (
    <div className={`page`}>
      <main className={`${styles.main} main`}>
        {videoPage.videos.map((video, index) => {
          return <Media medium={video.medium} key={index} className={styles.video} />;
        })}
      </main>
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
