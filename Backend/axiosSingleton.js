import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

const instance = axios.create({
  baseURL: config.baseURL,
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    console.log('Request interceptor - Token check:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      url: config.url,
      method: config.method 
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No auth token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Response interceptor - Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Handle token refresh for 401/403 errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const originalRequest = error.config;
      
      // Avoid infinite loop by checking if this is already a refresh request
      if (originalRequest.url === '/refresh-token') {
        console.log('Token refresh failed, redirecting to login');
        // Clear stored auth data and redirect to login
        await AsyncStorage.multiRemove(['authToken', 'userData']);
        return Promise.reject(error);
      }
      
      // Try to refresh the token
      try {
        console.log('Attempting to refresh token...');
        
        // Get the current token (even if expired) for refresh
        const currentToken = await AsyncStorage.getItem('authToken');
        
        if (currentToken) {
          const refreshResponse = await instance.post('/refresh-token', {}, {
            headers: { Authorization: `Bearer ${currentToken}` }
          });
          
          if (refreshResponse.data.success) {
            // Store the new token
            await AsyncStorage.setItem('authToken', refreshResponse.data.token);
            await AsyncStorage.setItem('userData', JSON.stringify(refreshResponse.data.user));
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            console.log('Token refreshed, retrying original request');
            return instance(originalRequest);
          }
        } else {
          console.log('No token available for refresh');
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        // Clear stored auth data and redirect to login
        await AsyncStorage.multiRemove(['authToken', 'userData']);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;