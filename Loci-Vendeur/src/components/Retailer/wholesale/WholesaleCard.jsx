import React from 'react';
import { TrendingDown, Truck } from 'lucide-react';

export default function WholesaleCard({ item, onClick, onSellerInfo }) {
  const sellerLabel =
    typeof item.supplier === 'string'
      ? item.supplier
      : item.supplier?.name || item.wholesaler?.name || 'Wholesaler';

  return (
    <div onClick={onClick} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative">
      {item.currentStoreStock < 10 && (
        <div className="absolute top-0 left-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-bold py-1 px-3 text-center border-b border-amber-200 z-10">
          ⚠ Low Retail Inventory: {item.currentStoreStock} left!
        </div>
      )}

      <div className="h-48 w-full bg-white p-6 relative flex items-center justify-center border-b border-gray-50 mt-4">
        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-1 rounded bg-white/90 shadow-sm border border-gray-100">
          {item.supplierStock < 50 ? <span className="text-red-500">● Low Stock</span> : <span className="text-green-600">● In Stock</span>}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">{item.brand}</span>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
            <TrendingDown size={12} /> {Math.round(((item.price - item.wholesalePrice)/item.price)*100)}% Margin
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{item.name}</h3>
        <p className="text-xs text-gray-500 mb-2">
          Seller:{' '}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSellerInfo?.();
            }}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            {sellerLabel}
          </button>
        </p>

        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 border-b border-gray-100 pb-3">
          <Truck size={14} className="text-blue-500" /><span>2–3 Day Delivery | Free &gt; ₹5k</span>
        </div>
        
        <div className="mt-auto bg-gray-50 p-3 rounded-lg border border-gray-100 group-hover:bg-blue-50/30 transition-colors">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Buy At</span>
                    <span className="text-xl font-bold text-black leading-none">₹{item.wholesalePrice}</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">MOQ</span>
                    <span className="text-sm font-bold text-gray-800">{item.minOrderQty} Units</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
