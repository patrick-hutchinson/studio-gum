import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

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

const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: (scrollY) => ({
    opacity: 0,
    position: "fixed",
    top: -scrollY,
    left: 0,
    right: 0,
    width: "100%",
    pointerEvents: "none",
  }),
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const site = pageProps.site || {};
  const gumLogoRef = useRef(null);

  const [exitingScrollY, setExitingScrollY] = useState(0);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setExitingScrollY(window.scrollY);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events]);

  useEffect(() => {
    const logo = gumLogoRef.current;
    if (!logo) return undefined;

    let animationFrame = null;

    const updateLogoSpacing = () => {
      animationFrame = null;

      const letterHeight = Array.from(logo.children).reduce((height, letter) => {
        return height + letter.getBoundingClientRect().height;
      }, 0);
      const logoHeight = logo.getBoundingClientRect().height;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const maxGap = Math.max(0, (logoHeight - letterHeight) / Math.max(1, logo.children.length - 1));
      const scrollProgress = maxScroll <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / maxScroll));

      logo.style.setProperty("--gum-logo-gap", `${maxGap * scrollProgress}px`);
    };

    const scheduleLogoSpacingUpdate = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(updateLogoSpacing);
    };

    scheduleLogoSpacingUpdate();
    window.addEventListener("scroll", scheduleLogoSpacingUpdate, { passive: true });
    window.addEventListener("resize", scheduleLogoSpacingUpdate);
    router.events.on("routeChangeComplete", scheduleLogoSpacingUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleLogoSpacingUpdate);
      window.removeEventListener("resize", scheduleLogoSpacingUpdate);
      router.events.off("routeChangeComplete", scheduleLogoSpacingUpdate);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
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
      <ThemeProvider attribute="data-theme" enableSystem={false} forcedTheme="light">
        <ViewportProvider>
          <DeviceProvider>
            <div className={styles.shell}>
              <Header className={styles.header} site={site} />
              <Menu />

              <div ref={gumLogoRef} className={styles.gumLogo} typo="h3">
                <span>G</span>
                <span>U</span>
                <span>M</span>
              </div>

              <div className={`${styles.content} pageTransitionRoot`}>
                <MarginDebugOverlay />
                <AnimatePresence custom={exitingScrollY} initial={false}>
                  <motion.div
                    animate="animate"
                    className="pageTransition"
                    custom={exitingScrollY}
                    exit="exit"
                    initial="initial"
                    key={router.asPath}
                    transition={{ duration: 1, ease: "easeInOut" }}
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
