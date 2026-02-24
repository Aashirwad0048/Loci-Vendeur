import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus } from "lucide-react";
import API from "../api/axios";

import DashboardStats from "../components/Retailer/dashboard/DashboardStats";
import SalesChart from "../components/Retailer/dashboard/SalesChart";
import DashboardSidebar from "../components/Retailer/dashboard/DashboardSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [billsRes, ordersRes, productsRes] = await Promise.all([
          API.get("/bills?limit=100"),
          API.get("/orders?limit=100"),
          API.get("/products?limit=100"),
        ]);
        setBills(billsRes.data?.data || []);
        setOrders(ordersRes.data?.data || []);
        setProducts(productsRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalProducts = products.length;
  const totalBills = bills.length;
  const totalRevenue = bills.reduce((sum, bill) => sum + Number(bill.total || 0), 0);
  const avgOrderValue = totalBills > 0 ? Math.round(totalRevenue / totalBills) : 0;

  const lowStockItems = products
    .filter((p) => Number(p.stock) < 10)
    .slice(0, 3)
    .map((p) => ({ id: p._id, name: p.name, stock: Number(p.stock || 0) }));

  const recentBills = [
    ...bills.map((bill) => ({
      id: bill._id,
      invoiceNumber: bill.invoiceNumber || `INV-${String(bill._id).slice(-6).toUpperCase()}`,
      total: Number(bill.total || 0),
      date: bill.invoiceDate ? new Date(bill.invoiceDate).toLocaleDateString() : "",
      paymentStatus: bill.paymentStatus || "paid",
      createdAt: bill.createdAt,
      type: "Retail Bill",
    })),
    ...orders.map((order) => ({
      id: order._id,
      invoiceNumber: `ORD-${String(order._id).slice(-6).toUpperCase()}`,
      total: Number(order.totalAmount || 0),
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
      paymentStatus: order.paymentStatus || "pending",
      createdAt: order.createdAt,
      type: "Wholesale",
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const chartData = useMemo(() => {
    const dayKey = (value) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const salesByDay = new Map();
    for (const bill of bills) {
      const key = dayKey(bill.invoiceDate || bill.createdAt);
      if (!key) continue;
      salesByDay.set(key, (salesByDay.get(key) || 0) + Number(bill.total || 0));
    }

    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = dayKey(date);
      result.push({
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        sales: Number(salesByDay.get(key) || 0),
      });
    }

    return result;
  }, [bills]);

  if (loading) {
    return <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, here is what's happening today.
          </p>
        </div>
        
        <div className="flex gap-3">
           <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Inventory</span>
          </button>
          <button
            onClick={() => navigate("/billing")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 font-medium"
          >
            <Plus size={18} />
            <span>New Bill</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <div className="lg:col-span-2 space-y-6">
          <DashboardStats 
            totalRevenue={totalRevenue}
            totalBills={totalBills}
            totalProducts={totalProducts}
            avgOrderValue={avgOrderValue}
          />
          <SalesChart data={chartData} />
        </div>

        <DashboardSidebar 
          lowStockItems={lowStockItems}
          recentBills={recentBills}
        />

      </div>
    </div>
  );
};

export default Dashboard;
