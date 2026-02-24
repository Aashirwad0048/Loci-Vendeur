import React from 'react';
import { IndianRupee, ArrowUpRight, ShieldCheck, RefreshCcw } from 'lucide-react';

const Card = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900">₹{value.toLocaleString()}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const EscrowSummaryCards = ({ orders }) => {
  // Logic from your design
  const escrowHolding = orders
    .filter(o => o.paymentStatus === "paid" && o.status !== "delivered")
    .reduce((sum, o) => sum + o.value, 0);

  const totalReleased = orders
    .filter(o => o.paymentStatus === "released")
    .reduce((sum, o) => sum + o.value, 0);

  const totalCommission = orders
    .filter(o => o.paymentStatus === "released")
    .reduce((sum, o) => sum + (o.value * 0.03), 0);

  const totalRefunded = orders
    .filter(o => o.paymentStatus === "refunded")
    .reduce((sum, o) => sum + o.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card title="Escrow Holding" value={escrowHolding} icon={ShieldCheck} color="bg-blue-600" />
      <Card title="Total Released" value={totalReleased} icon={ArrowUpRight} color="bg-green-600" />
      <Card title="Platform Earnings" value={totalCommission} icon={IndianRupee} color="bg-purple-600" />
      <Card title="Total Refunded" value={totalRefunded} icon={RefreshCcw} color="bg-red-500" />
    </div>
  );
};

export default EscrowSummaryCards;
