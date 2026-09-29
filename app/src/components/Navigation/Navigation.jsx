import Link from "next/link";

import styles from "./Navigation.module.css";

const Navigation = () => {
  const menuItems = [
    { name: "Work", slug: "/" },
    { name: "About", slug: "/about" },
    { name: "Video", slug: "/video" },
    { name: "Press", slug: "/press" },
    { name: "Contact", slug: "/contact" },
  ];
  return (
    <nav className={styles.navigation} typo="title">
      <ul>
        {menuItems.map((menuItem) => (
          <Link href={menuItem.slug}>{menuItem.name}</Link>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
