import React from 'react';
import { LuDownload } from 'react-icons/lu';

const MealSummary = ({ summary, onDownload, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }
  
  if (!summary) {
    return (
      <div className="card">
        <h5 className="text-lg font-semibold">Meal Summary</h5>
        <p className="text-gray-500 mt-2">No meal data available</p>
      </div>
    );
  }
  
  const {
    morningCount,
    eveningCount,
    totalMeals,
    totalPossible,
    percentage,
    vegCost = morningCount * 60 + eveningCount * 60, // Default calculation if backend doesn't provide
    nonVegCost = summary.nonVegCost || 0,
    totalCost = vegCost + nonVegCost
  } = summary;
  
  return (
    <div className="card p-3 sm:p-4 border border-gray-100 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-base sm:text-lg font-semibold">Meal Summary</h5>
        <button
          className="card-btn text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 flex items-center bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          onClick={onDownload}
        >
          <LuDownload className="text-sm sm:text-base mr-1" /> Export
        </button>
      </div>
      
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 mb-3">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="inline sm:hidden">M Meals</span>
              <span className="hidden sm:inline">Morning Meals</span>
            </p>
            <p className="text-lg sm:text-xl font-semibold">{morningCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="inline sm:hidden">E Meals</span>
              <span className="hidden sm:inline">Evening Meals</span>
            </p>
            <p className="text-lg sm:text-xl font-semibold">{eveningCount}</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-600">Total Meals</p>
            <p className="text-lg sm:text-xl font-semibold">{totalMeals}</p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-xs sm:text-sm font-medium">Monthly Progress</span>
            <span className="text-xs sm:text-sm font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
            <div
              className="bg-green-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You took {totalMeals} out of {totalPossible} possible meals this month
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <h6 className="text-sm font-medium mb-2">Cost Breakdown</h6>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Veg Cost</p>
              <p className="text-base font-semibold">₹{vegCost}</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Non-Veg Cost</p>
              <p className="text-base font-semibold">₹{nonVegCost}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Total Cost</p>
              <p className="text-base font-semibold text-green-700">₹{totalCost}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealSummary;