import React from "react";
import { Building2, ShieldCheck, Camera } from "lucide-react";

export default function WholesaleProfileHeader({ data, isEditing, toggleEdit, onLogoUpload }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          {data.logo ? (
            <img
              src={data.logo}
              alt={data.companyName || "Company Logo"}
              className="h-20 w-20 rounded-2xl object-cover shadow-xl"
            />
          ) : (
            <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Building2 size={36} />
            </div>
          )}
          {isEditing && (
            <label className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onLogoUpload}
              />
              <Camera size={14} />
            </label>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
              {data.companyName}
            </h2>
            <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{data.status}</span>
            </div>
          </div>
          <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-wide">Rep: {data.representative}</p>
        </div>
      </div>

      <button
        onClick={toggleEdit}
        className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
          isEditing 
          ? "bg-emerald-600 text-white shadow-emerald-100" 
          : "bg-black text-white shadow-gray-200"
        }`}
      >
        {isEditing ? "Save Profile" : "Edit Details"}
      </button>
    </div>
  );
}
