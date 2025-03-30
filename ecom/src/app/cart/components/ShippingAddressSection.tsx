// src/app/cart/components/ShippingAddressSection.tsx
'use client';

import Link from 'next/link';
import { FaMapMarkerAlt, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { UserProfile, Address } from '../types';

interface ShippingAddressSectionProps {
  isAddressLoading: boolean;
  defaultShippingAddress: Address | null;
  userProfile: UserProfile | null;
  showAddressRequired: boolean;
  handleAddAddress: () => void;
}

const ShippingAddressSection = ({
  isAddressLoading,
  defaultShippingAddress,
  userProfile,
  showAddressRequired,
  handleAddAddress
}: ShippingAddressSectionProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <FaMapMarkerAlt className="mr-2 text-gray-600" /> 
          Shipping Address
        </h2>
        
        <button 
          onClick={handleAddAddress}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {defaultShippingAddress ? 'Change' : 'Add'}
        </button>
      </div>
      
      {isAddressLoading ? (
        <div className="py-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading address...</p>
        </div>
      ) : defaultShippingAddress ? (
        <div className="bg-white p-3 rounded border">
          <div className="text-sm">
            <p className="font-medium">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p>{defaultShippingAddress.addressLine1}</p>
            {defaultShippingAddress.addressLine2 && <p>{defaultShippingAddress.addressLine2}</p>}
            <p>
              {defaultShippingAddress.city}, {defaultShippingAddress.state} {defaultShippingAddress.postalCode}
            </p>
            <p>{defaultShippingAddress.country}</p>
            {userProfile?.phoneNumber && <p className="mt-1">Phone: {userProfile.phoneNumber}</p>}
          </div>
        </div>
      ) : (
        <div className={`bg-white p-4 rounded border ${showAddressRequired ? 'border-red-500' : 'border-gray-200'}`}>
          <div className="text-center py-2">
            <FaExclamationTriangle className={`mx-auto mb-2 ${showAddressRequired ? 'text-red-500' : 'text-gray-400'}`} size={24} />
            <p className={`font-medium ${showAddressRequired ? 'text-red-500' : 'text-gray-500'}`}>
              Please add a shipping address
            </p>
            <button
              onClick={handleAddAddress}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Add Address
            </button>
          </div>
        </div>
      )}
      
      {/* User Information */}
      {userProfile ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <FaUser className="text-gray-500 mt-1 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{userProfile.firstName} {userProfile.lastName}</p>
              <p className="text-gray-600">{userProfile.email}</p>
              {userProfile.phoneNumber && <p className="text-gray-600">{userProfile.phoneNumber}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Please <Link href="/login" className="text-blue-600 hover:underline">log in</Link> to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressSection;