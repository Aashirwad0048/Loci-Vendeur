import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, FileText, ArrowRight } from 'lucide-react';

const DashboardSidebar = ({ lowStockItems, recentBills }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      
      {/* Low Stock Alert */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
        </div>
        <div className="space-y-3">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-amber-700">Only {item.stock} left</p>
                </div>
                <button className="text-xs bg-white px-3 py-1 rounded border border-amber-200 text-amber-700 font-medium hover:bg-amber-100">
                  Restock
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">All items are well stocked.</p>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Bills</h3>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="space-y-4">
          {recentBills.map((bill) => (
            <div key={bill.id} className="flex justify-between items-center pb-3 last:pb-0 border-b last:border-none border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{bill.invoiceNumber || bill.id}</p>
                  <p className="text-xs text-gray-500">{bill.type || "Bill"} • {bill.date || "Today"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">₹{bill.total}</p>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                  bill.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {bill.paymentStatus || "paid"}
                </span>
              </div>
            </div>
          ))}
          {recentBills.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No recent transactions</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardSidebar;
