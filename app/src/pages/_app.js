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

import LogoInteraction from "@/components/LogoInteraction/LogoInteraction";

import "@/styles/globals.css";
import "@/styles/margins.css";
import "@/styles/fonts.css";

import styles from "../styles/App.module.scss";

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

const ALL_FILTER_ID = "all";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const site = pageProps.site || {};
  const forcedTheme = router.pathname === "/press" ? "yellow" : "light";
  const shellRef = useRef(null);
  const contentRef = useRef(null);
  const pageTransitionRef = useRef(null);

  const menuButtonRef = useRef(null);

  const [exitingPageBox, setExitingPageBox] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([ALL_FILTER_ID]);

  const toggleFilter = useCallback((filterId) => {
    setSelectedFilters((currentFilters) => {
      if (filterId === ALL_FILTER_ID) return [ALL_FILTER_ID];

      const activeFilters = currentFilters.includes(ALL_FILTER_ID) ? [] : currentFilters;
      const nextFilters = activeFilters.includes(filterId)
        ? activeFilters.filter((currentFilter) => currentFilter !== filterId)
        : [...activeFilters, filterId];

      return nextFilters.length ? nextFilters : [ALL_FILTER_ID];
    });
  }, []);

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

  return (
    <>
      <Head>
        {site.title ? <title>{site.title}</title> : null}
        {site.description ? <meta name="description" content={site.description} /> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.faviconUrl ? <link rel="icon" href={site.faviconUrl} /> : null}
      </Head>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme={forcedTheme}
        themes={["light", "yellow"]}
      >
        <ViewportProvider>
          <DeviceProvider>
            <div ref={shellRef} className={styles.shell}>
              <LogoInteraction menuButtonRef={menuButtonRef} />

              <Menu
                categories={pageProps.categories || []}
                menuButtonRef={menuButtonRef}
                selectedFilters={selectedFilters}
                onToggleFilter={toggleFilter}
              />

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
                    ref={pageTransitionRef}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    variants={pageTransitionVariants}
                  >
                    <Component {...pageProps} selectedFilters={selectedFilters} />
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
