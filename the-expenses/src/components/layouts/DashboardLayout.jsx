import React, { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import ThemeAnimationWrapper from "../ThemeAnimationWrapper";
import { ThemeContext } from "../../context/themeContext";
import { UserContext } from "../../context/userContext";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../PageTransition";

const DashboardLayout = ({ children, activeMenu }) => {
  const { theme, isChanging } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [previousMenu, setPreviousMenu] = useState(activeMenu);
  const [transitionDirection, setTransitionDirection] = useState(null);
  
  // Get username from user context
  const username = user?.fullName?.split(' ')[0] || 'User';
  const appTitle = `${username}'s Expense Tracker`;
  
  // Track menu changes to determine animation direction
  useEffect(() => {
    if (activeMenu !== previousMenu) {
      // Define page order for direction determination
      const pageOrder = ['dashboard', 'income', 'expense', 'analytics', 'profile'];
      const prevIndex = pageOrder.indexOf(previousMenu);
      const currentIndex = pageOrder.indexOf(activeMenu);
      
      if (prevIndex !== -1 && currentIndex !== -1) {
        setTransitionDirection(prevIndex < currentIndex ? 'forward' : 'backward');
      } else {
        // Default direction if pages not found in order
        setTransitionDirection('forward');
      }
      
      setPreviousMenu(activeMenu);
    }
  }, [activeMenu, previousMenu]);
  
  // Determine page type based on activeMenu
  const getPageType = () => {
    if (activeMenu === 'dashboard') return 'dashboard';
    if (activeMenu === 'income') return 'income';
    if (activeMenu === 'expense') return 'expense';
    if (activeMenu === 'analytics') return 'analytics';
    if (activeMenu === 'profile') return 'profile';
    return 'dashboard'; // default
  };
  
  return (
    <div 
      className={`flex h-screen transition-colors duration-500 theme-${theme}`} 
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="hidden lg:block w-[250px] border-r" style={{ borderColor: 'var(--border-color)' }}>
        <SideMenu activeMenu={activeMenu} appTitle={appTitle} />
      </div>
      <div className="flex-1 flex flex-col w-full">
        <Navbar activeMenu={activeMenu} appTitle={appTitle} />
        <div className="flex-1 overflow-y-auto page-viewport">
          <ThemeAnimationWrapper>
            <PageTransition 
              pageType={getPageType()} 
              direction={transitionDirection}
            >
              {children}
            </PageTransition>
          </ThemeAnimationWrapper>
        </div>
      </div>
      
      <div className={`fixed inset-0 pointer-events-none ${theme}-theme-bg transition-opacity duration-800 z-50 ${isChanging ? 'opacity-10' : 'opacity-0'}`}></div>
    </div>
  );
};

export default DashboardLayout;