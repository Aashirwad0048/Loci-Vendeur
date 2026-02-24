import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, ShieldCheck, ArrowUpRight, Clock } from 'lucide-react';
import API from '../api/axios';

// Import our new components
import Adminstatcard from '../components/admin/dashboard/Adminstatcard';
import EscrowPanel from '../components/admin/dashboard/EscrowPanel';
import ActivityFeed from '../components/admin/dashboard/ActivityFeed';
import RiskAlert from '../components/admin/dashboard/RiskAlert';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    retailers: 0,
    wholesalers: 0,
    totalOrders: 0,
    gmv: 0,
    escrow: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          API.get('/users'),
          API.get('/orders?limit=100'),
        ]);

        const users = usersRes.data?.data || [];
        const orders = ordersRes.data?.data || [];

        setStats({
          retailers: users.filter((u) => u.role === 'retailer').length,
          wholesalers: users.filter((u) => u.role === 'wholesaler').length,
          totalOrders: ordersRes.data?.pagination?.total || orders.length,
          gmv: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
          escrow: orders
            .filter((o) => o.status !== 'delivered' && o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
          pending: users.filter((u) => u.role === 'wholesaler' && u.status === 'pending').length,
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 bg-slate-50 min-h-screen text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 bg-slate-50 min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
        <p className="text-slate-500 text-sm">Orchestrating marketplace trust and operations.</p>
      </header>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Adminstatcard title="Retailers" value={stats.retailers} icon={<Users size={20}/>} color="blue" />
        <Adminstatcard title="Wholesalers" value={stats.wholesalers} icon={<Users size={20}/>} color="indigo" />
        <Adminstatcard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={20}/>} color="purple" />
        <Adminstatcard title="GMV" value={`₹${stats.gmv.toLocaleString()}`} icon={<ArrowUpRight size={20}/>} color="green" />
        <Adminstatcard title="Escrow" value={`₹${stats.escrow.toLocaleString()}`} icon={<ShieldCheck size={20}/>} color="amber" />
        <Adminstatcard title="Pending" value={stats.pending} icon={<Clock size={20}/>} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed Area */}
        <div className="lg:col-span-8 space-y-6">
          <ActivityFeed />
        </div>

        {/* Control & Risk Area */}
        <div className="lg:col-span-4 space-y-6">
          <EscrowPanel 
            releasedToday={12400} 
            commission={stats.gmv * 0.03} 
            onManualRelease={() => alert("Redirecting to Escrow Ledger...")} 
          />
          <RiskAlert />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
