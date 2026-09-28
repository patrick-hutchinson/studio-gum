import styles from "./Project.module.scss";

const ProjectTitle = ({ project }) => {
  const categories = project.categories
    ?.map((category) => category.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.projectTitle}>
      {categories && (
        <span className={styles.categories} typo="label">
          ({categories})
        </span>
      )}
      <span typo="title">{project.title}</span>
    </div>
  );
};

export default ProjectTitle;
