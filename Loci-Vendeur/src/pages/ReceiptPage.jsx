import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import API from "../api/axios";

const formatDateTime = (value) => {
  if (!value) return { date: "-", time: "-" };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: "-", time: "-" };
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

const ReceiptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const receiptRef = useRef();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await API.get(`/bills/${id}`);
        setBill(response.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Invoice-${bill?.invoiceNumber || id}`,
  });

  const meta = useMemo(() => formatDateTime(bill?.invoiceDate || bill?.createdAt), [bill]);
  const shopName = bill?.shopSnapshot?.shopName || "Store";
  const ownerName = bill?.shopSnapshot?.ownerName || "";
  const addressLine = [
    bill?.shopSnapshot?.address,
    bill?.shopSnapshot?.city,
    bill?.shopSnapshot?.state,
    bill?.shopSnapshot?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  if (loading) return <div className="min-h-screen bg-gray-100 p-6 text-gray-500">Loading receipt...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-6 text-red-600">{error}</div>;
  if (!bill) return <div className="min-h-screen bg-gray-100 p-6 text-gray-600">Invoice Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-md flex justify-between items-center mb-6 no-print">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black">
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={handlePrint}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 shadow-lg"
        >
          <Printer size={18} /> Print
        </button>
      </div>

      <div
        ref={receiptRef}
        className="bg-white w-full max-w-md p-8 rounded-none md:rounded-xl shadow-none md:shadow-xl border-none md:border text-gray-800"
      >
        <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-black">{shopName}</h1>
          {ownerName ? <p className="text-sm text-gray-500 mt-2">Owner: {ownerName}</p> : null}
          {addressLine ? <p className="text-sm text-gray-500 mt-1">{addressLine}</p> : null}
          {bill?.shopSnapshot?.phone ? <p className="text-xs text-gray-500">Tel: {bill.shopSnapshot.phone}</p> : null}
          {bill?.shopSnapshot?.gstin ? <p className="text-xs text-gray-500">GSTIN: {bill.shopSnapshot.gstin}</p> : null}
        </div>

        <div className="flex justify-between text-sm mb-6 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <p className="text-gray-500">Invoice No</p>
            <p className="font-bold text-black text-lg">{bill.invoiceNumber}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-gray-500">Date & Time</p>
            <p className="font-medium text-black">
              {meta.date}, {meta.time}
            </p>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead className="border-b border-gray-200 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(bill.items || []).map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td className="py-3 font-medium text-gray-900">{item.name}</td>
                <td className="py-3 text-center text-gray-600">{item.qty}</td>
                <td className="py-3 text-right font-medium text-gray-900">₹{Number(item.lineTotal || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 pt-4 border-t-2 border-dashed border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₹{Number(bill.subtotal || 0).toFixed(2)}</span>
          </div>
          {Number(bill.discountAmount || 0) > 0 ? (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({Number(bill.discountPercent || 0)}%)</span>
              <span>- ₹{Number(bill.discountAmount || 0).toFixed(2)}</span>
            </div>
          ) : null}
          {Number(bill.taxAmount || 0) > 0 ? (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax ({Number(bill.taxPercent || 0)}%)</span>
              <span>+ ₹{Number(bill.taxAmount || 0).toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-xl font-bold text-black pt-2 border-t border-gray-100 mt-2">
            <span>Total</span>
            <span>₹{Number(bill.total || 0).toLocaleString()}</span>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">Paid via {bill.paymentMethod || "Cash"}</div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-10">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
