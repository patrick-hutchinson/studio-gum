import { getSite } from "@/lib/sanity";
import SanityPreviewFallback, { SanityPreviewValue } from "@/components/SanityPreviewFallback";
import styles from "@/styles/pages/ContactPage.module.scss";

export default function ContactPage({ site }) {
  const address = site?.address;
  const addressText = [address?.street, address?.postcode, address?.city].filter(Boolean).join(", ");

  return (
    <div className={`${styles.page} page`}>
      <main className={`${styles.main} main`}>
        <section className={styles.contactTextContainer} typo="body compensate-top">
          <div>
            <span className={styles.contactLabel} typo="label shift">
              (Address)
            </span>
            {site?.googleMaps ? (
              <a href={site.googleMaps} target="_blank" typo="body">
                <SanityPreviewValue value={addressText} fieldTitle="Address" />
              </a>
            ) : (
              <span typo="body">
                <SanityPreviewValue value={addressText} fieldTitle="Address" />
                <SanityPreviewFallback as="span" fieldTitle="Google Maps link" />
              </span>
            )}
          </div>
          <div>
            <span className={styles.contactLabel} typo="label shift">
              (E—mail)
            </span>
            {site?.email ? (
              <a href={`mailto:${site.email}`} typo="body">
                {site.email}
              </a>
            ) : (
              <SanityPreviewFallback as="span" fieldTitle="Email" />
            )}
          </div>
          <div>
            <span className={styles.contactLabel} typo="label shift">
              (Phone)
            </span>
            <span typo="body">
              {site?.phone?.length ? (
                site.phone.map((entry, index) => {
                  return (
                    <span key={index}>
                      {entry}
                      <br />
                    </span>
                  );
                })
              ) : (
                <SanityPreviewFallback as="span" fieldTitle="Phone" />
              )}
            </span>
            <span typo="body">
              {site?.socials?.length ? (
                site.socials.map((entry, index) => {
                  return (
                    <span key={index}>
                      <span className={styles.contactLabel} typo="label shift">
                        (<SanityPreviewValue value={entry.platform} fieldTitle="Social platform" />)
                      </span>
                      {entry.link ? (
                        <a href={entry.link} target="_blank">
                          <SanityPreviewValue value={entry.handle} fieldTitle="Social handle" />
                        </a>
                      ) : (
                        <SanityPreviewValue value={entry.handle} fieldTitle="Social handle" />
                      )}
                      <br />
                    </span>
                  );
                })
              ) : (
                <SanityPreviewFallback as="span" fieldTitle="Socials" />
              )}
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
