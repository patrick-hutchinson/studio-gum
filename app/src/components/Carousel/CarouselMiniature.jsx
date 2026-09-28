import { useCallback, useContext, useEffect, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Media from "@/components/Media/Media";

import styles from "./Carousel.module.css";

import { motion } from "framer-motion";

import { DeviceContext } from "@/context/DeviceContext";

const AUTO_SCROLL_DELAY = 3000;
const MINIMUM_PAUSE_DURATION = 10000;

const CarouselMiniature = ({ array, onIndexChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { isTouch } = useContext(DeviceContext);
  const pauseUntilRef = useRef(0);
  const dragStartedRef = useRef(false);
  const media = array ?? [];
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: media.length > 1, dragResistance: 1, dragFree: isTouch ? true : false },
    [],
  );

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
      onIndexChange?.(index);
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
  }, [emblaApi, media.length, onIndexChange, pauseForActiveVideo]);

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
    if (!emblaApi) return;

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
  }, [emblaApi, pauseAutoScroll]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      if (!isDragging && Date.now() >= pauseUntilRef.current) {
        emblaApi.scrollNext();
      }
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(interval);
  }, [emblaApi, isDragging, media.length]);

  if (!media.length) return null;

  return (
    <motion.div className={`${styles.carouselOuter} ${styles.carouselMiniature}`} ref={emblaRef}>
      <div className={`${styles.carouselInner}`}>
        {media.map((item, index) => {
          return (
            <li key={item._key ?? item.medium?._id ?? index} className={`${styles.slide}`}>
              <Media medium={item.medium} />
            </li>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CarouselMiniature;
