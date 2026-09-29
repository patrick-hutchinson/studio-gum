import { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation/Navigation";

import styles from "./Menu.module.scss";

import { AnimatePresence, motion } from "framer-motion";

const ALL_FILTER_ID = "all";

const Filters = ({ categories, selectedFilters, onToggleFilter }) => {
  if (!categories?.length) return null;

  const filters = [{ _id: ALL_FILTER_ID, name: "All" }, ...categories];

  return (
    <motion.nav
      className={styles.filters}
      typo="h4"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.25, ease: "easeInOut", delay: 0.5 },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.25, ease: "easeInOut" },
      }}
    >
      <ul>
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter._id);

          return (
            <li key={filter._id}>
              <button
                className={isSelected ? styles.selectedFilter : ""}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleFilter(filter._id)}
              >
                {filter.name}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

const Menu = ({ categories = [], menuButtonRef, selectedFilters = [ALL_FILTER_ID], onToggleFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const toggleMenu = () => {
    window.clearTimeout(closeTimeoutRef.current);

    if (isExpanded) {
      setShowNavigation(false);
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsExpanded(false);
      }, 350);
      return;
    }

    setIsExpanded(true);
    setShowNavigation(true);
  };

  return (
    <div className={`${styles.menu} ${isExpanded ? styles.showMenu : null}`}>
      <img className={`${styles.menuButton}`} ref={menuButtonRef} src="/icons/plus.svg" onClick={toggleMenu} />
      <AnimatePresence>
        {showNavigation && (
          <motion.div
            key="menu"
            className={styles.menuAnimation}
          >
            <motion.div
              className={styles.navigation}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.25, ease: "easeInOut", delay: 0.35 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.25, ease: "easeInOut" },
              }}
            >
              <Navigation />
            </motion.div>

            <Filters categories={categories} selectedFilters={selectedFilters} onToggleFilter={onToggleFilter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
