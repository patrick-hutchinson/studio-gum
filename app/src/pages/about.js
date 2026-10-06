import Media from "@/components/Media/Media";
import SanityPreviewFallback, { SanityPreviewValue } from "@/components/SanityPreviewFallback";
import Text from "@/components/Text/Text";
import { getAboutPage, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/AboutPage.module.scss";
import { useEffect, useRef, useState } from "react";

export default function About({ aboutPage }) {
  const mainRef = useRef(null);
  const [isMainOverflowing, setIsMainOverflowing] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;

    const measureMain = () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const mainStyles = window.getComputedStyle(main);
      const contentHeight = Number.parseFloat(rootStyles.getPropertyValue("--content-height"));
      const headerHeight = Number.parseFloat(rootStyles.getPropertyValue("--header-height"));
      const paddingBottom = Number.parseFloat(mainStyles.paddingBottom) || 0;
      const measuredHeight = main.scrollHeight - paddingBottom;
      const overflowThreshold = contentHeight - headerHeight;

      setIsMainOverflowing(measuredHeight > overflowThreshold);
    };

    const resizeObserver = new ResizeObserver(measureMain);
    resizeObserver.observe(main);
    Array.from(main.children).forEach((child) => resizeObserver.observe(child));

    measureMain();
    window.addEventListener("resize", measureMain);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureMain);
    };
  }, []);

  const CurrentTeam = ({ team }) => {
    return (
      <div>
        <span className={styles.teamLabel} typo="label shift">
          (Current Team)
        </span>
        <span typo="tag">
          <SanityPreviewValue value={team} fieldTitle="Current team">
            {team?.join(", ")}
          </SanityPreviewValue>
        </span>
      </div>
    );
  };

  const PastTeam = ({ team }) => {
    return (
      <div>
        <span className={styles.teamLabel} typo="label shift">
          (Past Team)
        </span>
        <span typo="tag">
          <SanityPreviewValue value={team} fieldTitle="Past team">
            {team?.join(", ")}
          </SanityPreviewValue>
        </span>
      </div>
    );
  };

  return (
    <div className={`${styles.page} page`}>
      <main ref={mainRef} className={`${styles.main} ${isMainOverflowing ? styles.mainOverflowing : ""} main`}>
        <section className={styles.portrait}>
          {aboutPage?.portrait?.medium ? (
            <Media medium={aboutPage.portrait.medium} objectFit="cover" />
          ) : (
            <SanityPreviewFallback fieldTitle="About portrait" />
          )}
        </section>
        <section className={styles.aboutTextContainer}>
          {aboutPage?.lead ? <Text text={aboutPage.lead} typo="tag" /> : <SanityPreviewFallback fieldTitle="About lead" />}
        </section>
        <section className={styles.team} typo="tag">
          <CurrentTeam team={aboutPage?.currentTeam} />
          <PastTeam team={aboutPage?.pastTeam} />
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const [site, aboutPage] = await Promise.all([getSite(), getAboutPage()]);

  return {
    props: {
      site,
      aboutPage,
    },
    revalidate: 5,
  };
}
