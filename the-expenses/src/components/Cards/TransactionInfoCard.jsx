import React, { useState } from "react";
import { LuTrash2, LuChevronDown, LuChevronUp } from "react-icons/lu";

const TransactionInfoCard = ({
  id,
  icon,
  title,
  date,
  amount,
  type,
  description,
  onDelete,
  hideDeleteBtn
}) => {
  // Add state for toggling description visibility
  const [showDescription, setShowDescription] = useState(false);

  // Method to toggle description visibility
  const toggleDescription = () => {
    if (description) {
      setShowDescription(!showDescription);
    }
  };

  const getAmountStyles = () => {
    if (type === "expense") {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 group">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 sm:p-2 rounded-lg ${type === "expense" ? "bg-red-50/60" : "bg-green-50/60"}`}>
          {icon && (icon.includes && icon.includes('http') ? 
            <img src={icon} alt="transaction icon" className="w-5 h-5" /> : 
            <span className="text-xl">{icon}</span>
          )}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="w-full max-w-[70%]">
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
          
          {description && (
            <div className="mt-1">
              {showDescription ? (
                <p className="text-xs text-gray-500">
                  {description}
                </p>
              ) : (
                <button 
                  className="flex items-center text-xs text-blue-500 hover:underline"
                  onClick={toggleDescription}
                >
                  <LuChevronDown className="mr-1 text-xs" /> View description
                </button>
              )}
              
              {showDescription && (
                <button 
                  className="flex items-center text-xs text-blue-500 hover:underline mt-1"
                  onClick={toggleDescription}
                >
                  <LuChevronUp className="mr-1 text-xs" /> Hide description
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button 
              className="text-gray-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18}/>
            </button>
          )}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
            <h6 className="text-xs font-medium">
              Rs {amount}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;