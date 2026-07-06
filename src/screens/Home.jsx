import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Gift, Globe, Megaphone, ChevronRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);
  const banners = ["BANNER 1", "BANNER 2", "BANNER 3"];

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const games = [
    { id: 'mobilelegends', name: 'MLBB', image: 'https://img.icons8.com/color/96/mobile-legends.png' },
    { id: 'magicchessgogo', name: 'Magic Chess', image: 'https://img.icons8.com/color/96/chess.png' },
    { id: 'hok', name: 'HOK', image: 'https://img.icons8.com/color/96/king.png' },
    { id: 'wherewindsmeet', name: 'WWM', image: 'https://img.icons8.com/color/96/wind.png' },
    { id: 'bloodstrike', name: 'Blood Strike', image: 'https://img.icons8.com/color/96/gun.png' },
    { id: 'identityv', name: 'Identity V', image: 'https://img.icons8.com/color/96/ghost.png' },
  ];

  return (
    <div className="bg-[#f0f8ff] min-h-full"> 
      <div className="px-4 pt-4">

        {/* 1. Header Row */}
        <div className="flex justify-between items-center mb-3">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-[14px]">WAM</div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white rounded-full text-gray-600 border border-blue-100"><Bell size={18} /></button>
            <button className="px-4 py-2 bg-white border border-blue-200 rounded-full text-sm font-semibold text-blue-600 flex items-center gap-1"><User size={16} /> Login</button>
          </div>
        </div>

        {/* 2. Welcome Row */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-700 font-bold text-sm">Welcome 👋</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-blue-300 rounded-full text-[10px] font-bold text-gray-700"><Gift size={11} className="inline mr-1 text-pink-500"/> Spin</button>
            <button className="px-3 py-1 bg-white border border-blue-300 rounded-full text-[10px] font-bold text-gray-700 uppercase"><Globe size={11} className="inline mr-1 text-blue-500"/> En</button>
          </div>
        </div>

        {/* 3. Banner */}
        <div className="relative mb-3">
            <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-blue-300 rounded-3xl flex items-center justify-center text-white font-bold text-xl">
                {banners[bannerIndex]}
            </div>
            <button onClick={nextBanner} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-full backdrop-blur-sm">
                <ChevronRight size={20} className="text-white" />
            </button>
        </div>

        {/* 4. Marquee */}
        <div className="bg-white rounded-lg p-2 mb-3 shadow-sm flex items-center">
          <Megaphone size={14} className="text-blue-500 mr-2" />
          <marquee className="text-[10px] font-medium text-gray-600">Wam Trading - အမြန်ဆုံးနှင့် အယုံကြည်ရဆုံး ဂိမ်းငွေဖြည့်ဝန်ဆောင်မှု။</marquee>
        </div>

        {/* 5. Games Grid (Icon ကြီးထားပြီး နေရာလွတ်မထားတော့ပါ) */}
        <div className="grid grid-cols-3 gap-3">
          {games.map((game) => (
            <div key={game.id} onClick={() => navigate(`/topup/${game.id}`)} className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <div className="w-16 h-16 bg-gray-50 rounded-xl mb-2 flex items-center justify-center p-1 border border-gray-100">
                <img src={game.image} alt={game.name} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-[11px] font-bold text-gray-700 text-center">{game.name}</h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
