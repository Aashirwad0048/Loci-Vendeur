import React from 'react';
import { TrendingUp, ShoppingBag, BarChart3, CreditCard } from 'lucide-react';

const AnalyticsKPIs = ({ orders }) => {
  const gmv = orders.reduce((sum, o) => sum + (o.value || 0), 0);
  const avgOrder = orders.length > 0 ? gmv / orders.length : 0;
  const commission = orders
    .filter(o => o.paymentStatus === "released")
    .reduce((sum, o) => sum + (o.value * 0.03), 0);

  const kpis = [
    { label: 'Total GMV', value: `₹${gmv.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Order Value', value: `₹${avgOrder.toFixed(2)}`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Platform Revenue', value: `₹${commission.toLocaleString()}`, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className={`${kpi.bg} ${kpi.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
            <kpi.icon size={24} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsKPIs;
