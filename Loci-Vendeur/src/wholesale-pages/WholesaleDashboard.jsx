import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus } from "lucide-react";

// Import your new separate components
import WholeDashboardStats from "../components/Wholesale/dashboard/WholeDashboardStats";
import WholeRevenueChart from "../components/Wholesale/dashboard/WholeRevenueChart";
import WholesaleSidebar from "../components/Wholesale/dashboard/WholesaleSidebar";
import API from "../api/axios";

const WholesaleDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/orders?limit=100'),
          API.get(`/products?wholesalerId=${user?.id}`),
        ]);
        setOrders(ordersRes.data?.data || []);
        setProducts(productsRes.data?.data || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const statsData = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'paid' || o.paymentStatus === 'released')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const activeRetailers = new Set(orders.map((o) => o.retailerId?._id).filter(Boolean)).size;

    return {
      totalRevenue,
      totalOrders: orders.length,
      activeRetailers,
      pendingShipments: orders.filter((o) => o.status === 'assigned' || o.status === 'dispatched').length,
    };
  }, [orders]);

  const chartData = useMemo(
    () =>
      orders.slice(0, 7).map((o, idx) => ({
        name: `O${idx + 1}`,
        sales: Number(o.totalAmount || 0),
      })),
    [orders]
  );

  const lowStockBulk = useMemo(
    () =>
      products
        .filter((p) => Number(p.stock) < 20)
        .slice(0, 5)
        .map((p) => ({ id: p._id, name: p.name, stock: p.stock, unit: 'Units' })),
    [products]
  );

  const recentDispatches = useMemo(
    () =>
      orders.slice(0, 5).map((o) => ({
        id: `ORD-${String(o._id).slice(-6).toUpperCase()}`,
        retailer: o.retailerId?.name || 'Retailer',
        total: Number(o.totalAmount || 0),
        status: o.status,
      })),
    [orders]
  );

  if (loading) {
    return <div className="p-4 md:p-8 bg-gray-50 min-h-screen pt-20 text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-8 bg-gray-50 min-h-screen pt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans pt-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Wholesale <span className="text-emerald-600">Command</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name || "Supplier"}. Here is your supply overview.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/wholesaler/orders")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium"
          >
            <Package size={18} />
            <span className="hidden sm:inline">Warehouse</span>
          </button>
          <button
            onClick={() => navigate("/wholesaler/inventory")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 font-medium"
          >
            <Plus size={18} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Side: Stats & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <WholeDashboardStats 
            revenue={statsData.totalRevenue}
            orders={statsData.totalOrders}
            retailers={statsData.activeRetailers}
            pending={statsData.pendingShipments}
          />
          <WholeRevenueChart data={chartData} />
        </div>

        {/* Right Side: Sidebar */}
        <WholesaleSidebar 
          lowStock={lowStockBulk}
          recentDispatches={recentDispatches}
        />
      </div>
    </div>
  );
};

export default WholesaleDashboard;
