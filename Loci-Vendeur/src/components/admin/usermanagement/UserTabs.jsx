import React from "react";
export default function UserTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'retailers', label: 'Retailers' },
    { id: 'wholesalers', label: 'Wholesalers' },
    { id: 'pending', label: 'Pending Apps' }
  ];

  return (
    <div className="flex space-x-4 border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 px-4 text-sm font-medium transition-colors ${
            activeTab === tab.id 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};