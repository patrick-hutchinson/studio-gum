import Media from "@/components/Media/Media";
import SanityPreviewFallback, { SanityPreviewValue } from "@/components/SanityPreviewFallback";
import Text from "@/components/Text/Text";
import { getAboutPage, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/AboutPage.module.scss";

export default function About({ aboutPage }) {
  const CurrentTeam = ({ team }) => {
    return (
      <div>
        <span typo="label shift">(Current Team)</span>
        <span typo="body">
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
        <span typo="label shift">(Past Team)</span>
        <span typo="body">
          <SanityPreviewValue value={team} fieldTitle="Past team">
            {team?.join(", ")}
          </SanityPreviewValue>
        </span>
      </div>
    );
  };

  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        <section className={styles.portrait}>
          {aboutPage?.portrait?.medium ? (
            <Media medium={aboutPage.portrait.medium} objectFit="cover" />
          ) : (
            <SanityPreviewFallback fieldTitle="About portrait" />
          )}
        </section>
        <section className={styles.aboutTextContainer}>
          {aboutPage?.lead ? <Text text={aboutPage.lead} typo="body" /> : <SanityPreviewFallback fieldTitle="About lead" />}
        </section>
        <section className={styles.team}>
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
