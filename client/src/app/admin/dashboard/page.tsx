// app/admin/dashboard/page.tsx
import { Metadata } from 'next';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaBox, 
  FaChartLine 
} from 'react-icons/fa';
// import AdminLayout from '@/components/admin/AdminLayout';
// import StatCard from '@/components/admin/StatCard';
// import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
// import ProductService from '@/services/product.service';
// import OrderService from '@/services/order.service';
// import UserService from '@/services/user.service';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your store and view key metrics'
};

export default async function AdminDashboardPage() {
  // Fetch dashboard data
//   const [
//     totalProducts,
//     totalOrders,
//     totalUsers,
//     recentOrders,
//     totalRevenue
//   ] = await Promise.all([
//     ProductService.getTotalProductCount(),
//     OrderService.getTotalOrderCount(),
//     UserService.getTotalUserCount(),
//     OrderService.getRecentOrders(5),
//     OrderService.getTotalRevenue()
//   ]);

  return (
    // <AdminLayout>
    //   <div className="p-6">
    //     <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    //     {/* Stats Grid */}
    //     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    //       <StatCard 
    //         title="Total Products"
    //         value={totalProducts}
    //         icon={<FaBox className="text-blue-500" />}
    //       />
    //       <StatCard 
    //         title="Total Orders"
    //         value={totalOrders}
    //         icon={<FaShoppingCart className="text-green-500" />}
    //       />
    //       <StatCard 
    //         title="Total Users"
    //         value={totalUsers}
    //         icon={<FaUsers className="text-purple-500" />}
    //       />
    //       <StatCard 
    //         title="Total Revenue"
    //         value={`$${totalRevenue.toFixed(2)}`}
    //         icon={<FaChartLine className="text-red-500" />}
    //       />
    //     </div>

    //     {/* Recent Orders */}
    //     <div className="bg-white shadow-md rounded-lg p-6">
    //       <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
    //       <RecentOrdersTable orders={recentOrders} />
    //     </div>
    //   </div>
    // </AdminLayout>
  );
}