import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import StatusBadge from '../usermanagement/StatusBadge';

const OrderRow = ({ order, onClick }) => {
  const hoursElapsed = (Date.now() - new Date(order.createdAt)) / 3600000;
  const isStuck = order.status === 'assigned' && hoursElapsed > 48;

  return (
    <tr onClick={() => onClick(order)} className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
      <td className="px-6 py-4">
        <div className="font-bold text-blue-600">{order.displayId || order.id}</div>
        <div className="text-sm font-semibold">{order.retailer}</div>
        <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> {order.city}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium">{order.wholesaler || <span className="text-orange-500 italic">Unassigned</span>}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <StatusBadge status={order.status} />
          {isStuck && (
            <span className="text-[10px] font-black text-red-600 flex items-center gap-1 animate-pulse">
              <AlertCircle size={10} /> STUCK {Math.floor(hoursElapsed)}H
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right font-mono font-bold">₹{Number(order.value || 0).toLocaleString()}</td>
    </tr>
  );
};

export default OrderRow;
