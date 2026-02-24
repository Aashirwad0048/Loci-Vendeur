import React from "react";

export default function ShopInfo({ data, handleChange, isEditing }) {
  // Helper for input styling
  const inputClass = `w-full p-2.5 rounded-lg border bg-white transition-all 
    ${isEditing 
      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
      : "border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"}`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-md">🏪</span> 
        Shop Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Shop Name</label>
          <input
            type="text"
            name="shopName"
            value={data.shopName}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={data.ownerName}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Contact Number</label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            disabled
            className="w-full p-2.5 rounded-lg border border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Shop Address</label>
          <textarea
            name="address"
            rows="3"
            value={data.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${inputClass} resize-none`}
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
          <input
            type="text"
            name="city"
            value={data.city || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State</label>
          <input
            type="text"
            name="state"
            value={data.state || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={data.pincode || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">GST Identification Number</label>
          <input
            type="text"
            name="gstNumber"
            value={data.gstNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
