import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

import ProductStats from '../components/Retailer/products/ProductStats';
import ProductTable from '../components/Retailer/products/ProductTable';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchRetailInventory = async () => {
      try {
        const response = await API.get('/orders?limit=100&status=delivered');
        const orders = response.data?.data || [];

        const inventoryMap = new Map();

        for (const order of orders) {
          for (const item of order.items || []) {
            const id = item.productId?._id || item.productId;
            const name = item.productId?.name || 'Product';
            if (!id) continue;

            if (!inventoryMap.has(String(id))) {
              inventoryMap.set(String(id), {
                id: String(id),
                name,
                price: Number(item.price || 0),
                stock: 0,
                category: item.productId?.category || 'Purchased',
                image: item.productId?.image || null,
              });
            }

            const existing = inventoryMap.get(String(id));
            existing.stock += Number(item.quantity || 0);
          }
        }

        setProducts(Array.from(inventoryMap.values()));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchRetailInventory();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 text-gray-500">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Inventory</h1>
          <p className="text-gray-500 mt-1">Delivered stock in your store. Reorder low items from wholesale market.</p>
        </div>

        {/* 1. Add Product Button now goes DIRECTLY to Wholesale Market */}
        <button 
            onClick={() => navigate('/wholesale')}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-gray-200 font-medium"
        >
            <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <ProductStats products={products} />

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button className="flex items-center gap-2 text-gray-600 hover:text-black font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition">
          <Filter size={18} />
          <span className="text-sm">Filters</span>
        </button>
      </div>

      <ProductTable 
        products={paginatedProducts} 
        handleSort={handleSort}
        openModal={() => {}}
        confirmDelete={() => {}}
        readOnly
      />

      {processedProducts.length > 0 && (
         <div className="flex items-center justify-between p-4 mt-4 bg-white rounded-xl border border-gray-200 shadow-sm">
           <span className="text-sm text-gray-500">
             Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
           </span>
           <div className="flex gap-2">
             <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
             >
               <ChevronLeft size={18} />
             </button>
             <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => c + 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
             >
               <ChevronRight size={18} />
             </button>
           </div>
         </div>
      )}

    </div>
  );
};

export default Products;
