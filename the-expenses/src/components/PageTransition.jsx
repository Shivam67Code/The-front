import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/themeContext';

const PageTransition = ({ children, pageType, direction }) => {
  const { theme } = useContext(ThemeContext);
  
  // Enhanced premium transitions with direction awareness
  const transitions = {
    dashboard: {
      initial: (direction) => ({ 
        opacity: 0,
        scale: direction === 'backward' ? 1.06 : 0.94,
        y: direction === 'backward' ? -15 : 20,
        filter: 'blur(8px) brightness(1.1)',
        transformPerspective: '1200px',
        rotateX: direction === 'backward' ? '2deg' : '-1deg'
      }),
      animate: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        filter: 'blur(0px) brightness(1)',
        rotateX: '0deg',
        transition: {
          duration: 0.85,
          ease: [0.19, 1, 0.22, 1],
          staggerChildren: 0.05,
          delayChildren: 0.02
        }
      },
      exit: (direction) => ({ 
        opacity: 0,
        scale: direction === 'forward' ? 1.06 : 0.94,
        y: direction === 'forward' ? -15 : 15,
        filter: 'blur(8px)',
        rotateX: direction === 'forward' ? '2deg' : '-1deg',
        transition: {
          duration: 0.6,
          ease: [0.55, 0.085, 0.68, 0.53]
        }
      })
    },
    
    income: {
      initial: (direction) => ({ 
        opacity: 0,
        x: direction === 'backward' ? '-30%' : '30%',
        filter: 'brightness(1.2) blur(12px)',
        scale: direction === 'backward' ? 1.1 : 0.9,
        transformPerspective: '1200px',
        rotateY: direction === 'backward' ? '3deg' : '-3deg'
      }),
      animate: { 
        opacity: 1, 
        x: '0%',
        filter: 'brightness(1) blur(0px)',
        scale: 1,
        rotateY: '0deg',
        transition: {
          type: 'spring',
          damping: 22,
          stiffness: 90,
          staggerChildren: 0.07,
          delayChildren: 0.05
        }
      },
      exit: (direction) => ({ 
        opacity: 0,
        x: direction === 'forward' ? '-25%' : '25%',
        scale: direction === 'forward' ? 0.9 : 1.1,
        filter: 'blur(12px)',
        rotateY: direction === 'forward' ? '-3deg' : '3deg',
        transition: {
          duration: 0.55,
          ease: [0.43, 0.13, 0.23, 0.96]
        }
      })
    },
    
    expense: {
      initial: (direction) => ({ 
        opacity: 0,
        y: direction === 'backward' ? '-10%' : '8%',
        scale: 0.92,
        rotateZ: direction === 'backward' ? '1deg' : '-1deg',
        transformOrigin: direction === 'backward' ? 'center right' : 'center left',
        filter: 'saturate(0.8) blur(10px) contrast(0.95)',
      }),
      animate: { 
        opacity: 1, 
        y: '0%',
        scale: 1,
        rotateZ: '0deg',
        filter: 'saturate(1) blur(0px) contrast(1)',
        transition: {
          duration: 0.75,
          ease: [0.165, 0.84, 0.44, 1],
          staggerChildren: 0.08
        }
      },
      exit: (direction) => ({ 
        opacity: 0,
        scale: 0.95,
        y: direction === 'forward' ? '-8%' : '8%',
        rotateZ: direction === 'forward' ? '1deg' : '-1deg',
        filter: 'saturate(1.2) blur(8px)',
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1]
        }
      })
    }
  };
  
  // Theme-specific enhancements
  const themeEnhancements = {
    default: {
      timeMultiplier: 1,
      filter: 'none',
      decorationOpacity: 0.4
    },
    roseGold: {
      timeMultiplier: 1.15,
      filter: 'hue-rotate(-5deg)',
      decorationOpacity: 0.6
    },
    ocean: {
      timeMultiplier: 0.9,
      filter: 'hue-rotate(10deg)',
      decorationOpacity: 0.5
    },
    glass: {
      timeMultiplier: 1.05,
      filter: 'none',
      decorationOpacity: 0.35
    },
    sunset: {
      timeMultiplier: 1.1,
      filter: 'hue-rotate(5deg) saturate(1.1)',
      decorationOpacity: 0.5
    }
  };
  
  const themeEnhance = themeEnhancements[theme] || themeEnhancements.default;
  
  // Item variants for cards and grid elements
  const itemVariants = {
    hidden: (index) => ({ 
      opacity: 0, 
      y: 25 + (index * 5), 
      scale: 0.97,
      filter: 'blur(5px)',
      transformOrigin: 'center bottom'
    }),
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: index * 0.06 * themeEnhance.timeMultiplier,
        duration: 0.8 * themeEnhance.timeMultiplier,
        ease: [0.19, 1, 0.22, 1]
      }
    })
  };

  // Grid item variants
  const gridItemVariants = {
    hidden: (index) => ({ 
      opacity: 0, 
      y: 15, 
      scale: pageType === 'income' ? 0.96 : 0.98,
      filter: 'blur(4px)',
      rotateX: pageType === 'expense' ? '2deg' : '0deg',
      transformOrigin: 'center bottom'
    }),
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      rotateX: '0deg',
      transition: {
        delay: 0.1 + (index * 0.06 * themeEnhance.timeMultiplier),
        duration: 0.7 * themeEnhance.timeMultiplier,
        ease: [0.19, 1, 0.22, 1]
      }
    })
  };

  // Special decorator variants
  const decoratorVariants = {
    dashboard: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { 
        opacity: themeEnhance.decorationOpacity, 
        scale: 1,
        transition: { delay: 0.2, duration: 1.4 }
      },
      exit: { opacity: 0, scale: 1.2, transition: { duration: 0.4 } }
    },
    income: {
      initial: { opacity: 0, pathLength: 0 },
      animate: { 
        opacity: themeEnhance.decorationOpacity, 
        pathLength: 1,
        transition: { delay: 0.15, duration: 1.2, ease: "easeInOut" }
      },
      exit: { opacity: 0, transition: { duration: 0.3 } }
    },
    expense: {
      initial: { opacity: 0, scale: 0.5, rotate: -5 },
      animate: { 
        opacity: themeEnhance.decorationOpacity, 
        scale: 1, 
        rotate: 0,
        transition: { 
          delay: 0.1, 
          duration: 0.9, 
          type: "spring", 
          stiffness: 50 
        }
      },
      exit: { opacity: 0, scale: 1.3, transition: { duration: 0.4 } }
    }
  };
  
  // Apply the appropriate transition based on page type, with direction awareness
  const transition = transitions[pageType] || transitions.dashboard;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageType}
        className={`page-${pageType} page-content-wrapper`}
        custom={direction}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={transition}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          filter: themeEnhance.filter,
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Page-specific decorative elements */}
        {pageType === 'dashboard' && (
          <motion.div 
            className="page-decoration dashboard-glow"
            variants={decoratorVariants.dashboard}
          />
        )}
        
        {pageType === 'income' && (
          <motion.div 
            className="page-decoration income-path"
            variants={decoratorVariants.income}
          />
        )}
        
        {pageType === 'expense' && (
          <motion.div 
            className="page-decoration expense-particles"
            variants={decoratorVariants.expense}
          />
        )}
        
        {/* Custom rendering for different child types */}
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          // Different animations for cards
          if (child.props.className?.includes('card')) {
            return (
              <motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="card-wrapper"
              >
                {child}
              </motion.div>
            );
          }
          
          // Handle grid containers
          if (child.props.className?.includes('grid') || 
              child.props.className?.includes('flex')) {
            return React.cloneElement(child, {
              ...child.props,
              children: React.Children.map(child.props.children, (gridChild, gridIndex) => {
                if (!React.isValidElement(gridChild)) return gridChild;
                
                return (
                  <motion.div
                    custom={gridIndex}
                    initial="hidden"
                    animate="visible"
                    variants={gridItemVariants}
                    className="grid-item-wrapper"
                  >
                    {gridChild}
                  </motion.div>
                );
              })
            });
          }
          
          // Default for other elements
          return child;
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;