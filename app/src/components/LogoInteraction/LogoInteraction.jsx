import { useCallback, useLayoutEffect, useRef, useState } from "react";

import RenderSVG from "../RenderSVG/RenderSVG";
import styles from "./LogoInteraction.module.scss";

const LETTERS = ["G", "U", "M"];
const NEIGHBOR_BREATHING_ROOM = 200;
const MINIMUM_HOVER_MOVE = 250;
const MAXIMUM_HOVER_MOVE = 450;
const LETTER_TRANSITION_DURATION = 1000;
const INTRO_FADE_DURATION = 600;

function getCssPixelValue(propertyName, fallbackPropertyName) {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const value = Number.parseFloat(rootStyles.getPropertyValue(propertyName));
  const fallbackValue = Number.parseFloat(rootStyles.getPropertyValue(fallbackPropertyName));

  if (Number.isFinite(value)) return value;
  if (Number.isFinite(fallbackValue)) return fallbackValue;
  return 0;
}

function getRandomPosition(min, max) {
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}

function getIntersectingRanges(ranges, allowedRanges) {
  return ranges
    .flatMap(([rangeMin, rangeMax]) =>
      allowedRanges.map(([allowedMin, allowedMax]) => [Math.max(rangeMin, allowedMin), Math.min(rangeMax, allowedMax)]),
    )
    .filter(([rangeMin, rangeMax]) => rangeMax >= rangeMin);
}

function getRandomPositionFromRanges(ranges) {
  if (!ranges.length) return null;

  const totalRange = ranges.reduce((total, [rangeMin, rangeMax]) => total + rangeMax - rangeMin, 0);
  let target = Math.random() * totalRange;

  for (const [rangeMin, rangeMax] of ranges) {
    const range = rangeMax - rangeMin;

    if (target <= range) {
      return getRandomPosition(rangeMin, rangeMax);
    }

    target -= range;
  }

  const [fallbackMin, fallbackMax] = ranges[ranges.length - 1];
  return getRandomPosition(fallbackMin, fallbackMax);
}

function getRandomPositionWithMoveRange(
  min,
  max,
  currentPosition,
  minimumMove,
  maximumMove,
  allowedRanges = [[min, max]],
) {
  const moveRanges = [
    [Math.max(min, currentPosition - maximumMove), Math.min(max, currentPosition - minimumMove)],
    [Math.max(min, currentPosition + minimumMove), Math.min(max, currentPosition + maximumMove)],
  ].filter(([rangeMin, rangeMax]) => rangeMax >= rangeMin);
  const allowedMoveRanges = getIntersectingRanges(moveRanges, allowedRanges);

  return (
    getRandomPositionFromRanges(allowedMoveRanges) ??
    getRandomPositionFromRanges(allowedRanges) ??
    getRandomPosition(min, max)
  );
}

function getHorizontalBounds(width = 0) {
  const margin = getCssPixelValue("--margin", "--spacing-5");

  return {
    min: margin,
    max: window.innerWidth - margin - width,
  };
}

function createCenteredPositions(widths) {
  const gap = getCssPixelValue("--spacing-5", "--margin-5");
  const totalWidth = widths.reduce((total, width) => total + width, 0) + gap * Math.max(widths.length - 1, 0);
  const start = (window.innerWidth - totalWidth) / 2;
  const positions = [];

  widths.forEach((width, index) => {
    positions[index] = index === 0 ? start : positions[index - 1] + widths[index - 1] + gap;
  });

  return positions;
}

function getAllowedLandingRanges(min, max, width, blockedBounds) {
  if (!blockedBounds) return [[min, max]];

  return [
    [min, blockedBounds.left - width],
    [blockedBounds.right, max],
  ].filter(([rangeMin, rangeMax]) => rangeMax >= rangeMin);
}

const LogoInteraction = ({ menuButtonRef, onIntroComplete, routeKey, runIntro = false }) => {
  const letterRefs = useRef([]);
  const animationTimeoutRefs = useRef([]);
  const introTimeoutRefs = useRef([]);
  const previousRouteKeyRef = useRef(routeKey);
  const [letterPositions, setLetterPositions] = useState([]);
  const [animatingLetterIndexes, setAnimatingLetterIndexes] = useState([]);
  const [isIntroVisible, setIsIntroVisible] = useState(!runIntro);

  const getLetterMetrics = useCallback(() => {
    return letterRefs.current.map((letter) => letter?.getBoundingClientRect().width || 0);
  }, []);

  const getMenuButtonBounds = useCallback(() => {
    const rect = menuButtonRef?.current?.getBoundingClientRect();

    if (!rect) return null;

    return {
      left: rect.left,
      right: rect.right,
    };
  }, [menuButtonRef]);

  const createInitialPositions = useCallback(() => {
    const gap = getCssPixelValue("--spacing-5", "--margin-5");
    const widths = getLetterMetrics();
    const blockedBounds = getMenuButtonBounds();
    const positions = [];

    widths.forEach((width, index) => {
      const { min, max } = getHorizontalBounds(width);
      const minLeft = index === 0 ? min : positions[index - 1] + widths[index - 1] + gap;
      const remainingWidth = widths
        .slice(index + 1)
        .reduce((total, nextWidth) => total + nextWidth + gap, 0);
      const maxLeft = Math.max(minLeft, max - remainingWidth);
      const allowedRanges = getAllowedLandingRanges(minLeft, maxLeft, width, blockedBounds);

      positions[index] = getRandomPositionFromRanges(allowedRanges) ?? getRandomPosition(minLeft, maxLeft);
    });

    return positions;
  }, [getLetterMetrics, getMenuButtonBounds]);

  const clampPositions = useCallback((positions) => {
    const gap = getCssPixelValue("--spacing-5", "--margin-5");
    const widths = getLetterMetrics();
    const nextPositions = [...positions];
    const { min: minViewportPosition } = getHorizontalBounds();

    for (let index = 0; index < nextPositions.length; index += 1) {
      const min =
        index === 0 ? minViewportPosition : nextPositions[index - 1] + widths[index - 1] + gap;

      nextPositions[index] = Math.max(nextPositions[index] ?? min, min);
    }

    for (let index = nextPositions.length - 1; index >= 0; index -= 1) {
      const max =
        index === nextPositions.length - 1
          ? getHorizontalBounds(widths[index]).max
          : nextPositions[index + 1] - gap - widths[index];

      nextPositions[index] = Math.min(nextPositions[index], Math.max(minViewportPosition, max));
    }

    return nextPositions;
  }, [getLetterMetrics]);

  const moveAwayFromMenuButton = useCallback(
    (positions) => {
      const blockedBounds = getMenuButtonBounds();

      if (!blockedBounds) return positions;

      const widths = getLetterMetrics();
      const blockedCenter = (blockedBounds.left + blockedBounds.right) / 2;
      const nextPositions = positions.map((position, index) => {
        const letterRight = position + widths[index];
        const overlapsButton = position < blockedBounds.right && letterRight > blockedBounds.left;

        if (!overlapsButton) return position;

        const letterCenter = position + widths[index] / 2;
        return letterCenter < blockedCenter ? blockedBounds.left - widths[index] : blockedBounds.right;
      });

      return clampPositions(nextPositions);
    },
    [clampPositions, getLetterMetrics, getMenuButtonBounds],
  );

  const createRoomAroundLetter = useCallback(
    (positions, letterIndex, movementDirection = 0) => {
      const gap = getCssPixelValue("--spacing-5", "--margin-5");
      const widths = getLetterMetrics();
      const nextPositions = [...positions];

      const pushLeft = (index, desiredLeft) => {
        if (index < 0) return;

        const { min } = getHorizontalBounds();

        nextPositions[index] = Math.min(nextPositions[index], Math.max(min, desiredLeft));

        if (index > 0) {
          const previousMaxLeft = nextPositions[index] - gap - widths[index - 1];
          pushLeft(index - 1, previousMaxLeft);
        }
      };

      const pushRight = (index, desiredLeft) => {
        if (index >= nextPositions.length) return;

        const { max } = getHorizontalBounds(widths[index]);

        nextPositions[index] = Math.max(nextPositions[index], Math.min(max, desiredLeft));

        if (index < nextPositions.length - 1) {
          const nextMinLeft = nextPositions[index] + widths[index] + gap;
          pushRight(index + 1, nextMinLeft);
        }
      };

      const leftNeighborIndex = letterIndex - 1;
      const rightNeighborIndex = letterIndex + 1;
      const letterLeft = nextPositions[letterIndex];
      const letterRight = letterLeft + widths[letterIndex];

      if (movementDirection < 0 && leftNeighborIndex >= 0) {
        const leftNeighborRight = nextPositions[leftNeighborIndex] + widths[leftNeighborIndex];
        const leftGap = letterLeft - leftNeighborRight;

        if (leftGap < NEIGHBOR_BREATHING_ROOM) {
          pushLeft(leftNeighborIndex, letterLeft - NEIGHBOR_BREATHING_ROOM - widths[leftNeighborIndex]);
        }
      }

      if (movementDirection > 0 && rightNeighborIndex < nextPositions.length) {
        const rightGap = nextPositions[rightNeighborIndex] - letterRight;

        if (rightGap < NEIGHBOR_BREATHING_ROOM) {
          pushRight(rightNeighborIndex, letterRight + NEIGHBOR_BREATHING_ROOM);
        }
      }

      return clampPositions(nextPositions);
    },
    [clampPositions, getLetterMetrics],
  );

  useLayoutEffect(() => {
    if (runIntro) {
      const startIntro = () => {
        const centeredPositions = moveAwayFromMenuButton(clampPositions(createCenteredPositions(getLetterMetrics())));

        setLetterPositions(centeredPositions);
        setIsIntroVisible(true);

        introTimeoutRefs.current[0] = window.setTimeout(() => {
          setAnimatingLetterIndexes(LETTERS.map((_, index) => index));
          setLetterPositions(moveAwayFromMenuButton(clampPositions(createInitialPositions())));
        }, INTRO_FADE_DURATION);

        introTimeoutRefs.current[1] = window.setTimeout(() => {
          setAnimatingLetterIndexes([]);
          onIntroComplete?.();
        }, INTRO_FADE_DURATION + LETTER_TRANSITION_DURATION);
      };

      startIntro();

      return () => {
        introTimeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
        animationTimeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
      };
    }

    const updateInitialPositions = () => {
      setLetterPositions((currentPositions) => {
        if (currentPositions.length) return moveAwayFromMenuButton(clampPositions(currentPositions));
        return moveAwayFromMenuButton(clampPositions(createInitialPositions()));
      });
    };

    updateInitialPositions();
    window.addEventListener("resize", updateInitialPositions);

    return () => {
      window.removeEventListener("resize", updateInitialPositions);
      introTimeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
      animationTimeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [clampPositions, createInitialPositions, getLetterMetrics, moveAwayFromMenuButton, onIntroComplete, runIntro]);

  useLayoutEffect(() => {
    if (previousRouteKeyRef.current === routeKey) return;

    previousRouteKeyRef.current = routeKey;
    if (runIntro) return;

    animationTimeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
    setAnimatingLetterIndexes(LETTERS.map((_, index) => index));
    setLetterPositions(moveAwayFromMenuButton(clampPositions(createInitialPositions())));

    animationTimeoutRefs.current[LETTERS.length] = window.setTimeout(() => {
      setAnimatingLetterIndexes([]);
    }, LETTER_TRANSITION_DURATION);
  }, [clampPositions, createInitialPositions, moveAwayFromMenuButton, routeKey, runIntro]);

  const setLetterIsAnimating = useCallback((letterIndex) => {
    window.clearTimeout(animationTimeoutRefs.current[letterIndex]);

    setAnimatingLetterIndexes((currentIndexes) => {
      if (currentIndexes.includes(letterIndex)) return currentIndexes;
      return [...currentIndexes, letterIndex];
    });

    animationTimeoutRefs.current[letterIndex] = window.setTimeout(() => {
      setAnimatingLetterIndexes((currentIndexes) => currentIndexes.filter((index) => index !== letterIndex));
    }, LETTER_TRANSITION_DURATION);
  }, []);

  const randomizeLetterPosition = useCallback(
    (letterIndex) => {
      if (animatingLetterIndexes.includes(letterIndex)) return;

      setLetterIsAnimating(letterIndex);

      setLetterPositions((currentPositions) => {
        const widths = getLetterMetrics();
        const currentLayout = currentPositions.length ? [...currentPositions] : clampPositions(createInitialPositions());
        const nextPositions = [...currentLayout];
        const { min, max } = getHorizontalBounds(widths[letterIndex]);
        const currentPosition = currentLayout[letterIndex] ?? nextPositions[letterIndex] ?? min;
        const allowedRanges = getAllowedLandingRanges(min, Math.max(min, max), widths[letterIndex], getMenuButtonBounds());
        const nextPosition = getRandomPositionWithMoveRange(
          min,
          Math.max(min, max),
          currentPosition,
          MINIMUM_HOVER_MOVE,
          MAXIMUM_HOVER_MOVE,
          allowedRanges,
        );
        const movementDirection = Math.sign(nextPosition - currentPosition);

        nextPositions[letterIndex] = nextPosition;

        return moveAwayFromMenuButton(createRoomAroundLetter(nextPositions, letterIndex, movementDirection));
      });
    },
    [
      clampPositions,
      createInitialPositions,
      createRoomAroundLetter,
      getLetterMetrics,
      getMenuButtonBounds,
      animatingLetterIndexes,
      moveAwayFromMenuButton,
      setLetterIsAnimating,
    ],
  );

  return (
    <div className={`${styles.logoContainer} ${isIntroVisible ? styles.isVisible : ""}`}>
      {LETTERS.map((letter, index) => (
        <span
          className={`${styles.logoLetterWrapper} ${
            animatingLetterIndexes.includes(index) ? styles.isAnimating : ""
          }`}
          key={letter}
          ref={(element) => {
            letterRefs.current[index] = element;
          }}
          style={{ left: letterPositions[index] ?? 0 }}
          onPointerEnter={() => randomizeLetterPosition(index)}
        >
          <RenderSVG text={letter} className={styles.logoLetter} padding={20} />
        </span>
      ))}
    </div>
  );
};

export default LogoInteraction;
