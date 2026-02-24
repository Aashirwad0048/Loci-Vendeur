import React from 'react';
// Added 'Flag' and 'AlertTriangle' to the imports
import { ShoppingCart, Ban, Zap, Flag, AlertTriangle } from 'lucide-react';

const InventoryAlertPanel = ({ supplies = [] }) => {
  // Logic: Filter for critical supply issues
  const critical = supplies.filter(s => s.stock === 0);
  const anomalies = supplies.filter(s => s.flagged);
  const lowStock = supplies.filter(s => s.stock > 0 && s.stock < 20);

  return (
    <div className="w-full shrink-0 xl:ml-8 xl:w-80 flex flex-col gap-6">
      {/* Dark Alert Card */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400 flex items-center gap-2">
          <Zap size={14} className="text-yellow-400 fill-yellow-400" /> System Alerts
        </h3>
        
        <div className="space-y-4">
          {/* Critical Stockout */}
          <div className="flex items-start gap-3">
            <div className="bg-red-500/20 p-2 rounded text-red-400">
              <Ban size={16}/>
            </div>
            <div>
              <p className="text-sm font-bold">{critical.length} Stockouts</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tight">Immediate Action Required</p>
            </div>
          </div>
          
          {/* Flagged Pricing/Quality */}
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/20 p-2 rounded text-orange-400">
              <Flag size={16}/>
            </div>
            <div>
              <p className="text-sm font-bold">{anomalies.length} Flagged Items</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tight">Pending Price Review</p>
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className="flex items-start gap-3">
            <div className="bg-yellow-500/20 p-2 rounded text-yellow-400">
              <AlertTriangle size={16}/>
            </div>
            <div>
              <p className="text-sm font-bold">{lowStock.length} Low Stock Alerts</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tight">Replenishment needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Distribution Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Supply Density</h3>
        <div className="space-y-3 text-sm">
          {/* This is a static placeholder - in production you would map unique cities */}
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium italic">Lagos</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-xs">{supplies.filter(s => s.city === 'Lagos').length} items</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium italic">Abuja</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-xs">{supplies.filter(s => s.city === 'Abuja').length} items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlertPanel;
