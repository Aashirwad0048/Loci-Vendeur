import React from 'react';

const ActivityFeed = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
      <h3 className="font-semibold text-slate-800">Recent Activity</h3>
    </div>
    <div className="p-6 text-sm text-slate-500">
      No activity events available yet.
    </div>
  </div>
);

export default ActivityFeed;
