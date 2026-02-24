import React from 'react';
import { EyeOff, Flag, CheckCircle2, AlertCircle } from 'lucide-react';

const InventoryTable = ({ supplies, onToggleActive, onFlag, onWholesalerClick }) => {
  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <th className="px-6 py-4">Product & Wholesaler</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Stock Level</th>
            <th className="px-6 py-4">Unit Price</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {supplies.map(item => (
            <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${!item.isActive ? 'bg-slate-50/50' : ''}`}>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{item.productName}</div>
                <button
                  type="button"
                  onClick={() => onWholesalerClick?.(item.wholesaler)}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  {item.wholesalerName}
                </button>
              </td>
              <td className="px-6 py-4 text-slate-500 font-medium">{item.city}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${item.stock < 20 ? 'text-red-500' : 'text-slate-700'}`}>
                    {item.stock}
                  </span>
                  {item.stock < 20 && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                </div>
              </td>
              <td className="px-6 py-4 font-mono font-bold text-slate-900">
                ₹{item.price.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                {item.isActive ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase">
                    <CheckCircle2 size={12} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase">
                    <EyeOff size={12} /> Hidden
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => onToggleActive(item.id)}
                    className={`p-2 rounded-lg border transition-all ${item.isActive ? 'hover:bg-red-50 text-slate-400 hover:text-red-600 border-slate-200' : 'bg-green-600 text-white border-green-600'}`}
                    title={item.isActive ? "Deactivate" : "Activate"}
                  >
                    {item.isActive ? <EyeOff size={16} /> : <CheckCircle2 size={16} />}
                  </button>
                  <button 
                    onClick={() => onFlag(item.id)}
                    className={`p-2 rounded-lg border border-slate-200 hover:bg-orange-50 transition-all ${item.flagged ? 'bg-orange-500 text-white border-orange-500' : 'text-slate-400 hover:text-orange-500'}`}
                  >
                    <Flag size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default InventoryTable;  
