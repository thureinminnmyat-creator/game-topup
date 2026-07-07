import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Gift, HelpCircle, LogIn, User } from 'lucide-react'; // 👈 Icon အသစ်များ ထည့်ထားပါသည်
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 Login အခြေအနေ သိမ်းရန် State
  const navigate = useNavigate();

  useEffect(() => {
    // LocalStorage တွင် Token ရှိ/မရှိ စစ်ဆေးခြင်း
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    // Railway API မှ ဂိမ်းစာရင်း လှမ်းယူခြင်း
    axios.get('https://topup-bk-production.up.railway.app/api/topup/games')
      .then((response) => {
        if (response.data && response.data.success) {
          setGames(response.data.games);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24">
      
      {/* 1. Header Section */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full flex items-center justify-center text-[#121722] font-black text-sm shadow-md shadow-teal-500/20">
            F
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Faygo Games Shop</h1>
            <p className="text-xs text-gray-400">Best place to buy items</p>
          </div>
        </div>
        
        {/* 👈 ညာဘက်ခြမ်း ခလုတ်များ အစုအဖွဲ့ */}
        <div className="flex items-center gap-2">
          {/* Bell Notification */}
          <button className="p-2 bg-slate-800 rounded-xl text-teal-400 relative border border-slate-700/50">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dynamic Login Button: ဝင်ထားရင် User Icon ပြပြီး မဝင်ရသေးရင် Login Button ပြပါမည် */}
          {isLoggedIn ? (
            <button 
              onClick={() => navigate('/setting')} 
              className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400"
            >
              <User size={18} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} // 👈 Login စာမျက်နှာသို့ သွားရန်
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-[#121722] rounded-xl text-xs font-bold transition shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <LogIn size={14} />
              Login
            </button>
          )}
        </div>
      </header>

      {/* 2. Marquee Announcement (ပြေးနေသော ကြေညာစာတန်း) */}
      <div className="mx-4 bg-teal-900/30 border border-teal-500/30 rounded-lg p-1.5 overflow-hidden mb-6 flex items-center">
        <marquee className="text-teal-400 text-sm font-medium pt-1" scrollamount="5">
          ✨ 10% Discount on Mobile Legends today! ဝယ်ယူအားပေးမှုကို ကျေးဇူးတင်ပါသည်။ ✨
        </marquee>
      </div>

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Welcome to Faygo Games Shop!</h2>

        {/* 3. Action Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#1A2235] border border-slate-700 rounded-xl hover:bg-slate-700 transition">
            <Gift size={20} className="text-orange-400" />
            <span className="font-medium text-teal-400">Claim Daily Bonus</span>
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#1A2235] border border-slate-700 rounded-xl hover:bg-slate-700 transition">
            <HelpCircle size={20} className="text-purple-400" />
            <span className="font-medium text-yellow-500">Lucky Spin Wheel</span>
          </button>
        </div>

        {/* 4. Hero Banner */}
        <div className="w-full h-40 rounded-xl overflow-hidden mb-6 relative">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121722] to-transparent"></div>
        </div>

        {/* 5. Featured Games */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold">Featured Games</h3>
          <span 
            onClick={() => navigate('/shop')} 
            className="text-xs text-teal-400 cursor-pointer hover:underline"
          >
            View All
          </span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading games...</p>
          ) : (
            games.map((game) => (
              <div 
                key={game.id} 
                onClick={() => navigate('/shop')} 
                className="min-w-[120px] sm:min-w-[150px] bg-[#1A2235] rounded-xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer hover:ring-2 ring-teal-500 transition"
              >
                <img 
                  src={game.image_url} 
                  alt={game.name} 
                  className="w-full h-24 object-cover bg-white"
                />
                <div className="p-2 text-center">
                  <p className="text-xs font-semibold truncate">{game.name}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 6. Latest Promotions */}
        <div className="flex justify-between items-end mb-4 mt-4">
          <h3 className="text-lg font-bold">Latest Promotions</h3>
          <span 
            onClick={() => navigate('/social')} 
            className="text-xs text-teal-400 cursor-pointer hover:underline"
          >
            View All
          </span>
        </div>
        <div className="space-y-3">
            <div 
              onClick={() => navigate('/social')} 
              className="flex gap-3 bg-[#1A2235] p-3 rounded-xl items-center cursor-pointer hover:bg-slate-800 transition"
            >
                <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop" alt="Promo" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                    <h4 className="font-semibold text-sm">ပရိုမိုးရှင်း အထူးအစီအစဉ်</h4>
                    <p className="text-xs text-gray-400">10% Off for all games</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;