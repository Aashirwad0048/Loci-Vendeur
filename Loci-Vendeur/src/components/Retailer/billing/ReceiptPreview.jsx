import React from "react";
import { Trash2 } from "lucide-react";

const ReceiptPreview = React.forwardRef(({ 
  items, 
  handleDeleteItem, 
  invoiceDate, 
  invoiceNum, 
  paymentMethod, 
  calculations,
  shopInfo,
}, ref) => {
  
  const { subtotal, discountAmount, discountPercent, taxAmount, taxPercent, total } = calculations;
  const stripPart = (text, part) => {
    if (!text || !part) return text;
    const escaped = String(part).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`\\s*,?\\s*${escaped}\\s*,?\\s*`, "ig"), ", ");
  };

  let streetAddress = shopInfo?.address || "";
  streetAddress = stripPart(streetAddress, shopInfo?.city);
  streetAddress = stripPart(streetAddress, shopInfo?.state);
  streetAddress = stripPart(streetAddress, shopInfo?.pincode);
  streetAddress = streetAddress.replace(/\s*,\s*,+/g, ", ").replace(/^,\s*|\s*,$/g, "").trim();

  const locationLine = [shopInfo?.city, shopInfo?.state, shopInfo?.pincode].filter(Boolean).join(", ");

  return (
    <div className="flex-grow bg-gray-200/50 p-4 rounded-xl overflow-auto flex justify-center items-start">
      <div ref={ref} className="print-area bg-white p-8 w-full max-w-[400px] shadow-lg text-gray-800"
        style={{ minHeight: "500px" }}
      >
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-extrabold uppercase tracking-widest">
            {shopInfo?.shopName || "Store"}
          </h1>
          {shopInfo?.ownerName ? <p className="text-xs text-gray-500 mt-1">Owner: {shopInfo.ownerName}</p> : null}
          {streetAddress ? <p className="text-xs text-gray-500">{streetAddress}</p> : null}
          {locationLine ? <p className="text-xs text-gray-500">{locationLine}</p> : null}
          {shopInfo?.phone ? <p className="text-xs text-gray-500">Tel: {shopInfo.phone}</p> : null}
          {shopInfo?.gstin ? <p className="text-xs text-gray-500">GSTIN: {shopInfo.gstin}</p> : null}
        </div>

        <div className="flex justify-between text-xs mb-4 text-gray-600">
          <div className="text-left">
            <p>Date: {invoiceDate.toLocaleDateString()}</p>
            <p>Time: {invoiceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">INV: {invoiceNum}</p>
            <p>Mode: {paymentMethod}</p>
          </div>
        </div>

        <table className="w-full text-xs mb-4">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2 w-8">Qty</th>
              <th className="text-right py-2 w-12">Total</th>
              <th className="w-6 no-print"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-[10px] text-gray-400">@ ₹{item.price}</div>
                </td>
                <td className="text-center align-top py-2">{item.qty}</td>
                <td className="text-right align-top py-2 font-medium">₹{item.qty * item.price}</td>
                <td className="text-right align-top py-2 pl-2 no-print">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400 italic">
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Discount ({discountPercent}%)</span>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tax ({taxPercent}%)</span>
            <span>+ ₹{taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold">Thank you for shopping!</p>
          <p className="text-[10px] text-gray-400 mt-1">Visit us again</p>
        </div>
      </div>
    </div>
  );
});

export default ReceiptPreview;
