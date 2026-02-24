import React, { useState, useEffect } from 'react';
import UserTabs from '../components/admin/usermanagement/UserTabs';
import UserTable from '../components/admin/usermanagement/UserTable';
import UserValidationModal from '../components/admin/usermanagement/UserValidationModal';
import API from '../api/axios';

const Usermanagement = () => {
  const [activeTab, setActiveTab] = useState('retailers'); // 'retailers' | 'wholesalers' | 'pending'
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await API.get('/users');
      const raw = response.data?.data || [];
      setUsers(
        raw.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          city: u.city,
          phone: u.phone || u.retailerDetails?.phone || '',
          shopName: u.retailerDetails?.shopName || u.shopName || '',
          industry: u.retailerDetails?.industry || u.industry || '',
          companyName: u.wholesalerDetails?.companyName || '',
          gstin: u.wholesalerDetails?.gstin || u.retailerDetails?.gstin || u.gstin || '',
          address:
            u.wholesalerDetails?.warehouseAddress ||
            u.retailerDetails?.address ||
            u.address ||
            '',
          state: u.retailerDetails?.state || u.state || '',
          pincode: u.retailerDetails?.pincode || u.pincode || '',
          verificationStatus: u.wholesalerDetails?.verificationStatus || '',
          wholesalerCertificate: u.wholesalerDetails?.gstFile || '',
          retailPhoto: u.retailerDetails?.shopPhoto || u.shopPhoto || '',
          category: u.wholesalerDetails?.category || '',
          mov: u.wholesalerDetails?.mov || 0,
          accountNumber: u.wholesalerDetails?.bankDetails?.accountNumber || '',
          ifsc: u.wholesalerDetails?.bankDetails?.ifsc || '',
        }))
      );
    };

    fetchUsers().catch((e) => console.error(e));
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    const normalized = newStatus === 'rejected' ? 'suspended' : newStatus;
    await API.patch(`/users/${userId}/status`, { status: normalized });

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: normalized } : u)));
    setSelectedUser((prev) => (prev && prev.id === userId ? { ...prev, status: normalized } : prev));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500">Governance & Quality Control Center</p>
      </header>

      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <UserTable 
          users={users} 
          activeTab={activeTab} 
          onStatusChange={handleStatusChange} 
          onViewInfo={setSelectedUser}
        />
      </div>

      <UserValidationModal
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Usermanagement;
