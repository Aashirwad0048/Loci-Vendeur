import React from "react";
import { useNavigate } from "react-router-dom"; // Import this

export default function AccountInfo({ data }) {
  const navigate = useNavigate();

  // The Logout Logic moves here
  const handleLogout = () => {
    // 1. Clear Auth Data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    
    // 2. Redirect to Login Page
    navigate("/");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-green-100 text-green-600 p-1.5 rounded-md">🔐</span> 
        Account Security
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Last Login</span>
          <span className="text-sm font-medium text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded">
            {data.lastLogin}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Access Role</span>
          <span className="text-sm font-medium text-gray-800">{data.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition text-sm shadow-sm">
          Change Password
        </button>

        {/* Updated Logout Button with onClick event */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-medium transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
