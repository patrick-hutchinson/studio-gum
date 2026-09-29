import SanityPreviewFallback from "@/components/SanityPreviewFallback";

import styles from "./Project.module.scss";

const ProjectCredits = ({ project }) => {
  if (!project.credits?.length) {
    return (
      <div className={styles.projectCredits} typo="marker compensate-bottom">
        <SanityPreviewFallback fieldTitle="Project credits" />
      </div>
    );
  }

  return (
    <div className={styles.projectCredits} typo="marker compensate-bottom">
      {project.credits?.map((credit) => {
        const [firstEntry, ...remainingEntries] = credit.entries || [];

        if (!firstEntry) {
          return (
            <span className={styles.creditGroup} key={credit.role}>
              <span className={styles.creditLead}>
                <span className={styles.creditRole} typo="label shift">
                  ({credit.role || <SanityPreviewFallback as="span" fieldTitle="Credit role" />})
                </span>
                <span className={styles.creditEntry} typo="body">
                  <SanityPreviewFallback as="span" fieldTitle="Credit entries" />
                </span>
              </span>
            </span>
          );
        }

        return (
          <span className={styles.creditGroup} key={credit.role}>
            <span className={styles.creditLead}>
              <span className={styles.creditRole} typo="label shift">
                ({credit.role || <SanityPreviewFallback as="span" fieldTitle="Credit role" />})
              </span>
              <span className={styles.creditEntry} typo="body">
                {firstEntry}
              </span>
            </span>
            {remainingEntries.length ? (
              <span className={styles.creditEntry} typo="body">
                {`, ${remainingEntries.join(", ")}`}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

export default ProjectCredits;
