import styles from "./Project.module.scss";

const ProjectCredits = ({ project }) => {
  return (
    <div className={styles.projectCredits} typo="marker compensate-bottom">
      {project.credits?.map((credit) => {
        const [firstEntry, ...remainingEntries] = credit.entries || [];

        if (!firstEntry) return null;

        return (
          <span className={styles.creditGroup} key={credit.role}>
            <span className={styles.creditLead}>
              <span className={styles.creditRole} typo="label">
                ({credit.role})
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
