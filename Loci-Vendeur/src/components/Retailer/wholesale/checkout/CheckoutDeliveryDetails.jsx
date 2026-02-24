import React from 'react';
import { MapPin } from 'lucide-react';

export default function CheckoutDeliveryDetails() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-blue-600" /> Delivery Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Shop Name</label>
          <input type="text" defaultValue="Kirana King Store" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Contact Name</label>
          <input type="text" defaultValue="Rajesh Kumar" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
          <input type="text" defaultValue="+91 98765 43210" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Address</label>
          <textarea rows="2" defaultValue="123 Market Road, Sector 4, New Delhi - 110001" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  );
}