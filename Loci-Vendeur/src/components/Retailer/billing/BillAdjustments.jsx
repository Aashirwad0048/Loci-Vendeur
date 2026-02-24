import React from "react";
import { Calculator } from "lucide-react";

const BillAdjustments = ({
  taxPercent,
  setTaxPercent,
  discountPercent,
  setDiscountPercent,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  total,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator size={20} className="text-purple-600" /> Adjustments
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold">Tax (GST %)</label>
          <div className="flex items-center border rounded-lg overflow-hidden mt-1">
            <input
              type="number"
              min="0"
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value))}
              className="w-full p-2 outline-none"
            />
            <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold">Discount (%)</label>
          <div className="flex items-center border rounded-lg overflow-hidden mt-1">
            <input
              type="number"
              min="0"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full p-2 outline-none"
            />
            <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm">%</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">
          Payment Mode
        </label>
        <div className="flex gap-2">
          {["Cash", "UPI", "Card"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                paymentMethod === method
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === "Cash" && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-green-800 font-medium text-sm">Cash Calculator</p>
            <p className="text-xs text-green-600">Enter amount received</p>
          </div>
          <div className="text-right">
            <input
              type="number"
              placeholder="₹0"
              className="w-24 p-2 border border-green-300 rounded text-right mb-1"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
            />
            {cashReceived && (
              <p className="text-sm font-bold text-green-700">
                Return: ₹{Math.max(cashReceived - total, 0)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillAdjustments;