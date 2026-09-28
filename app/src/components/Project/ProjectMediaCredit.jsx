import SanityPreviewFallback from "@/components/SanityPreviewFallback";

import styles from "./Project.module.scss";

const ProjectMediaCredit = ({ project, carouselIndex }) => {
  const gallery = project?.gallery || {};
  const currentMediaCredit = gallery.media?.[carouselIndex]?.medium?.credit?.trim();
  const galleryCredit = gallery.credit?.trim();
  const credit = currentMediaCredit || galleryCredit;

  if (!credit) return <SanityPreviewFallback className={styles.mediaCredit} fieldTitle="Gallery or image credit" />;

  return (
    <div className={styles.mediaCredit}>
      <span className={styles.creditLead}>
        <span typo="label">(Foto)</span>
        <span typo="body">{credit}</span>
      </span>
    </div>
  );
};

export default ProjectMediaCredit;
