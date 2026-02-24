import React from 'react';
import { Edit3, Trash2, MapPin, Package } from 'lucide-react';

const SupplyCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      {/* Status Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${item.isActive ? (item.stock > 0 ? 'bg-emerald-500' : 'bg-red-500') : 'bg-slate-400'}`} />
      
      {/* --- Image Section --- */}
      <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.productName} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
            <Package size={32} strokeWidth={1.5} />
            <span className="text-[10px] font-black uppercase tracking-tighter">No Image Available</span>
          </div>
        )}
        
        {/* Subtle Overlay for Price on Image (Optional) */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
          <span className="text-sm font-black text-emerald-600">₹{item.price}</span>
        </div>
      </div>
      {/* --------------------- */}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg leading-tight">{item.productName}</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
        </div>
        {!item.isActive && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
            Hidden
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">In Stock</p>
          <p className={`text-sm font-bold ${item.stock < 50 ? 'text-amber-600' : 'text-gray-800'}`}>{item.stock} Units</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min. Order (MOQ)</p>
          <p className="text-sm font-bold text-gray-800">{item.minOrderQty} Units</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin size={12} />
          <span className="text-[10px] font-bold uppercase">{item.city}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(item)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-gray-50 hover:bg-blue-50 rounded-lg"
            title="Edit product"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete?.(item)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg"
            title="Delete product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplyCard;
