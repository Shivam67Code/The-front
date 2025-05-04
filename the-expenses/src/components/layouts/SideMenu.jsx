import React, { useContext, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { ThemeContext } from '../../context/themeContext';
import { FiGrid, FiDollarSign, FiCreditCard, FiMenu, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SIDE_MENU_DATA = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <FiGrid className="text-lg" />,
  },
  {
    label: 'Income',
    path: '/income',
    icon: <FiDollarSign className="text-lg" />,
  },
  {
    label: 'Expense',
    path: '/expense',
    icon: <FiCreditCard className="text-lg" />,
  },
  {
    label: 'Meals',
    path: '/meals',
    icon: <FiMenu className="text-lg" />,
  }
];

const SideMenu = ({ activeMenu, appTitle }) => {
  const { user, logout } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Handle logout with confirmation
  const handleLogoutClick = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);
  
  const handleLogoutConfirm = useCallback(() => {
    setIsLogoutModalOpen(false);
    logout(); // This will clear both token and user data
    navigate('/login');
  }, [logout, navigate]);
  
  const handleLogoutCancel = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  // If activeMenu isn't provided, determine it from the current path
  const currentActiveMenu = activeMenu || 
    SIDE_MENU_DATA.find(item => location.pathname.includes(item.path))?.label;

  return (
    <div className="side-menu">
      <div className="logo">
        <h1 className="text-lg font-bold">{appTitle}</h1>
      </div>
      <aside className="h-full flex flex-col justify-between p-6" style={{ color: 'var(--text-color)' }}>
        <div>
          {/* Profile section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              {user?.profileImageUrl ? (
                <div className="overflow-hidden rounded-full w-16 h-16 mb-3 ring-2 ring-indigo-100">
                  <img
                    src={user?.profileImageUrl}
                    alt={`${user?.fullName || 'User'}'s profile`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-gray-700">{user?.fullName?.charAt(0) || 'U'}</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-center">{user?.fullName}</h3>
          </div>

          {/* Navigation Menu */}
          <div className="mt-8 flex flex-col gap-2">
            {SIDE_MENU_DATA.map(item => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 text-[15px] mb-2 p-3 px-5 rounded-lg transition-all duration-300 ${
                  currentActiveMenu === item.label
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={`${currentActiveMenu === item.label ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-300`}>
                  {item.icon}
                </span>
                <span className={`font-medium ${currentActiveMenu === item.label ? 'text-blue-600' : ''}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-2 w-full rounded-lg transition-all duration-200 hover:bg-red-50 text-red-600"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>

        {/* Logout confirmation modal */}
        <LogoutConfirmModal 
          isOpen={isLogoutModalOpen}
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      </aside>
    </div>
  );
};

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center z-50 animate-fadeIn transition-all duration-300">
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-sm w-full border border-gray-200/50 dark:border-gray-700/50 animate-scaleIn overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ 
          background: 'var(--card-bg, rgba(255, 255, 255, 0.9))',
          borderColor: 'var(--border-color, rgba(229, 231, 235, 0.5))',
          boxShadow: '0 10px 25px var(--shadow-color, rgba(0, 0, 0, 0.1))'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 -z-10 dark:bg-green-900 dark:opacity-30 dark:mix-blend-overlay"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 -z-10 dark:bg-blue-900 dark:opacity-30 dark:mix-blend-overlay"></div>
        
        {/* Content */}
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
            <FiLogOut className="text-red-600 dark:text-red-400 h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100" style={{ color: 'var(--text-color, #1f2937)' }}>
            Confirm Logout
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6" style={{ color: 'var(--text-secondary, #4b5563)' }}>
          Are you sure you want to logout from your account? Your data will remain securely stored.
        </p>
        
        <div className="flex justify-end gap-3">
          <motion.button 
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              borderColor: 'var(--border-color, #e5e7eb)',
              color: 'var(--text-color, #374151)'
            }}
          >
            Stay Logged In
          </motion.button>
          
          <motion.button 
            onClick={onConfirm}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <FiLogOut className="mr-1.5 h-4 w-4" />
              <span>Logout</span>
            </div>
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ 
                mixBlendMode: "overlay"
              }}
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 0.1, 0]
              }}
              transition={{
                repeat: Infinity,
                repeatDelay: 3,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </div>
      </motion.div>
      
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SideMenu;