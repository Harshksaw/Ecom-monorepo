// components/admin/StatCard.tsx
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-2">
          {title}
        </h3>
        <div className="text-2xl font-bold text-gray-800">
          {value}
        </div>
        {trend && (
          <div 
            className={`
              flex items-center text-sm mt-2 
              ${trend === 'up' ? 'text-green-500' : 'text-red-500'}
            `}
          >
            {trend === 'up' ? '▲' : '▼'} 12.5%
          </div>
        )}
      </div>
      <div className="bg-gray-100 rounded-full p-3">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;