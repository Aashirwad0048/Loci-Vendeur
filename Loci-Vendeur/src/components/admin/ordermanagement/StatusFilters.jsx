import React from 'react';

const StatusFilters = ({ activeTab, setActiveTab, counts }) => {
  const tabs = ['All', 'Placed', 'Assigned', 'Dispatched', 'Delivered', 'Cancelled'];
  
  return (
    <div className="px-8 py-4 flex gap-2 overflow-x-auto bg-white border-b border-slate-200 shrink-0">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === tab 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {tab} {counts?.[tab] && <span className="ml-1 opacity-60">({counts[tab]})</span>}
        </button>
      ))}
    </div>
  );
};

export default StatusFilters;