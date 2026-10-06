import { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation/Navigation";

import styles from "./Menu.module.scss";

import { AnimatePresence, motion } from "framer-motion";

const ALL_FILTER_ID = "all";

const menuViewVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeInOut", delay: 0.35 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const Filters = ({ categories, selectedFilters, onBackToMenu, onToggleFilter }) => {
  if (!categories?.length) return null;

  const filters = [{ _id: ALL_FILTER_ID, name: "All" }, ...categories];

  return (
    <motion.nav
      className={styles.filters}
      typo="title"
      variants={menuViewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ul>
        <li className={styles.menuReturn}>
          <button type="button" onClick={onBackToMenu}>
            Menu
          </button>
        </li>
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
  const [activeView, setActiveView] = useState("menu");
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
        setActiveView("menu");
      }, 350);
      return;
    }

    setIsExpanded(true);
    setShowNavigation(true);
  };

  return (
    <div className={`${styles.menu} ${isExpanded ? styles.showMenu : null}`}>
      <button className={styles.menuButton} ref={menuButtonRef} type="button" aria-label="Toggle menu" onClick={toggleMenu} />
      <AnimatePresence>
        {showNavigation && (
          <motion.div key="menu" className={styles.menuAnimation}>
            <AnimatePresence mode="wait">
              {activeView === "menu" ? (
                <motion.div
                  key="menu-overview"
                  className={styles.navigation}
                  variants={menuViewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Navigation onFilterClick={() => setActiveView("filters")} />
                </motion.div>
              ) : (
                <Filters
                  key="menu-filters"
                  categories={categories}
                  selectedFilters={selectedFilters}
                  onBackToMenu={() => setActiveView("menu")}
                  onToggleFilter={onToggleFilter}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
