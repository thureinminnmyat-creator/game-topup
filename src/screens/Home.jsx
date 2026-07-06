import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Gift, Globe, Megaphone, ChevronRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);

  // Banner ပုံလမ်းကြောင်းများ
  const banners = ["/images/banner1.jpg", "/images/banner2.jpg", "/images/banner3.jpg"];
  const nextBanner = () => setBannerIndex((prev) => (prev + 1) % banners.length);

  // Games ပုံလမ်းကြောင်းများ (စာလုံးပေါင်း အနည်းငယ် ပြင်ပေးထားပါသည်)
  const games = [
    { id: 'mobilelegends', name: 'MLBB', image: '/images/mlbb.jpg' },
    { id: 'magicchessgogo', name: 'Magic Chess', image: '/images/mcgg.jpg' },
    { id: 'hok', name: 'Pubg', image: '/images/pubg.jpg' },
    { id: 'wherewindsmeet', name: 'Free Fire', image: '/images/ff.jpg' },
    { id: 'bloodstrike', name: 'Delta Force', image: '/images/dtfoc.jpg' }, 
    { id: 'identityv', name: 'Genshin Impact', image: '/images/ge.jpg' }, 
  ];

  return (
    <div className="bg-[#f0f8ff] min-h-screen flex flex-col p-3 gap-2 pb-6"> 
      
      {/* 1. Header Row */}
      <div className="flex justify-between items-center">
        <img 
          src="/images/logo.jpg" 
          alt="Logo" 
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
        />
        <div className="flex gap-2">
            <button className="p-2 bg-white rounded-full text-gray-600 shadow-sm">
              <Bell size={18} />
            </button>
            <button className="px-3 py-1 bg-white border border-blue-200 rounded-full text-sm font-semibold text-blue-600 flex items-center gap-1 shadow-sm">
              <User size={16} /> Login
            </button>
        </div>
      </div>

      {/* 2. Welcome Row */}
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-bold text-sm">Welcome 👋</p>
        <div className="flex gap-2">
            <button className="px-2 py-1 bg-white border border-blue-300 rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
              <Gift size={10} className="inline mr-1 text-pink-500"/> Spin
            </button>
            <button className="px-2 py-1 bg-white border border-blue-300 rounded-full text-[10px] font-bold text-gray-700 uppercase shadow-sm">
              <Globe size={10} className="inline mr-1 text-blue-500"/> En
            </button>
        </div>
      </div>

      {/* 3. Banner */}
      <div className="relative w-full">
          <div className="w-full h-60 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
              <img src={banners[bannerIndex]} alt="Banner" className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={nextBanner} 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-full backdrop-blur-sm active:scale-95 transition-transform"
          >
              <ChevronRight size={18} className="text-white" />
          </button>
      </div>

      {/* 4. Marquee */}
      <div className="bg-white rounded-lg p-2 shadow-sm flex items-center">
        <Megaphone size={14} className="text-blue-500 mr-2 shrink-0" />
        <marquee className="text-[10px] font-medium text-gray-600 pt-1">
          Faygo games shop မှာ games item များကို အမြန်ဆုံးနဲ့အသက်သာဆုံး ယုံကြည်စိတ်ချစွာ ဝယ်ယူ ရရှိနိုင်ပါပီ- အမြန်ဆုံးနှင့် အယုံကြည်ရဆုံး ဂိမ်းငွေဖြည့်ဝန်ဆောင်မှု။
        </marquee>
      </div>

      {/* 5. Popular Games Header */}
      <div className="flex justify-between items-center px-1 mt-1">
          <h2 className="text-sm font-bold text-gray-800">Popular Games</h2>
          <button className="text-[11px] font-bold text-blue-500 flex items-center hover:underline">
            view all <ChevronRight size={12} />
          </button>
      </div>

      {/* 6. Games Grid */}
      <div className="grid grid-cols-3 gap-3">
        {games.map((game) => (
          <div 
            key={game.id} 
            onClick={() => navigate(`/topup/${game.id}`)} 
            className="flex flex-col cursor-pointer active:scale-95 transition-transform h-48"
          >
            {/* Game Image */}
            <div className="h-38 w-full p-1">
              <div className="w-full h-full border-4 border-blue-100 rounded-xl overflow-hidden bg-white shadow-sm">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            
            {/* Game Name */}
            <div className="flex-grow flex items-center justify-center pt-1">
              <h3 className="text-[11px] font-bold text-gray-700 text-center leading-tight">
                {game.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}