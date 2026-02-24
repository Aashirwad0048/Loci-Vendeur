import React from 'react';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';

const AlertItem = ({ title, desc, type }) => {
  const types = {
    warning: "border-amber-100 bg-amber-50 text-amber-700",
    danger: "border-red-100 bg-red-50 text-red-700",
    info: "border-blue-100 bg-blue-50 text-blue-700",
  };
  return (
    <div className={`p-3 rounded-lg border flex justify-between items-center ${types[type]}`}>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="text-[11px] opacity-80">{desc}</p>
      </div>
      <ArrowUpRight size={14} className="cursor-pointer hover:scale-110 transition" />
    </div>
  );
};

const RiskAlerts = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="font-semibold mb-4 text-slate-800 flex items-center gap-2">
      <AlertTriangle size={18} className="text-amber-500" /> Risk Alerts
    </h3>
    <div className="space-y-3">
      <AlertItem title="Low Stock" desc="3 Wholesalers critical" type="warning" />
      <AlertItem title="Delayed Ship" desc="2 orders > 48h" type="danger" />
      <AlertItem title="Dispute" desc="1 pending review" type="info" />
    </div>
  </div>
);

export default RiskAlerts;