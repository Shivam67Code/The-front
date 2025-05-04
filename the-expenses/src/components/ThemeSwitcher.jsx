import React, { useState, useContext, useRef, useEffect } from 'react';
import { LuPalette } from 'react-icons/lu';
import { ThemeContext, themes } from '../context/themeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey);
    setIsOpen(false);
  };

  // Current theme emoji
  const currentThemeEmoji = themes[theme]?.properties['--theme-emoji'] || '🎨';

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change theme"
        aria-expanded={isOpen}
        aria-controls="theme-dropdown"
      >
        <span 
          className="text-lg"
          style={{ filter: isOpen ? 'brightness(1.2)' : 'none' }}
        >
          {currentThemeEmoji}
        </span>
        <span className="text-sm hidden sm:block" style={{ color: 'var(--text-color)' }}>Theme</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="theme-dropdown"
            className="absolute right-0 mt-2 z-50 w-64 overflow-hidden rounded-xl shadow-xl"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 10px 25px var(--shadow-color)',
            }}
          >
            <div className="compact-theme-selector">
              <div className="px-3 py-2 text-sm font-medium border-b flex items-center gap-1.5" 
                style={{ 
                  borderColor: 'var(--border-color)',
                  background: 'var(--accent-gradient)',
                  color: 'white'
                }}
              >
                <LuPalette size={14} />
                Select Theme
              </div>
              <div className="py-1.5 max-h-80 overflow-y-auto theme-list">
                {Object.entries(themes).map(([key, { name, properties }]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleThemeSelect(key)}
                    className={`compact-theme-option ${key === theme ? 'active' : ''}`}
                    whileHover={{ x: 2 }}
                    style={{
                      color: 'var(--text-color)',
                     }}
                  >
                    <div className="theme-info flex items-center gap-2 w-full relative p-2 px-3 hover:bg-black/5 transition-colors">
                      <div className="theme-emoji">{properties['--theme-emoji']}</div>
                      <div className="theme-name">{name}</div>
                      {key === theme && (
                        <motion.div 
                          className="ml-auto text-xs"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ color: 'var(--accent-color)' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;