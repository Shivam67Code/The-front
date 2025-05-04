import React, { useState } from 'react';
import Input from '../Inputs/Input'; 
import EmojiPickerPopup from '../EmojiPickerPopup';
const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
    description: "" 
  });

  const handleChange = (key, value) => {
    setIncome({
      ...income,
      [key]: value
    });
  }; 

  const handleEmojiSelect = (emojiData) => {
    setIncome({ ...income, icon: emojiData.emoji });
  };

  const handleSubmit = () => {
    // Transform the data to match what your backend expects
    const transformedIncome = {
      title: income.source, // Map source to title correctly
      amount: income.amount,
      date: income.date,
      icon: income.icon,
      description: income.description
    }; 
    onAddIncome(transformedIncome);
  };

  return (
    <div className="space-y-4">
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={handleEmojiSelect}
        />
      <Input 
        value={income.source}
        onChange={({target}) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Money From:..."
        type="text"
      />
      <Input 
        value={income.amount}
        onChange={({target}) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="00.00"
        type="number"
      />
      <Input
        value={income.date}
        onChange={({target}) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      {/* Description Text Area with theme sync */}
      <div className="input-box mt-4">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <div className="flex w-full items-center gap-3 text-sm font-medium bg-white/90 backdrop-blur-md rounded-lg px-5 py-3.5 mb-4 mt-2 border border-gray-300 shadow-sm transition-all duration-300 ease-out hover:border-green-800 hover:shadow-md hover:shadow-green-900/30 focus-within:border-green-900 focus-within:ring-2 focus-within:ring-gray-500/40 focus-within:shadow-lg focus-within:shadow-green-800/30 dark:bg-gray-800/90 dark:border-gray-600 dark:text-gray-200 dark:hover:border-green-700 dark:hover:shadow-gray-500/30 dark:focus-within:border-gray-400 dark:focus-within:ring-green-800/30 dark:focus-within:shadow-gray-400/20"
          style={{ 
            background: 'var(--card-bg, rgba(255, 255, 255, 0.9))',
            borderColor: 'var(--border-color, #e5e7eb)',
            boxShadow: '0 2px 6px var(--shadow-color, rgba(0, 0, 0, 0.1))'
          }}>
          <textarea
            value={income.description}
            onChange={({target}) => handleChange("description", target.value)}
            placeholder="Add more details about this income source..."
            rows="3"
            className="flex-1 bg-transparent border-0 outline-none p-0 text-gray-800 placeholder:text-slate-400/80 placeholder:font-light focus:ring-0 selection:bg-green-900/20 dark:text-gray-100 dark:placeholder:text-slate-500/70 dark:selection:bg-green-800/40 caret-gray-500 dark:caret-gray-400 resize-none"
            style={{ color: 'var(--text-color, #1f2937)' }}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          Add Income 💵
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;