import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import AnalyticsKPIs from '../components/admin/analytics/AnalyticsKPIs';
import MarketShareAnalytics from '../components/admin/analytics/MarketShareAnalytics';

const toUiOrder = (order) => ({
  id: order._id,
  city: order.city,
  value: order.totalAmount,
  paymentStatus: order.paymentStatus,
  status: order.status,
});

const AnalyticsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders?limit=100');
        const raw = response.data?.data || [];
        setOrders(raw.map(toUiOrder));
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-10 bg-slate-50 min-h-screen text-slate-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-10 bg-slate-50 min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Strategic Intelligence</h1>
          <p className="text-slate-500 font-medium">Platform Growth & Market Penetration Metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Last 30 Days</button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Export Report</button>
        </div>
      </div>

      <AnalyticsKPIs orders={orders} />
      <MarketShareAnalytics orders={orders} />

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex gap-2 mb-4">
            {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
              <div key={i} className="w-8 bg-blue-100 rounded-t-lg flex flex-col justify-end" style={{ height: '100px' }}>
                <div className="bg-blue-600 rounded-t-lg transition-all hover:bg-blue-400" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">7-Month GMV Trend</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
