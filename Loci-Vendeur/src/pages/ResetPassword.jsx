import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Passkey must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirm) {
      setError("Passkey mismatch detected. Please verify inputs.");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/auth/reset-password/${token}`, { password: formData.password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-transparent font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-[0_0_40px_-2px_rgba(45,212,191,0.6)] p-8 overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-teal-500/10 border border-teal-400/20 mb-4">
            <ShieldCheck className="text-teal-400" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">New <span className="text-teal-400">Passkey</span></h1>
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">
            Auth Token: <span className="text-gray-300">{token?.substring(0, 12)}...</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 flex items-center gap-2 text-xs border border-red-500/30 animate-shake">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-6 animate-in fade-in zoom-in">
             <div className="h-1 bg-teal-500 w-full mb-6 overflow-hidden rounded-full">
                <div className="h-full bg-white animate-progress-loading"></div>
             </div>
             <p className="text-teal-400 font-black uppercase tracking-widest text-sm">Security Core Updated</p>
             <p className="text-gray-400 text-[10px] mt-2 italic">Re-routing to Secure Login...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Security Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-teal-400 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••"
                  className="w-full pl-10 pr-12 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition-all text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-teal-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-teal-400 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••"
                  className="w-full pl-10 pr-12 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition-all text-sm"
                  onChange={(e) => setFormData({...formData, confirm: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all shadow-lg uppercase tracking-widest text-xs mt-2 active:scale-95"
            >
              {loading ? 'Updating...' : 'Overwrite Identity'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
