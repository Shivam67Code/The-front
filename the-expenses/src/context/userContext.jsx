import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

// Change from const UserProvider to export const UserProvider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Enhanced functions for user management
  const login = (userData) => {
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };
  
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('userData');
  };
  
  // Load user data from localStorage on initial render
  useEffect(() => {
    const fetchUserData = async () => {
      // First try to get user from localStorage for immediate rendering
      const storedUserData = localStorage.getItem('userData');
      const token = localStorage.getItem('token');
      
      if (storedUserData && token) {
        try {
          setUser(JSON.parse(storedUserData));
          
          // Then verify with the server in the background
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
          if (response.data) {
            // Update user data if server returns different data
            updateUser(response.data.user || response.data);
          }
        } catch (err) {
          console.error("Failed to verify user token:", err);
          // Only clear if 401 Unauthorized
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      
      setLoading(false);
    };
    
    fetchUserData();
  }, []);
  
  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Keep the default export for backward compatibility
export default UserProvider;