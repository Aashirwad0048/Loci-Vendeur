// components/WholesaleTermsModal.jsx
import React from 'react';
import { X, ScrollText, AlertTriangle } from 'lucide-react';

const WholesaleTermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <ScrollText className="text-emerald-400" size={24} />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Wholesale Agreement</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-gray-300 space-y-6 text-sm leading-relaxed">

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">1. Business Verification</h3>
    <p>
      All wholesalers must provide a valid GSTIN and legal business documentation.
      Loci-Vendeur reserves the right to verify submitted information at any time.
      Submission of false or misleading information will result in permanent suspension.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">2. Order Fulfillment Obligation</h3>
    <p>
      Wholesalers agree to dispatch confirmed orders within 48 hours unless otherwise specified.
      Failure to meet dispatch timelines repeatedly may lead to penalties, ranking reduction, or account suspension.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">3. Pricing Accuracy</h3>
    <p>
      All listed prices must be accurate and inclusive of applicable taxes unless clearly mentioned.
      Loci-Vendeur reserves the right to cancel orders arising from obvious pricing errors.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">4. Inventory Responsibility</h3>
    <p>
      Wholesalers are responsible for maintaining updated stock information.
      Overselling, fake availability, or misleading stock declarations may result in temporary or permanent listing removal.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">5. Quality & Compliance</h3>
    <p>
      All products must comply with Indian regulatory standards.
      Loci-Vendeur acts only as a marketplace facilitator and is not liable for product quality disputes between buyer and supplier.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">6. Platform Authority</h3>
    <p>
      Loci-Vendeur reserves full discretion to suspend, restrict, or terminate wholesaler accounts
      if platform misuse, fraudulent activity, or policy violations are detected.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">7. Payment & Settlement</h3>
    <p>
      Payments will be processed via approved payment gateways.
      Settlement timelines may vary based on verification and dispute resolution.
      Loci-Vendeur is not responsible for third-party banking delays.
    </p>
  </div>

  <div>
    <h3 className="text-emerald-400 font-bold mb-2">8. Limitation of Liability</h3>
    <p>
      Loci-Vendeur shall not be liable for indirect losses, profit losses,
      logistics delays, or force majeure events beyond reasonable control.
    </p>
  </div>

  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
    <div className="flex items-start gap-2">
      <AlertTriangle className="text-emerald-400 mt-0.5" size={16} />
      <p className="text-xs">
        By continuing registration, you confirm that you have read, understood,
        and agreed to comply with this Wholesale Agreement.
      </p>
    </div>
  </div>

</div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <button onClick={onClose} className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs">
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WholesaleTermsModal;