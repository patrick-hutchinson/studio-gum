import Media from "@/components/Media/Media";
import SanityPreviewFallback from "@/components/SanityPreviewFallback";
import { useSampleColor } from "@/helpers/sampleColor";
import { getProjects, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/IndexPage.module.scss";

import ProjectTitle from "@/components/Project/ProjectTitle";

import Link from "next/link";

function ProjectInfo({ project }) {
  return (
    <div className={styles.projectInfo}>
      <ProjectTitle project={project} />
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
    <div ref={elementRef} className={styles.project} onPointerMove={sampleColor}>
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
    </div>
  );
}

export default function Index({ projects }) {
  return (
    <div className={`page ${styles.page}`}>
      <main className={`${styles.main} main`}>
        {projects.length ? (
          projects.map((project) => <ProjectLink key={project._id} project={project} />)
        ) : (
          <SanityPreviewFallback fieldTitle="Projects" />
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const [site, projects] = await Promise.all([getSite(), getProjects()]);

  return {
    props: {
      site,
      projects,
    },
    revalidate: 5,
  };
}
