import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Media from "@/components/Media/Media";

import styles from "./Carousel.module.css";

import { motion } from "framer-motion";

import { DeviceContext } from "@/context/DeviceContext";

const AUTO_SCROLL_DELAY = 3000;
const MINIMUM_PAUSE_DURATION = 10000;
const INFINITE_REPEAT_BUFFER = 2;
const MINIMUM_INFINITE_REPEAT_COUNT = 3;

function getMediumAspectRatio(medium) {
  if (!medium) return null;

  if (medium.width && medium.height) {
    return medium.width / medium.height;
  }

  if (medium.aspect_ratio) {
    const [width, height] = medium.aspect_ratio.split(":").map(Number);
    if (width && height) return width / height;
  }

  return null;
}

const Carousel = ({
  array,
  autoScrollDelay = AUTO_SCROLL_DELAY,
  className = "",
  contained = false,
  fitMediaToBounds = false,
  infinite = false,
  onIndexChange,
  showCounter = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorState, setCursorState] = useState({
    direction: "next",
    isVisible: false,
    x: 0,
    y: 0,
  });
  const { isDesktop } = useContext(DeviceContext);
  const carouselOuterRef = useRef(null);
  const pauseUntilRef = useRef(0);
  const dragStartedRef = useRef(false);
  const baseMedia = useMemo(() => array ?? [], [array]);
  const [repeatCount, setRepeatCount] = useState(1);
  const media = useMemo(() => {
    const items = baseMedia;

    return infinite && items.length ? Array.from({ length: repeatCount }, () => items).flat() : items;
  }, [baseMedia, infinite, repeatCount]);
  const emblaOptions = useMemo(
    () => ({
      align: "start",
      watchDrag: !isDesktop,
      dragResistance: 1,
      dragFree: false,
      loop: media.length > 1,
    }),
    [isDesktop, media.length],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, []);

  const setCarouselRefs = useCallback(
    (node) => {
      carouselOuterRef.current = node;
      emblaRef(node);
    },
    [emblaRef],
  );

  useLayoutEffect(() => {
    if (!infinite || !baseMedia.length) return undefined;

    const carousel = carouselOuterRef.current;
    if (!carousel) return undefined;

    const updateRepeatCount = () => {
      const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
      const firstCycle = slides.slice(0, baseMedia.length);
      const cycleWidth = firstCycle.reduce((total, slide) => {
        const marginRight = Number.parseFloat(window.getComputedStyle(slide).marginRight) || 0;

        return total + slide.getBoundingClientRect().width + marginRight;
      }, 0);

      if (cycleWidth <= 0 || carousel.clientWidth <= 0) return;

      // Give Embla one full viewport of media plus two spare cycles for a stable loop.
      const nextRepeatCount = Math.max(
        MINIMUM_INFINITE_REPEAT_COUNT,
        Math.ceil(carousel.clientWidth / cycleWidth) + INFINITE_REPEAT_BUFFER,
      );

      setRepeatCount((current) => (current === nextRepeatCount ? current : nextRepeatCount));
    };

    const resizeObserver = new ResizeObserver(updateRepeatCount);
    resizeObserver.observe(carousel);
    carousel.querySelectorAll("[data-carousel-slide]").forEach((slide) => resizeObserver.observe(slide));
    updateRepeatCount();

    return () => resizeObserver.disconnect();
  }, [baseMedia, infinite, repeatCount]);

  const pauseAutoScroll = useCallback((duration = MINIMUM_PAUSE_DURATION) => {
    pauseUntilRef.current = Math.max(pauseUntilRef.current, Date.now() + duration);
  }, []);

  const pauseForActiveVideo = useCallback(() => {
    if (!emblaApi) return;

    const activeMedium = media[emblaApi.selectedScrollSnap()]?.medium;
    if (activeMedium?.type !== "video") return;

    const videoDuration = Number(activeMedium.duration) * 1000;
    pauseAutoScroll(Math.max(MINIMUM_PAUSE_DURATION, Number.isFinite(videoDuration) ? videoDuration : 0));
  }, [emblaApi, media, pauseAutoScroll]);

  useEffect(() => {
    if (!emblaApi || !media.length) return;

    const updateIndex = () => {
      const index = emblaApi.selectedScrollSnap();
      const normalizedIndex = baseMedia.length ? index % baseMedia.length : index;
      setActiveIndex(normalizedIndex);
      onIndexChange?.(normalizedIndex);
    };

    updateIndex();
    pauseForActiveVideo();
    emblaApi.on("select", updateIndex);
    emblaApi.on("scroll", updateIndex);
    emblaApi.on("select", pauseForActiveVideo);

    return () => {
      emblaApi.off("select", updateIndex);
      emblaApi.off("scroll", updateIndex);
      emblaApi.off("select", pauseForActiveVideo);
    };
  }, [baseMedia.length, emblaApi, media.length, onIndexChange, pauseForActiveVideo]);

  useEffect(() => {
    if (!emblaApi || media.length < 2) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        pauseAutoScroll();
        emblaApi.scrollNext();
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        pauseAutoScroll();
        emblaApi.scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi, pauseAutoScroll]);

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    const onDragStart = () => {
      dragStartedRef.current = true;
      setIsDragging(true);
    };
    const onDragEnd = () => {
      if (dragStartedRef.current) pauseAutoScroll();
      dragStartedRef.current = false;
      setIsDragging(false);
    };

    emblaApi.on("pointerDown", onDragStart);
    emblaApi.on("pointerUp", onDragEnd);
    emblaApi.on("dragEnd", onDragEnd);

    return () => {
      emblaApi.off("pointerDown", onDragStart);
      emblaApi.off("pointerUp", onDragEnd);
      emblaApi.off("dragEnd", onDragEnd);
    };
  }, [emblaApi, isDesktop, pauseAutoScroll]);

  const handleDesktopClick = useCallback(
    (event) => {
      if (!isDesktop || !emblaApi || media.length < 2) return;

      const interactiveTarget = event.target.closest("a, button, input, select, textarea");
      if (interactiveTarget) return;

      const { left, width } = event.currentTarget.getBoundingClientRect();
      pauseAutoScroll();

      if (event.clientX - left < width / 2) {
        emblaApi.scrollPrev();
        return;
      }

      emblaApi.scrollNext();
    },
    [emblaApi, isDesktop, media.length, pauseAutoScroll],
  );

  const updateCursor = useCallback(
    (event) => {
      if (!isDesktop || media.length < 2) return;

      const { left, top, width } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      const direction = x < width / 2 ? "previous" : "next";

      setCursorState({ direction, isVisible: true, x, y });
    },
    [isDesktop, media.length],
  );

  const hideCursor = useCallback(() => {
    setCursorState((currentState) => ({ ...currentState, isVisible: false }));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      if (!isDragging && Date.now() >= pauseUntilRef.current) {
        emblaApi.scrollNext();
      }
    }, autoScrollDelay);

    return () => clearInterval(interval);
  }, [autoScrollDelay, emblaApi, isDragging, media.length]);

  if (!media.length) return null;

  return (
    <motion.div
      className={`${styles.carouselOuter} ${styles.carouselFullscreen} ${contained ? styles.carouselContained : ""} ${fitMediaToBounds ? styles.carouselFitMediaToBounds : ""} ${isDesktop ? styles.desktopClickNavigation : ""} ${className}`}
      onClick={handleDesktopClick}
      onPointerLeave={hideCursor}
      onPointerMove={updateCursor}
      ref={setCarouselRefs}
    >
      <div className={`${styles.carouselInner}`}>
        {media.map((item, index) => {
          const aspectRatio = getMediumAspectRatio(item.medium);
          const isPortrait = aspectRatio && aspectRatio < 1;

          return (
            <li
              data-carousel-slide
              key={`${item._key ?? item.medium?._id ?? "media"}-${index}`}
              className={`${styles.slide} ${fitMediaToBounds ? styles.fitMediaSlide : ""} ${fitMediaToBounds && isPortrait ? styles.portraitSlide : ""} ${fitMediaToBounds && !isPortrait ? styles.landscapeSlide : ""}`}
              style={aspectRatio ? { "--media-aspect-ratio": aspectRatio } : undefined}
            >
              <Media medium={item.medium} objectFit="contain" objectPosition={fitMediaToBounds ? "top center" : "center"} />
            </li>
          );
        })}
      </div>
      {showCounter ? (
        <div aria-live="polite" className={styles.mediaCounter} typo="label">
          {activeIndex + 1}/{media.length}
        </div>
      ) : null}
      {isDesktop && media.length > 1 ? (
        <img
          alt=""
          aria-hidden="true"
          className={`${styles.carouselCursor} ${cursorState.isVisible ? styles.carouselCursorVisible : ""}`}
          src={cursorState.direction === "previous" ? "/icons/arrow-left.svg" : "/icons/arrow-right.svg"}
          style={{
            transform: `translate3d(${cursorState.x}px, ${cursorState.y}px, 0) translate(-50%, -50%)`,
          }}
        />
      ) : null}
    </motion.div>
  );
};

export default Carousel;
