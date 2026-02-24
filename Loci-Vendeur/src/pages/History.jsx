import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import API from "../api/axios";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const toInvoiceRows = (bills, orders) => [
  ...bills.map((bill) => ({
    id: bill._id,
    displayId: bill.invoiceNumber || `INV-${String(bill._id).slice(-6).toUpperCase()}`,
    date: formatDate(bill.invoiceDate || bill.createdAt),
    sortAt: bill.invoiceDate || bill.createdAt,
    amount: Number(bill.total || 0),
    paymentStatus: bill.paymentStatus || "paid",
    type: "retail_bill",
  })),
  ...orders.map((order) => ({
    id: order._id,
    displayId: `ORD-${String(order._id).slice(-6).toUpperCase()}`,
    date: formatDate(order.createdAt),
    sortAt: order.createdAt,
    amount: Number(order.totalAmount || 0),
    paymentStatus: order.paymentStatus || "pending",
    type: "wholesale_order",
  })),
].sort((a, b) => new Date(b.sortAt || 0) - new Date(a.sortAt || 0));

const History = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billsRes, ordersRes] = await Promise.all([
          API.get("/bills?limit=200"),
          API.get("/orders?limit=200"),
        ]);
        const bills = billsRes.data?.data || [];
        const orders = ordersRes.data?.data || [];
        setRows(toInvoiceRows(bills, orders));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load invoice history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.displayId.toLowerCase().includes(q));
  }, [rows, searchTerm]);

  if (loading) {
    return <div className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 text-gray-500">Loading history...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Invoice History</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search Invoice/Order ID..."
          className="w-full md:w-1/3 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b">
            <tr>
              <th className="p-4">Invoice / Order</th>
              <th className="p-4 text-center">Type</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Payment</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{row.displayId}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.type === "retail_bill" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {row.type === "retail_bill" ? "Retail Bill" : "Wholesale Order"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{row.date}</td>
                  <td className="p-4 text-right font-medium">₹{row.amount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => navigate(row.type === "retail_bill" ? `/receipt/${row.id}` : `/orders/${row.id}`)}
                      className="flex items-center justify-center gap-1 mx-auto text-blue-600 hover:text-blue-800 transition"
                    >
                      <Eye size={16} /> <span className="text-sm font-medium">View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No bills/orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default History;
