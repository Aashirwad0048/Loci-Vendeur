import React from 'react';

const EscrowPanel = ({ releasedToday, commission, onManualRelease }) => (
  <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
    <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-tight">Escrow Overview</h3>
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400">Released Today</p>
        <p className="text-xl font-bold text-green-400">+₹{releasedToday.toLocaleString()}</p>
      </div>
      <div className="pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-400">Platform Commission (3%)</p>
        <p className="text-lg font-semibold text-blue-300">₹{commission.toLocaleString()}</p>
      </div>
      <button 
        onClick={onManualRelease}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition active:scale-95"
      >
        Manual Release Portal
      </button>
    </div>
  </div>
);

export default EscrowPanel;
