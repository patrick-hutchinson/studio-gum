import { useContext } from "react";

import { DeviceContext } from "@/context/DeviceContext";
import Link from "next/link";

import styles from "./Header.module.scss";

const Header = ({ className = "", site }) => {
  const { isMobile } = useContext(DeviceContext);
  const addressParts = [site?.address?.street, site?.address?.city].filter(Boolean);
  const address = addressParts.join(", ");

  const DesktopNav = () => {
    return (
      <>
        <nav>
          <Link href="/work">Work</Link>,&nbsp;
          <Link href="/about">About</Link>,&nbsp;
          <Link href="/press">Press</Link>,&nbsp;
          <Link href="/contact">Contact</Link>.
        </nav>

        {address ? <div>{address}.</div> : null}
      </>
    );
  };

  const MobileNav = () => {
    return <nav></nav>;
  };
  return (
    <header className={`${className} ${styles.header}`} typo="h3">
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </header>
  );
};

export default Header;
