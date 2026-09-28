import Media from "@/components/Media/Media";
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
  const { canvasRef, elementRef, sampleColor } = useSampleColor(medium);

  return (
    <div ref={elementRef} className={styles.project} onPointerMove={sampleColor}>
      <Link href={`/projects/${project.slug.current}`} className={styles.projectLink}>
        <Media medium={medium} className={styles.thumbnail} objectFit="cover" />
        <ProjectInfo project={project} />
      </Link>
      <canvas ref={canvasRef} className={styles.colorSampler} aria-hidden="true" />
    </div>
  );
}

export default function Index({ projects }) {
  return (
    <div className={`page ${styles.page}`}>
      <main className={`${styles.main} main`}>
        {projects.map((project) => (
          <ProjectLink key={project._id} project={project} />
        ))}
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
