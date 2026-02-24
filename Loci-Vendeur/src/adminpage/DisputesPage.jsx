import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import DisputeSummary from '../components/admin/dispute/DisputeSummary';
import DisputeTable from '../components/admin/dispute/DisputeTable';
import DisputeDetailDrawer from '../components/admin/dispute/DisputeDetailDrawer';

const toUiDispute = (d) => ({
  id: d._id,
  displayId: `DSP-${String(d._id).slice(-6).toUpperCase()}`,
  orderId: d.orderId?._id ? `ORD-${String(d.orderId._id).slice(-6).toUpperCase()}` : 'Order',
  raisedBy: d.raisedBy?.role || 'user',
  retailerName: d.orderId?.retailerId?.name || 'Retailer',
  wholesalerName: d.orderId?.wholesalerId?.name || 'Wholesaler',
  reason: d.reason,
  description: d.description,
  status: d.status,
  createdAt: new Date(d.createdAt).toLocaleDateString(),
});

const DisputesPage = () => {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);

  const fetchDisputes = async () => {
    const response = await API.get('/disputes');
    const raw = response.data?.data || [];
    setDisputes(raw.map(toUiDispute));
  };

  useEffect(() => {
    fetchDisputes().catch((e) => console.error(e));
  }, []);

  const handleResolve = async (disputeId, outcome) => {
    try {
      if (outcome === 'under_review') {
        await API.patch(`/disputes/${disputeId}/resolve`, { status: 'under_review' });
      } else if (outcome === 'refunded') {
        await API.patch(`/disputes/${disputeId}/resolve`, { status: 'resolved', action: 'refund' });
      } else {
        await API.patch(`/disputes/${disputeId}/resolve`, { status: 'rejected' });
      }

      await fetchDisputes();
      setSelectedDispute(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update dispute');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Conflict Resolution Center</h1>
        <p className="text-slate-500 font-medium tracking-tight">Neutral Mediation & Escrow Protection</p>
      </div>

      <DisputeSummary disputes={disputes} />
      <DisputeTable disputes={disputes} onSelect={setSelectedDispute} />
      <DisputeDetailDrawer dispute={selectedDispute} onClose={() => setSelectedDispute(null)} onResolve={handleResolve} />
    </div>
  );
};

export default DisputesPage;
