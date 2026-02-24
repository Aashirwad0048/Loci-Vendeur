// src/components/wholesale/CartDrawer.jsx
import React from 'react';
import { ShoppingCart, X, Package, Minus, Plus, Trash2, CheckCircle, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, updateQty, removeFromCart, checkout }) {
  const totalAmount = cart.reduce((acc, item) => acc + (item.wholesalePrice * item.qty), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* 1. Backdrop - Clicking this also exits the drawer */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* 2. Drawer Panel - Added pt-[80px] to push content below Navbar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col pt-[80px] animate-in slide-in-from-right duration-300">
        
        {/* --- Header Section --- */}
        <div className="px-6 flex justify-between items-center border-b pb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <ShoppingCart className="text-blue-600" size={20} /> 
              Your Cart ({cart.length})
            </h2>
            <button 
              onClick={onClose} 
              className="text-xs text-blue-600 font-bold hover:underline mt-1 flex items-center gap-1"
            >
              Continue Shopping <ArrowRight size={12} />
            </button>
          </div>
          
          {/* CRITICAL: Close Button positioned clearly */}
          <button 
            onClick={onClose} 
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all text-gray-600 shadow-sm active:scale-90"
            aria-label="Close Cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-lg p-1 border" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">₹{item.wholesalePrice} / unit</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1" disabled={item.qty <= item.minOrderQty}><Minus size={12} /></button>
                      <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-right font-bold text-sm text-gray-900">₹{(item.wholesalePrice * item.qty).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {/* --- Footer Summary --- */}
        <div className="p-6 border-t bg-gray-50 space-y-4">
          <div className="flex justify-between items-center text-xl font-black">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Total Payable</span>
            <span className="text-2xl">₹{totalAmount.toLocaleString()}</span>
          </div>
          <button 
            onClick={checkout} 
            disabled={cart.length === 0} 
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl flex justify-center items-center gap-2 active:scale-95"
          >
            <CheckCircle size={20} /> Checkout Order
          </button>
        </div>
      </div>
    </div>
  );
}