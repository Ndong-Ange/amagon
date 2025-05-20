import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Seller {
  id: string;
  name: string;
  email: string;
  totalSales: number;
  productCount: number;
  lastActive: string;
}

interface Activity {
  id: string;
  seller_id: string;
  action_type: string;
  description: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sellersRes, activitiesRes] = await Promise.all([
        axios.get('/api/admin/sellers'),
        axios.get('/api/admin/activities')
      ]);
      setSellers(sellersRes.data);
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Sellers</h3>
            <p className="text-3xl font-bold">{sellers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
            <p className="text-3xl font-bold">
              ${sellers.reduce((acc, seller) => acc + seller.totalSales, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Active Sellers Today</h3>
            <p className="text-3xl font-bold">
              {sellers.filter(s => new Date(s.lastActive).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Sellers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellers.map((seller) => (
                  <tr 
                    key={seller.id}
                    onClick={() => setSelectedSeller(seller.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{seller.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{seller.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${seller.totalSales.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{seller.productCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(seller.lastActive).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;