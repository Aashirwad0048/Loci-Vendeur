import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import FulfillmentStats from '../components/Wholesale/Orders/FulfillmentStats';
import OrderFulfillmentCard from '../components/Wholesale/Orders/OrderFulfillmentCard';

const toUiOrder = (order) => ({
  id: order._id,
  displayId: `ORD-${String(order._id).slice(-6).toUpperCase()}`,
  retailerName: order.retailerId?.name || 'Retailer',
  city: order.city,
  totalAmount: order.totalAmount,
  status: order.status,
  paymentStatus: order.paymentStatus,
});

const WholesaleOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    total: 0,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    paymentStatus: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async (nextFilters) => {
    try {
      setLoading(true);
      setError('');
      const query = new URLSearchParams();
      Object.entries(nextFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          query.set(key, String(value));
        }
      });

      const response = await API.get(`/orders?${query.toString()}`);
      const raw = response.data?.data || [];
      setOrders(raw.map(toUiOrder));
      setPagination(
        response.data?.pagination || {
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          total: raw.length,
        }
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filters);
  }, [filters]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders(filters);

      if (newStatus === 'delivered') {
        alert('Order marked delivered. Escrow can be released by admin after payment is marked paid.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const stats = {
    assigned: orders.length,
    ready: orders.filter((o) => o.status === 'assigned').length,
    transit: orders.filter((o) => o.status === 'dispatched').length,
    pendingEarnings: orders
      .filter((o) => o.status !== 'delivered')
      .reduce((sum, o) => sum + o.totalAmount * 0.95, 0),
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
            Supply <span className="text-emerald-600">Pipeline</span>
          </h1>
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm">
            <ShieldCheck size={20} className="text-emerald-500" />
            <p className="text-xs font-bold uppercase tracking-wide">Escrow Secured • Funds Held by Platform</p>
          </div>
        </div>

        <FulfillmentStats stats={stats} />

        <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
          >
            <option value="">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={filters.paymentStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, paymentStatus: e.target.value, page: 1 }))}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="released">Released</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={filters.limit}
            onChange={(e) => setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {loading && <div className="py-16 text-center font-semibold text-gray-600">Loading orders...</div>}
        {error && <div className="py-16 text-center font-semibold text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Fulfillment Log</h2>
            {orders.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                No orders assigned yet.
              </div>
            ) : (
              <>
                {orders.map((order) => (
                  <OrderFulfillmentCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateStatus}
                    onView={() => navigate(`/orders/${order.id}`)}
                  />
                ))}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-500">Total orders: {pagination.total}</div>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-3 py-1.5 rounded-md border border-gray-300 disabled:opacity-50"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      className="px-3 py-1.5 rounded-md border border-gray-300 disabled:opacity-50"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesaleOrders;
