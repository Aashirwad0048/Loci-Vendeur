import React from 'react';
import { AlertTriangle, User, Store } from 'lucide-react';

const DisputeTable = ({ disputes, onSelect }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <th className="px-6 py-4">Dispute Info</th>
            <th className="px-6 py-4">Parties Involved</th>
            <th className="px-6 py-4">Reason</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {disputes.map(dispute => (
            <tr key={dispute.id} className="hover:bg-slate-50/80 cursor-pointer transition-colors" onClick={() => onSelect(dispute)}>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{dispute.id}</div>
                <div className="text-xs text-blue-600 font-medium">Order: {dispute.orderId}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <User size={12} className="text-slate-400" /> {dispute.raisedBy}: {dispute.retailerName}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Store size={12} className="text-slate-400" /> Target: {dispute.wholesalerName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-700 font-medium italic">"{dispute.reason}"</span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={dispute.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                  Investigate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    open: 'bg-red-100 text-red-700',
    under_review: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default DisputeTable;
