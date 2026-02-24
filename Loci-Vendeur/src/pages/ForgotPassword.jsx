import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await API.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-transparent font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-[0_0_40px_-2px_rgba(45,212,191,0.6)] p-8">
        
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">Recovery <span className="text-teal-400">Protocol</span></h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Initiating Access Restoration</p>
        </div>

        {success ? (
          <div className="bg-teal-500/20 border border-teal-500/40 p-6 rounded-xl text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={40} className="text-teal-400 mx-auto mb-4" />
            <p className="text-white font-bold text-sm">Request Processed</p>
            <p className="text-gray-300 text-xs mt-2 leading-relaxed">
              If an account is associated with this ID, recovery instructions have been sent to email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-xs font-semibold text-red-300">{error}</p>}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Corporate ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-teal-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-teal-500 text-black font-black py-4 rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 uppercase tracking-widest text-xs"
            >
              {loading ? 'Generating...' : 'Request Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
