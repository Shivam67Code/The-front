import React, { useRef, useState, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, existingImageUrl }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  useEffect(() => {
    // If there's an existing image URL, use it for preview
    if (existingImageUrl && !image) {
      setPreviewUrl(existingImageUrl);
    }
  }, [existingImageUrl, image]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      // Update the image state 
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    // Only clear preview if we're not reverting to an existing image
    if (!existingImageUrl) {
      setPreviewUrl(null);
    } else {
      setPreviewUrl(existingImageUrl);
    }
  };
  
  const onChooseFile = () => {
    inputRef.current.click();
  };

  const showPreview = image || previewUrl;

  return (
    <div className="flex justify-center">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!showPreview ? (
        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full relative">
          <LuUser className="text-5xl text-gray-500"/>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full absolute -bottom-1 right-1 hover:bg-green-700 transition-colors duration-200"
            onClick={onChooseFile}
          >
            <LuUpload/>
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={image ? URL.createObjectURL(image) : previewUrl}
            alt="profile photo"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />
          <div className="absolute -bottom-1 right-1 flex space-x-1">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
              onClick={handleRemoveImage}
            >
              <LuTrash/>
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200"
              onClick={onChooseFile}
            >
              <LuUpload/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;