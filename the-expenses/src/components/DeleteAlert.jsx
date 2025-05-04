import React from 'react';

const DeleteAlert = ({content, onDelete, onCancel}) => {
  return (
    <div>
      <p className="text-sm">{content}</p>
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={onDelete}
        >
          DELETE
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;