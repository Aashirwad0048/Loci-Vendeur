import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function WholesaleFilters({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, sortBy, setSortBy }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col xl:flex-row gap-4 items-center justify-between sticky top-20 z-40">
      <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === cat ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group w-full md:w-auto">
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><ChevronDown size={16} /></div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none w-full md:w-48 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black cursor-pointer font-medium">
          <option value="default">Relevance</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="discount">Highest Discount</option>
          <option value="moq">Low MOQ</option>
        </select>
      </div>
    </div>
  );
}