import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Truck, Printer, Home, Package } from 'lucide-react';
import API from '../api/axios';

export default function WholesaleSuccess() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/orders/${id}`);
        setOrder(response.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      navigate('/wholesale');
      return;
    }

    fetchOrder();
  }, [id, navigate]);

  const orderDate = useMemo(() => {
    if (!order?.createdAt) return new Date().toLocaleString();
    return new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [order]);

  const formattedDelivery = useMemo(() => {
    const dt = new Date(order?.createdAt || Date.now());
    dt.setDate(dt.getDate() + 3);
    return dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  }, [order]);

  const itemsCount = useMemo(() => {
    if (!order?.items) return state?.fallbackItemsCount || 0;
    return order.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [order, state]);

  const amount = order?.totalAmount || state?.fallbackAmount || 0;
  const paymentMethod = state?.paymentMethod || 'cod';

  const handleDownloadInvoice = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 pt-24 p-8 text-center font-semibold text-gray-600">Loading order...</div>;
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
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-24 pb-12 px-4 print:bg-white print:pt-0 print:p-0">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center border border-gray-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 print:shadow-none print:border-none">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>

        <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-25"></div>
          <CheckCircle size={44} className="text-green-600 relative z-10" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 font-medium">Your wholesale restock has been scheduled.</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 space-y-4 print:bg-white print:border-black">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-2">
            <div>
              <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">Order Reference</span>
              <span className="font-mono font-bold text-gray-900">{`ORD-${String(order._id).slice(-6).toUpperCase()}`}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">Date</span>
              <span className="text-xs font-semibold text-gray-700">{orderDate}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 italic">Inventory Units</span>
            <span className="text-sm font-bold text-gray-900 px-2 py-1 bg-white rounded-md border border-gray-100">{itemsCount} Units</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 italic">Payment Via</span>
            <span className="text-sm font-bold text-gray-900 uppercase tracking-tighter">{paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-medium text-gray-500 italic">Settlement Amount</span>
            <span className="text-2xl font-black text-green-700">₹{Number(amount).toLocaleString()}</span>
          </div>

          <div className="bg-blue-600 p-4 rounded-xl flex items-center gap-4 mt-4 shadow-lg shadow-blue-100">
            <div className="bg-white/20 p-2 rounded-lg text-white">
              <Truck size={24} />
            </div>
            <div>
              <span className="block text-[10px] text-blue-100 font-bold uppercase tracking-wider">Estimated Handover</span>
              <span className="text-sm font-bold text-white">{formattedDelivery}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 print:hidden">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleDownloadInvoice} className="py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
              <Printer size={18} /> Invoice
            </button>
            <button onClick={() => navigate(`/wholesale/track/${order._id}`)} className="py-3 px-4 border-2 border-blue-100 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-50/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-[0.98]">
              <Truck size={18} />
              <span>Track</span>
            </button>
          </div>

          <button onClick={() => navigate('/products')} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-[0.99]">
            <Package size={20} /> Back to Inventory
          </button>

          <button onClick={() => navigate('/dashboard')} className="group w-full text-sm text-gray-400 hover:text-gray-900 font-bold transition flex items-center justify-center gap-2">
            <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
