import React, { useEffect, useState } from 'react';
import InventorySummary from '../components/admin/monitoring/InventorySummary';
import InventoryTable from '../components/admin/monitoring/InventoryTable';
import InventoryAlertPanel from '../components/admin/monitoring/InventoryAlertPanel';
import API from '../api/axios';

const InventoryPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);

  const fetchProducts = async () => {
    const response = await API.get('/products?includeInactive=true');
    const raw = response.data?.data || [];
    setSupplies(
      raw.map((p) => {
        const wholesalerObj = p.wholesaler || (p.wholesalerId && typeof p.wholesalerId === 'object' ? p.wholesalerId : null);
        const wholesalerName =
          typeof p.wholesalerName === 'string'
            ? p.wholesalerName
            : wholesalerObj?.name || 'Wholesaler';
        const wholesalerId = wholesalerObj?.id || wholesalerObj?._id || p.wholesalerId || null;

        return {
          id: p._id,
          productName: p.name,
          wholesalerName,
          wholesaler: {
            id: wholesalerId,
            name: wholesalerName,
            city: p.wholesalerCity || wholesalerObj?.city || p.city || '-',
          },
          city: p.city,
          stock: p.stock,
          price: p.price,
          isActive: p.isActive,
          flagged: p.flagged,
        };
      })
    );
  };

  useEffect(() => {
    fetchProducts().catch((e) => console.error(e));
  }, []);

  const toggleActive = async (id) => {
    const target = supplies.find((s) => s.id === id);
    if (!target) return;
    await API.patch(`/products/${id}/status`, { isActive: !target.isActive, flagged: target.flagged });
    await fetchProducts();
  };

  const toggleFlag = async (id) => {
    const target = supplies.find((s) => s.id === id);
    if (!target) return;
    await API.patch(`/products/${id}/status`, { isActive: target.isActive, flagged: !target.flagged });
    await fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase ">Inventory Intelligence</h1>
        <p className="text-slate-500 font-medium">Global Supply Governance & Price Monitoring</p>
      </div>

      <InventorySummary supplies={supplies} />
      
      <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start">
        <InventoryTable 
          supplies={supplies} 
          onToggleActive={toggleActive} 
          onFlag={toggleFlag} 
          onWholesalerClick={(wholesaler) => setSelectedWholesaler(wholesaler)}
        />
        <InventoryAlertPanel supplies={supplies} />
      </div>

      {selectedWholesaler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Wholesaler Mini Info</h3>
              <button
                onClick={() => setSelectedWholesaler(null)}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</p>
                <p className="font-semibold text-slate-900">{selectedWholesaler.name || 'Wholesaler'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</p>
                <p className="font-semibold text-slate-900">{selectedWholesaler.city || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wholesaler ID</p>
                <p className="font-mono text-xs text-slate-600 break-all">{selectedWholesaler.id || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
