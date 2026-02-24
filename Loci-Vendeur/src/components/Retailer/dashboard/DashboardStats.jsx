import React from 'react';
import { IndianRupee, FileText, Package, Activity, TrendingUp } from 'lucide-react';

const DashboardStats = ({ totalRevenue, totalBills, totalProducts, avgOrderValue }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon={<IndianRupee size={20} className="text-green-600" />}
      />
      <StatCard
        title="Bills"
        value={totalBills}
        icon={<FileText size={20} className="text-blue-600" />}
      />
      <StatCard
        title="Products"
        value={totalProducts}
        icon={<Package size={20} className="text-purple-600" />}
      />
      <StatCard
        title="Avg. Value"
        value={`₹${avgOrderValue}`}
        icon={<Activity size={20} className="text-orange-600" />}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        {trend && (
          <span className={`text-xs font-medium flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <TrendingUp size={12} className="mr-1" /> : null}
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{title}</p>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardStats;
