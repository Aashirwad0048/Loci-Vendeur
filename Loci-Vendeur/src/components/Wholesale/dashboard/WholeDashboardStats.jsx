import React from 'react';
import { IndianRupee, Package, Users, Truck } from 'lucide-react';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
      <h2 className="text-2xl font-black text-gray-900 mt-1">{value}</h2>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      {icon}
    </div>
  </div>
);

const WholeDashboardStats = ({ revenue, orders, retailers, pending }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <StatCard 
        title="Revenue" 
        value={`₹${revenue.toLocaleString()}`} 
        icon={<IndianRupee size={22} />} 
        colorClass="bg-emerald-50 text-emerald-600"
      />
      <StatCard 
        title="Active Retailers" 
        value={retailers} 
        icon={<Users size={22} />} 
        colorClass="bg-blue-50 text-blue-600"
      />
      <StatCard 
        title="Total Orders" 
        value={orders} 
        icon={<Package size={22} />} 
        colorClass="bg-purple-50 text-purple-600"
      />
      <StatCard 
        title="Pending Shipments" 
        value={pending} 
        icon={<Truck size={22} />} 
        colorClass="bg-orange-50 text-orange-600"
      />
    </div>
  );
};

export default WholeDashboardStats;