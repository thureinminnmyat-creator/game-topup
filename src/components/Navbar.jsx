import React from 'react';
import { Home, ShoppingBag, Wallet, Megaphone, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', label: 'ပင်မ', icon: Home },
    { id: '/shop', label: 'ဆိုင်', icon: ShoppingBag },
    { id: '/wallet', label: 'ဝေါလက်', icon: Wallet },
    { id: '/social', label: 'ကြေညာချက်', icon: Megaphone },
    { id: '/setting', label: 'ဆက်တင်', icon: Settings },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] bg-[#1A2235]/95 backdrop-blur-md border border-slate-700 rounded-2xl flex justify-around items-center py-1.5 px-2 shadow-2xl z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-teal-500/20 text-teal-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={20} className={isActive ? 'scale-110 transition-transform' : ''} />
            <span className={`text-[9px] mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}