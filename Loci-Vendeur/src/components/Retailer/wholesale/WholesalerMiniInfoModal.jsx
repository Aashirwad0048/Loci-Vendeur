import React from 'react';

export default function WholesalerMiniInfoModal({ wholesaler, onClose }) {
  if (!wholesaler) return null;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">Wholesaler Mini Info</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="space-y-3 px-5 py-4 text-sm">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</p>
            <p className="font-semibold text-gray-900">{wholesaler.name || 'Wholesaler'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</p>
            <p className="font-semibold text-gray-900">{wholesaler.city || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wholesaler ID</p>
            <p className="font-mono text-xs text-gray-600 break-all">{wholesaler.id || '-'}</p>
          </div>
          <p className="rounded-lg bg-blue-50 p-3 text-xs font-medium text-blue-700">
            Seller identity and location confirmed from backend product source.
          </p>
        </div>
      </div>
    </div>
  );
}
