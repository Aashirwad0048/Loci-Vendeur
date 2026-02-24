import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, MapPin, ArrowLeft, CheckCircle, Phone, Mail, Lock, Camera, X } from 'lucide-react';
import RetailTermsModal from '../components/login/RetailTermsModal';
import API from '../api/axios';

const RegisterRetail = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // For the UI image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    industry: 'Kirana',
    gst: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    agreed: false,
    shopPhoto: null // Stores the Base64 string
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 2. PHOTO UPLOAD LOGIC
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the preview
      setPreviewUrl(URL.createObjectURL(file));

      // Convert file to Base64 string for LocalStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          shopPhoto: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, shopPhoto: null }));
  };

  // 3. REGISTRATION LOGIC
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.ownerName ||
      !formData.email ||
      !formData.password ||
      !formData.shopName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("Missing required fields. Please complete all business and address details.");
      return;
    }
    if (!formData.shopPhoto) {
      setError("Shop proof is required for retailer verification.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.agreed) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", {
        name: formData.ownerName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: "retailer",
        phone: formData.phone.trim(),
        shopName: formData.shopName.trim(),
        industry: formData.industry,
        gstin: formData.gst.trim().toUpperCase(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        shopPhoto: formData.shopPhoto || null,
      });
      alert("Registration submitted. Your retailer account is pending admin verification.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-transparent font-sans">
      
      <RetailTermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-[0_0_40px_-2px_rgba(16,185,129,0.9)] p-8 my-10 relative z-10">
        
        <button 
          onClick={() => navigate('/register')} 
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Store Setup</h1>
          <p className="text-gray-300 text-sm mt-1 font-medium">Create your business credentials</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && <p className="text-sm font-semibold text-red-300">{error}</p>}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Owner Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input required name="ownerName" value={formData.ownerName} onChange={handleChange} type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 text-sm shadow-inner" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Mobile Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 text-sm shadow-inner" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="admin@shop.com" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 text-sm shadow-inner" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input required minLength={6} name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 text-sm shadow-inner" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input required minLength={6} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 text-sm shadow-inner" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Shop Name</label>
              <div className="relative group">
                <Store className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input required name="shopName" value={formData.shopName} onChange={handleChange} type="text" placeholder="Business Name" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 text-sm shadow-inner" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Industry Type</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm appearance-none cursor-pointer">
                  <option className="bg-slate-900" value="Kirana">Kirana</option>
                  <option className="bg-slate-900" value="Pharmacy">Pharmacy</option>
                  <option className="bg-slate-900" value="Electronics">Electronics</option>
                  <option className="bg-slate-900" value="General Store">General Store</option>
                </select>
              </div>
              <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">GSTIN (Optional)</label>
                <input name="gst" value={formData.gst} onChange={handleChange} type="text" placeholder="22AAAAA0000A1Z5" className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 uppercase text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Shop Address</label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Street, Locality, Landmark..." className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-500 resize-none text-sm"></textarea>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm shadow-inner" />
            <input name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State" className="px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm shadow-inner" />
            <input name="pincode" value={formData.pincode} onChange={handleChange} type="text" placeholder="Pincode" className="px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm shadow-inner" />
          </div>

          {/* FUNCTIONAL PHOTO UPLOAD */}
          <div className="space-y-2">
            <input 
              type="file" 
              id="shop-photo" 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoChange} 
            />
            {!previewUrl ? (
              <label 
                htmlFor="shop-photo"
                className="p-4 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center gap-4 text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-all cursor-pointer group"
              >
                <Camera size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Upload Shop Proof Photo (Required)</span>
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-emerald-500/50">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                name="agreed" 
                checked={formData.agreed} 
                onChange={handleChange} 
                type="checkbox" 
                className="w-5 h-5 rounded border-gray-600 bg-black/40 text-emerald-600 focus:ring-emerald-400/50 cursor-pointer" 
              />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                I agree to the 
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(true)}
                  className="mx-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors"
                >
                  Retailer Terms & Conditions
                </button> 
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-50 transition-all hover:text-emerald-600 shadow-lg hover:shadow-emerald-500/40 mt-4 flex items-center justify-center gap-2 transform active:scale-95 duration-200 uppercase tracking-[0.1em]"
          >
            {loading ? 'Creating Account...' : 'Create Business Account'} <CheckCircle size={20} />
          </button>
        </form>

        <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-8 italic">
          Verified Loci-Vendeur Retail Portal
        </p>
      </div>
    </div>
  );
};

export default RegisterRetail;
