// src/app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, message: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => Promise<{ success: boolean, message: string }>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token, user, message } = response.data;
      
      // Save auth data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      
      return { success: true, message };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const userData = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || ''
      };
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      // API automatically logs in the user after registration
      const { token, user, message } = response.data;
      
      // Save auth data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Redirect to home page
      router.push('/');
      
      return { success: true, message };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setToken(null);
    setUser(null);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirect to login page
    router.push('/auth/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};