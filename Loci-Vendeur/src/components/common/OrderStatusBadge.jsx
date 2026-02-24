import React from 'react';

const styles = {
  assigned: 'bg-amber-100 text-amber-700 border-amber-200',
  dispatched: 'bg-blue-100 text-blue-700 border-blue-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  placed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
}
