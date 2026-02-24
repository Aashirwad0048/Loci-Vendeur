import React from 'react';
import { Loader2, CheckCircle, Truck } from 'lucide-react';

export default function CheckoutSummary({ cart, subtotal, shipping, tax, total, loading, onPlaceOrder }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-gray-500">{item.qty}x</span>
              <span className="text-gray-700 line-clamp-1 w-40">{item.name}</span>
            </div>
            <span className="font-medium">₹{(item.wholesalePrice * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-300 pt-4 space-y-2 mb-6">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>GST (18%)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-black border-t pt-2 mt-2">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={onPlaceOrder}
        disabled={loading}
        className="w-full py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
        {loading ? "Processing..." : "Place Order"}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
         <Truck size={12} />
         <span>Estimated Delivery: 2-3 Days</span>
      </div>
    </div>
  );
}