import { useCallback, useEffect } from "react";

import Media from "@/components/Media/Media";
import styles from "./FullscreenView.module.scss";

const FullscreenView = ({ activeIndex, gallery, onClose }) => {
  const isOpen = activeIndex !== null;
  const activeItem = isOpen ? gallery[activeIndex] : null;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCloseClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClose();
    },
    [onClose],
  );

  if (!isOpen || !activeItem) return null;

  return (
    <div className={styles.fullscreenView} role="dialog" aria-modal="true">
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
