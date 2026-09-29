import { useCallback, useContext, useEffect, useRef, useState } from "react";

import Media from "@/components/Media/Media";
import { DeviceContext } from "@/context/DeviceContext";
import styles from "./FullscreenView.module.scss";

const FullscreenView = ({ activeIndex, gallery, onClose, onNavigate }) => {
  const { isDesktop } = useContext(DeviceContext);
  const closeButtonRef = useRef(null);
  const [cursorState, setCursorState] = useState({
    direction: "next",
    isVisible: false,
    x: 0,
    y: 0,
  });
  const isOpen = activeIndex !== null;
  const activeItem = isOpen ? gallery[activeIndex] : null;
  const formattedActiveIndex = String((activeIndex ?? 0) + 1).padStart(2, "0");

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

  const updateCursor = useCallback(
    (event) => {
      if (!isDesktop || gallery.length < 2) return;

      const { left, top, width } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      const direction = x < width / 2 ? "previous" : "next";
      const closeButtonRect = closeButtonRef.current?.getBoundingClientRect();
      const isNearCloseButton = closeButtonRect
        ? event.clientX >= closeButtonRect.left - 50 &&
          event.clientX <= closeButtonRect.right + 50 &&
          event.clientY >= closeButtonRect.top - 50 &&
          event.clientY <= closeButtonRect.bottom + 50
        : false;

      setCursorState({ direction, isVisible: !isNearCloseButton, x, y });
    },
    [gallery.length, isDesktop],
  );

  const hideCursor = useCallback(() => {
    setCursorState((currentState) => ({ ...currentState, isVisible: false }));
  }, []);

  const handleFullscreenClick = useCallback(
    (event) => {
      if (!isDesktop || gallery.length < 2) return;

      const { left, width } = event.currentTarget.getBoundingClientRect();

      if (event.clientX - left < width / 2) {
        onNavigate(-1);
        return;
      }

      onNavigate(1);
    },
    [gallery.length, isDesktop, onNavigate],
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
      className={`${styles.fullscreenView} ${isDesktop ? styles.desktopNavigation : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={handleFullscreenClick}
      onPointerLeave={hideCursor}
      onPointerMove={updateCursor}
    >
      {!isDesktop ? (
        <button
          className={`${styles.navigationButton} ${styles.previousButton}`}
          type="button"
          onClick={() => onNavigate(-1)}
        >
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
      ) : null}

      <button className={styles.mediaArea} type="button" onClick={isDesktop ? undefined : onClose}>
        <Media medium={activeItem.medium} className={styles.fullscreenMedia} eager showVideoPoster={false} />
      </button>

      {!isDesktop ? (
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
      ) : null}

      <div className={styles.counter} typo="marker bold compensate-bottom">
        <span typo="label shift">(N°)</span>
        <span typo="body">
          {formattedActiveIndex}/{gallery.length}
        </span>
      </div>

      <button
        ref={closeButtonRef}
        className={styles.closeButton}
        type="button"
        aria-label="Close fullscreen view"
        onClick={handleCloseClick}
      >
        <img src="/icons/plus.svg" alt="" aria-hidden="true" />
      </button>

      {isDesktop && gallery.length > 1 ? (
        <img
          alt=""
          aria-hidden="true"
          className={`${styles.fullscreenCursor} ${cursorState.isVisible ? styles.fullscreenCursorVisible : ""}`}
          src={cursorState.direction === "previous" ? "/icons/arrow-left.svg" : "/icons/arrow-right.svg"}
          style={{
            transform: `translate3d(${cursorState.x}px, ${cursorState.y}px, 0) translate(-50%, -50%)`,
          }}
        />
      ) : null}
    </div>
  );
};

export default FullscreenView;
