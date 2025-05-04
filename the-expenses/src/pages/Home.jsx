// Make sure you're importing and using the axios instance
import axiosInstance from '../utils/axiosInstance';

// Replace any axios.get calls with axiosInstance.get
const fetchDashboardData = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/dashboard');
    // rest of your function
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};