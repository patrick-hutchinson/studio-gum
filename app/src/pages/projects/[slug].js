import { useCallback, useState } from "react";

import FullscreenView from "@/components/FullscreenView/FullscreenView";
import SanityPreviewFallback from "@/components/SanityPreviewFallback";

import { getProject, getProjectSlugs, getProjects, getSite } from "@/lib/sanity";

import ProjectCredits from "@/components/Project/ProjectCredits";

import ProjectNavigation from "@/components/Project/ProjectNavigation";

import Carousel from "@/components/Carousel/Carousel";
import styles from "@/styles/pages/ProjectPage.module.scss";
import ProjectTitle from "@/components/Project/ProjectTitle";
import ProjectMediaCredit from "@/components/Project/ProjectMediaCredit";

function getProjectSlug(project) {
  return project?.slug?.current || project?.slug;
}

function getAdjacentProjects(projects, currentSlug) {
  const currentIndex = projects.findIndex((project) => getProjectSlug(project) === currentSlug);

  if (currentIndex < 0 || projects.length < 2) {
    return {
      nextProject: null,
      previousProject: null,
    };
  }

  return {
    previousProject: projects[(currentIndex - 1 + projects.length) % projects.length],
    nextProject: projects[(currentIndex + 1) % projects.length],
  };
}

export default function ProjectPage({ nextProject, previousProject, project }) {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const gallery = project.gallery || {};
  const galleryMedia = gallery.media || [];

  const [carouselIndex, setCarouselIndex] = useState(0);

  const navigateFullscreen = useCallback(
    (direction) => {
      setFullscreenIndex((currentIndex) => {
        if (currentIndex === null || galleryMedia.length === 0) return currentIndex;

        return (currentIndex + direction + galleryMedia.length) % galleryMedia.length;
      });
    },
    [galleryMedia.length],
  );

  return (
    <main className={styles.main}>
      <section className={styles.gallery} aria-label={`${project.title || "Project"} gallery`}>
        {galleryMedia.length ? (
          <Carousel
            array={galleryMedia}
            className={styles.projectCarousel}
            contained
            fitMediaToBounds
            onIndexChange={setCarouselIndex}
          />
        ) : (
          <SanityPreviewFallback fieldTitle="Project gallery" />
        )}
      </section>
      <section className={styles.projectInfoContainer}>
        <div className={styles.projectInfo}>
          <ProjectTitle project={project} />

          <div className={styles.projectCredits}>
            <ProjectCredits project={project} />
            <ProjectMediaCredit project={project} carouselIndex={carouselIndex} />
          </div>
        </div>
        <ProjectNavigation
          nextProject={nextProject}
          previousProject={previousProject}
          className={styles.projectNavigation}
        />
      </section>
      <FullscreenView
        activeIndex={fullscreenIndex}
        gallery={galleryMedia}
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
  const currentSlug = params?.slug;
  const [site, project, projects] = await Promise.all([getSite(), getProject(currentSlug), getProjects()]);

  if (!project) {
    return {
      notFound: true,
      revalidate: 5,
    };
  }

  const { nextProject, previousProject } = getAdjacentProjects(projects, currentSlug);

  return {
    props: {
      site,
      project,
      nextProject,
      previousProject,
    },
    revalidate: 5,
  };
}
