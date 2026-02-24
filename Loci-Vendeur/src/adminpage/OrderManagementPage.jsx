import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import StatusFilters from '../components/admin/ordermanagement/StatusFilters';
import OrderRow from '../components/admin/ordermanagement/OrderRow';

const toUiOrder = (order) => ({
  id: order._id,
  displayId: `ORD-${String(order._id).slice(-6).toUpperCase()}`,
  retailer: order.retailerId?.name || 'Retailer',
  city: order.city,
  wholesaler: order.wholesalerId?.name || 'Unassigned',
  value: order.totalAmount,
  status: order.status,
  paymentStatus: order.paymentStatus,
  createdAt: order.createdAt,
  items: (order.items || []).map((it) => ({
    name: it.productId?.name || 'Product',
    qty: it.quantity,
    price: it.price,
  })),
});

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
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
    paymentStatus: '',
    city: '',
    from: '',
    to: '',
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
      if (activeTab !== 'All') {
        query.set('status', activeTab.toLowerCase());
      }

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
  }, [activeTab, filters]);

  const filteredOrders = useMemo(() => orders, [orders]);
  const counts = useMemo(() => ({ [activeTab]: pagination.total }), [activeTab, pagination.total]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <StatusFilters activeTab={activeTab} setActiveTab={handleTabChange} counts={counts} />

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={filters.paymentStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, paymentStatus: e.target.value, page: 1 }))}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="released">Released</option>
            <option value="refunded">Refunded</option>
          </select>
          <input
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Filter by city"
            value={filters.city}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value, page: 1 }))}
          />
          <input
            type="date"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={filters.from}
            onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value, page: 1 }))}
          />
          <input
            type="date"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={filters.to}
            onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value, page: 1 }))}
          />
          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={filters.limit}
            onChange={(e) => setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {loading && <div className="py-12 text-center font-semibold text-gray-600">Loading orders...</div>}
        {error && <div className="py-12 text-center font-semibold text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <OrderRow key={o.id} order={o} onClick={() => navigate(`/orders/${o.id}`)} />
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">Total orders: {pagination.total}</div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-50"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </button>
                <span className="text-sm font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-50"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderManagementPage;
