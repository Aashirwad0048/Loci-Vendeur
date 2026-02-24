import React from 'react';
import { XCircle, ArrowRightLeft, History } from 'lucide-react';

const OrderInvestigationDrawer = ({ order, onClose, onAction }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold italic">Investigation: {order.displayId || order.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><XCircle size={24} className="text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="grid grid-cols-2 gap-3">
            <button onClick={() => onAction(order.id, 'reassign')} className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
              <ArrowRightLeft size={18} /> Reassign
            </button>
            <button onClick={() => onAction(order.id, 'cancel')} className="flex items-center justify-center gap-2 border border-red-600 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition">
              <XCircle size={18} /> Cancel Order
            </button>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={14}/> Audit Trail</h3>
          </section>

          <section className="bg-slate-50 p-5 rounded-2xl border">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Escrow Supervision</h3>
            <div className="flex justify-between font-bold text-lg">
              <span>Retailer Paid:</span> <span>₹{Number(order.value || 0).toLocaleString()}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderInvestigationDrawer;
