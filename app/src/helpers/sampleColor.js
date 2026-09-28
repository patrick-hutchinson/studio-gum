import { useCallback, useEffect, useRef } from "react";

const COLOR_LERP_AMOUNT = 0.16;
const COLOR_SETTLE_THRESHOLD = 0.75;
const PROJECT_BACKGROUND_PROPERTY = "--project-background";

function formatRgb(color) {
  return `rgb(${Math.round(color[0])} ${Math.round(color[1])} ${Math.round(color[2])})`;
}

function getSamplePoint(event, element, imageSize) {
  const rect = element.getBoundingClientRect();
  const scale = Math.max(rect.width / imageSize.width, rect.height / imageSize.height);
  const renderedWidth = imageSize.width * scale;
  const renderedHeight = imageSize.height * scale;
  const offsetX = (rect.width - renderedWidth) / 2;
  const offsetY = (rect.height - renderedHeight) / 2;
  const imageX = (event.clientX - rect.left - offsetX) / scale;
  const imageY = (event.clientY - rect.top - offsetY) / scale;

  return {
    x: Math.min(imageSize.width - 1, Math.max(0, Math.floor(imageX))),
    y: Math.min(imageSize.height - 1, Math.max(0, Math.floor(imageY))),
  };
}

export function useSampleColor(medium) {
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const imageSizeRef = useRef({ width: 0, height: 0 });
  const displayedColorRef = useRef(null);
  const targetColorRef = useRef(null);
  const colorFrameRef = useRef(null);

  const cancelSmoothedColor = useCallback(() => {
    if (!colorFrameRef.current) return;

    window.cancelAnimationFrame(colorFrameRef.current);
    colorFrameRef.current = null;
  }, []);

  const clearColor = useCallback(() => {
    targetColorRef.current = null;
    displayedColorRef.current = null;
    cancelSmoothedColor();
    elementRef.current?.style.removeProperty(PROJECT_BACKGROUND_PROPERTY);
  }, [cancelSmoothedColor]);

  const renderSmoothedColor = useCallback(() => {
    const element = elementRef.current;
    const targetColor = targetColorRef.current;

    if (!element || !targetColor) {
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
      ...displayedColorRef.current.map((channel, index) => Math.abs(channel - targetColor[index])),
    );

    if (channelDistance <= COLOR_SETTLE_THRESHOLD) {
      displayedColorRef.current = targetColor;
      element.style.setProperty(PROJECT_BACKGROUND_PROPERTY, formatRgb(targetColor));
      colorFrameRef.current = null;
      return;
    }

    element.style.setProperty(PROJECT_BACKGROUND_PROPERTY, formatRgb(displayedColorRef.current));
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

      imageSizeRef.current = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };
    };

    return () => {
      image.onload = null;
      imageSizeRef.current = { width: 0, height: 0 };
      clearColor();
    };
  }, [clearColor, medium?.type, medium?.url]);

  useEffect(() => {
    return () => {
      cancelSmoothedColor();
    };
  }, [cancelSmoothedColor]);

  const sampleColor = useCallback(
    (event) => {
      const element = elementRef.current;
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d", { willReadFrequently: true });
      const imageSize = imageSizeRef.current;

      if (!element || !canvas || !context || !imageSize.width || !imageSize.height) return;

      const point = getSamplePoint(event, element, imageSize);

      try {
        const [red, green, blue] = context.getImageData(point.x, point.y, 1, 1).data;
        targetColorRef.current = [red, green, blue];
        scheduleSmoothedColor();
      } catch {
        clearColor();
      }
    },
    [clearColor, scheduleSmoothedColor],
  );

  return {
    canvasRef,
    elementRef,
    sampleColor,
  };
}
