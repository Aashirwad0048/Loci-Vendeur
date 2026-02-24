import React, { useState, useEffect, useMemo } from "react";
import { Plus, Package, AlertTriangle, IndianRupee,Layers } from "lucide-react";
import SupplyCard from "../components/Wholesale/inventory/SupplyCard";
import AddSupplyModal from "../components/Wholesale/inventory/AddSupplyModal";
import API from "../api/axios";

const WholesaleInventory = () => {
  const [supplies, setSupplies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const currentUser = useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);

  const fetchInventory = async () => {
    if (!currentUser?.id) return;
    const response = await API.get(`/products?wholesalerId=${currentUser.id}&includeInactive=true`);
    const raw = response.data?.data || [];
    setSupplies(
      raw.map((item) => ({
        id: item._id,
        productName: item.name,
        category: item.category || "General",
        price: item.price,
        stock: item.stock,
        minOrderQty: item.minOrderQty || 1,
        image: item.image || "",
        city: item.city,
        isActive: item.isActive !== false,
      }))
    );
  };

  useEffect(() => {
    fetchInventory().catch((e) => console.error(e));
  }, [currentUser?.id]);

  // Logic to refresh data after adding a product
  const refreshInventory = () => {
    fetchInventory().catch((e) => console.error(e));
  };

  const handleEdit = (item) => {
    setEditingSupply(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(`Delete "${item.productName}" from inventory?`);
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${item.id}`);
      await refreshInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupply(null);
  };

  // Summary Computations
  const stats = {
    total: supplies.length,
    lowStock: supplies.filter(s => s.stock < 50).length,
    outOfStock: supplies.filter(s => s.stock === 0).length,
    value: supplies.reduce((acc, s) => acc + (s.price * s.stock), 0)
  };

  const filteredSupplies = useMemo(() => {
    if (statusFilter === "active") {
      return supplies.filter((s) => s.isActive);
    }
    if (statusFilter === "inactive") {
      return supplies.filter((s) => !s.isActive);
    }
    return supplies;
  }, [supplies, statusFilter]);

  return (
    <div className="pt-24 p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
              Bulk <span className="text-emerald-600">Stock</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">Manage your marketplace supply listings</p>
          </div>
          <button 
            onClick={() => {
              setEditingSupply(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={18} /> List New Product
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Listed Items", val: stats.total, icon: <Layers />, color: "text-blue-600" },
            { label: "Low Stock", val: stats.lowStock, icon: <AlertTriangle />, color: "text-amber-500" },
            { label: "Out of Stock", val: stats.outOfStock, icon: <Package />, color: "text-red-500" },
            { label: "Inventory Value", val: `₹${stats.value.toLocaleString()}`, icon: <IndianRupee />, color: "text-emerald-600" },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-emerald-200">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{card.val}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-gray-50 ${card.color}`}>{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Supply List */}
        <div className="space-y-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
              Supply Catalog
            </h2>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    statusFilter === tab.id
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {filteredSupplies.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest italic">No products in this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSupplies.map(item => (
                <SupplyCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddSupplyModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={refreshInventory} 
        wholesalerCity={currentUser?.city}
        initialData={editingSupply}
      />
    </div>
  );
};

export default WholesaleInventory;
