import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle, ArrowLeft, Clock, MapPin } from "lucide-react";
import API from "../api/axios";

const buildSteps = (status) => {
  const rank = {
    placed: 1,
    assigned: 2,
    dispatched: 3,
    delivered: 4,
    cancelled: 0,
  };

  const current = rank[status] ?? 1;

  const normalize = (idx) => {
    if (status === "cancelled") return "pending";
    if (idx < current) return "done";
    if (idx === current) return "current";
    return "pending";
  };

  return [
    { label: "Order Placed", desc: "Your order has been received", status: normalize(1) },
    { label: "Assigned", desc: "Wholesaler assigned to fulfill", status: normalize(2) },
    { label: "Shipped", desc: "On the way via logistics", status: normalize(3) },
    { label: "Delivered", desc: "Handover completed", status: normalize(4) },
  ];
};

export default function WholesaleTrack() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const response = await API.get(`/orders/${id}`);
      setOrder(response.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order tracking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate('/wholesale');
      return;
    }

    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  const steps = useMemo(() => buildSteps(order?.status), [order?.status]);
  const displayId = order?._id ? `ORD-${String(order._id).slice(-6).toUpperCase()}` : id;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 pt-24 p-8 text-center font-semibold text-gray-600">Loading tracking...</div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 p-8 text-center">
        <p className="font-semibold text-red-600 mb-4">{error || 'Order not found'}</p>
        <button onClick={() => navigate('/wholesale')} className="text-blue-600 font-bold hover:underline">Back to Market</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors group">
          <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Current Status</p>
                <h2 className="text-3xl font-bold mt-1 capitalize">{order.status}</h2>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <Truck size={32} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-blue-100">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Order ID: {displayId} • {order.city}
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-0">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6 pb-10 last:pb-0">
                  {index !== steps.length - 1 && (
                    <div className={`absolute left-[23px] top-[48px] w-0.5 h-full ${step.status === "done" ? "bg-green-500" : "bg-gray-200"}`} />
                  )}

                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white shadow-sm transition-all duration-500 ${
                    step.status === "done"
                      ? "bg-green-500 text-white"
                      : step.status === "current"
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.status === "done" ? <CheckCircle size={20} /> : index === 1 ? <Package size={20} /> : index === 2 ? <Truck size={20} /> : <CheckCircle size={20} />}
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className={`font-bold leading-none ${step.status === "pending" ? "text-gray-400" : "text-gray-900"}`}>{step.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <Clock size={12} /> {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-blue-500" />
              <span>
                Ship to: <span className="font-bold text-gray-900">{order.retailerId?.name || 'Retailer'}, {order.city}</span>
              </span>
            </div>
            <button className="text-blue-600 font-bold hover:underline">Help?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
