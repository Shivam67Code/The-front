import React, { useState, useEffect, useRef } from 'react';
import { LuCalendar, LuChevronDown, LuCheck } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';

const DateRangeFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: moment().format('YYYY-MM-DD')
  });
  const [dateRangeText, setDateRangeText] = useState('All Transactions');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All Transactions' },
    { id: 'last15', label: 'Last 15 Days' },
    { id: 'last25', label: 'Last 25 Days' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'thisYear', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    
    if (optionId !== 'custom') {
      setIsOpen(false);
    }

    let dateRange = {};
    const today = moment().endOf('day');

    switch (optionId) {
      case 'all':
        dateRange = { startDate: '', endDate: '' };
        setDateRangeText('All Transactions');
        break;
      case 'last15':
        dateRange = {
          startDate: moment().subtract(15, 'days').startOf('day').format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD')
        };
        setDateRangeText('Last 15 Days');
        break;
      case 'last25':
        dateRange = {
          startDate: moment().subtract(25, 'days').startOf('day').format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD')
        };
        setDateRangeText('Last 25 Days');
        break;
      case 'thisMonth':
        dateRange = {
          startDate: moment().startOf('month').format('YYYY-MM-DD'),
          endDate: moment().endOf('month').format('YYYY-MM-DD')
        };
        setDateRangeText('This Month');
        break;
      case 'thisYear':
        dateRange = {
          startDate: moment().startOf('year').format('YYYY-MM-DD'),
          endDate: moment().endOf('year').format('YYYY-MM-DD')
        };
        setDateRangeText('This Year');
        break;
      case 'custom':
        // Keep dropdown open for custom range
        dateRange = customRange;
        if (customRange.startDate && customRange.endDate) {
          const start = moment(customRange.startDate).format('MMM D, YYYY');
          const end = moment(customRange.endDate).format('MMM D, YYYY');
          setDateRangeText(`${start} - ${end}`);
        }
        break;
      default:
        dateRange = { startDate: '', endDate: '' };
        setDateRangeText('All Transactions');
    }

    if (optionId !== 'custom' || (customRange.startDate && customRange.endDate)) {
      onFilterChange(dateRange);
    }
  };

  const handleCustomDateChange = (field, value) => {
    const newRange = { ...customRange, [field]: value };
    setCustomRange(newRange);
    
    if (newRange.startDate && newRange.endDate) {
      const start = moment(newRange.startDate).format('MMM D, YYYY');
      const end = moment(newRange.endDate).format('MMM D, YYYY');
      setDateRangeText(`${start} - ${end}`);
      onFilterChange(newRange);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <motion.div 
        className="flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{ 
          borderColor: 'var(--border-color)',
          background: 'var(--input-bg)',
          color: 'var(--text-color)',
          boxShadow: isOpen ? '0 2px 8px var(--shadow-color)' : 'none'
        }}
      >
        <div className="flex items-center">
          <LuCalendar className="mr-2" style={{ color: 'var(--icon-color)' }} />
          <span className="text-sm font-medium">
            {dateRangeText}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <LuChevronDown className="text-gray-500" />
        </motion.div>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute z-20 w-full mt-1.5 rounded-lg overflow-hidden border shadow-lg"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ 
              background: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              boxShadow: '0 4px 16px var(--shadow-color)'
            }}
          >
            {filterOptions.map((option) => (
              <div key={option.id} className="px-1 py-1">
                <div
                  className={`flex items-center cursor-pointer px-4 py-2 rounded-md transition-colors duration-200`}
                  onClick={() => handleOptionSelect(option.id)}
                  style={{
                    backgroundColor: selectedOption === option.id 
                      ? 'rgba(var(--accent-color-rgb), 0.1)' 
                      : undefined,
                    color: selectedOption === option.id 
                      ? 'var(--accent-color)' 
                      : 'var(--text-color)'
                  }}
                >
                  {selectedOption === option.id && (
                    <LuCheck className="mr-2" style={{ color: 'var(--accent-color)' }} />
                  )}
                  <span className={selectedOption === option.id ? 'font-medium' : ''}>{option.label}</span>
                </div>
                
                {/* Custom Date Range Picker */}
                {selectedOption === 'custom' && option.id === 'custom' && (
                  <motion.div 
                    className="mt-2 p-3 space-y-3 border-t"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customRange.startDate}
                        onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:border-accent"
                        max={customRange.endDate || moment().format('YYYY-MM-DD')}
                        style={{ 
                          borderColor: 'var(--border-color)',
                          background: 'var(--input-bg)',
                          color: 'var(--text-color)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customRange.endDate}
                        onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:border-accent"
                        min={customRange.startDate}
                        max={moment().format('YYYY-MM-DD')}
                        style={{ 
                          borderColor: 'var(--border-color)',
                          background: 'var(--input-bg)',
                          color: 'var(--text-color)'
                        }}
                      />
                    </div>
                    
                    {/* Apply button for custom date range */}
                    <motion.button
                      className={`w-full mt-2 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200`}
                      onClick={() => {
                        if (customRange.startDate && customRange.endDate) {
                          handleOptionSelect('custom');
                          setIsOpen(false);
                        }
                      }}
                      disabled={!customRange.startDate || !customRange.endDate}
                      whileHover={customRange.startDate && customRange.endDate ? { scale: 1.02 } : {}}
                      whileTap={customRange.startDate && customRange.endDate ? { scale: 0.98 } : {}}
                      style={{ 
                        backgroundColor: customRange.startDate && customRange.endDate 
                          ? 'var(--accent-color)' 
                          : 'var(--button-bg-disabled, #e2e8f0)',
                        color: customRange.startDate && customRange.endDate 
                          ? 'white' 
                          : 'var(--text-secondary)',
                        cursor: customRange.startDate && customRange.endDate 
                          ? 'pointer' 
                          : 'not-allowed',
                        opacity: customRange.startDate && customRange.endDate ? 1 : 0.7
                      }}
                    >
                      Apply Date Range
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeFilter;