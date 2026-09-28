import Link from "next/link";

import styles from "./Menu.module.css";

const Menu = () => {
  const menuItems = [
    { name: "Work", slug: "/" },
    { name: "About", slug: "/about" },
    { name: "Video", slug: "/video" },
    { name: "Press", slug: "/press" },
    { name: "Contact", slug: "/contact" },
  ];
  return (
    <nav className={styles.menu} typo="title">
      <ul>
        {menuItems.map((menuItem) => (
          <Link href={menuItem.slug}>{menuItem.name}</Link>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
