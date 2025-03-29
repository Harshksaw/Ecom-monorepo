// AdminLoginButton component
import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface AdminLoginProps {
  onClick: () => void;
  loading: boolean;
}

const AdminLoginButton: React.FC<AdminLoginProps> = ({ onClick, loading }) => {
  return (
    <button
      type="button"
      onClick={onClick}
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
  );
};

export default AdminLoginButton;