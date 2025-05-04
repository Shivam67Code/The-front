import React, { useState, useEffect } from 'react';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareIncomeBarChartData } from '../../utils/helper';

const IncomeOverview = ({transactions = [], onAddIncome}) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    try {
      // Add default empty array and error checking
      const validTransactions = Array.isArray(transactions) ? transactions : [];
      console.log("Processing transactions:", validTransactions.length);
      
      // If no transactions are available, use empty array
      if (validTransactions.length === 0) {
        setChartData([]);
        return;
      }
      
      // Process actual transaction data
      const result = prepareIncomeBarChartData(validTransactions);
      setChartData(result || []);
    } catch (error) {
      console.error("Error preparing chart data:", error);
      // Fallback to empty data
      setChartData([]);
    }
  }, [transactions]);
  
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h5 className="text-lg font-semibold">Income Overview</h5>
          <p className="text-sm text-gray-400 mt-0.5">
            Stay on top of your earnings and spot the trends that shape your success!
          </p>
        </div>
        <button 
          className="add-btn self-start sm:self-auto"
          onClick={onAddIncome}
        >
          <LuPlus className="text-lg" /> 
          <span>Add Income</span>
        </button>
      </div>
      <div className="mt-10">
        {chartData && chartData.length > 0 ? (
          <CustomBarChart data={chartData} />
        ) : (
          <div className="flex justify-center items-center h-48 text-gray-400">
            No income data available to display
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeOverview;