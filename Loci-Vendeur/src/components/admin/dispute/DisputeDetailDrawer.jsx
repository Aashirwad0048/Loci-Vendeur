import React from 'react';
import { X, ShieldAlert, CheckCircle2, Ban, History } from 'lucide-react';

const DisputeDetailDrawer = ({ dispute, onClose, onResolve }) => {
  if (!dispute) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-black tracking-tight italic">Case {dispute.id}</h2>
            <p className="text-xs text-slate-500">Raised on {dispute.createdAt}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* DESCRIPTION */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Retailer Claim</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 italic">
              "{dispute.description}"
            </div>
          </section>

          {/* LOCK STATUS ALERT */}
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-center">
            <ShieldAlert className="text-red-600" size={24} />
            <div>
              <p className="text-sm font-bold text-red-900 uppercase italic">Escrow Locked</p>
              <p className="text-xs text-red-700 font-medium">Payout to Wholesaler is blocked until resolution.</p>
            </div>
          </div>

          {/* ADMIN JUDGMENT ACTIONS */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Judgment Room</h3>
            <div className="space-y-3">
              <button 
                onClick={() => onResolve(dispute.id, 'refunded')}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
              >
                <CheckCircle2 size={18} /> Approve Refund (Retailer Wins)
              </button>
              <button 
                onClick={() => onResolve(dispute.id, 'rejected')}
                className="w-full flex items-center justify-center gap-2 border border-red-600 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition"
              >
                <Ban size={18} /> Reject Dispute (Wholesaler Wins)
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold py-2"
                onClick={() => onResolve(dispute.id, 'under_review')}
              >
                Mark as Under Investigation
              </button>
            </div>
          </section>

          {/* AUDIT TRAIL */}
          <section className="pt-6 border-t border-slate-100">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><History size={14}/> Audit Trail</h3>
             <div className="text-xs space-y-3">
                <div className="flex justify-between text-slate-500"><span>System: Dispute Opened</span> <span>{dispute.createdAt}</span></div>
                <div className="flex justify-between text-slate-500"><span>Retailer: Evidence Uploaded</span> <span>Mar 2, 11:20 AM</span></div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetailDrawer;