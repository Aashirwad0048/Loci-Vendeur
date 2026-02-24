import React from 'react';
import { ClipboardList, Truck, IndianRupee } from 'lucide-react';

const FulfillmentStats = ({ stats }) => {
  const cards = [
    { label: "Assigned", val: stats.assigned, icon: <ClipboardList />, color: "text-gray-400" },
    { label: "To Dispatch", val: stats.ready, icon: <Truck className="rotate-12" />, color: "text-amber-500" },
    { label: "In Transit", val: stats.transit, icon: <Truck />, color: "text-blue-500" },
    { label: "Earnings in Escrow", val: `₹${stats.pendingEarnings.toLocaleString()}`, icon: <IndianRupee />, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-emerald-200 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{card.val}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-gray-50 ${card.color}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FulfillmentStats;