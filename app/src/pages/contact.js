import { getSite } from "@/lib/sanity";
import styles from "@/styles/Contact.module.scss";
import Text from "@/components/Text/Text";

export default function ContactPage({ site }) {
  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        <section className={styles.contactTextContainer}>
          <div>
            <span typo="label">(Address)</span>
            <a href={site.googleMaps} target="_blank" typo="body">
              {site.address.street}, {site.address.postcode}, {site.address.city}
            </a>
          </div>
          <div>
            <span typo="label">(E—mail)</span>
            <a href={`mailto:${site.email}`} typo="body">
              {site.email}
            </a>
          </div>
          <div>
            <span typo="label">(Phone)</span>
            <span typo="body">
              {site.phone.map((entry, index) => {
                return (
                  <>
                    <span key={index}>{entry}</span> <br />
                  </>
                );
              })}
            </span>
            <span typo="body">
              {site.socials.map((entry, index) => {
                return (
                  <>
                    <span typo="label">({entry.platform})</span>
                    <a href={entry.link} target="_blank" key={index}>
                      {entry.handle}
                    </a>
                    <br />
                  </>
                );
              })}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const [site] = await Promise.all([getSite()]);

  return {
    props: {
      site,
    },
    revalidate: 5,
  };
}
