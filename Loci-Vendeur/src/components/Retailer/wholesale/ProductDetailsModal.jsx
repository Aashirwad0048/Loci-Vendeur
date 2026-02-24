import React, { useState } from 'react';
import { X, Package, Star, Plus, Minus } from 'lucide-react';

export default function ProductDetailsModal({ product, onClose, onAddToCart }) {
  // Internal State for the modal logic
  const [qtyInput, setQtyInput] = useState(String(product.minOrderQty));
  const [sellingPrice, setSellingPrice] = useState(product.price); // Default MRP

  const clampQty = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return product.minOrderQty;
    return Math.max(product.minOrderQty, Math.floor(parsed));
  };

  const qty = clampQty(qtyInput);

  // Calculate Profit
  const estimatedProfit = (sellingPrice - product.wholesalePrice) * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition z-10"><X size={20} /></button>

        {/* Left: Image & Bulk Pricing */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 border-r border-gray-100 flex flex-col">
          <div className="flex-1 flex items-center justify-center mb-6">
            <img src={product.image} alt={product.name} className="max-h-[250px] object-contain mix-blend-multiply" />
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Package size={16} className="text-blue-500" /> Bulk Pricing Tiers</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-blue-50 rounded border border-blue-100">
                <span>{product.minOrderQty} - 49 units</span><span className="font-bold">₹{product.wholesalePrice}</span>
              </div>
              <div className="flex justify-between p-2 text-gray-500">
                <span>50 - 99 units</span><span className="font-bold">₹{Math.floor(product.wholesalePrice * 0.95)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Calculation */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{product.category}</span>
            <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold"><Star size={14} fill="currentColor" /> {product.rating}</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span className={product.supplierStock < 50 ? "text-red-500" : "text-green-600"}>{product.supplierStock} Available</span>
          </div>

          {/* Margin Calculator */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Margin Calculator</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Selling Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full pl-6 pr-3 py-2 border rounded-lg text-sm font-bold focus:ring-2 focus:ring-black outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Net Profit</label>
                <div className={`p-2 rounded-lg text-sm font-bold text-center border ${estimatedProfit >= 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {estimatedProfit >= 0 ? '+' : ''}₹{estimatedProfit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setQtyInput(String(Math.max(product.minOrderQty, qty - 1)))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={product.minOrderQty}
                  step="1"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  onBlur={() => setQtyInput(String(clampQty(qtyInput)))}
                  className="w-16 h-8 text-center text-sm font-bold rounded bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => setQtyInput(String(qty + 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg font-bold flex items-center justify-center gap-2"
              onClick={() => onAddToCart(product, qty)}>
              <Plus size={20} /> Add to Order (₹{(product.wholesalePrice * qty).toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
