import Media from "@/components/Media/Media";
import { getAboutPage, getSite } from "@/lib/sanity";
import styles from "@/styles/About.module.scss";
import Text from "@/components/Text/Text";

export default function About({ aboutPage }) {
  const ProjectCredits = () => {
    return (
      <ul className={styles.projectCredits} typo="h3">
        {aboutPage.credits?.map((credit) => {
          return (
            <li className={styles.creditContainer}>
              <span className={styles.creditRole} typo="bold">
                {credit.role}
              </span>
              <div className={styles.creditEntries}>
                {credit.entries.map((entry) => {
                  return <div className={styles.creditEntry}>{entry}</div>;
                })}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        <section className={styles.portrait}>
          <Media medium={aboutPage.portrait.medium} objectFit="cover" />
        </section>
        <section className={styles.aboutTextContainer}>
          <Text text={aboutPage.lead} typo="h3" />

          <ProjectCredits />
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
    revalidate: 60,
  };
}
