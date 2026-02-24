import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Factory, ArrowRight, ArrowLeft } from 'lucide-react';

const SelectRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'retailer',
      title: 'Store Owner',
      desc: 'Manage inventory, billing, and restock products.',
      icon: <Store size={28} />,
      path: '/register/retailer',
    },
    {
      id: 'wholesaler',
      title: 'Wholesaler',
      desc: 'Supply bulk goods to retailers across the platform.',
      icon: <Factory size={28} />,
      path: '/register/wholesaler',
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-950">
      
      {/* THE SHADOW FIX: 
          1. Increased opacity to 0.8
          2. Increased blur to 60px
          3. Added a secondary drop-shadow filter for extra "neon" punch 
      */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 
                      shadow-[0_0_60px_-10px_rgba(99,102,241,0.8)] 
                      filter drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-wide">Join Loci-Vendeur</h1>
          <p className="text-gray-300 text-sm mt-1">Select your business type to begin registration</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <button 
              key={role.id}
              onClick={() => navigate(role.path)}
              className="group p-6 bg-black/40 border border-gray-700 rounded-xl transition-all text-left
                         hover:border-indigo-400 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]"
            >
              <div className="h-12 w-12 bg-indigo-900/30 text-indigo-400 rounded-lg flex items-center justify-center mb-4 border border-indigo-400/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                {role.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{role.desc}</p>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:gap-4 transition-all">
                Get Started <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;