import React from 'react';
import { Wallet, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPayment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Wallet size={20} className="text-green-600" /> Payment Method
      </h2>
      <div className="space-y-3">
        
        <p className="text-xs text-gray-500">Online methods are processed via Razorpay.</p>

        {/* UPI */}
        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-black focus:ring-black" />
            <div>
              <span className="block font-semibold text-gray-900">UPI / QR Code</span>
              <span className="block text-xs text-gray-500">Google Pay, PhonePe, Paytm</span>
            </div>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/2704/2704332.png" alt="UPI" className="h-6 opacity-70" />
        </label>

        {/* COD */}
        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-black focus:ring-black" />
            <div>
              <span className="block font-semibold text-gray-900">Cash on Delivery</span>
              <span className="block text-xs text-gray-500">Pay cash upon receipt of goods</span>
            </div>
          </div>
          <Truck size={20} className="text-gray-400" />
        </label>

        {/* Net Banking */}
        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="w-4 h-4 text-black focus:ring-black" />
            <div>
              <span className="block font-semibold text-gray-900">Net Banking</span>
              <span className="block text-xs text-gray-500">HDFC, ICICI, SBI, Axis</span>
            </div>
          </div>
          <CreditCard size={20} className="text-gray-400" />
        </label>

        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-gray-400" />
            <div>
              <span className="block font-semibold text-gray-700">Cards / Wallets / UPI</span>
              <span className="block text-xs text-gray-500">Available inside Razorpay popup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
