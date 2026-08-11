import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { ThemeProvider } from "next-themes";
import { DeviceProvider } from "@/context/DeviceContext";
import { ViewportProvider } from "@/context/ViewportContext";

import MarginDebugOverlay from "@/components/MarginDebugOverlay/MarginDebugOverlay";

import { AnimatePresence, motion } from "framer-motion";

import Head from "next/head";
import Menu from "@/components/Menu/Menu";

import "@/styles/globals.css";
import "@/styles/margins.css";
import "@/styles/fonts.css";

import styles from "../styles/App.module.scss";

import Header from "@/components/Header/Header";
import RenderSVG from "@/components/RenderSVG/RenderSVG";

const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: (pageBox) => ({
    opacity: 0,
    position: "fixed",
    top: pageBox?.top ?? 0,
    left: pageBox?.left ?? 0,
    width: pageBox?.width ?? "100%",
    pointerEvents: "none",
  }),
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const site = pageProps.site || {};
  const shellRef = useRef(null);
  const headerRef = useRef(null);
  const gumLogoRef = useRef(null);
  const contentRef = useRef(null);
  const pageTransitionRef = useRef(null);
  const layoutAnimationFrameRef = useRef(null);
  const shouldAnimateLayoutFrameRef = useRef(false);
  const logoAnimationTimeoutRef = useRef(null);
  const settledLayoutTimeoutsRef = useRef([]);

  const [exitingPageBox, setExitingPageBox] = useState(null);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      const rect = contentRef.current?.getBoundingClientRect() || pageTransitionRef.current?.getBoundingClientRect();

      flushSync(() => {
        setExitingPageBox(
          rect
            ? {
                top: rect.top,
                left: rect.left,
                width: rect.width,
              }
            : null,
        );
      });
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events]);

  const updateLayoutMetrics = useCallback((animateLogo = false) => {
    const shell = shellRef.current;
    const header = headerRef.current;
    const logo = gumLogoRef.current;

    if (shell && header) {
      shell.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
    }

    if (!logo) return;

    const letterHeight = Array.from(logo.children).reduce((height, letter) => {
      return height + letter.getBoundingClientRect().height;
    }, 0);
    const logoHeight = logo.getBoundingClientRect().height;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const minGap = 5;
    const maxGap = Math.max(minGap, (logoHeight - letterHeight) / Math.max(1, logo.children.length - 1));
    const scrollProgress =
      animateLogo && maxScroll > 0 ? 0 : maxScroll <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / maxScroll));

    if (animateLogo) {
      logo.dataset.animateGap = "true";
      logo.getBoundingClientRect();

      if (logoAnimationTimeoutRef.current) {
        window.clearTimeout(logoAnimationTimeoutRef.current);
      }

      logoAnimationTimeoutRef.current = window.setTimeout(() => {
        delete logo.dataset.animateGap;
        logoAnimationTimeoutRef.current = null;
      }, 500);
    } else {
      delete logo.dataset.animateGap;

      if (logoAnimationTimeoutRef.current) {
        window.clearTimeout(logoAnimationTimeoutRef.current);
        logoAnimationTimeoutRef.current = null;
      }
    }

    logo.style.setProperty("--gum-logo-gap", `${minGap + (maxGap - minGap) * scrollProgress}px`);
  }, []);

  const scheduleLayoutMetricsUpdate = useCallback((animateLogo = false) => {
    shouldAnimateLayoutFrameRef.current = animateLogo;

    if (layoutAnimationFrameRef.current) return;

    layoutAnimationFrameRef.current = window.requestAnimationFrame(() => {
      const shouldAnimate = shouldAnimateLayoutFrameRef.current;

      layoutAnimationFrameRef.current = null;
      shouldAnimateLayoutFrameRef.current = false;
      updateLayoutMetrics(shouldAnimate);
    });
  }, [updateLayoutMetrics]);

  const cancelSettledLayoutMetricsUpdates = useCallback(() => {
    settledLayoutTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    settledLayoutTimeoutsRef.current = [];
  }, []);

  const scheduleSettledLayoutMetricsUpdate = useCallback(() => {
    cancelSettledLayoutMetricsUpdates();
    scheduleLayoutMetricsUpdate(true);
    settledLayoutTimeoutsRef.current = [50, 250, 700].map((delay) =>
      window.setTimeout(() => scheduleLayoutMetricsUpdate(true), delay),
    );
  }, [cancelSettledLayoutMetricsUpdates, scheduleLayoutMetricsUpdate]);

  const handleScroll = useCallback(() => {
    cancelSettledLayoutMetricsUpdates();
    scheduleLayoutMetricsUpdate(false);
  }, [cancelSettledLayoutMetricsUpdates, scheduleLayoutMetricsUpdate]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(scheduleSettledLayoutMetricsUpdate);

    [shellRef.current, headerRef.current, gumLogoRef.current, contentRef.current].forEach((element) => {
      if (element) resizeObserver.observe(element);
    });

    scheduleSettledLayoutMetricsUpdate();
    document.fonts?.ready?.then(scheduleSettledLayoutMetricsUpdate);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleSettledLayoutMetricsUpdate);
    router.events.on("routeChangeStart", scheduleSettledLayoutMetricsUpdate);
    router.events.on("routeChangeComplete", scheduleSettledLayoutMetricsUpdate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleSettledLayoutMetricsUpdate);
      router.events.off("routeChangeStart", scheduleSettledLayoutMetricsUpdate);
      router.events.off("routeChangeComplete", scheduleSettledLayoutMetricsUpdate);

      if (layoutAnimationFrameRef.current) {
        window.cancelAnimationFrame(layoutAnimationFrameRef.current);
        layoutAnimationFrameRef.current = null;
      }

      if (logoAnimationTimeoutRef.current) {
        window.clearTimeout(logoAnimationTimeoutRef.current);
        logoAnimationTimeoutRef.current = null;
      }

      cancelSettledLayoutMetricsUpdates();
    };
  }, [cancelSettledLayoutMetricsUpdates, handleScroll, router.events, scheduleSettledLayoutMetricsUpdate]);

  return (
    <>
      <Head>
        {site.title ? <title>{site.title}</title> : null}
        {site.description ? <meta name="description" content={site.description} /> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.faviconUrl ? <link rel="icon" href={site.faviconUrl} /> : null}
      </Head>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} themes={["light", "yellow"]}>
        <ViewportProvider>
          <DeviceProvider>
            <div ref={shellRef} className={styles.shell}>
              <Header ref={headerRef} className={styles.header} site={site} />
              {/* <Menu /> */}

              <div ref={gumLogoRef} className={styles.gumLogo} typo="h3 bold compensate">
                <RenderSVG text="G" />
                <RenderSVG text="U" />
                <RenderSVG text="M" />
              </div>

              <div ref={contentRef} className={`${styles.content} pageTransitionRoot`}>
                <MarginDebugOverlay />

                <AnimatePresence custom={exitingPageBox} initial={false}>
                  <motion.div
                    animate="animate"
                    className="pageTransition"
                    custom={exitingPageBox}
                    exit="exit"
                    initial="initial"
                    key={router.asPath}
                    onAnimationComplete={scheduleSettledLayoutMetricsUpdate}
                    ref={pageTransitionRef}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    variants={pageTransitionVariants}
                  >
                    <Component {...pageProps} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </DeviceProvider>
        </ViewportProvider>
      </ThemeProvider>
    </>
  );
}
