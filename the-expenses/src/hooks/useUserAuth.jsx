import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const useUserAuth = () => {
  const { user, updateUser, clearUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't fetch if we already have user data
    if (user) return;
    
    // Check if we have a token but no user data
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }
    
    let isMounted = true;
    
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (isMounted && response.data) {
          updateUser(response.data.user || response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (isMounted) {
          if (error.response?.status === 401) {
            logout(); // Use logout to clear everything consistently
          } else {
            clearUser();
          }
          navigate("/login");
        }
      } 
    };
    
    fetchUserInfo();
    
    return () => { isMounted = false; };
  }, [user, updateUser, clearUser, logout, navigate]);
  
  return { user };
};

export default useUserAuth;