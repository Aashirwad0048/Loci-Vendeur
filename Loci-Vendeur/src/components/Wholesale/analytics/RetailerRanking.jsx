import React from 'react';
import { Users, Award } from 'lucide-react';

const RetailerRanking = ({ orders }) => {
  // Aggregate revenue by retailer
  const retailerMap = orders.reduce((acc, order) => {
    const name = order.retailer || "Unknown Retailer";
    acc[name] = (acc[name] || 0) + (order.total || 0);
    return acc;
  }, {});

  // Sort by revenue and take top 5
  const sortedRetailers = Object.entries(retailerMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Users size={18} className="text-emerald-500" /> Top Retailers
        </h3>
        <Award size={18} className="text-amber-400" />
      </div>

      <div className="space-y-6">
        {sortedRetailers.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase italic">No sales data yet</p>
          </div>
        ) : (
          sortedRetailers.map(([name, revenue], index) => (
            <div key={name} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-gray-300 group-hover:text-emerald-500 transition-colors">
                  0{index + 1}
                </span>
                <span className="font-bold text-gray-800 text-sm tracking-tight">{name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">₹{revenue.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Gross Contribution</p>
              </div>
            </div>
          ))
        )}
      </div>

      {sortedRetailers.length > 0 && (
        <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-50 hover:text-emerald-600 transition-colors">
          View Full Client List
        </button>
      )}
    </div>
  );
};

export default RetailerRanking;