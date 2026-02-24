import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WholesaleHeader({ cartCount, onOpenCart }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <button onClick={() => navigate('/products')} className="flex items-center text-sm text-gray-500 hover:text-black mb-2 transition-colors group">
          <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
        </button>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wholesale Market</h1>
        <p className="text-gray-500 mt-1">Restock your inventory with exclusive bulk rates.</p>
      </div>
      <button onClick={onOpenCart} className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-3 shadow-lg transition-all active:scale-95">
        <ShoppingCart size={20} />
        <div className="flex flex-col items-start leading-none">
          <span className="text-xs text-gray-400 font-medium">Your Order</span>
          <span className="font-bold">{cartCount} Items</span>
        </div>
      </button>
    </div>
  );
}