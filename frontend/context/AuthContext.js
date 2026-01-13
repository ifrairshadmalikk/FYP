import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const AuthContext = createContext();

const API_BASE_URL = "http://192.168.10.8:5001/api";

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkExistingLogin();
  }, []);

  const checkExistingLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (token) {
        setUserToken(token);
        
        if (userInfo) {
          setUserInfo(JSON.parse(userInfo));
        }
        
        // Verify token with backend (optional)
        try {
          const response = await fetch(`${API_BASE_URL}/auth/check`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (!data.success) {
              // Token is invalid, logout user
              await logout();
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Continue with stored token even if verification fails
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user info
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.passenger));
        
        setUserToken(data.token);
        setUserInfo(data.passenger);
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user info
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.passenger));
        
        setUserToken(data.token);
        setUserInfo(data.passenger);
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserInfo = async (updatedInfo) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
    } catch (error) {
      console.error('Update user info error:', error);
    }
  };

  const authContextValue = {
    userToken,
    userInfo,
    isLoading,
    login,
    register,
    logout,
    updateUserInfo,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;