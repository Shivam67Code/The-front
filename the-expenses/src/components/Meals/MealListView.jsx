import React from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import moment from 'moment';

const MealListView = ({ meals, onToggleMeal, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        {Array(10).fill().map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }
  
  // Sort meals by date (most recent first)
  const sortedMeals = [...meals].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return (
    <div className="card">
      <h5 className="text-lg font-semibold mb-4">Meal List View</h5>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200"> {/* Added overflow-x-auto for mobile */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Morning
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evening
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMeals.length > 0 ? (
              sortedMeals.map((meal) => {
                // Fix: Create proper date string without timezone issues
                const mealDate = new Date(meal.date);
                const dateString = `${mealDate.getFullYear()}-${String(mealDate.getMonth() + 1).padStart(2, '0')}-${String(mealDate.getDate()).padStart(2, '0')}`;
                
                return (
                  <tr key={meal._id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {moment(meal.date).format("MMMM D, YYYY")}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleMeal(dateString, 'morning', !meal.morning)}
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium
                          ${meal.morning
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {meal.morning ? (
                          <>
                            <LuCheck className="mr-1" /> Taken
                          </>
                        ) : (
                          <>
                            <LuX className="mr-1" /> Missed
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleMeal(dateString, 'evening', !meal.evening)}
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium
                          ${meal.evening
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {meal.evening ? (
                          <>
                            <LuCheck className="mr-1" /> Taken
                          </>
                        ) : (
                          <>
                            <LuX className="mr-1" /> Missed
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm text-gray-500">
                  No meal attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealListView;