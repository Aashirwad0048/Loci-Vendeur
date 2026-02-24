import React from 'react';
import StatusBadge from './StatusBadge';


const UserTable = ({ users, activeTab, onStatusChange, onViewInfo }) => {
  // Logic: Filter users based on current tab
  const displayUsers = users.filter(u => {
    if (activeTab === 'pending') return u.status === 'pending';
    if (activeTab === 'retailers') return u.role === 'retailer';
    if (activeTab === 'wholesalers') return u.role === 'wholesaler';
    return false;
  });

  return (
    <div className="overflow-x-auto">
    <table className="min-w-[980px] w-full text-left">
      <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
        <tr>
          <th className="px-6 py-3">User ID</th>
          <th className="px-6 py-3">Name / Email</th>
          {activeTab === 'wholesalers' && <th className="px-6 py-3">City / Reliability</th>}
          {activeTab === 'retailers' && <th className="px-6 py-3">Spend Metrics</th>}
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {displayUsers.length === 0 ? (
          <tr>
            <td colSpan={activeTab === 'wholesalers' || activeTab === 'retailers' ? 5 : 4} className="px-6 py-8 text-center text-sm text-gray-500">
              No users found for this tab.
            </td>
          </tr>
        ) : (
          displayUsers.map(user => (
            <tr key={user.id} className="text-sm text-gray-700 hover:bg-gray-50">
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-gray-600">{user.id}</span>
              </td>
              <td className="px-6 py-4">
                <div className="font-bold">{user.name}</div>
                <div className="text-gray-400 text-xs">{user.email}</div>
              </td>
              
              {/* Conditional Metrics */}
              {activeTab === 'wholesalers' && (
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.companyName || 'Company not set'}</div>
                  <div className="text-xs text-gray-500">
                    {[user.city, user.state, user.pincode].filter(Boolean).join(', ') || 'Location not set'}
                  </div>
                  <div className="text-xs text-gray-500">{user.gstin || 'GSTIN not set'}</div>
                  <div className="text-xs text-blue-600 font-medium capitalize">
                    {user.verificationStatus || 'pending'}
                  </div>
                </td>
              )}
              {activeTab === 'retailers' && (
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.shopName || 'Shop not set'}</div>
                  <div className="text-xs text-gray-500">{user.industry || 'Industry not set'}</div>
                  <div className="text-xs text-gray-500">{user.phone || 'Phone not set'}</div>
                  <div className="text-xs text-gray-500">{user.address || 'Address not set'}</div>
                </td>
              )}
              
              <td className="px-6 py-4">
                <StatusBadge status={user.status} />
              </td>

              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onViewInfo(user)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Mini Info
                </button>
                {user.status === 'pending' ? (
                  <>
                    <button onClick={() => onStatusChange(user.id, 'active')} className="text-green-600 font-semibold">Approve</button>
                    <button onClick={() => onStatusChange(user.id, 'rejected')} className="text-red-400">Reject</button>
                  </>
                ) : (
                  <button 
                    onClick={() => onStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                    className={user.status === 'active' ? 'text-red-500' : 'text-green-500'}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
  );
};

export default UserTable;
