import React from "react";
import { HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineCurrencyDollar, HiOutlineCalculator } from "react-icons/hi";
import { FiUser, FiPieChart, FiDatabase } from "react-icons/fi";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content area - form side */}
      <div className="w-full md:w-1/2 px-6 sm:px-12 lg:px-16 py-12 flex flex-col justify-center">
        {children}
      </div>

      {/* Info panel - right side with advanced animations */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-green-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Hexagonal pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="hexagons" width="50" height="86.6" patternUnits="userSpaceOnUse">
                <path d="M25 0 L50 43.3 L25 86.6 L0 43.3 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>
          
          {/* Animated floating circles - Dr. Doom-inspired elements */}
          <div className="absolute h-36 w-36 rounded-full bg-white/10 -top-[5%] right-[10%] animate-float-slow blur-sm"></div>
          <div className="absolute h-24 w-24 rounded-full bg-white/5 top-[35%] right-[20%] animate-float-medium"></div>
          <div className="absolute h-48 w-48 rounded-full bg-white/5 bottom-[15%] left-[10%] animate-float-fast blur-sm"></div>
          
          {/* Digital circuit lines */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="circuits" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 H100 M50 0 V100 M25 25 L75 75 M75 25 L25 75 M0 0 L100 100" 
                      stroke="currentColor" strokeWidth="0.5" fill="none" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuits)" />
            </svg>
          </div>
        </div>
        
        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Brand logo area with SK initials */}
          <div className="flex items-center space-x-3 mb-10">
            <motion.div 
              className="flex h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm items-center justify-center shadow-lg"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <span className="text-xl font-bold tracking-tight">SK</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-xl font-bold">SHIVAM KARN</h1>
              <p className="text-xs text-green-100">Financial Command Center</p>
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Master Your Finances
          </motion.h1>
          
          <motion.p 
            className="text-green-100 text-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Conquer your financial realm with precision and insight
          </motion.p>
          
          {/* Features list with staggered animations - Only showing actual features */}
          <div className="space-y-8">
            <motion.div 
              className="flex items-start space-x-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <HiOutlineChartBar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Expense Analytics</h3>
                <p className="text-green-100 mt-1">Visualize spending patterns with interactive charts and powerful insights</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start space-x-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <HiOutlineCurrencyDollar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Budget Management</h3>
                <p className="text-green-100 mt-1">Set spending limits and track progress towards your financial goals</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start space-x-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FiPieChart className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Income Tracking</h3>
                <p className="text-green-100 mt-1">Record and analyze your revenue streams in one secure location</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 mt-auto pt-10">
          <p className="text-sm text-green-100 opacity-80">
            &copy; {new Date().getFullYear()} SHIVAM KARN's Expense Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;