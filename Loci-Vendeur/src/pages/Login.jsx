import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await API.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const payload = response.data?.data;
      const token = payload?.token;
      const user = payload?.user;

      if (!token || !user) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('currentUser', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
        return;
      }

      if (user.role === 'retailer') {
        navigate('/dashboard');
        return;
      }

      navigate('/wholesaler/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-transparent font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-[0_0_40px_-2px_rgba(45,212,191,0.9)] overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="h-14 w-14 bg-teal-900/30 text-teal-400 rounded-xl flex items-center justify-center mx-auto mb-4 border border-teal-400/20 shadow-inner">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Loci-Vendeur</h1>
          <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">Identity & Access Management</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-red-500/30 animate-pulse">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Corporate ID (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-teal-400 transition-colors" size={20} />
              <input
                type="email"
                placeholder="admin@shop.com"
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all placeholder-gray-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Security Passkey</label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[9px] font-bold text-teal-400 uppercase tracking-wider hover:text-white transition-colors"
              >
                Reset Access?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-teal-400 transition-colors" size={20} />
              <input
                type="password"
                placeholder="••••"
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all placeholder-gray-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-teal-50 transition-all hover:text-teal-600 shadow-lg hover:shadow-teal-500/40 mt-3 transform active:scale-95 duration-200 uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-xs mb-2 font-medium">New business?</p>
          <button
            onClick={() => navigate('/register')}
            className="text-teal-400 text-xs font-black uppercase tracking-widest hover:underline"
          >
            Create Company Profile
          </button>
        </div>

        <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-8 italic">
          System Core 3.0 • Secure Session
        </p>
      </div>
    </div>
  );
};

export default Login;
