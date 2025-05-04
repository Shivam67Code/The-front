import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const MonthYearSelector = ({ month, year, onChange }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear = year - 1;
    }
    
    onChange(newMonth, newYear);
  };
  
  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear = year + 1;
    }
    
    onChange(newMonth, newYear);
  };

  // Get abbreviated month name
  const getMonthDisplay = (index) => {
    const monthName = monthNames[index];
    return monthName.substring(0, 3); // Just use first 3 characters always
  };

  return (
    <div className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg shadow-sm w-full max-w-xs mx-auto border border-gray-100">
      <button
        onClick={handlePrevMonth}
        className="p-1 sm:p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Previous month"
      >
        <LuChevronLeft className="text-base sm:text-lg" />
      </button>
      
      <div className="flex items-center space-x-2">
        <select
          value={month}
          onChange={(e) => onChange(parseInt(e.target.value), year)}
          className="bg-white border border-gray-300 rounded-md px-1 sm:px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer w-16 sm:w-auto"
          aria-label="Select month"
        >
          {monthNames.map((monthName, index) => (
            <option key={index + 1} value={index + 1}>
              {getMonthDisplay(index)}
            </option>
          ))}
        </select>
        
        <select
          value={year}
          onChange={(e) => onChange(month, parseInt(e.target.value))}
          className="bg-white border border-gray-300 rounded-md px-1 sm:px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
          aria-label="Select year"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const yearOption = new Date().getFullYear() - 2 + i;
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </select>
      </div>
      
      <button 
        onClick={handleNextMonth}
        className="p-1 sm:p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Next month"
      >
        <LuChevronRight className="text-base sm:text-lg" />
      </button>
    </div>
  );
};

export default MonthYearSelector;