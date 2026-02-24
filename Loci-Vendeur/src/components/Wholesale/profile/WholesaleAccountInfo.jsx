import React from "react";
import { Calendar, UserCheck, Shield, LogOut, KeyRound } from "lucide-react";

export default function WholesaleAccountInfo({ data, onChangePassword, onLogout }) {
  const Item = ({ icon, label, val }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 text-gray-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-black text-gray-900 italic tracking-tight">{val}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account Metadata</h3>
      <div className="space-y-1">
        <Item icon={<UserCheck size={14} />} label="Security" val="Level 3 Access" />
        <Item icon={<Calendar size={14} />} label="Member Since" val={data.joinedDate} />
        <Item icon={<Shield size={14} />} label="Node" val="Region-North" />
      </div>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onChangePassword}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <KeyRound size={14} />
          Change Password
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="w-full px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-wider hover:bg-red-100 transition flex items-center justify-center gap-2"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}
