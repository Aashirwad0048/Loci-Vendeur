import React from 'react';

const MarketShareAnalytics = ({ orders }) => {
  const cityData = orders.reduce((acc, o) => {
    acc[o.city] = (acc[o.city] || 0) + 1;
    return acc;
  }, {});

  const sortedCities = Object.entries(cityData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxOrders = Math.max(...Object.values(cityData), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase italic mb-6">Top Performing Cities</h3>
        <div className="space-y-6">
          {sortedCities.map(([city, count]) => (
            <div key={city}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-700">{city}</span>
                <span className="text-slate-500">{count} Orders</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(count / maxOrders) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Market Risk Profile</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="border-l-2 border-red-500 pl-4">
            <p className="text-3xl font-bold">2.4%</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Dispute Rate</p>
          </div>
          <div className="border-l-2 border-orange-500 pl-4">
            <p className="text-3xl font-bold">12%</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Cancellation Rate</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <p className="text-3xl font-bold">4.8h</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Avg Assignment Time</p>
          </div>
          <div className="border-l-2 border-purple-500 pl-4">
            <p className="text-3xl font-bold">94%</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Successful Payouts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketShareAnalytics;
