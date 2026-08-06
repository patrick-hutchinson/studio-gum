import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ThemeProvider } from "next-themes";
import { DeviceProvider } from "@/context/DeviceContext";
import { ViewportProvider } from "@/context/ViewportContext";

import { AnimatePresence, motion } from "framer-motion";

import Head from "next/head";
import Menu from "@/components/Menu/Menu";

import "@/styles/globals.css";
import "@/styles/fonts.css";

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
  const site = pageProps.site || null;

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

  return (
    <>
      <Head>
        <title>{site.title}</title>
        {site.description ? <meta name="description" content={site.description} /> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={site.faviconUrl} />
      </Head>
      <ThemeProvider attribute="data-theme" enableSystem={false} forcedTheme="light">
        <ViewportProvider>
          <DeviceProvider>
            <Menu />

            <div className="pageTransitionRoot">
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
          </DeviceProvider>
        </ViewportProvider>
      </ThemeProvider>
    </>
  );
}
