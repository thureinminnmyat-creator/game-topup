import React from 'react';
import { Home, ShoppingCart, Wallet, Globe, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/shop', label: 'ဆိုင်', icon: ShoppingCart },
    { id: '/wallet', label: 'ဝေါလက်', icon: Wallet },
    { id: '/social', label: 'ကြေညာချက်', icon: Globe },
    { id: '/setting', label: 'ဆက်တင်', icon: Settings },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[380px] bg-[#1A2235]/95 backdrop-blur-md border border-slate-700/50 rounded-full flex justify-between items-center p-1.5 shadow-2xl z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex items-center justify-center gap-2 rounded-full transition-all duration-300 ease-in-out ${
              isActive 
                ? 'bg-teal-500/20 text-teal-400 px-4 py-2.5' 
                : 'text-gray-400 p-2.5 hover:text-white'
            }`}
          >
            <Icon size={20} className={isActive ? 'scale-105 transition-transform' : ''} />
            
            {/* Active ဖြစ်နေမှသာ စာသားကို ပြမည် */}
            {isActive && (
              <span className="text-[11px] font-bold whitespace-nowrap animate-fade-in">
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}