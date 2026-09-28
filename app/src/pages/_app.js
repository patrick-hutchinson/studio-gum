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

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const site = pageProps.site || {};
  const forcedTheme = router.pathname === "/press" ? "yellow" : "light";
  const shouldShowIndexIntroRef = useRef(router.pathname === "/");
  const shellRef = useRef(null);
  const contentRef = useRef(null);
  const pageTransitionRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [exitingPageBox, setExitingPageBox] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const [hasEnteredPage, setHasEnteredPage] = useState(!shouldShowIndexIntroRef.current);
  const isIndexIntro = !hasEnteredPage;

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
            <div
              ref={shellRef}
              className={`${styles.shell} ${isIndexIntro ? styles.indexIntro : ""}`}
              onClick={isIndexIntro ? () => setHasEnteredPage(true) : undefined}
            >
              {hasEnteredPage && (
                <motion.div
                  className={styles.alley}
                  typo="marker bold compensate"
                  initial={shouldShowIndexIntroRef.current ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        key="menu"
                        className={styles.menuAnimation}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className={styles.menu}>
                          <Menu />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <img
                    className={`${styles.menuButton} ${showMenu ? styles.showMenu : null} `}
                    ref={menuButtonRef}
                    src="/icons/plus.svg"
                    onClick={() => setShowMenu((prev) => !prev)}
                  />
                </motion.div>
              )}

              <LogoInteraction menuButtonRef={menuButtonRef} />

              {hasEnteredPage && (
                <motion.div
                  ref={contentRef}
                  className={`${styles.content} pageTransitionRoot`}
                  initial={shouldShowIndexIntroRef.current ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
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
                      <Component {...pageProps} />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </DeviceProvider>
        </ViewportProvider>
      </ThemeProvider>
    </>
  );
}
