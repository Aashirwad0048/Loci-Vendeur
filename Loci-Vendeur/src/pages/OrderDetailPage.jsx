import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, MapPin, Package, Truck } from 'lucide-react';
import API from '../api/axios';
import OrderStatusBadge from '../components/common/OrderStatusBadge';

const allowedTransitions = {
  assigned: ['dispatched'],
  dispatched: ['delivered'],
  delivered: [],
};

function StatusTimeline({ order }) {
  const currentRank = { assigned: 1, dispatched: 2, delivered: 3 }[order.status] || 1;

  const steps = [
    { key: 'assigned', label: 'Assigned', desc: 'Wholesaler assigned to your order' },
    { key: 'dispatched', label: 'Dispatched', desc: 'Order is in transit' },
    { key: 'delivered', label: 'Delivered', desc: 'Order handover completed' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-5">Status Timeline</h3>
      <div className="space-y-5">
        {steps.map((step, idx) => {
          const rank = idx + 1;
          const state = rank < currentRank ? 'done' : rank === currentRank ? 'current' : 'pending';
          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className={`mt-0.5 w-4 h-4 rounded-full ${state === 'done' ? 'bg-emerald-500' : state === 'current' ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div>
                <p className={`font-bold ${state === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoleActionPanel({ userRole, order, onTransition, busy }) {
  const nextStates = allowedTransitions[order.status] || [];
  const canProgressDelivery = userRole === 'wholesaler';
  const canCancel = userRole === 'retailer' && order.status === 'assigned';

  if ((!canProgressDelivery || nextStates.length === 0) && !canCancel) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">Actions</h3>
        <p className="text-sm text-gray-500">No valid actions available for current status.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Actions</h3>
      <div className="flex flex-wrap gap-3">
        {canProgressDelivery &&
          nextStates.map((nextStatus) => (
            <button
              key={nextStatus}
              disabled={busy}
              onClick={() => onTransition(nextStatus)}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
            >
              {nextStatus === 'dispatched' ? 'Dispatch Order' : 'Mark Delivered'}
            </button>
          ))}
        {canCancel && (
          <button
            disabled={busy}
            onClick={() => onTransition('cancel')}
            className="px-5 py-2.5 rounded-xl border border-red-300 bg-red-50 text-red-700 text-xs font-black uppercase tracking-widest hover:bg-red-100 disabled:opacity-50"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/orders/${id}`);
      setOrder(response.data?.data || null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const displayId = useMemo(() => (order?._id ? `ORD-${String(order._id).slice(-6).toUpperCase()}` : id), [order, id]);

  const handleTransition = async (nextStatus) => {
    try {
      setBusy(true);
      if (nextStatus === 'cancel') {
        await API.patch(`/orders/${order._id}/cancel`);
      } else {
        await API.patch(`/orders/${order._id}/status`, { status: nextStatus });
      }
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-8">Loading order...</div>;
  if (error || !order) return <div className="min-h-screen bg-gray-50 p-8 text-red-600">{error || 'Order not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Order</p>
              <h1 className="text-2xl font-black text-gray-900 mt-1">{displayId}</h1>
            </div>
            <div className="text-right">
              <OrderStatusBadge status={order.status} />
              <p className="text-sm font-semibold text-gray-800 mt-3">₹{Number(order.totalAmount || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-black mb-1">Retailer</p>
              <p className="font-bold">{order.retailerId?.name || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-black mb-1">Wholesaler</p>
              <p className="font-bold">{order.wholesalerId?.name || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-black mb-1">City</p>
              <p className="font-bold flex items-center gap-1"><MapPin size={14} /> {order.city}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StatusTimeline order={order} />

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Order Items</h3>
              <div className="space-y-3">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border border-gray-100 rounded-xl p-3 bg-gray-50">
                    <div>
                      <p className="font-bold text-gray-900 flex items-center gap-2"><Package size={14} /> {item.productId?.name || 'Product'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-800">₹{Number((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <RoleActionPanel userRole={user.role} order={order} onTransition={handleTransition} busy={busy} />

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">Meta</h3>
              <p className="text-sm text-gray-600 flex items-center gap-2"><Clock3 size={14} /> Created: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Payment: <span className="font-semibold">{order.paymentStatus}</span></p>
              <p className="text-sm text-gray-600 mt-1">Dispute: <span className="font-semibold">{order.hasDispute ? 'Yes' : 'No'}</span></p>
              <button onClick={() => navigate(`/wholesale/track/${order._id}`)} className="mt-4 w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 flex items-center justify-center gap-2">
                <Truck size={14} /> Open Tracking View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
