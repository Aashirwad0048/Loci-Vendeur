import React from 'react';
import { Gavel, Clock, CheckCircle, RotateCcw } from 'lucide-react';

const DisputeSummary = ({ disputes }) => {
  const stats = [
    { label: 'Open Disputes', count: disputes.filter(d => d.status === 'open').length, icon: Gavel, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Under Review', count: disputes.filter(d => d.status === 'under_review').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolved', count: disputes.filter(d => d.status === 'resolved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Refunds Issued', count: disputes.filter(d => d.status === 'resolved' && d.outcome === 'refunded').length, icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisputeSummary;