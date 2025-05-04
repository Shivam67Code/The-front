import React, { useState } from 'react';
import { LuDownload, LuSearch } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from 'moment';
import DateRangeFilter from '../Filters/DateRangeFilter';

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Filter transactions based on search query and date range
  const filteredTransactions = transactions?.filter((expense) => {
    const category = expense.category?.toLowerCase() || '';
    const amount = expense.amount?.toString() || '';
    const description = expense.description?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();

    const matchesText = !searchQuery || 
      category.includes(searchLower) || 
      amount.includes(searchLower) ||
      description.includes(searchLower);
    
    // Date range filtering
    const expenseDate = moment(expense.date).format("YYYY-MM-DD");
    const matchesDateRange = 
      (!dateRange.startDate || expenseDate >= dateRange.startDate) && 
      (!dateRange.endDate || expenseDate <= dateRange.endDate);
    
    return matchesText && matchesDateRange;
  }) || [];

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="p-4">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Transactions</h2>
        
        <button
          onClick={onDownload}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100"
        >
          <LuDownload className="text-sm" />
          <span className="text-sm">Download</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LuSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category, amount or description"
            className="w-full pl-10 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        {/* Date Range Filter */}
        <div>
          <DateRangeFilter onFilterChange={handleDateRangeChange} />
        </div>
      </div>

      {/* Date Range Display */}
      {(dateRange.startDate || dateRange.endDate) && (
        <div className="mb-4 text-sm text-gray-600">
          Showing transactions from 
          {dateRange.startDate 
            ? ` ${moment(dateRange.startDate).format("MMM D, YYYY")}` 
            : " all time"} 
          to
          {dateRange.endDate 
            ? ` ${moment(dateRange.endDate).format("MMM D, YYYY")}` 
            : " present"}
        </div>
      )}
      
      {/* Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              id={expense._id}
              amount={expense.amount}
              date={moment(expense.date).format("Do MMM YYYY")}
              title={expense.category}
              description={expense.description}
              icon={expense.icon}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          ))
        ) : (
          <div className="col-span-2 py-8 text-center text-gray-500">
            No expense transactions found matching your search criteria
          </div>
        )}
      </div>
      
      {/* Results Count */}
      {transactions?.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  );
};

export default ExpenseList;