import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-100 py-4 md:py-6">
      <div className="container mx-auto px-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <span className="font-bold text-gray-800 text-lg md:text-xl">The Expenses</span>
              <span className="ml-1 bg-green-500 rounded-full p-1 transform -translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Simplifying expense management</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center">
              <p className="text-xs md:text-sm text-gray-600">
                Made with <span className="text-red-500 mx-1">❤</span> by <span className="font-medium text-gray-700 hover:text-green-600 transition-colors">Shivam's Creations</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              © {new Date().getFullYear()} The Expenses | All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;