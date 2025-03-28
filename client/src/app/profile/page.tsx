'use client';

import { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaKey, FaEdit, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';
import Wrapper from '@/app/components/Wrapper';
import { useAuth } from '../context/authcontext';

export default function ProfilePage() {
  const { user, token } = useAuth();
  console.log("🚀 ~ ProfilePage ~ user:", user)
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  // Password change form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Initialize form data with user info
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
      setIsLoading(false);
    }
  }, [user]);
  
  // Handle input changes for profile form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle input changes for password form
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const response = await axios.put(
        `${API_URL}/users/profile`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        
        // Update user in localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.put(
        `${API_URL}/users/change-password`, 
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Password changed successfully');
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !user) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Wrapper>
    );
  }
  
  return (
    <Wrapper>
      <div className="py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl">
                {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <FaUser />}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <p className="text-blue-100">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="ml-auto bg-white text-blue-600 px-4 py-2 rounded flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaUser className="inline mr-2" /> First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaUser className="inline mr-2" /> Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaEnvelope className="inline mr-2" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email cannot be changed
                    className="w-full p-3 border rounded-md bg-gray-100"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaPhone className="inline mr-2" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
            
            {/* Change Password Section */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaKey className="mr-2" /> Password
                </h3>
                <button 
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-blue-600 hover:underline"
                >
                  {showChangePassword ? 'Cancel' : 'Change Password'}
                </button>
              </div>
              
              {showChangePassword && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  
                  {/* New Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  
                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}