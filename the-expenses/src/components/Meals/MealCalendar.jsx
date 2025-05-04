import React, { useState, useEffect, useRef } from 'react';
import { LuCheck, LuCircle, LuClock, LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu';

const MealCalendar = ({ 
  month: initialMonth, 
  year: initialYear, 
  meals, 
  onToggleMeal, 
  isLoading 
}) => {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [calendarDays, setCalendarDays] = useState([]);
  const [nonVegModalOpen, setNonVegModalOpen] = useState(false);
  const [currentDateString, setCurrentDateString] = useState('');
  const [currentNonVegOptions, setCurrentNonVegOptions] = useState({
    omelette: false,
    eggCurry: false,
    chicken: false,
    other: ""
  });
  const otherInputRef = useRef(null);
  
  // Update calendar when month or year changes
  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }
    
    setCalendarDays(days);
  }, [month, year]);
  
  // Ensure correct local date representation
  const getMealStatusForDay = (day) => {
    // Create date at noon to avoid time zone issues
    const date = new Date(year, month - 1, day, 12, 0, 0);
    
    // Format as YYYY-MM-DD without timezone conversion issues
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const meal = meals.find(m => {
      const mealDate = new Date(m.date);
      return mealDate.getDate() === day && 
             mealDate.getMonth() === month - 1 && 
             mealDate.getFullYear() === year;
    });
    
    return {
      morning: meal?.morning || false,
      evening: meal?.evening || false,
      nonVeg: meal?.nonVeg || {},
      dateString
    };
  };
  
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() + 1 && 
           year === today.getFullYear();
  };
  
  const getMonthName = (monthNum) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNum - 1];
  };

  const navigatePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const navigateNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  
  const onOpenNonVegModal = (dateString, nonVeg = {}) => {
    setCurrentDateString(dateString);
    setCurrentNonVegOptions({
      omelette: nonVeg.omelette || false,
      eggCurry: nonVeg.eggCurry || false,
      chicken: nonVeg.chicken || false,
      other: nonVeg.other || ""
    });
    setNonVegModalOpen(true);
  };

  const handleNonVegChange = (option, value) => {
    setCurrentNonVegOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const saveNonVegOptions = () => {
    onToggleMeal(currentDateString, 'nonVeg', currentNonVegOptions);
    setNonVegModalOpen(false);
  };

  const renderMealCell = (day) => {
    if (!day) return null;

    const { morning, evening, nonVeg = {}, dateString } = getMealStatusForDay(day);
    const dayIsToday = isToday(day);
    const hasNonVegItems = nonVeg && Object.values(nonVeg).some(item => item);

    return (
      <div
        className={`flex flex-col items-center justify-between h-full w-full py-1 px-0.5
          ${dayIsToday ? 'ring-2 ring-green-400 bg-green-50/80' : ''}
          transition-all duration-200`}
      >
        {/* Day Number */}
        <div className="flex items-center justify-center w-6 h-6 rounded-full mb-1 mt-0.5
          text-xs font-semibold
          bg-gray-100 text-gray-700
          sm:bg-transparent sm:text-base sm:font-bold sm:mb-2 sm:mt-1
          ">
          {day}
        </div>

        {/* Meal Selection Buttons */}
        <div className="flex flex-col gap-1 w-full items-center">
          {/* Morning */}
          <button
            onClick={() => onToggleMeal(dateString, 'morning', !morning)}
            className={`flex items-center justify-center w-8 h-8 rounded-full
              text-xs font-bold
              ${morning ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'}
              active:scale-95 transition-all duration-150
              sm:w-9 sm:h-9 sm:text-base`}
            aria-label="Morning meal"
          >
            <span className="sm:hidden">🌅</span>
            <span className="hidden sm:inline">M</span>
          </button>
          {/* Evening */}
          <button
            onClick={() => onToggleMeal(dateString, 'evening', !evening)}
            className={`flex items-center justify-center w-8 h-8 rounded-full
              text-xs font-bold
              ${evening ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'}
              active:scale-95 transition-all duration-150
              sm:w-9 sm:h-9 sm:text-base`}
            aria-label="Evening meal"
          >
            <span className="sm:hidden">🌇</span>
            <span className="hidden sm:inline">E</span>
          </button>
          {/* Non-Veg */}
          <button
            onClick={() => onOpenNonVegModal(dateString, nonVeg)}
            className={`flex items-center justify-center w-8 h-8 rounded-full
              text-xs font-bold
              ${hasNonVegItems ? 'bg-orange-400 text-white shadow-md' : 'bg-gray-200 text-gray-400'}
              active:scale-95 transition-all duration-150
              sm:w-9 sm:h-9`}
            aria-label="Non-Veg options"
          >
            <span>🍗</span>
          </button>
        </div>
      </div>
    );
  };

  const MealLegend = () => (
    <div className="flex flex-wrap justify-center md:grid md:grid-cols-5 gap-3 text-xs mt-4 mb-4 px-2 py-3 backdrop-filter backdrop-blur-sm bg-white/50 rounded-lg shadow-sm">
      <div className="flex items-center mx-2 my-1">
        <div className="flex items-center">
          <span className="mr-1 md:hidden">M 🌅</span>
          <span className="hidden md:inline">Morning</span>
        </div>
        <span className="text-gray-500">(Rs 60)</span>
      </div>
      <div className="flex items-center mx-2 my-1">
        <div className="flex items-center">
          <span className="mr-1 md:hidden">E 🌇</span>
          <span className="hidden md:inline">Evening</span>
        </div>
        <span className="text-gray-500">(Rs 60)</span>
      </div>
      <div className="flex items-center mx-2 my-1">
        <div className="flex items-center">
          <span className="mr-1">🍗</span>
          <span className="hidden md:inline">Non-Veg</span>
        </div>
      </div>
      <div className="flex items-center mx-2 my-1">
        <LuCheck className="text-green-600 mr-1" />
        <span>Attending</span>
      </div>
      <div className="flex items-center mx-2 my-1">
        <div className="w-3 h-3 mr-1 rounded-sm bg-green-200/80 backdrop-blur-sm"></div>
        <span>Today</span>
      </div>
    </div>
  );

  const NonVegModal = () => {
    if (!nonVegModalOpen) return null;
    
    const date = new Date(currentDateString);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white/90 backdrop-filter backdrop-blur-md rounded-lg shadow-xl max-w-md w-full animate-fadeIn border border-white/20">
          <div className="flex justify-between items-center p-3 sm:p-4 bg-orange-50/90 backdrop-filter backdrop-blur-sm border-b border-orange-100/50 rounded-t-lg">
            <h3 className="text-base sm:text-lg font-semibold text-orange-800">
              <span className="md:hidden">🍗 Options - </span>
              <span className="hidden md:inline">Non-Veg Options - </span>
              {formattedDate}
            </h3>
            <button 
              onClick={() => setNonVegModalOpen(false)}
              className="text-orange-600 hover:text-orange-800 p-1 rounded-full hover:bg-orange-100/70 transition-colors duration-200"
            >
              <LuX size={18} />
            </button>
          </div>

          <div className="p-3 sm:p-5">
            <div className="space-y-3 sm:space-y-5">
              <div className="flex items-center justify-between p-2 rounded-md bg-white/50 backdrop-filter backdrop-blur-sm hover:bg-orange-50/70 transition-colors duration-200 shadow-sm">
                <label className="flex items-center space-x-2 sm:space-x-3 w-full cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentNonVegOptions.omelette}
                    onChange={(e) => handleNonVegChange('omelette', e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-400 h-4 w-4"
                  />
                  <span className="text-sm">🥚 Omelette (Rs 30)</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-white/50 backdrop-filter backdrop-blur-sm hover:bg-orange-50/70 transition-colors duration-200 shadow-sm">
                <label className="flex items-center space-x-2 sm:space-x-3 w-full cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentNonVegOptions.eggCurry}
                    onChange={(e) => handleNonVegChange('eggCurry', e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-400 h-4 w-4"
                  />
                  <span className="text-sm">🍛 Egg Curry (Rs 30)</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-white/50 backdrop-filter backdrop-blur-sm hover:bg-orange-50/70 transition-colors duration-200 shadow-sm">
                <label className="flex items-center space-x-2 sm:space-x-3 w-full cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentNonVegOptions.chicken}
                    onChange={(e) => handleNonVegChange('chicken', e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-400 h-4 w-4"
                  />
                  <span className="text-sm">🍗 Chicken (Rs 70)</span>
                </label>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Other (specify)
                </label>
                <input
                  type="text"
                  value={currentNonVegOptions.other}
                  onChange={(e) => handleNonVegChange('other', e.target.value)}
                  ref={otherInputRef}
                  placeholder="E.g. Fish curry (Rs 50)"
                  className="w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm bg-white/70 backdrop-filter backdrop-blur-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 text-xs sm:text-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="px-3 py-3 sm:px-5 sm:py-4 bg-gray-50/80 backdrop-filter backdrop-blur-sm rounded-b-lg border-t flex justify-between">
            <button
              onClick={() => setNonVegModalOpen(false)}
              className="inline-flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-300/70 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white/80 backdrop-filter backdrop-blur-sm hover:bg-gray-50/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={saveNonVegOptions}
              className="inline-flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-orange-500/90 backdrop-filter backdrop-blur-sm hover:bg-orange-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all duration-200 active:scale-95"
            >
              Save Options
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-filter backdrop-blur-sm rounded-xl shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200/70 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array(7).fill().map((_, i) => (
            <div key={`header-${i}`} className="h-4 bg-gray-200/70 rounded my-1"></div>
          ))}
          {Array(35).fill().map((_, i) => (
            <div key={`day-${i}`} className="h-20 sm:h-24 bg-gray-200/70 backdrop-filter backdrop-blur-sm rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg border border-white/20">
      {/* Header with month navigation */}
      <div className="p-3 sm:p-4 bg-green-100/80 backdrop-filter backdrop-blur-sm border-b border-green-200/70">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h5 className="text-base sm:text-lg md:text-xl font-semibold text-green-800">Meal Calendar</h5>
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
            <button 
              onClick={navigatePreviousMonth}
              className="p-1.5 sm:p-2 rounded-full hover:bg-green-200/80 backdrop-filter backdrop-blur-sm text-green-700 transition-all duration-200 active:scale-95"
              aria-label="Previous month"
            >
              <LuChevronLeft size={18} />
            </button>
            <span className="text-sm sm:text-base md:text-lg font-medium text-green-800">
              {getMonthName(month)} {year}
            </span>
            <button 
              onClick={navigateNextMonth}
              className="p-1.5 sm:p-2 rounded-full hover:bg-green-200/80 backdrop-filter backdrop-blur-sm text-green-700 transition-all duration-200 active:scale-95"
              aria-label="Next month"
            >
              <LuChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar container with improved spacing for mobile */}
      <div className="px-1 sm:px-2 md:px-4 pb-4 sm:pb-5">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 py-1 sm:py-2 bg-gray-50/60 backdrop-filter backdrop-blur-sm rounded-md">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-1">
          {calendarDays.map((dayObj, index) => (
            <div 
              key={index}
              className={`min-h-[90px] sm:min-h-[120px] md:min-h-[140px]
                ${!dayObj.isCurrentMonth ? 'bg-gray-50/30' : 'bg-white/40'} 
                backdrop-filter backdrop-blur-[8px] border border-white/30 rounded-md 
                shadow-[0_4px_20px_rgba(31,41,55,0.05)] overflow-hidden
                hover:shadow-[0_8px_25px_rgba(31,41,55,0.08)] hover:border-green-200/50 
                transition-all duration-300 ease-in-out flex`}
              style={{
                boxShadow: dayObj.isCurrentMonth ? '0 4px 20px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.7)' : 'none'
              }}
            >
              {dayObj.isCurrentMonth && renderMealCell(dayObj.day)}
            </div>
          ))}
        </div>
        
        <MealLegend />
      </div>

      <NonVegModal />
    </div>
  );
};

export default MealCalendar;