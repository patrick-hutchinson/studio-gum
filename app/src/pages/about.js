import Media from "@/components/Media/Media";
import { getAboutPage, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/AboutPage.module.scss";
import Text from "@/components/Text/Text";

export default function About({ aboutPage }) {
  const CurrentTeam = ({ team }) => {
    return (
      <div>
        <span typo="label">(Current Team)</span>
        <span typo="body">{team.join(", ")}</span>
      </div>
    );
  };

  const PastTeam = ({ team }) => {
    return (
      <div>
        <span typo="label">(Past Team)</span>
        <span typo="body">{team.join(", ")}</span>
      </div>
    );
  };

  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        <section className={styles.portrait}>
          <Media medium={aboutPage.portrait.medium} objectFit="cover" />
        </section>
        <section className={styles.aboutTextContainer}>
          <Text text={aboutPage.lead} typo="body" />
        </section>
        <section className={styles.team}>
          <CurrentTeam team={aboutPage.currentTeam} />
          <PastTeam team={aboutPage.pastTeam} />
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
