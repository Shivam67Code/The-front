import React, { useState, useEffect, useContext, useCallback } from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuLock, LuExternalLink } from "react-icons/lu";
import { FiClock, FiCalendar } from "react-icons/fi";
import SideMenu from './SideMenu';
import ThemeSwitcher from '../ThemeSwitcher';
import { ThemeContext, themes } from '../../context/themeContext';
import VaultPromptModal from '../../components/VaultPromptModal';

// Rain effect component - update this to remove flowers and grass
const RainEffect = () => {
  const [raindrops, setRaindrops] = useState([]);
  const [lightning, setLightning] = useState({ active: false, intensity: 0 });
  const { theme } = useContext(ThemeContext);
  
  // Get theme values from CSS variables for better synchronization
  const getCSSVariable = (name) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };
  
  // Generate theme-aware styling
  const getThemeStyles = () => {
    // Get accent color from theme
    const accentColor = getCSSVariable('--accent-color') || '#3b82f6';
    const textColor = getCSSVariable('--text-color') || '#1f2937';
    
    // Parse the accent color to extract RGB values
    let accentRGB = { r: 70, g: 130, b: 230 }; // Default fallback
    
    // Try to parse the accent color if it's in hex format
    if (accentColor.startsWith('#')) {
      const hex = accentColor.slice(1);
      if (hex.length === 3) {
        accentRGB = {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        };
      } else if (hex.length === 6) {
        accentRGB = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16)
        };
      }
    }
    
    switch(theme) {
      case 'dark':
        return {
          raindrop: `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.7)`,
          cloud: `rgba(${Math.max(0, accentRGB.r - 40)}, ${Math.max(0, accentRGB.g - 40)}, ${Math.max(0, accentRGB.b - 40)}, 0.6)`,
          cloudShadow: `rgba(${Math.max(0, accentRGB.r - 70)}, ${Math.max(0, accentRGB.g - 70)}, ${Math.max(0, accentRGB.b - 70)}, 0.3)`,
          lightning: `rgba(230, 230, 255, 0.9)`,
          lightningGlow: `0 0 60px 30px rgba(180, 180, 255, 0.8)`
        };
      case 'purple':
        return {
          raindrop: `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.7)`,
          cloud: `rgba(${Math.max(0, accentRGB.r - 40)}, ${Math.max(0, accentRGB.g - 40)}, ${Math.max(0, accentRGB.b - 40)}, 0.6)`,
          cloudShadow: `rgba(${Math.max(0, accentRGB.r - 70)}, ${Math.max(0, accentRGB.g - 70)}, ${Math.max(0, accentRGB.b - 70)}, 0.3)`,
          lightning: 'rgba(230, 200, 255, 0.9)',
          lightningGlow: '0 0 60px 30px rgba(180, 120, 255, 0.8)'
        };
      case 'golden':
        return {
          raindrop: `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.7)`,
          cloud: `rgba(${Math.max(0, accentRGB.r - 40)}, ${Math.max(0, accentRGB.g - 40)}, ${Math.max(0, accentRGB.b - 40)}, 0.6)`,
          cloudShadow: `rgba(${Math.max(0, accentRGB.r - 70)}, ${Math.max(0, accentRGB.g - 70)}, ${Math.max(0, accentRGB.b - 70)}, 0.3)`,
          lightning: 'rgba(255, 240, 180, 0.9)',
          lightningGlow: '0 0 60px 30px rgba(255, 200, 100, 0.8)'
        };
      default: // light and others
        return {
          raindrop: `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.7)`,
          cloud: `rgba(${Math.max(0, accentRGB.r - 40)}, ${Math.max(0, accentRGB.g - 40)}, ${Math.max(0, accentRGB.b - 40)}, 0.6)`,
          cloudShadow: `rgba(${Math.max(0, accentRGB.r - 70)}, ${Math.max(0, accentRGB.g - 70)}, ${Math.max(0, accentRGB.b - 70)}, 0.3)`,
          lightning: 'rgba(230, 230, 255, 0.9)',
          lightningGlow: '0 0 60px 30px rgba(200, 200, 255, 0.8)'
        };
    }
  };

  const styles = getThemeStyles();
  
  // Generate clouds
  const clouds = [
    { left: '10%', top: '10%', size: 60, delay: 0 },
    { left: '30%', top: '5%', size: 80, delay: 2 },
    { left: '60%', top: '8%', size: 70, delay: 1 },
    { left: '80%', top: '15%', size: 50, delay: 3 },
  ];

  // Create lightning effect
  useEffect(() => {
    const createLightning = () => {
      // Random time between 5-15 seconds for next lightning
      const nextLightningTime = 5000 + Math.random() * 10000;
      
      setTimeout(() => {
        // Flash the lightning
        setLightning({ active: true, intensity: 0.8 + Math.random() * 0.2 });
        
        // Fade out after a short time
        setTimeout(() => {
          setLightning({ active: false, intensity: 0 });
        }, 100 + Math.random() * 150);
        
        // Maybe do a second flash
        if (Math.random() > 0.6) {
          setTimeout(() => {
            setLightning({ active: true, intensity: 0.5 + Math.random() * 0.5 });
            
            setTimeout(() => {
              setLightning({ active: false, intensity: 0 });
              
              // Schedule next lightning
              createLightning();
            }, 50 + Math.random() * 100);
          }, 100 + Math.random() * 200);
        } else {
          // Schedule next lightning
          createLightning();
        }
      }, nextLightningTime);
    };
    
    // Start the lightning cycle
    createLightning();
    
    // No cleanup needed as component is persistent
  }, []);

  // Create new raindrops
  useEffect(() => {
    // Initialize raindrops
    const createRaindrop = () => {
      const id = Math.random().toString(36);
      const left = Math.random() * 100; // position across width (%)
      const size = Math.random() * 3 + 1; // raindrop size
      const duration = Math.random() * 0.5 + 0.7; // fall animation duration
      const delay = Math.random() * 0.3; // start delay
      
      return { id, left, size, duration, delay };
    };
    
    // Initial raindrops
    setRaindrops(Array.from({ length: 30 }, createRaindrop));
    
    // Keep adding raindrops
    const interval = setInterval(() => {
      setRaindrops(prev => {
        // Remove some older drops to prevent too many elements
        const filtered = prev.slice(-40);
        return [...filtered, createRaindrop()];
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Keyframe animations */}
      <style>
        {`
          @keyframes raindrop {
            0% {
              transform: translateY(-10px);
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            90% {
              opacity: 0.7;
            }
            100% {
              transform: translateY(95px);
              opacity: 0;
            }
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-10px) translateX(10px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
          
          @keyframes lightning-path {
            0% {
              d: path('M 50,0 L 55,20 L 45,30 L 55,50 L 40,70');
            }
            50% {
              d: path('M 50,0 L 60,25 L 40,35 L 60,55 L 35,75');
            }
            100% {
              d: path('M 50,0 L 55,20 L 45,30 L 55,50 L 40,70');
            }
          }
        `}
      </style>
      
      {/* Lightning overlay */}
      {lightning.active && (
        <div 
          className="absolute inset-0 z-30 transition-opacity duration-100"
          style={{
            opacity: lightning.intensity,
            background: `radial-gradient(circle at ${30 + Math.random() * 40}% ${20 + Math.random() * 20}%, ${styles.lightning}, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
        ></div>
      )}
      
      {/* Lightning bolts */}
      {lightning.active && (
        <div 
          className="absolute z-20"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: 0,
            opacity: lightning.intensity
          }}
        >
          <svg width="100" height="80" viewBox="0 0 100 80">
            <path
              d={`M 50,0 L ${48 + Math.random() * 14},${15 + Math.random() * 10} L ${40 + Math.random() * 10},${25 + Math.random() * 10} L ${50 + Math.random() * 15},${45 + Math.random() * 10} L ${35 + Math.random() * 10},${65 + Math.random() * 15}`}
              stroke={styles.lightning}
              strokeWidth="2"
              fill="none"
              style={{
                filter: `drop-shadow(0 0 3px ${styles.lightning})`,
              }}
            />
          </svg>
        </div>
      )}
      
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <div 
          key={index}
          className="absolute"
          style={{
            left: cloud.left,
            top: cloud.top,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            borderRadius: '50%',
            background: styles.cloud,
            boxShadow: `5px 5px 10px ${styles.cloudShadow}`,
            animation: `float 15s ease-in-out ${cloud.delay}s infinite alternate`,
            zIndex: 10
          }}
        >
          {/* Cloud details */}
          <div 
            className="absolute"
            style={{
              left: '20%',
              top: '-30%',
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              background: styles.cloud
            }}
          ></div>
          <div 
            className="absolute"
            style={{
              left: '50%',
              top: '-40%',
              width: '50%',
              height: '70%',
              borderRadius: '50%',
              background: styles.cloud
            }}
          ></div>
        </div>
      ))}
      
      {/* Lightning glow source */}
      {lightning.active && (
        <div 
          className="absolute z-10"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${10 + Math.random() * 20}%`,
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: styles.lightning,
            boxShadow: styles.lightningGlow,
            opacity: lightning.intensity * 0.8
          }}
        ></div>
      )}
      
      {/* Raindrops */}
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="absolute w-0.5 rounded-full"
          style={{
            left: `${drop.left}%`,
            top: '-5px',
            height: `${drop.size * 10}px`,
            width: `${drop.size}px`,
            background: styles.raindrop,
            animation: `raindrop ${drop.duration}s linear ${drop.delay}s forwards`,
            zIndex: 5
          }}
        ></div>
      ))}
    </div>
  );
};

// Theme-aware Analog Clock Component
const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const { theme } = useContext(ThemeContext);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const secondsStyle = {
    transform: `rotate(${time.getSeconds() * 6}deg)`
  };
  
  const minutesStyle = {
    transform: `rotate(${time.getMinutes() * 6}deg)`
  };
  
  const hoursStyle = {
    transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)`
  };

  // Theme-specific styling
  const getThemeStyles = () => {
    switch(theme) {
      case 'dark':
        return {
          clock: {
            border: '2px solid rgba(100, 100, 255, 0.5)',
            background: 'radial-gradient(circle, rgba(20, 20, 40, 0.4) 0%, rgba(10, 10, 30, 0.3) 100%)',
            boxShadow: '0 0 15px rgba(80, 80, 255, 0.3), inset 0 0 20px rgba(60, 60, 200, 0.2)'
          },
          marking: {
            color: 'rgba(120, 120, 255, 0.9)'
          },
          hourHand: 'rgba(150, 150, 255, 0.9)',
          minuteHand: 'rgba(120, 120, 255, 0.9)',
          secondHand: 'rgba(100, 100, 255, 0.9)',
          centerPin: {
            bg: 'rgba(150, 150, 255, 0.9)',
            shadow: '0 0 3px rgba(100, 100, 255, 0.8)'
          }
        };
      case 'light':
        return {
          clock: {
            border: '2px solid rgba(0, 150, 0, 0.5)',
            background: 'radial-gradient(circle, rgba(220, 255, 220, 0.2) 0%, rgba(0, 80, 0, 0.1) 100%)',
            boxShadow: '0 0 10px rgba(0, 200, 0, 0.3), inset 0 0 15px rgba(0, 150, 0, 0.2)'
          },
          marking: {
            color: 'rgba(0, 150, 0, 0.9)'
          },
          hourHand: 'rgba(0, 100, 0, 0.9)',
          minuteHand: 'rgba(0, 130, 0, 0.9)',
          secondHand: 'rgba(0, 160, 0, 0.9)',
          centerPin: {
            bg: 'rgba(0, 100, 0, 0.9)',
            shadow: '0 0 3px rgba(0, 150, 0, 0.8)'
          }
        };
      case 'purple':
        return {
          clock: {
            border: '2px solid rgba(150, 50, 200, 0.5)',
            background: 'radial-gradient(circle, rgba(240, 220, 255, 0.2) 0%, rgba(100, 0, 150, 0.1) 100%)',
            boxShadow: '0 0 15px rgba(180, 0, 255, 0.3), inset 0 0 20px rgba(150, 0, 200, 0.2)'
          },
          marking: {
            color: 'rgba(170, 80, 220, 0.9)'
          },
          hourHand: 'rgba(130, 40, 180, 0.9)',
          minuteHand: 'rgba(150, 60, 200, 0.9)',
          secondHand: 'rgba(170, 80, 220, 0.9)',
          centerPin: {
            bg: 'rgba(130, 40, 180, 0.9)',
            shadow: '0 0 3px rgba(150, 0, 200, 0.8)'
          }
        };
      case 'golden':
        return {
          clock: {
            border: '2px solid rgba(230, 180, 50, 0.5)',
            background: 'radial-gradient(circle, rgba(255, 245, 210, 0.2) 0%, rgba(180, 140, 20, 0.1) 100%)',
            boxShadow: '0 0 15px rgba(255, 200, 0, 0.3), inset 0 0 20px rgba(200, 160, 0, 0.2)'
          },
          marking: {
            color: 'rgba(200, 160, 50, 0.9)'
          },
          hourHand: 'rgba(180, 140, 20, 0.9)',
          minuteHand: 'rgba(200, 160, 30, 0.9)',
          secondHand: 'rgba(220, 180, 40, 0.9)',
          centerPin: {
            bg: 'rgba(180, 140, 20, 0.9)',
            shadow: '0 0 3px rgba(200, 160, 0, 0.8)'
          }
        };
      default: 
        return {
          clock: {
            border: '2px solid rgba(0, 150, 0, 0.5)',
            background: 'radial-gradient(circle, rgba(220, 255, 220, 0.2) 0%, rgba(0, 80, 0, 0.1) 100%)',
            boxShadow: '0 0 10px rgba(0, 200, 0, 0.3), inset 0 0 15px rgba(0, 150, 0, 0.2)'
          },
          marking: {
            color: 'rgba(0, 150, 0, 0.9)'
          },
          hourHand: 'rgba(0, 100, 0, 0.9)',
          minuteHand: 'rgba(0, 130, 0, 0.9)',
          secondHand: 'rgba(0, 160, 0, 0.9)',
          centerPin: {
            bg: 'rgba(0, 100, 0, 0.9)',
            shadow: '0 0 3px rgba(0, 150, 0, 0.8)'
          }
        };
    }
  };

  const styles = getThemeStyles();
  
  return (
    <div className="relative w-16 h-16 rounded-full transition-all duration-500" 
         style={{ 
           border: styles.clock.border,
           background: styles.clock.background,
           boxShadow: styles.clock.boxShadow
         }}>
      {/* Hour Markings */}
      {[...Array(12)].map((_, i) => (
        <div key={i} 
             className="absolute rounded-full transition-all duration-500"
             style={{ 
               left: '50%', 
               top: i % 3 === 0 ? '2px' : '3px',
               height: i % 3 === 0 ? '6px' : '4px',
               width: i % 3 === 0 ? '2px' : '1px',
               backgroundColor: styles.marking.color,
               transformOrigin: '0 calc(8px + 0.5px)', 
               transform: `rotate(${i * 30}deg) translateX(-50%)` 
             }}></div>
      ))}
      
      {/* Clock Hands */}
      <div className="absolute top-1/2 left-1/2 w-0.5 h-5 rounded-full origin-bottom transition-all duration-500" 
           style={{ 
             backgroundColor: styles.hourHand,
             ...hoursStyle, 
             transform: `${hoursStyle.transform} translateX(-50%)` 
           }}></div>
      <div className="absolute top-1/2 left-1/2 w-0.5 h-6 rounded-full origin-bottom transition-all duration-500" 
           style={{ 
             backgroundColor: styles.minuteHand,
             ...minutesStyle, 
             transform: `${minutesStyle.transform} translateX(-50%)` 
           }}></div>
      <div className="absolute top-1/2 left-1/2 w-0.5 h-7 rounded-full origin-bottom transition-all duration-500" 
           style={{ 
             backgroundColor: styles.secondHand,
             ...secondsStyle, 
             transform: `${secondsStyle.transform} translateX(-50%)` 
           }}></div>
      
      {/* Center Pin */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
           style={{ 
             backgroundColor: styles.centerPin.bg,
             boxShadow: styles.centerPin.shadow 
           }}></div>
    </div>
  );
};

const Navbar = ({ activeMenu, appTitle }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const { theme } = useContext(ThemeContext);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isVaultButtonHovered, setIsVaultButtonHovered] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Current theme emoji
  const currentThemeEmoji = themes[theme]?.properties['--theme-emoji'] || '💼';

  // Update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Smoother breathing effect for the clock
  useEffect(() => {
    let direction = 1;
    const breathingInterval = setInterval(() => {
      setPulseIntensity(prev => {
        const newValue = prev + (0.05 * direction);
        if (newValue >= 1) direction = -1;
        if (newValue <= 0) direction = 1;
        return Math.max(0, Math.min(1, newValue));
      });
    }, 50);
    return () => clearInterval(breathingInterval);
  }, []);

  // Get theme-specific styles for date and time display
  const getThemeTimeStyles = () => {
    switch(theme) {
      case 'dark':
        return {
          bg: 'rgba(30, 30, 70, 0.2)',
          border: '3px solid rgba(80, 80, 200, 0.5)',
          boxShadow: `0 0 ${8 + pulseIntensity * 8}px rgba(100, 100, 255, ${0.2 + pulseIntensity * 0.3})`,
          textShadow: `0 0 ${3 + pulseIntensity * 2}px rgba(100, 100, 255, ${0.2 + pulseIntensity * 0.3})`,
          iconColor: 'rgba(120, 120, 255, 0.9)'
        };
      case 'light':
        return {
          bg: 'rgba(0, 70, 0, 0.1)',
          border: '3px solid rgba(0, 150, 0, 0.7)',
          boxShadow: `0 0 ${8 + pulseIntensity * 8}px rgba(0, 180, 0, ${0.2 + pulseIntensity * 0.3})`,
          textShadow: `0 0 ${3 + pulseIntensity * 2}px rgba(0, 180, 0, ${0.2 + pulseIntensity * 0.3})`,
          iconColor: 'rgba(0, 150, 0, 0.9)'
        };
      case 'purple':
        return {
          bg: 'rgba(80, 0, 100, 0.1)',
          border: '3px solid rgba(150, 50, 200, 0.7)',
          boxShadow: `0 0 ${8 + pulseIntensity * 8}px rgba(170, 80, 220, ${0.2 + pulseIntensity * 0.3})`,
          textShadow: `0 0 ${3 + pulseIntensity * 2}px rgba(170, 80, 220, ${0.2 + pulseIntensity * 0.3})`,
          iconColor: 'rgba(170, 80, 220, 0.9)'
        };
      case 'golden':
        return {
          bg: 'rgba(100, 80, 0, 0.1)',
          border: '3px solid rgba(200, 160, 30, 0.7)',
          boxShadow: `0 0 ${8 + pulseIntensity * 8}px rgba(220, 180, 40, ${0.2 + pulseIntensity * 0.3})`,
          textShadow: `0 0 ${3 + pulseIntensity * 2}px rgba(220, 180, 40, ${0.2 + pulseIntensity * 0.3})`,
          iconColor: 'rgba(200, 160, 30, 0.9)'
        };
      default:
        return {
          bg: 'rgba(0, 70, 0, 0.1)',
          border: '3px solid rgba(0, 150, 0, 0.7)',
          boxShadow: `0 0 ${8 + pulseIntensity * 8}px rgba(0, 180, 0, ${0.2 + pulseIntensity * 0.3})`,
          textShadow: `0 0 ${3 + pulseIntensity * 2}px rgba(0, 180, 0, ${0.2 + pulseIntensity * 0.3})`,
          iconColor: 'rgba(0, 150, 0, 0.9)'
        };
    }
  };

  const timeStyles = getThemeTimeStyles();

  // Vault modal handlers
  const handleOpenVaultModal = useCallback(() => {
    setIsVaultModalOpen(true);
  }, []);
  
  const handleVaultConfirm = useCallback(() => {
    setIsVaultModalOpen(false);
    window.open("https://shivamsvault.netlify.app/", "_blank", "noopener,noreferrer");
  }, []);
  
  const handleVaultCancel = useCallback(() => {
    setIsVaultModalOpen(false);
  }, []);

  return (
    <>
      <div 
        className="flex justify-between items-center border border-b backdrop-blur-[2px] py-4 px-7 sticky top-0 z-300 relative" 
        style={{ 
          background: 'var(--sidebar-bg)', 
          borderColor: 'var(--border-color)',
          boxShadow: '0 2px 10px var(--shadow-color)'
        }}
      >
        {/* Add the rain effect here */}
        <RainEffect />
        
        <div className="flex items-center gap-5 relative z-10">
          <button
            className="block lg:hidden"
            onClick={() => {
              setOpenSideMenu(!openSideMenu);
            }}
            style={{ color: 'var(--text-color)' }}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>
          
          {/* Glassmorphism container for title */}
          <div className="flex flex-col relative">
            {/* Glassmorphism background */}
            <div className="absolute -left-3 -top-3 -right-3 -bottom-3 rounded-xl backdrop-blur-md z-0"
                 style={{
                   backgroundColor: 'rgba(255, 255, 255, 0.15)',
                   border: '1px solid rgba(255, 255, 255, 0.2)',
                   boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
                 }}>
            </div>
            
            <h1 className="text-xl font-bold relative z-10 px-3 pt-2">{appTitle}</h1>
            <h2 className="text-lg font-medium flex items-center navbar-brand relative z-10 px-3" style={{ color: 'var(--accent-color)' }}>
              <span className="mr-2">{currentThemeEmoji}</span>
            </h2>
            
            {/* Enhanced Date and Time Display with Theme Syncing */}
            <div className="mt-2 flex gap-3 items-center relative z-10 px-3 pb-2">
              <AnalogClock />
              
              <div className="flex flex-col gap-2">
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-500"
                  style={{ 
                    backgroundColor: timeStyles.bg,
                    borderLeft: timeStyles.border,
                    boxShadow: timeStyles.boxShadow,
                  }}
                >
                  <FiCalendar className="text-sm transition-colors duration-500" 
                              style={{ color: timeStyles.iconColor }}/>
                  <p 
                    className="text-xs font-medium transition-all duration-500" 
                    style={{ 
                      color: 'var(--text-color)',
                      textShadow: timeStyles.textShadow
                    }}
                  >
                    {today}
                  </p>
                </div>
                
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-500"
                  style={{ 
                    backgroundColor: timeStyles.bg,
                    borderLeft: timeStyles.border,
                    boxShadow: timeStyles.boxShadow,
                  }}
                >
                  <FiClock 
                    className="text-sm transition-colors duration-500" 
                    style={{ 
                      color: timeStyles.iconColor,
                    }}
                  />
                  <p 
                    className="text-xs font-medium transition-all duration-500" 
                    style={{ 
                      color: 'var(--text-color)',
                      textShadow: timeStyles.textShadow
                    }}
                  >
                    <span className="font-mono tracking-wider">{currentTime}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleOpenVaultModal}
            onMouseEnter={() => setIsVaultButtonHovered(true)}
            onMouseLeave={() => setIsVaultButtonHovered(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 relative overflow-hidden group"
            style={{ 
              backgroundColor: isVaultButtonHovered 
                ? 'var(--accent-color)' 
                : 'var(--accent-color-light, rgba(59, 130, 246, 0.1))',
              color: isVaultButtonHovered 
                ? 'white' 
                : 'var(--accent-color)',
              transform: isVaultButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isVaultButtonHovered 
                ? '0 4px 12px var(--shadow-color, rgba(0, 0, 0, 0.1))' 
                : 'none',
              border: isVaultButtonHovered 
                ? '1px solid var(--accent-color)' 
                : '1px solid transparent'
            }}
            aria-label="Open Shivam's Vault"
          >
            {/* Add shine effect overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
            ></div>
            
            <LuLock className={`${isVaultButtonHovered ? 'text-white' : ''} text-sm transition-all duration-300 ${isVaultButtonHovered ? 'rotate-12 scale-110' : ''}`} />
            <span className={`text-sm font-medium transition-all duration-300 ${isVaultButtonHovered ? 'font-semibold' : ''}`}>
              🔐 Secure Passwords
            </span>
          </button>
          
          <ThemeSwitcher />
        </div>
        
        {openSideMenu && (
          <div 
            className="fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] z-40 overflow-hidden backdrop-blur-md"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-30"
              style={{ 
                background: `linear-gradient(135deg, 
                  var(--card-bg-transparent, rgba(255, 255, 255, 0.2)) 0%, 
                  var(--card-bg-transparent, rgba(255, 255, 255, 0.1)) 100%)`,
                pointerEvents: 'none'
              }}
            ></div> 
            
            <div className="p-3 relative h-full bg-white/5">
              <SideMenu activeMenu={activeMenu} />
            </div>
          </div>
        )}
      </div>

      <VaultPromptModal 
        isOpen={isVaultModalOpen}
        onConfirm={handleVaultConfirm}
        onCancel={handleVaultCancel}
      />
    </>
  );
};

export default Navbar;