import React from "react";
import { LuLock, LuExternalLink } from "react-icons/lu";

export default function VaultPromptModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div 
        className="rounded-2xl p-6 shadow-xl w-[90%] max-w-md text-center animate-scaleIn"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
          boxShadow: '0 10px 25px var(--shadow-color)' 
        }}
      >
        <div 
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ 
            backgroundColor: 'var(--accent-color-light, rgba(59, 130, 246, 0.1))'
          }}
        >
          <LuLock 
            className="text-2xl" 
            style={{ color: 'var(--accent-color)' }} 
          />
        </div>
        
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--heading-color, var(--text-color))' }}>
          Secure Your Credentials
        </h2>
        
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Would you like to securely store your credentials and passwords? Head over to Shivam's Vault 🔐
        </p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: 'var(--button-secondary-bg, rgba(209, 213, 219, 0.5))',
              color: 'var(--button-secondary-text, var(--text-color))'
            }}
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded-lg text-white flex items-center transition-all"
            style={{ 
              backgroundColor: 'var(--accent-color)',
              boxShadow: '0 2px 5px var(--shadow-color, rgba(0, 0, 0, 0.1))'
            }}
          >
            Go to Vault <LuExternalLink className="ml-1" />
          </button>
        </div>
      </div>
      
      <style jsx="true">{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        button:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}