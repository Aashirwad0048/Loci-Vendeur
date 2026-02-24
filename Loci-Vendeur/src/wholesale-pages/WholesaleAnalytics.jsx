import React, { useEffect, useState, useMemo } from "react";
import { 
  IndianRupee, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  Star 
} from "lucide-react";
import AnalyticsCard from "../components/Wholesale/analytics/AnalyticsCard";
import RetailerRanking from "../components/Wholesale/analytics/RetailerRanking";
import PerformanceChart from "../components/Wholesale/analytics/PerformanceChart";
import API from "../api/axios";

const WholesaleAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const currentUser = useMemo(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders?limit=100');
        const raw = response.data?.data || [];
        setOrders(
          raw.map((order) => ({
            id: order._id,
            total: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentStatus,
            retailer: order.retailerId?.name || 'Retailer',
          }))
        );
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === "delivered").length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const escrow = orders
      .filter(o => o.status !== "delivered")
      .reduce((sum, o) => {
        const total = o.total || 0;
        const payout = o.payout || total * 0.95;
        return sum + payout;
      }, 0); 
    
    return { totalOrders, delivered, revenue, escrow };
  }, [orders]);
  const deliveryRate = metrics.totalOrders ? ((metrics.delivered / metrics.totalOrders) * 100).toFixed(1) : "0.0";

  if (loading) {
    return <div className="pt-8 px-5 md:px-8 pb-20 text-gray-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="pt-8 px-5 md:px-8 pb-20 text-red-600">{error}</div>;
  }

  return (
    <div className="pt-8 px-5 md:px-8 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">
            Business <span className="text-emerald-600">Intelligence</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mt-1">
            Performance metrics for {currentUser?.companyName}
          </p>
        </div>

        {/* 🔹 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <AnalyticsCard 
            icon={<Truck size={20} />} 
            label="Total Shipments" 
            value={metrics.totalOrders} 
            color="text-blue-600" 
          />
          <AnalyticsCard 
            icon={<CheckCircle2 size={20} />} 
            label="Successful Deliveries" 
            value={metrics.delivered} 
            color="text-emerald-600" 
          />
          <AnalyticsCard 
            icon={<IndianRupee size={20} />} 
            label="Gross Revenue" 
            value={`₹${metrics.revenue.toLocaleString()}`} 
            color="text-gray-900" 
          />
          <AnalyticsCard 
            icon={<ShieldCheck size={20} />} 
            label="Escrow (Pending)" 
            value={`₹${metrics.escrow.toLocaleString()}`} 
            color="text-amber-600" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 🔹 Performance Graph - Takes up more space */}
          <div className="lg:col-span-2">
            <PerformanceChart orders={orders} />
          </div>

          {/* 🔹 Sidebar Content */}
          <div className="flex flex-col gap-6">
            <RetailerRanking orders={orders} />
            
            <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-200/50 transform transition hover:scale-[1.02]">
               <div className="flex items-center gap-2 mb-4">
                  <Star size={18} fill="white" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Delivery Rate</span>
               </div>
               <h4 className="text-4xl font-black italic">{deliveryRate}%</h4>
               <p className="text-xs text-emerald-50 mt-3 font-medium leading-relaxed">
                 Calculated from delivered orders against total shipments.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleAnalytics;
