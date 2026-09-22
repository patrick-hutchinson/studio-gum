import { useCallback, useEffect, useRef } from "react";

import Media from "@/components/Media/Media";
import { getProjects, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/Index.module.scss";

import Link from "next/link";

const COLOR_LERP_AMOUNT = 0.16;
const COLOR_SETTLE_THRESHOLD = 0.75;

function formatRgb(color) {
  return `rgb(${Math.round(color[0])} ${Math.round(color[1])} ${Math.round(color[2])})`;
}

function ProjectInfo({ project }) {
  return (
    <div className={styles.projectInfo}>
      <h3 typo="bold">{project.title}</h3>
    </div>
  );
}

function ProjectLink({ project }) {
  const projectRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const imageSizeRef = useRef({ width: 0, height: 0 });
  const displayedColorRef = useRef(null);
  const targetColorRef = useRef(null);
  const colorFrameRef = useRef(null);

  const medium = project.thumbnail?.medium;

  const renderSmoothedColor = useCallback(() => {
    const projectElement = projectRef.current;
    const targetColor = targetColorRef.current;

    if (!projectElement || !targetColor) {
      colorFrameRef.current = null;
      return;
    }

    if (!displayedColorRef.current) {
      displayedColorRef.current = targetColor;
    } else {
      displayedColorRef.current = displayedColorRef.current.map((channel, index) => {
        return channel + (targetColor[index] - channel) * COLOR_LERP_AMOUNT;
      });
    }

    const channelDistance = Math.max(
      ...displayedColorRef.current.map((channel, index) => Math.abs(channel - targetColor[index]))
    );

    if (channelDistance <= COLOR_SETTLE_THRESHOLD) {
      displayedColorRef.current = targetColor;
      projectElement.style.setProperty("--project-background", formatRgb(targetColor));
      colorFrameRef.current = null;
      return;
    }

    projectElement.style.setProperty("--project-background", formatRgb(displayedColorRef.current));
    colorFrameRef.current = window.requestAnimationFrame(renderSmoothedColor);
  }, []);

  const scheduleSmoothedColor = useCallback(() => {
    if (colorFrameRef.current) return;
    colorFrameRef.current = window.requestAnimationFrame(renderSmoothedColor);
  }, [renderSmoothedColor]);

  useEffect(() => {
    if (medium?.type !== "image" || !medium.url) return undefined;

    const image = new Image();
    image.decoding = "async";
    image.src = `/api/image-proxy?url=${encodeURIComponent(medium.url)}`;

    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d", { willReadFrequently: true });
      if (!canvas || !context) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);

      imageRef.current = image;
      imageSizeRef.current = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };
    };

    return () => {
      image.onload = null;
      imageRef.current = null;
    };
  }, [medium?.type, medium?.url]);

  useEffect(() => {
    return () => {
      if (!colorFrameRef.current) return;
      window.cancelAnimationFrame(colorFrameRef.current);
    };
  }, []);

  const sampleThumbnailColor = useCallback((event) => {
    const projectElement = projectRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    const imageSize = imageSizeRef.current;

    if (!projectElement || !canvas || !context || !imageSize.width || !imageSize.height) return;

    const rect = projectElement.getBoundingClientRect();
    const scale = Math.max(rect.width / imageSize.width, rect.height / imageSize.height);
    const renderedWidth = imageSize.width * scale;
    const renderedHeight = imageSize.height * scale;
    const offsetX = (rect.width - renderedWidth) / 2;
    const offsetY = (rect.height - renderedHeight) / 2;
    const imageX = (event.clientX - rect.left - offsetX) / scale;
    const imageY = (event.clientY - rect.top - offsetY) / scale;
    const pixelX = Math.min(imageSize.width - 1, Math.max(0, Math.floor(imageX)));
    const pixelY = Math.min(imageSize.height - 1, Math.max(0, Math.floor(imageY)));

    try {
      const [red, green, blue] = context.getImageData(pixelX, pixelY, 1, 1).data;
      targetColorRef.current = [red, green, blue];
      scheduleSmoothedColor();
    } catch {
      targetColorRef.current = null;
      displayedColorRef.current = null;
      if (colorFrameRef.current) {
        window.cancelAnimationFrame(colorFrameRef.current);
        colorFrameRef.current = null;
      }
      projectElement.style.removeProperty("--project-background");
    }
  }, [scheduleSmoothedColor]);

  return (
    <div ref={projectRef} className={styles.project} onPointerMove={sampleThumbnailColor}>
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
    revalidate: 60,
  };
}
