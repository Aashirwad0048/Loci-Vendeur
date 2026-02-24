import React from 'react';
import { Package, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';

const InventorySummary = ({ supplies }) => {
  const total = supplies.length;
  const active = supplies.filter(s => s.isActive).length;
  const lowStock = supplies.filter(s => s.stock < 20).length;
  
  // Simple Price Anomaly Detection: Price is 50% lower than the median
  const avgPrice = supplies.reduce((acc, s) => acc + s.price, 0) / total;
  const suspicious = supplies.filter(s => s.price < (avgPrice * 0.5)).length;

  const stats = [
    { label: 'Total Listings', value: total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Supply', value: active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Low Stock Alerts', value: lowStock, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Price Anomalies', value: suspicious, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventorySummary;   