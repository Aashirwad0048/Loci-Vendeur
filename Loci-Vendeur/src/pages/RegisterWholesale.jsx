import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Briefcase, MapPin, ArrowLeft, ShieldCheck, Globe, Lock, Mail, FileText } from 'lucide-react';
import WholesaleTermsModal from '../components/login/WholesaleTermsModal';
import API from '../api/axios';

const RegisterWholesale = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState(""); // For UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    representative: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    gst: '',
    category: 'FMCG & Groceries',
    warehouseCity: '',
    accountNumber: '',
    ifsc: '',
    mov: '',
    agreed: false,
    gstFile: null // Will store Base64 string
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 2. FILE UPLOAD LOGIC (Base64 Conversion for LocalStorage)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          gstFile: reader.result // This is the Base64 string
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 3. VALIDATION & SUBMISSION LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mandatory Field Check
    if (
      !formData.representative ||
      !formData.email ||
      !formData.companyName ||
      !formData.gst ||
      !formData.password ||
      !formData.warehouseCity ||
      !formData.accountNumber ||
      !formData.ifsc
    ) {
      setError("CRITICAL ERROR: All mandatory corporate fields must be filled.");
      return;
    }

    // File Check
    if (!formData.gstFile) {
      setError("COMPLIANCE ERROR: Please upload a valid GST Certificate.");
      return;
    }

    // Password Match Check
    if (formData.password !== formData.confirmPassword) {
      setError("SECURITY ALERT: Passwords do not match.");
      return;
    }

    // Terms Agreement Check
    if (!formData.agreed) {
      setError("COMPLIANCE REQUIRED: Please accept the Wholesaler Terms of Supply.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", {
        name: formData.representative.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: "wholesaler",
        city: formData.warehouseCity.trim(),
        companyName: formData.companyName.trim(),
        gstin: formData.gst.trim().toUpperCase(),
        category: formData.category,
        mov: Number(formData.mov) || 0,
        warehouseAddress: formData.warehouseCity.trim(),
        bankDetails: {
          accountNumber: formData.accountNumber.trim(),
          ifsc: formData.ifsc.trim().toUpperCase(),
        },
        gstFile: formData.gstFile || null,
      });

      alert("APPLICATION RECEIVED: Your account is pending admin verification.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Wholesaler registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-transparent font-sans">
      
      {/* EMERALD NEON BACKLIGHT EFFECT */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-[0_0_40px_-2px_rgba(16,185,129,0.9)] p-8 my-10 relative z-10">
        
        <button 
          onClick={() => navigate('/register')} 
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Wholesale Entry</h1>
          <p className="text-gray-300 text-sm mt-1 font-medium italic">Official Supplier Onboarding Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm font-semibold text-red-300">{error}</p>}
          
          {/* Section: Representative & Auth */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Auth Representative</label>
              <input required name="representative" value={formData.representative} onChange={handleChange} type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="corp@company.com" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
              </div>
            </div>
          </div>

          {/* CRITICAL: PASSWORD CREATION */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 text-emerald-400">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input required minLength={6} name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 text-emerald-400">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input required minLength={6} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Section: Corporate Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 ml-1">Company Name (As per GST)</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input required name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="Legal Entity Name" className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 ml-1">GSTIN (Mandatory)</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors" size={16} />
                  <input required name="gst" value={formData.gst} onChange={handleChange} type="text" placeholder="22AAAAA0000A1Z5" className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Primary Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all text-sm appearance-none cursor-pointer">
                  <option className="bg-slate-900" value="FMCG & Groceries">FMCG & Groceries</option>
                  <option className="bg-slate-900" value="Medical Supplies">Medical Supplies</option>
                  <option className="bg-slate-900" value="Electronics">Industrial Electronics</option>
                  <option className="bg-slate-900" value="Textiles">Textiles & Apparel</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Logistics */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Warehouse City</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input required name="warehouseCity" value={formData.warehouseCity} onChange={handleChange} type="text" placeholder="Base Location" className="w-full pl-12 pr-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Min. Order Value (MOV)</label>
              <input name="mov" value={formData.mov} onChange={handleChange} type="number" placeholder="₹5000" className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Bank Account Number</label>
              <input
                required
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                type="text"
                placeholder="1234567890"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">IFSC</label>
              <input
                required
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                type="text"
                placeholder="HDFC0001234"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-gray-700 text-sm shadow-inner uppercase"
              />
            </div>
          </div>

          {/* ACTUAL FUNCTIONAL UPLOAD */}
          <div className="space-y-2">
            <input 
              type="file" 
              id="gst-file" 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={handleFileChange} 
            />
            <label 
              htmlFor="gst-file"
              className={`p-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-4 transition-all cursor-pointer group 
                ${formData.gstFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-600 hover:border-emerald-500'}`}
            >
              <FileText size={20} className={formData.gstFile ? 'text-emerald-400' : 'text-gray-400 group-hover:scale-110 transition-transform'} />
              <div className="flex flex-col text-left">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.gstFile ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {formData.gstFile ? "Certificate Attached" : "Upload GST Certificate (PDF/IMG)"}
                </span>
                {fileName && <span className="text-[9px] text-gray-500 truncate max-w-[200px]">{fileName}</span>}
              </div>
            </label>
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
                  Wholesaler Terms of Supply
                </button> 
                & Verification
              </span>
            </label>
          </div>

          <WholesaleTermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-50 transition-all hover:text-emerald-600 shadow-lg hover:shadow-emerald-500/40 mt-2 uppercase tracking-[0.1em] transform active:scale-95 duration-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting...' : 'Submit Application'} <Globe size={18} />
          </button>
        </form>

        <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-8 italic">
          Strict Compliance Mode Active • Loci-Vendeur Security
        </p>
      </div>
    </div>
  );
};

export default RegisterWholesale;
