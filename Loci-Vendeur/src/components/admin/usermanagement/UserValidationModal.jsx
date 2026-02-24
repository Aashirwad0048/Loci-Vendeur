import React from 'react';

const UserValidationModal = ({ user, isOpen, onClose, onStatusChange }) => {
  if (!isOpen || !user) return null;

  const doc = user.wholesalerCertificate || user.retailPhoto || '';
  const isImage = typeof doc === 'string' && doc.startsWith('data:image');
  const isPdf = typeof doc === 'string' && doc.startsWith('data:application/pdf');

  const location = [user.address, user.city, user.state, user.pincode].filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Mini Info Validation</h3>
            <p className="text-xs text-slate-500">{user.name} • {user.role}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold text-slate-700">Email:</span> {user.email || '-'}</p>
            <p><span className="font-semibold text-slate-700">Phone:</span> {user.phone || '-'}</p>
            <p><span className="font-semibold text-slate-700">GSTIN:</span> {user.gstin || '-'}</p>
            <p><span className="font-semibold text-slate-700">Business:</span> {user.companyName || user.shopName || '-'}</p>
            <p><span className="font-semibold text-slate-700">Industry/Category:</span> {user.industry || user.category || '-'}</p>
            <p><span className="font-semibold text-slate-700">MOV:</span> {Number(user.mov || 0) > 0 ? `₹${user.mov}` : '-'}</p>
            <p><span className="font-semibold text-slate-700">Verification:</span> {user.verificationStatus || user.status || '-'}</p>
            <p><span className="font-semibold text-slate-700">Address:</span> {location || '-'}</p>
            <p><span className="font-semibold text-slate-700">Bank:</span> {user.accountNumber || '-'} {user.ifsc ? `• ${user.ifsc}` : ''}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Certificate / Photo</p>
            {!doc && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                No document uploaded.
              </div>
            )}
            {isImage && (
              <img
                src={doc}
                alt="Validation document"
                className="max-h-80 w-full rounded-lg border border-slate-200 object-contain"
              />
            )}
            {isPdf && (
              <iframe
                title="Validation PDF"
                src={doc}
                className="h-80 w-full rounded-lg border border-slate-200"
              />
            )}
            {doc && !isImage && !isPdf && (
              <a
                href={doc}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Open Document
              </a>
            )}
          </div>
        </div>

        {user.status === 'pending' && (
          <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
            <button
              onClick={() => onStatusChange(user.id, 'rejected')}
              className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Reject
            </button>
            <button
              onClick={() => onStatusChange(user.id, 'active')}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserValidationModal;
