'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../lib/api';
import Wrapper from '../components/Wrapper';

// Address interface matching your schema
interface Address {
  id:any
  _id?: string;
  type: 'billing' | 'shipping';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// User profile interface
interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addresses?: Address[];
}

const COUNTRIES = [
  'India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Italy', 'China', 'Japan', 'Singapore', 'UAE',

  // Add more as needed or use a package like `country-list`
];




// Utility function for safe localStorage access
const getFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return null;
      }
    }
  }
  return null;
};

export default function ProfilePage() {
  const { user, token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<{ id: string } | null>(null);
  
  // Address management
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<any>({
    type: 'shipping',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  
  // Get userId from localStorage on client-side only
  useEffect(() => {
    const storedUser = getFromLocalStorage('user');
    if (storedUser && storedUser.id) {
      setUserId(storedUser);
    }
  }, []);

  // Fetch user profile with addresses
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId?.id) return;
      
      try {
        setIsLoading(true);
        
        const response = await axios.get(`${API_URL}/auth/profile/${userId.id}`);
        
        if (response.status === 200) {
          setProfile(response.data.user);
        } else {
          toast.error(response.data.message || 'Failed to load profile');
        }
          console.log("🚀 ~ fetchProfile ~ response.data.user:", response.data.user)
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error(error.response?.data?.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [token, userId?.id]);
  
  
  // Handle address form changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setAddressForm((prev: typeof addressForm) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setAddressForm((prev: typeof addressForm) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Open modal to add new address
  const handleAddAddress = () => {
    setAddressForm({
      type: 'shipping',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    });
    setEditingAddressIndex(null);
    setShowAddressModal(true);
  };
  
  // Open modal to edit existing address
  const handleEditAddress = (address: Address, index: any) => {
    console.log("🚀 ~ handleEditAddress ~ index:", index)
    console.log("🚀 ~ handleEditAddress ~ address:", address)
    setAddressForm({
      ...address,

    });
    setEditingAddressIndex(index);
    setShowAddressModal(true);
  };

  // Save address (create or update)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !userId?.id) {
      toast.error('You need to be logged in to save addresses');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare payload
      const payload = {
        address: {
          ...addressForm,

        },
        index: editingAddressIndex
      };
      
      const endpoint = editingAddressIndex !== null 
        ? `${API_URL}/auth/address/${userId.id}?addressId=${editingAddressIndex}` 
        : `${API_URL}/auth/address/${userId.id}`;
      
      const method = editingAddressIndex !== null ? 'put' : 'post';
      
      const response = await axios({
        method,
        url: endpoint,
        data: payload,
      });
      
      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.user);
        setShowAddressModal(false);
        toast.success(editingAddressIndex !== null ? 'Address updated' : 'Address added');
        setShowAddressModal(false);
        // window.location.reload();
      } else {
        toast.error(response.data.message || 'Failed to save address');
      }
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete address
  const handleDeleteAddress = async (index: any) => {
    console.log("🚀 ~ handleDeleteAddress ~ index:", index)
    if (!token || !userId?.id) {
      toast.error('You need to be logged in to delete addresses');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.delete(`${API_URL}/auth/address/${index}`);
      
      if (response.status === 200 ) {
        setProfile(response.data.user);
        toast.success('Address deleted');
      } else {
        toast.error(response.data.message || 'Failed to delete address');
      }


      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set address as default
  const handleSetDefaultAddress = async (index: number, type: 'shipping' | 'billing') => {
    if (!token || !userId?.id) {
      toast.error('You need to be logged in to set a default address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.patch(
        `${API_URL}/auth/address/${index}/default/${userId.id}`,
        { type }
      );
      
      if (response.status === 200) {
        setProfile(response.data.user);
        toast.success('Default address updated');
      } else {
        toast.error(response.data.message || 'Failed to update default address');
      }
    } catch (error: any) {
      console.error('Error setting default address:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  // Show loading state
  if (isLoading && !profile) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Wrapper>
    );
  }
  
  // Show login prompt if no user
  if (!isLoading && !userId?.id) {
    return (
      <Wrapper>
        <div className="py-10 max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">Please log in to view and manage your profile.</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  
  
  return (
    <Wrapper>
      <div className="py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          {/* Profile Information */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2" /> Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">First Name</p>
                <p className="font-medium">{profile?.firstName || user?.firstName}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Last Name</p>
                <p className="font-medium">{profile?.lastName || user?.lastName}</p>
              </div>
              
              <div>
                <p className="text-gray-600 flex items-center">
                  <FaEnvelope className="mr-1" /> Email
                </p>
                <p className="font-medium">{profile?.email || user?.email}</p>
              </div>
              
              <div>
                <p className="text-gray-600 flex items-center">
                  <FaPhone className="mr-1" /> Phone Number
                </p>
                <p className="font-medium">{profile?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {/* Addresses Section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FaMapMarkerAlt className="mr-2" /> My Addresses
              </h2>
              
              <button
                onClick={handleAddAddress}
                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center hover:bg-blue-700"
              >
                <FaPlus className="mr-1" /> Add Address
              </button>
            </div>
            
            {/* Display Addresses */}
            {(!profile?.addresses || profile.addresses.length === 0) ? (
              <div className="text-center py-8 bg-gray-50 rounded">
                <p className="text-gray-500">You don't have any saved addresses.</p>
                <button
                  onClick={handleAddAddress}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.addresses.map((address: Address, index: number) => (
                  <div 
                    key={index} 
                    className={`
                      border rounded-md p-4 relative
                      ${address.isDefault ? 'border-blue-500 bg-blue-50' : ''}
                    `}
                  >
                    {/* Address Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-800">
                        {address.type}
                      </span>
                      
                      {address.isDefault && (
                        <span className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-blue-500 text-white">
                          Default
                        </span>
                      )}
                    </div>
                    
                    {/* Address Details */}
                    <div className="mb-6 mt-2">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                    </div>
                    
                    {/* Address Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditAddress(address, address._id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-red-600 hover:text-red-800 flex items-center text-sm"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                      
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(index, address.type)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress} className="p-4">
              {/* Address Type */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address Type
                </label>
                <select
                  name="type"
                  value={addressForm.type}
                  onChange={handleAddressChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="shipping">Shipping</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
              
              {/* Address Line 1 */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={handleAddressChange}
                  placeholder="Flat No. / House No. / Building Name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              {/* Address Line 2 */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={addressForm.addressLine2 || ''}
                  onChange={handleAddressChange}
                  placeholder="Street / Locality / Area"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              {/* City and State */}
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="City / District / Town"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    State
                  </label>
           
                    <input
  type="text"
  name="state"
  value={addressForm.state}
  onChange={handleAddressChange}
  placeholder="State / Province / Region"
  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  required
/>


                </div>
              </div>
              
              {/* Postal Code and Country */}
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    PIN Code
                  </label>
                  <input
  type="text"
  name="postalCode"
  value={addressForm.postalCode}
  onChange={handleAddressChange}
  placeholder="ZIP / Postal Code"
  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  required
/>

                  <p className="text-xs text-gray-500 mt-1">
                    Indian PIN codes are 6 digits
                  </p>
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Country
                  </label>
                  <select
  name="country"
  value={addressForm.country}
  onChange={handleAddressChange}
  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  required
>
  <option value="">Select Country</option>
  {COUNTRIES.map((country) => (
    <option key={country} value={country}>{country}</option>
  ))}
</select>

                </div>
              </div>
              
              {/* Default Address Checkbox */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm">Set as default address</span>
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Wrapper>
  );
}