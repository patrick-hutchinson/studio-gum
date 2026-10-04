import { useCallback, useEffect } from "react";

import Media from "@/components/Media/Media";
import styles from "./FullscreenView.module.scss";

const FullscreenView = ({ activeIndex, enableNavigation = false, gallery, onClose, onNavigate }) => {
  const isOpen = activeIndex !== null;
  const activeItem = isOpen ? gallery[activeIndex] : null;
  const canNavigate = enableNavigation && gallery.length > 1 && onNavigate;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (!canNavigate) return;
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canNavigate, isOpen, onClose, onNavigate]);

  const handleNavigationClick = useCallback(
    (event) => {
      if (!canNavigate) return;

      const { left, width } = event.currentTarget.getBoundingClientRect();
      const direction = event.clientX - left < width / 2 ? -1 : 1;

      onNavigate(direction);
    },
    [canNavigate, onNavigate],
  );

  const handleCloseClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClose();
    },
    [onClose],
  );

  if (!isOpen || !activeItem) return null;

  return (
    <div
      className={`${styles.fullscreenView} ${canNavigate ? styles.canNavigate : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={handleNavigationClick}
    >
      <div className={styles.mediaArea}>
        <Media medium={activeItem.medium} className={styles.fullscreenMedia} eager showVideoPoster={false} />
      </div>

      <button
        className={styles.closeButton}
        type="button"
        aria-label="Close fullscreen view"
        onClick={handleCloseClick}
      >
        <img src="/icons/plus.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  );
};

export default FullscreenView;
