import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch current user from backend
  const fetchCurrentUser = async () => {
    try {
      // Use /users/me to get full profile including profile_picture
      const userData = await api.get('/users/me');
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If /users/me fails, try /auth/me as fallback
      try {
        const basicUserData = await api.get('/auth/me');
        setUser(basicUserData);
        setIsLoggedIn(true);
      } catch (fallbackError) {
        console.error('Failed to fetch user from auth endpoint:', fallbackError);
        // Token invalid, clear it
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function - calls backend API
  const login = async (emailOrUsername, password) => {
    try {
      // Backend expects JSON with 'email_or_username' and 'password' fields
      const response = await api.post('/auth/login', {
        email_or_username: emailOrUsername,
        password: password,
      });
      
      // Store both access and refresh tokens
      localStorage.setItem('token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      setIsLoggedIn(true);
      
      // Fetch user data
      await fetchCurrentUser();
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function - calls backend API
  const register = async (email, name, password) => {
    try {
      await api.post('/auth/register', {
        email: email,
        name: name,  // Backend expects 'name' not 'username'
        password: password,
      });
      
      // After successful registration, log the user in
      return await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    // Clear user-specific app data
    localStorage.removeItem('createPlanState');
    setUser(null);
    setIsLoggedIn(false);
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      // Update access token
      localStorage.setItem('token', response.access_token);
      return response.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, loading, refreshAccessToken, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
