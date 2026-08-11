import { useEffect } from "react";

import Media from "@/components/Media/Media";
import styles from "./FullscreenView.module.scss";

const FullscreenView = ({ activeIndex, gallery, onClose, onNavigate }) => {
  const isOpen = activeIndex !== null;
  const activeItem = isOpen ? gallery[activeIndex] : null;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !activeItem) return null;

  return (
    <div className={styles.fullscreenView} role="dialog" aria-modal="true">
      <button className={`${styles.navigationButton} ${styles.previousButton}`} type="button" onClick={() => onNavigate(-1)}>
        <svg className={styles.arrow} aria-hidden="true" focusable="false" viewBox="0 0 45.329 87.829">
          <polyline
            points="44.622 87.122 1.414 43.915 44.622 .707"
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
        </svg>
      </button>

      <button className={styles.mediaArea} type="button" onClick={onClose}>
        <Media medium={activeItem.medium} className={styles.fullscreenMedia} eager />
      </button>

      <button className={`${styles.navigationButton} ${styles.nextButton}`} type="button" onClick={() => onNavigate(1)}>
        <svg className={styles.arrow} aria-hidden="true" focusable="false" viewBox="0 0 45.329 87.829">
          <polyline
            points=".707 .707 43.915 43.915 .707 87.122"
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
        </svg>
      </button>

      <div className={styles.counter} typo="h3 bold compensate-bottom">
        {activeIndex + 1}/{gallery.length}
      </div>
    </div>
  );
};

export default FullscreenView;
