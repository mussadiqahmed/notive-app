import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosSingleton';

export const storeAuthData = async (token, user) => {
  try {
    if (!token || !user) {
      throw new Error('Authentication data incomplete');
    }
    
    await AsyncStorage.multiSet([
      ['authToken', token],
      ['userData', JSON.stringify(user)],
    ]);
    return true;
  } catch (error) {
    console.error('Storage Error:', error);
    throw new Error('Failed to save authentication data');
  }
};

export const getAuthData = async () => {
  try {
    const [token, userData] = await AsyncStorage.multiGet(['authToken', 'userData']);
    
    if (!token[1] || !userData[1]) {
      return { token: null, user: null };
    }
    
    return {
      token: token[1],
      user: JSON.parse(userData[1]),
    };
  } catch (error) {
    console.error('Storage Retrieval Error:', error);
    return { token: null, user: null };
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
  } catch (error) {
    console.error('Storage Clear Error:', error);
  }
};


export const checkAuth = async () => {
  try {
    const { token, user } = await getAuthData();
    console.log('Auth check - Token status:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      user: user?.email 
    });
    
    // Check if we have both token and user data
    if (!token || !user) {
      return { isAuthenticated: false, user: null };
    }
    
    // Basic token validation (check if it's a valid JWT format)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('Invalid token format, clearing auth data');
      await clearAuthData();
      return { isAuthenticated: false, user: null };
    }
    
    return { isAuthenticated: true, user };
  } catch (error) {
    console.error('Auth Check Error:', error);
    return { isAuthenticated: false, user: null };
  }
};


export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/register', { name, email, password });
    
    if (!response.data?.token || !response.data?.user) {
      throw new Error('Invalid server response format');
    }
    
    await storeAuthData(response.data.token, response.data.user);
    return { success: true, user: response.data.user };
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Registration failed');
  }
};




export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    
    if (!response.data?.token || !response.data?.user) {
      throw new Error('Invalid server response format');
    }
    
    await storeAuthData(response.data.token, response.data.user);
    return { 
      success: true, 
      user: response.data.user,
      token: response.data.token
    };
    
  } catch (error) {
    console.error('Login Error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    let errorMessage = 'Login failed';
    let errorCode = 'LOGIN_FAILED';
    
    if (error.response) {
      errorMessage = error.response.data?.error || errorMessage;
      errorCode = error.response.data?.code || errorCode;
    }
    
    throw new Error(errorMessage);
  }
};

// New helpers
export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/refresh-token');
    if (response.data.success) {
      await storeAuthData(response.data.token, response.data.user);
      return { success: true, user: response.data.user };
    }
    throw new Error('Token refresh failed');
  } catch (error) {
    console.error('Token refresh error:', error);
    await clearAuthData();
    throw error;
  }
};

export const getProfile = async () => {
  const res = await axiosInstance.get('/profile');
  return res.data;
};

export const updateProfile = async (name, email) => {
  const res = await axiosInstance.put('/profile', { name, email });
  if (res.data?.user) {
    const { token } = await getAuthData();
    await storeAuthData(token, res.data.user);
  }
  return res.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await axiosInstance.post('/change-password', { oldPassword, newPassword });
  return res.data;
};

export const getPlans = async () => {
  const res = await axiosInstance.get('/plans');
  return res.data?.plans || [];
};

export const getSubscription = async () => {
  const res = await axiosInstance.get('/subscription');
  return res.data?.subscription || null;
};

export const subscribe = async (plan) => {
  const res = await axiosInstance.post('/subscribe', { plan });
  return res.data?.subscription;
};