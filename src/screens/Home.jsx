import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Gift, HelpCircle, LogIn, User } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [banners, setBanners] = useState([]); // 💡 Banner သိမ်းရန် State အသစ်
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    // 💡 Fetching Data Function
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) setIsLoggedIn(true);

      try {
        // ၁။ ဂိမ်းများ ဆွဲယူခြင်း (Local Games ကိုသာ ပြမည်)
        const gamesRes = await axios.get('https://topup-bk-production.up.railway.app/api/topup/local-games');
        if (gamesRes.data && gamesRes.data.success) {
          setGames(gamesRes.data.games);
        }

        // ၂။ 💡 Settings API မှ Banners များ ဆွဲယူခြင်း
        const settingsRes = await axios.get('https://topup-bk-production.up.railway.app/api/wallet/settings');
        if (settingsRes.data && settingsRes.data.success) {
          setBanners(settingsRes.data.setting.banners || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24"> {/* 💡 Background Color ပြင်ထားသည် */}
      
      {/* 1. Header Section */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full flex items-center justify-center text-[#121722] font-black text-sm shadow-md shadow-teal-500/20">
            W
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">Wam Trading</h1>
            <p className="text-[10px] text-gray-400">Best place to buy items</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bell Notification */}
          <button className="p-2 bg-slate-800 rounded-xl text-teal-400 relative border border-slate-700/50">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dynamic Login Button */}
          {isLoggedIn ? (
            <button 
              onClick={() => navigate('/setting')} 
              className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400"
            >
              <User size={18} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-[#121722] rounded-xl text-xs font-bold transition shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <LogIn size={14} />
              Login
            </button>
          )}
        </div>
      </header>

      {/* 2. Marquee Announcement */}
      <div className="mx-4 bg-teal-900/30 border border-teal-500/30 rounded-lg p-1.5 overflow-hidden mb-6 flex items-center">
        <marquee className="text-teal-400 text-sm font-medium pt-1" scrollamount="5">
          ✨ Wam Trading မှ နွေးထွေးစွာ ကြိုဆိုပါသည်။ ယုံကြည်စိတ်ချစွာ ဝယ်ယူအားပေးနိုင်ပါသည်။ ✨
        </marquee>
      </div>

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4 text-white">Welcome to Wam Trading!</h2>

        {/* 3. Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-[#1A2235] border border-slate-700 rounded-xl hover:bg-slate-800 transition">
            <Gift size={20} className="text-orange-400" />
            <span className="font-medium text-teal-400 text-sm">Daily Bonus</span>
          </button>
          <button className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-[#1A2235] border border-slate-700 rounded-xl hover:bg-slate-800 transition">
            <HelpCircle size={20} className="text-purple-400" />
            <span className="font-medium text-yellow-500 text-sm">Lucky Spin</span>
          </button>
        </div>

        {/* 4. 💡 Dynamic Hero Banner Slider */}
        {banners.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 snap-x pb-2 mb-6 scrollbar-hide">
            {banners.map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt={`Banner ${index + 1}`} 
                className="w-[90vw] md:w-[400px] h-40 md:h-48 object-cover rounded-2xl snap-center flex-shrink-0 border border-slate-700 shadow-lg"
              />
            ))}
          </div>
        ) : (
          /* Banner မရှိလျှင် ပြမည့် Default ပုံ */
          <div className="w-full h-40 rounded-xl overflow-hidden mb-6 relative border border-slate-700">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
              alt="Hero Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-transparent"></div>
          </div>
        )}

        {/* 5. Featured Games */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-white">Featured Games</h3>
          <span 
            onClick={() => navigate('/shop')} 
            className="text-xs text-teal-400 cursor-pointer hover:underline"
          >
            View All
          </span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {loading ? (
            <p className="text-teal-400 text-sm animate-pulse">Loading games...</p>
          ) : games.length > 0 ? (
            games.map((game) => (
              <div 
                key={game._id} 
                onClick={() => navigate(`/topup/${game.gameCode}`)} 
                className="w-28 sm:w-32 bg-[#1A2235] border border-slate-700 rounded-xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer hover:ring-2 ring-teal-500 transition"
              >
                <img 
                  src={game.imageUrl} 
                  alt={game.name} 
                  className="w-full h-28 object-cover bg-black"
                />
                <div className="p-2 text-center flex items-center justify-center h-12">
                  <p className="text-[10px] font-semibold line-clamp-2 text-gray-200">{game.name}</p>
                </div>
              </div>
            ))
          ) : (
             <p className="text-gray-500 text-sm">ဂိမ်းများ မရရှိနိုင်သေးပါ။</p>
          )}
        </div>

        {/* 6. Latest Promotions */}
        <div className="flex justify-between items-end mb-4 mt-4">
          <h3 className="text-lg font-bold text-white">Latest Promotions</h3>
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
              className="flex gap-3 bg-[#1A2235] p-3 rounded-xl items-center cursor-pointer hover:bg-slate-800 transition border border-slate-700"
            >
                <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop" alt="Promo" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                    <h4 className="font-semibold text-sm text-white">ပရိုမိုးရှင်း အထူးအစီအစဉ်</h4>
                    <p className="text-xs text-gray-400 mt-1">10% Off for all games</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
