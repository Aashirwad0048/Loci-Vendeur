import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function PayoutSettings({ data, handleChange, isEditing }) {
  const inputBase = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-xs font-bold";
  const labelBase = "text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-1 block";

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Escrow Settlement</h3>
        <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
          <CheckCircle2 size={12} /> KYC Linked
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelBase}>Bank Name</label>
          <input name="bankName" value={data.bankName} onChange={handleChange} disabled={!isEditing} className={inputBase} />
        </div>
        <div>
          <label className={labelBase}>Account Number</label>
          <input name="accountNumber" value={isEditing ? data.accountNumber : `•••• •••• ${data.accountNumber.slice(-4)}`} onChange={handleChange} disabled={!isEditing} className={inputBase} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelBase}>IFSC Code</label>
            <input name="ifscCode" value={data.ifscCode} onChange={handleChange} disabled={!isEditing} className={`${inputBase} uppercase`} />
          </div>
          <div>
            <label className={labelBase}>Payout Frequency</label>
            <div className="text-xs font-black italic text-emerald-600 mt-2 uppercase tracking-tighter">
              {data.payoutFrequency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}