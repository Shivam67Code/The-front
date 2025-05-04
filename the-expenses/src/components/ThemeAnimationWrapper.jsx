import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/themeContext';

const ThemeAnimationWrapper = ({ children }) => {
  const { theme, isChanging } = useContext(ThemeContext);
  const [key, setKey] = useState(theme);
  
  // Reset animation when theme changes
  useEffect(() => {
    if (isChanging) {
      // Generate new key to force re-mount and new animation
      setKey(`${theme}-${Date.now()}`);
    }
  }, [theme, isChanging]);

  // Get theme-specific animation values
  const getThemeAnimation = () => {
    switch(theme) {
      case 'glass':
        return {
          initial: { opacity: 0, filter: 'blur(8px)' },
          animate: { opacity: 1, filter: 'blur(0px)' },
          transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
        };
      case 'ocean':
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }
        };
      case 'roseGold':
        return {
          initial: { opacity: 0, rotate: -0.5, scale: 0.99 },
          animate: { opacity: 1, rotate: 0, scale: 1 },
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        };
    }
  };

  const themeAnimation = getThemeAnimation();

  return (
    <motion.div 
      key={key}
      className="animate-with-theme w-full h-full"
      initial={themeAnimation.initial}
      animate={themeAnimation.animate}
      transition={themeAnimation.transition}
    >
      {children}
    </motion.div>
  );
};

export default ThemeAnimationWrapper;