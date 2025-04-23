
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/authcontext';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/store/slices/userSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  
  const { login, user, loading, error, adminLogin } = useAuth();

  // Get callback URL from search params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const callbackUrl = searchParams.get('callback') || '/';
const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await login(email, password);
      console.log("🚀 ~ handleSubmit ~ result:", result)

      if (result.success) {
        //@ts-ignore
        dispatch(setUser({
          id: result.user?.id || '',
          name: result.user?.firstName || '',
          email: result.user?.email || '',

          phone: result.user?.phoneNumber || '',
          isLoggedIn: true
        }));
        toast.success(result.message || 'Login successful!');

      }
    } catch (err) {
      // Additional error handling if needed
      console.error('Login submission error:', err);
    }
  };

  const handleAdminLogin = async () => {
    // Set email field to admin email (you might want to set this to a specific value)
    // or just navigate to a dedicated admin login page
    try {
      // Example: Pre-fill with admin email
        const result = await adminLogin(email, password);
        if (result.success) {
          toast.success(result.message || 'Login successful!');
          // Router navigation happens in the login function after setting the user state
        }
      
      // Alternative: Direct navigation to admin login
      router.push('/admin/dashboard');
      
      toast.success('Admin credentials pre-filled. Enter your password to continue.');
    } catch (err) {
      console.error('Admin login error:', err);
      toast.error('Failed to setup admin login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
      

        </div>
        
        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {/* Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label 
                htmlFor="remember-me" 
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                href="/auth/forgot-password" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          {/* Admin Login Button */}
          <div>
            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-3 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaUserShield className="h-5 w-5 text-gray-400 group-hover:text-gray-300" />
              </span>
              Admin Login
            </button>
            <Link 
  href="/auth/forgot" 
  className="font-medium text-center text-blue-600 hover:text-blue-500"
>
  Forgot your password?
</Link>
          </div>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
         
          </div>

          {/* Social Login Buttons can be added here */}
        </form>
      </div>
    </div>
  );
}