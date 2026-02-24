import React from "react";

export default function BusinessSettings({ data, handleChange, handleCheckboxChange, isEditing }) {
  const inputClass = `w-full p-2 rounded-lg border text-center font-medium transition-all
    ${isEditing 
      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white" 
      : "border-transparent bg-gray-50 text-gray-600"}`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-purple-100 text-purple-600 p-1.5 rounded-md">⚙️</span> 
        Business Settings
      </h2>
      
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Currency</label>
            <input
              type="text"
              name="currency"
              value={data.currency}
              onChange={handleChange}
              disabled={!isEditing}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Default Tax %</label>
            <input
              type="number"
              name="defaultTax"
              value={data.defaultTax}
              onChange={handleChange}
              disabled={!isEditing}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Invoice Prefix</label>
          <div className="relative">
            <input
              type="text"
              name="invoicePrefix"
              value={data.invoicePrefix}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="INV-"
              className={`w-full p-2.5 rounded-lg border transition-all ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-transparent bg-gray-50"}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Accepted Payments</label>
          <div className="flex flex-wrap gap-2">
            {['cash', 'upi', 'card'].map((method) => (
              <label 
                key={method}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer transition select-none ${
                  data.paymentMethods[method] 
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" 
                    : "bg-gray-50 border-gray-100 text-gray-400"
                } ${!isEditing ? "pointer-events-none opacity-80" : ""}`}
              >
                <input
                  type="checkbox"
                  name={method}
                  checked={data.paymentMethods[method]}
                  onChange={handleCheckboxChange}
                  disabled={!isEditing}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="capitalize">{method}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}