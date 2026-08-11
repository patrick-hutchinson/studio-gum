import Media from "@/components/Media/Media";
import { getContactPage, getSite } from "@/lib/sanity";
import styles from "@/styles/Contact.module.scss";
import Text from "@/components/Text/Text";

export default function ContactPage({ contactPage }) {
  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        <section className={styles.contactTextContainer}>
          <Text text={contactPage.lead} typo="h3 bold" />
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const [site, contactPage] = await Promise.all([getSite(), getContactPage()]);

  return {
    props: {
      site,
      contactPage,
    },
    revalidate: 60,
  };
}
