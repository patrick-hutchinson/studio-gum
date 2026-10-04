import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./Navigation.module.css";

const navigationItemVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const Navigation = ({ onFilterClick }) => {
  const router = useRouter();
  const isIndexPage = router.pathname === "/";
  const workItem = { name: "Work", slug: "/" };
  const secondaryMenuItems = [
    { name: "About", slug: "/about" },
    { name: "Video", slug: "/video" },
    { name: "Press", slug: "/press" },
    { name: "Contact", slug: "/contact" },
  ];
  return (
    <nav className={styles.navigation} typo="title">
      <motion.ul layout>
        <motion.li key={workItem.slug} layout>
          <Link className={router.pathname === workItem.slug ? styles.activeLink : ""} href={workItem.slug}>
            {workItem.name}
          </Link>
        </motion.li>
        <AnimatePresence>
          {isIndexPage ? (
            <motion.li
              key="filter"
              layout
              variants={navigationItemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <button type="button" onClick={onFilterClick}>
                Filter
              </button>
            </motion.li>
          ) : null}
        </AnimatePresence>
        {secondaryMenuItems.map((menuItem) => (
          <motion.li key={menuItem.slug} layout>
            <Link className={router.pathname === menuItem.slug ? styles.activeLink : ""} href={menuItem.slug}>
              {menuItem.name}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  );
};

export default Navigation;
