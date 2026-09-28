import SanityPreviewFallback, { SanityPreviewValue } from "@/components/SanityPreviewFallback";

import styles from "./Project.module.scss";

const ProjectTitle = ({ project }) => {
  const categories = project.categories
    ?.map((category) => category.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.projectTitle}>
      <span className={styles.categories} typo="label">
        {categories ? `(${categories})` : <SanityPreviewFallback as="span" fieldTitle="Project categories" />}
      </span>
      <span typo="title">
        <SanityPreviewValue value={project.title} fieldTitle="Project title" />
      </span>
    </div>
  );
};

export default ProjectTitle;
