import { useCallback, useState } from "react";

import FullscreenView from "@/components/FullscreenView/FullscreenView";
import Media from "@/components/Media/Media";
import { getProject, getProjectSlugs, getSite } from "@/lib/sanity";

import Text from "@/components/Text/Text";
import styles from "@/styles/pages/Project.module.scss";

export default function ProjectPage({ project }) {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const gallery = project.gallery || [];

  const navigateFullscreen = useCallback(
    (direction) => {
      setFullscreenIndex((currentIndex) => {
        if (currentIndex === null || gallery.length === 0) return currentIndex;

        return (currentIndex + direction + gallery.length) % gallery.length;
      });
    },
    [gallery.length],
  );

  const ProjectCredits = () => {
    return (
      <ul className={styles.projectCredits} typo="h3">
        {project.credits?.map((credit) => {
          return (
            <li className={styles.creditContainer}>
              <span className={styles.creditRole} typo="bold">
                {credit.role}
              </span>
              <div className={styles.creditEntries}>
                {credit.entries.map((entry) => {
                  return <div className={styles.creditEntry}>{entry}</div>;
                })}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <main className={styles.main}>
      <section className={styles.gallery} aria-label={`${project.title} gallery`}>
        {gallery.map((item, index) => (
          <button
            key={item._key || `${project._id}-gallery-${index}`}
            className={styles.galleryMedium}
            type="button"
            onClick={() => setFullscreenIndex(index)}
          >
            <Media medium={item.medium} eager={index === 0} />
          </button>
        ))}
      </section>
      <section className={styles.projectInfo}>
        <div typo="bold">{project.title}</div>
        <Text text={project.description} typo="h3" />

        <ProjectCredits />
      </section>
      <FullscreenView
        activeIndex={fullscreenIndex}
        gallery={gallery}
        onClose={() => setFullscreenIndex(null)}
        onNavigate={navigateFullscreen}
      />
    </main>
  );
}

export async function getStaticPaths() {
  const projects = await getProjectSlugs();

  return {
    paths: projects.map((project) => ({
      params: {
        slug: project.slug,
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const [site, project] = await Promise.all([getSite(), getProject(params?.slug)]);

  if (!project) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      site,
      project,
    },
    revalidate: 60,
  };
}
