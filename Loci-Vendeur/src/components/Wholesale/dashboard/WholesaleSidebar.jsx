import React from 'react';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

const WholesaleSidebar = ({ lowStock, recentDispatches }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
          <AlertCircle size={18} className="text-orange-500" /> Stock Alerts
        </h3>
        <div className="space-y-3">
          {lowStock.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-xs font-bold text-red-500">{item.stock} left</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Recent Dispatches</h3>
        <div className="space-y-4">
          {recentDispatches.map((order) => (
            <div key={order.id} className="flex justify-between items-center group cursor-pointer border-b border-gray-50 pb-2 last:border-0">
              <div>
                <p className="text-sm font-bold text-gray-800">{order.retailer}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{order.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- THIS LINE IS WHAT IS MISSING ---
export default WholesaleSidebar;