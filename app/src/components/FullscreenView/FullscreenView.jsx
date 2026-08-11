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
        ←
      </button>

      <button className={styles.mediaArea} type="button" onClick={onClose}>
        <Media medium={activeItem.medium} className={styles.fullscreenMedia} eager />
      </button>

      <button className={`${styles.navigationButton} ${styles.nextButton}`} type="button" onClick={() => onNavigate(1)}>
        →
      </button>

      <div className={styles.counter}>
        {activeIndex + 1}/{gallery.length}
      </div>
    </div>
  );
};

export default FullscreenView;
