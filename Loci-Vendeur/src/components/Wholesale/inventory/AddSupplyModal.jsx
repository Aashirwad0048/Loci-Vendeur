import React, { useEffect, useState } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import API from '../../../api/axios';

const defaultFormState = {
  productName: '',
  category: 'FMCG',
  price: '',
  stock: '',
  minOrderQty: '',
  image: '',
  active: true,
};

const AddSupplyModal = ({ isOpen, onClose, onSuccess, wholesalerCity, initialData = null }) => {
  
  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (!isOpen) return;

    if (isEditing) {
      setFormData({
        productName: initialData.productName || '',
        category: initialData.category || 'FMCG',
        price: initialData.price ?? '',
        stock: initialData.stock ?? '',
        minOrderQty: initialData.minOrderQty ?? 1,
        image: initialData.image || '',
        active: true,
      });
      return;
    }

    setFormData(defaultFormState);
  }, [isOpen, isEditing, initialData]);

  if (!isOpen) return null;

  // Function to handle image conversion to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.productName,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        minOrderQty: Number(formData.minOrderQty),
        city: wholesalerCity || 'Delhi',
        image: formData.image || null,
      };

      if (isEditing) {
        await API.put(`/products/${initialData.id}`, payload);
      } else {
        await API.post('/products', payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || (isEditing ? 'Failed to update product' : 'Failed to create product'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            {isEditing ? 'Edit' : 'List New'} <span className="text-emerald-600">Bulk Stock</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          
          {/* --- Image Upload Section --- */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-300" size={24} />
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
          </div>
          {/* --------------------------- */}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Product Name</label>
            <input required type="text" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. Fortune Refined Oil 15L" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Bulk Price (per unit)</label>
              <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="₹" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm">
                <option value="FMCG">FMCG</option>
                <option value="Electronics">Electronics</option>
                <option value="Medical">Medical Supplies</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Total Bulk Stock</label>
              <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Units" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">MOQ (Min. Order)</label>
              <input required type="number" value={formData.minOrderQty} onChange={(e) => setFormData({...formData, minOrderQty: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Units" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            <Save size={18} /> {loading ? (isEditing ? 'Updating...' : 'Saving...') : isEditing ? 'Update Listing' : 'Confirm Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSupplyModal;
