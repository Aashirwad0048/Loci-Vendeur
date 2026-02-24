import React from "react";
import { MapPin, Briefcase } from "lucide-react";

export default function WholesaleBusinessInfo({ data, handleChange, isEditing }) {
  const inputBase = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm font-bold";
  const labelBase = "text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block";

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
        <Briefcase size={18} className="text-emerald-500" />
        <h3 className="font-black uppercase italic tracking-tighter text-gray-900">Corporate & Warehouse</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelBase}>Legal Entity Name</label>
          <input name="companyName" value={data.companyName} onChange={handleChange} disabled={!isEditing} className={`${inputBase} ${isEditing ? "focus:ring-2 focus:ring-emerald-500 bg-white" : "opacity-70"}`} />
        </div>
        <div>
          <label className={labelBase}>GSTIN (Verified)</label>
          <input name="gstin" value={data.gstin} onChange={handleChange} disabled={!isEditing} className={`${inputBase} uppercase ${isEditing ? "focus:ring-2 focus:ring-emerald-500 bg-white" : "opacity-70"}`} />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className={labelBase}>Physical Address</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="warehouseAddress" value={data.warehouseAddress} onChange={handleChange} disabled={!isEditing} className={`${inputBase} pl-12 ${isEditing ? "focus:ring-2 focus:ring-emerald-500 bg-white" : "opacity-70"}`} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelBase}>Warehouse City</label>
            <input name="warehouseCity" value={data.warehouseCity} onChange={handleChange} disabled={!isEditing} className={`${inputBase} ${isEditing ? "focus:ring-2 focus:ring-emerald-500 bg-white" : "opacity-70"}`} />
          </div>
          <div>
            <label className={labelBase}>Pincode</label>
            <input name="pincode" value={data.pincode} onChange={handleChange} disabled={!isEditing} className={`${inputBase} ${isEditing ? "focus:ring-2 focus:ring-emerald-500 bg-white" : "opacity-70"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}