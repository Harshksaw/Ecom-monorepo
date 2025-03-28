// components/admin/RecentOrdersTable.tsx
import React from 'react';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-center">Total</th>
            <th className="py-3 px-6 text-center">Status</th>
            <th className="py-3 px-6 text-center">Date</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {orders.map((order) => (
            <tr 
              key={order.id} 
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium">{order.id}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <span>{order.customerName}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex items-center justify-center">
                  ${order.total.toFixed(2)}
                </div>
              </td>
              <td className="py-3 px-6 text-center">
                <span 
                  className={`
                    py-1 px-3 rounded-full text-xs 
                    ${getStatusColor(order.status)}
                  `}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <span>{order.date}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                  >
                    <FaEye />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;