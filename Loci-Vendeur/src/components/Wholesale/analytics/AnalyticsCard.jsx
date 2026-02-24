import React from 'react';

const AnalyticsCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md hover:border-emerald-100">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          {label}
        </p>
        <h3 className="text-2xl font-black mt-2 text-gray-900 tracking-tight italic">
          {value}
        </h3>
      </div>
      <div className={`p-4 bg-gray-50 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default AnalyticsCard;