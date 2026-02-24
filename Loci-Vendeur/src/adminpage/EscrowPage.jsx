import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import EscrowSummaryCards from '../components/admin/Escrowmanagment/EscrowSummaryCards';
import PendingReleaseTable from '../components/admin/Escrowmanagment/PendingReleaseTable';

const toUiOrder = (order) => ({
  id: order._id,
  displayId: `ORD-${String(order._id).slice(-6).toUpperCase()}`,
  orderId: order._id,
  wholesaler: order.wholesalerId?.name || 'Wholesaler',
  value: order.totalAmount,
  status: order.status,
  paymentStatus: order.paymentStatus,
});

const EscrowPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders?limit=100');
      const raw = response.data?.data || [];
      setOrders(raw.map(toUiOrder));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRelease = async (orderId) => {
    try {
      await API.post(`/escrow/${orderId}/release`);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to release payout');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Financial Control System</h1>
        <p className="text-slate-500">Escrow Oversight & Revenue Ledger</p>
      </div>

      {loading ? (
        <div className="py-12 text-center font-semibold text-gray-600">Loading escrow data...</div>
      ) : (
        <>
          <EscrowSummaryCards orders={orders} />

          <div className="grid grid-cols-1 gap-8">
            <PendingReleaseTable orders={orders} onRelease={handleRelease} />

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between">
                <h3 className="font-bold text-slate-800 italic uppercase text-xs tracking-widest">Released History</h3>
                <button className="text-blue-600 text-xs font-bold">Export Audit Log (.CSV)</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EscrowPage;
