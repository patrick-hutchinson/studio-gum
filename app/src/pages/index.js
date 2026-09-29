import Media from "@/components/Media/Media";

import { useSampleColor } from "@/helpers/sampleColor";
import { getCategories, getProjects, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/IndexPage.module.scss";

import SanityPreviewFallback, { SanityPreviewValue } from "@/components/SanityPreviewFallback";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

const ALL_FILTER_ID = "all";

function ProjectInfo({ project }) {
  const categories = project.categories
    ?.map((category) => category.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.projectInfo}>
      <span className={styles.categories} typo="label">
        {categories ? `(${categories})` : <SanityPreviewFallback as="span" fieldTitle="Project categories" />}
      </span>
      <span typo="title">
        <SanityPreviewValue value={project.title} fieldTitle="Project title" />
      </span>
    </div>
  );
}

function ProjectLink({ project }) {
  const medium = project.thumbnail?.medium;
  const href = project.slug?.current ? `/projects/${project.slug.current}` : null;
  const { canvasRef, elementRef, sampleColor } = useSampleColor(medium);
  const content = (
    <>
      {medium ? (
        <Media medium={medium} className={styles.thumbnail} objectFit="cover" />
      ) : (
        <SanityPreviewFallback className={styles.thumbnail} fieldTitle="Project thumbnail" />
      )}
      <ProjectInfo project={project} />
    </>
  );

  return (
    <motion.div
      ref={elementRef}
      className={styles.project}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      onPointerMove={sampleColor}
    >
      {href ? (
        <Link href={href} className={styles.projectLink}>
          {content}
        </Link>
      ) : (
        <div className={styles.projectLink}>
          {content}
          <SanityPreviewFallback fieldTitle="Project slug" />
        </div>
      )}
      <canvas ref={canvasRef} className={styles.colorSampler} aria-hidden="true" />
    </motion.div>
  );
}

function projectMatchesFilters(project, selectedFilters) {
  if (!selectedFilters?.length || selectedFilters.includes(ALL_FILTER_ID)) return true;

  const projectCategoryIds = project.categories?.map((category) => category._id).filter(Boolean) || [];

  return selectedFilters.some((filterId) => projectCategoryIds.includes(filterId));
}

export default function Index({ projects, selectedFilters }) {
  const filteredProjects = useMemo(
    () => projects.filter((project) => projectMatchesFilters(project, selectedFilters)),
    [projects, selectedFilters],
  );

  return (
    <div className={`page ${styles.page}`}>
      <main className={`${styles.main} main`}>
        {projects.length ? (
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectLink key={project._id} project={project} />
            ))}
          </AnimatePresence>
        ) : (
          <SanityPreviewFallback fieldTitle="Projects" />
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const [site, projects, categories] = await Promise.all([getSite(), getProjects(), getCategories()]);

  return {
    props: {
      site,
      projects,
      categories,
    },
    revalidate: 5,
  };
}
