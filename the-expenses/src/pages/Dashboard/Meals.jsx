import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LuListFilter, LuCalendarDays } from 'react-icons/lu';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import MonthYearSelector from '../../components/Meals/MonthYearSelector';
import MealSummary from '../../components/Meals/MealSummary';
import MealCalendar from '../../components/Meals/MealCalendar';
import MealListView from '../../components/Meals/MealListView';

const Meals = () => {
  useUserAuth();
  
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  
  // Fetch meal attendance data
  const fetchMeals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.MEALS.GET_MEALS, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setMeals(response.data);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Failed to fetch meal data");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch meal summary
  const fetchMealSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.MEALS.GET_SUMMARY, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching meal summary:", error);
      toast.error("Failed to fetch meal summary");
    } finally {
      setSummaryLoading(false);
    }
  };
  
  // Handle month/year change
  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };
  
  // Toggle meal attendance
  const handleToggleMeal = async (date, mealType, value) => {
    try {
      // Use the dateString directly without any timezone conversion
      const payload = {
        date, // The date is already in YYYY-MM-DD format without time
        [mealType]: value
      };
      
      await axiosInstance.post(API_PATHS.MEALS.UPDATE_MEAL, payload);
      
      // Update local state to reflect the change
      setMeals(prevMeals => {
        const existingMealIndex = prevMeals.findIndex(meal => {
          // Compare dates by year, month, and day values
          const mealDate = new Date(meal.date);
          const parts = date.split('-');
          const targetYear = parseInt(parts[0]);
          const targetMonth = parseInt(parts[1]) - 1; // 0-based month
          const targetDay = parseInt(parts[2]);
          
          return mealDate.getFullYear() === targetYear && 
                 mealDate.getMonth() === targetMonth && 
                 mealDate.getDate() === targetDay;
        });
        
        if (existingMealIndex >= 0) {
          // Update existing meal
          const updatedMeals = [...prevMeals];
          updatedMeals[existingMealIndex] = {
            ...updatedMeals[existingMealIndex],
            [mealType]: value
          };
          return updatedMeals;
        } else {
          // Create new meal entry
          return [...prevMeals, {
            date,
            morning: mealType === 'morning' ? value : false,
            evening: mealType === 'evening' ? value : false,
            _id: Date.now().toString() // Temporary ID until refresh
          }];
        }
      });
      
      // Show appropriate toast messages based on meal type and action
      if (mealType === 'morning' || mealType === 'evening') {
        // For regular meals (morning/evening)
        toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} meal ${value ? 'taken' : 'missed'}`);
      } else if (mealType === 'nonVeg') {
        // For non-veg meal options
        const previousOptions = meals.find(meal => {
          const mealDate = new Date(meal.date);
          const parts = date.split('-');
          const targetYear = parseInt(parts[0]);
          const targetMonth = parseInt(parts[1]) - 1;
          const targetDay = parseInt(parts[2]);
          
          return mealDate.getFullYear() === targetYear && 
                 mealDate.getMonth() === targetMonth && 
                 mealDate.getDate() === targetDay;
        })?.nonVeg || {};
        
        // Check which options were changed
        const addedOptions = [];
        const removedOptions = [];
        
        // Check for added or removed options
        if (value.omelette !== previousOptions.omelette) {
          value.omelette ? addedOptions.push("Omelette") : removedOptions.push("Omelette");
        }
        if (value.eggCurry !== previousOptions.eggCurry) {
          value.eggCurry ? addedOptions.push("Egg Curry") : removedOptions.push("Egg Curry");
        }
        if (value.chicken !== previousOptions.chicken) {
          value.chicken ? addedOptions.push("Chicken") : removedOptions.push("Chicken");
        }
        if (value.other !== previousOptions.other) {
          value.other ? addedOptions.push("Other items") : removedOptions.push("Other items");
        }
        
        // Show toast based on what changed
        if (addedOptions.length > 0) {
          toast.success(`Added: ${addedOptions.join(", ")}`);
        }
        if (removedOptions.length > 0) {
          toast.success(`Removed: ${removedOptions.join(", ")}`);
        }
      }
      
      // Update the summary as well
      fetchMealSummary();
      
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("Failed to update meal status");
    }
  };
  
  // Download meal data
  const handleDownloadMeals = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.MEALS.DOWNLOAD_EXCEL, {
        params: { month: selectedMonth, year: selectedYear },
        responseType: 'blob',
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get month name for the filename
      const monthName = new Date(selectedYear, selectedMonth - 1, 1)
        .toLocaleString('default', { month: 'long' });
        
      link.setAttribute('download', `meal_attendance_${monthName}_${selectedYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Meal data downloaded successfully!");
    } catch (error) {
      console.error("Error downloading meal data:", error);
      toast.error("Failed to download meal data");
    }
  };
  
  // Fetch data when month/year changes
  useEffect(() => {
    fetchMeals();
    fetchMealSummary();
  }, [selectedMonth, selectedYear]);
  
  return (
    <DashboardLayout activeMenu="Meals">
      {/* Improved mobile responsiveness */}
      <div className="my-3 sm:my-5 px-3 sm:mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Meal Attendance</h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md flex-1 sm:flex-auto justify-center sm:justify-start ${
                  viewMode === 'calendar' 
                    ? 'bg-white shadow-sm text-green-700' 
                    : 'text-gray-600'
                }`}
              >
                <LuCalendarDays className="mr-1.5" /> Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md flex-1 sm:flex-auto justify-center sm:justify-start ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-green-700' 
                    : 'text-gray-600'
                }`}
              >
                <LuListFilter className="mr-1.5" /> List
              </button>
            </div>
            
            <div className="w-full sm:w-auto">
              <MonthYearSelector
                month={selectedMonth}
                year={selectedYear}
                onChange={handleMonthYearChange}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <MealSummary 
            summary={summary}
            onDownload={handleDownloadMeals}
            isLoading={summaryLoading}
          />
          
          {viewMode === 'calendar' ? (
            <MealCalendar
              month={selectedMonth}
              year={selectedYear}
              meals={meals}
              onToggleMeal={handleToggleMeal}
              isLoading={loading}
            />
          ) : (
            <MealListView
              meals={meals}
              onToggleMeal={handleToggleMeal}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meals;