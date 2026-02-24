import React from 'react';
import { ArrowRight, CheckCircle2, Eye } from 'lucide-react';
import OrderStatusBadge from '../../common/OrderStatusBadge';

const OrderFulfillmentCard = ({ order, onUpdateStatus, onView }) => {
  const total = order.totalAmount || 0;
  const fee = (total * 0.05).toFixed(0);
  const payout = (total * 0.95).toLocaleString();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-gray-900">{order.displayId || order.id}</span>
            <OrderStatusBadge status={order.status} />
            <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Platform Assigned</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retailer</p>
              <p className="font-bold text-gray-800">{order.retailerName || 'Retailer'}</p>
              <p className="text-xs text-gray-500 font-medium italic">{order.city}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Total</p>
              <p className="font-bold text-gray-800">₹{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="lg:w-64 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
            <span>Service Fee (5%)</span>
            <span>-₹{fee}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-dashed border-gray-300 flex justify-between items-center">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Your Payout</span>
            <span className="text-xl font-black text-gray-900">₹{payout}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-stretch lg:items-end">
          <button
            onClick={onView}
            className="w-full lg:w-auto px-6 py-3 border border-gray-300 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>

          {order.status === 'assigned' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'dispatched')}
              className="w-full lg:w-auto px-8 py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              Dispatch Order <ArrowRight size={16} />
            </button>
          )}
          {order.status === 'dispatched' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="w-full lg:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              Mark Delivered <CheckCircle2 size={16} />
            </button>
          )}
          {order.status === 'delivered' && (
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 italic">
              Payment Released <CheckCircle2 size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFulfillmentCard;
