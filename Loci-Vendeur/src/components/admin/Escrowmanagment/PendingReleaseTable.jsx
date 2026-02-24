import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

const PendingReleaseTable = ({ orders, disputes = [], onRelease }) => {
  const pending = orders.filter((o) => o.status === 'delivered' && o.paymentStatus === 'paid');

  const getDisputeStatus = (orderId) => {
    return disputes.find((d) => d.orderId === orderId && (d.status === 'open' || d.status === 'under_review'));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 italic uppercase text-xs tracking-widest">Awaiting Payout Release</h3>
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{pending.length} Orders Ready</span>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white border-b border-slate-100">
          <tr className="text-xs text-slate-400 uppercase tracking-tighter">
            <th className="px-6 py-4 font-bold">Order ID</th>
            <th className="px-6 py-4 font-bold text-right">Value</th>
            <th className="px-6 py-4 font-bold text-right">Fee (3%)</th>
            <th className="px-6 py-4 font-bold text-right text-blue-600">Net Payout</th>
            <th className="px-6 py-4 font-bold text-center">Status/Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pending.map((order) => {
            const activeDispute = getDisputeStatus(order.orderId || order.id);
            const isBlocked = !!activeDispute;

            return (
              <tr key={order.orderId || order.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{order.displayId || order.id}</div>
                  <div className="text-[10px] text-slate-400">{order.wholesaler}</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm">₹{order.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-red-400 text-xs">-₹{(order.value * 0.03).toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-green-600 font-mono font-bold">₹{(order.value * 0.97).toFixed(2)}</td>

                <td className="px-6 py-4 text-center">
                  {isBlocked ? (
                    <div className="flex flex-col items-center gap-1">
                      <button disabled className="bg-slate-100 text-slate-400 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed flex items-center gap-2 border border-slate-200">
                        <ShieldAlert size={14} className="text-red-500" /> Payout Locked
                      </button>
                      <span className="text-[9px] text-red-500 font-black uppercase italic tracking-tighter">Active Dispute</span>
                    </div>
                  ) : (
                    <button onClick={() => onRelease(order.orderId || order.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition transform active:scale-95 shadow-md shadow-blue-100 flex items-center gap-2 mx-auto">
                      <CheckCircle size={14} /> Release Payout
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {pending.length === 0 && (
            <tr>
              <td colSpan="5" className="py-20 text-center text-slate-400 italic font-medium">
                No payouts pending release.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PendingReleaseTable;
