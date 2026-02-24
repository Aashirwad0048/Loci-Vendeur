import React from "react";
import { Store } from "lucide-react";

export default function ProfileHeader({ data, isEditing, toggleEdit, onLogoUpload }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="relative group">
          {data.logo ? (
            <img
              src={data.logo}
              alt="Shop Logo"
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm bg-gray-100 text-gray-500 flex items-center justify-center">
              <Store size={28} />
            </div>
          )}
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-1.5 rounded-full hover:bg-black transition shadow-md cursor-pointer" title="Upload Logo">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onLogoUpload}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{data.shopName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md border border-blue-100">
              {data.role} Account
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={toggleEdit}
        className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
          isEditing 
            ? "bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-100" 
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {isEditing ? "Save Changes" : "Edit Profile"}
      </button>
    </div>
  );
}
