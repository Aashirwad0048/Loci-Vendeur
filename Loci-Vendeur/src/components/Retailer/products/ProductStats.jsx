import React from 'react';
import { AlertCircle } from 'lucide-react';

const ProductStats = ({ products }) => {
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      <StatCard label="Total Products" value={totalProducts} color="blue" />
      <StatCard label="Low Stock (<10)" value={lowStock} color="orange" />
      <StatCard label="Out of Stock" value={outOfStock} color="red" />
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    red: "text-red-600 bg-red-50 border-red-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };
  
  return (
    <div className={`p-4 rounded-xl border ${colors[color].replace('text-', 'border-')} bg-white shadow-sm flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[color]}`}>
        <AlertCircle size={20} />
      </div>
    </div>
  );
};

export default ProductStats;