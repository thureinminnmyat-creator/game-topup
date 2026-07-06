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
    // absolute ကို ဖြုတ်ပြီး shrink-0 ဖြင့် နေရာအသေယူပါမည်
    <div className="shrink-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Icon size={20} className={isActive ? 'scale-110 transition-transform' : ''} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}