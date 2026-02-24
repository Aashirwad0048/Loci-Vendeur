import React from 'react';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';

const ProfileIdentity = ({ profile }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
    {/* Decorative background element */}
    <div className="absolute top-[-20px] right-[-20px] p-10 bg-emerald-50 rounded-full opacity-50" />
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200">
          <Building2 size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
            {profile.companyName}
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
              GST: {profile.gstin || profile.gst || "Not Provided"}
            </span>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{profile.warehouseCity || profile.city}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {profile.status || "Verified"} Supplier
        </span>
      </div>
    </div>
  </div>
);

export default ProfileIdentity;