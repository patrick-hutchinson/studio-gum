import Link from "next/link";

import styles from "./Project.module.scss";

const getProjectHref = (project) => {
  const slug = project?.slug?.current || project?.slug;

  return slug ? `/projects/${slug}` : null;
};

const ProjectNavigation = ({ nextProject, previousProject }) => {
  const previousHref = getProjectHref(previousProject);
  const nextHref = getProjectHref(nextProject);

  if (!previousHref && !nextHref) return null;

  return (
    <nav className={styles.projectNavigation} aria-label="Project navigation">
      {previousHref ? (
        <Link className={styles.projectNavigationLink} href={previousHref}>
          <span typo="label">(Prev)</span>
          <span typo="body">{previousProject.title}</span>
        </Link>
      ) : null}
      {nextHref ? (
        <Link className={styles.projectNavigationLink} href={nextHref}>
          <span typo="label">(Next)</span>
          <span typo="body">{nextProject.title}</span>
        </Link>
      ) : null}
    </nav>
  );
};

export default ProjectNavigation;
