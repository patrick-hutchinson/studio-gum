import { forwardRef, useContext } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

import { DeviceContext } from "@/context/DeviceContext";
import Link from "next/link";

import styles from "./Header.module.scss";

const Header = forwardRef(function Header({ className = "", site }, ref) {
  const { isMobile } = useContext(DeviceContext);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const addressParts = [site?.address?.street, site?.address?.city].filter(Boolean);
  const address = addressParts.join(", ");
  const isYellowTheme = resolvedTheme === "yellow";
  const currentPath = router.pathname;

  const getLinkClassName = (href) => {
    const isActive = href === "/" ? currentPath === "/" : currentPath === href;

    return isActive ? styles.activeLink : undefined;
  };

  const toggleTheme = () => {
    setTheme(isYellowTheme ? "light" : "yellow");
  };

  const DesktopNav = () => {
    return (
      <>
        <nav>
          <Link className={getLinkClassName("/")} href="/">
            Work
          </Link>
          ,&nbsp;
          <Link className={getLinkClassName("/about")} href="/about">
            About
          </Link>
          ,&nbsp;
          <Link className={getLinkClassName("/press")} href="/press">
            Press
          </Link>
          ,&nbsp;
          <Link className={getLinkClassName("/contact")} href="/contact">
            Contact
          </Link>
          .
        </nav>

        <button className={styles.themeSwitch} type="button" onClick={toggleTheme}>
          {isYellowTheme ? "White" : "Yellow"}
        </button>

        {address ? <div>{address}.</div> : null}
      </>
    );
  };

  const MobileNav = () => {
    return <nav></nav>;
  };
  return (
    <header ref={ref} className={`${className} ${styles.header}`} typo="h3 bold compensate-bottom">
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </header>
  );
});

export default Header;
