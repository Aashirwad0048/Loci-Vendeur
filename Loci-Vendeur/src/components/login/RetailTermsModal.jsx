import React from 'react';
import { X, ScrollText, ShieldAlert, Store } from 'lucide-react';

const RetailTermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <Store className="text-emerald-400" size={24} />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Retailer Agreement</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto text-gray-300 space-y-6 text-sm leading-relaxed custom-scrollbar">
          
          <div>
            <h3 className="text-emerald-400 font-bold mb-2">1. Store Accountability</h3>
            <p>
              Retailers are responsible for all transactions processed through their Loci-Vendeur terminal. 
              You agree to provide accurate business details including shop name, type, and location for transparent billing.
            </p>
          </div>

          <div>
            <h3 className="text-emerald-400 font-bold mb-2">2. Billing & Invoicing</h3>
            <p>
              By using our billing system, you agree to generate valid invoices for customers. 
              The platform is not responsible for tax discrepancies arising from manual entry errors or incorrect GST applications by the retailer.
            </p>
          </div>

          <div>
            <h3 className="text-emerald-400 font-bold mb-2">3. Data Privacy</h3>
            <p>
              Retailers must protect customer data (names, numbers, purchase history) collected during billing. 
              Sharing or selling customer data to third parties via Loci-Vendeur exports is strictly prohibited.
            </p>
          </div>

          <div>
            <h3 className="text-emerald-400 font-bold mb-2">4. Wholesale Sourcing</h3>
            <p>
              When buying from the Wholesale Market, retailers agree to the Minimum Order Values (MOV) set by suppliers. 
              Loci-Vendeur acts as a facilitator and is not liable for goods damaged during external logistics.
            </p>
          </div>

          <div>
            <h3 className="text-emerald-400 font-bold mb-2">5. Inventory Management</h3>
            <p>
              Retailers are responsible for keeping their digital inventory updated. 
              Misuse of the "Stock Out" or "Restock" features to manipulate marketplace demand is a violation of platform policy.
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-emerald-400 mt-0.5 shrink-0" size={18} />
              <p className="text-xs text-emerald-100">
                Loci-Vendeur reserves the right to restrict access to billing features if fraudulent transactions or policy violations are detected.
              </p>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <button 
            onClick={onClose} 
            className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all active:scale-[0.98]"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetailTermsModal;