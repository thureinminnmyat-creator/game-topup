import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react'; // Search Icon အသုံးပြုရန်

export default function Shop() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Railway API မှ ဂိမ်းစာရင်း အားလုံးကို လှမ်းယူခြင်း
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

  // Search Bar တွင် ရိုက်ထည့်သော စာလုံးနှင့် ကိုက်ညီသည့် ဂိမ်းများကိုသာ စစ်ထုတ်ခြင်း
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24 px-4 pt-6">
      
      {/* Header & Title */}
      <h2 className="text-2xl font-bold mb-1">ဂိမ်းဆိုင် (Shop)</h2>
      <p className="text-gray-400 text-sm mb-6">Top-up ပြုလုပ်လိုသော ဂိမ်းကို ရွေးချယ်ပါ</p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="ဂိမ်းအမည် ရှာဖွေရန်..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1A2235] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
        />
      </div>

      {/* Games Grid Layout */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <p className="text-teal-400 animate-pulse text-sm">ဂိမ်းအချက်အလက်များ ယူနေပါသည်...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              // ဂိမ်းတစ်ခုကို နှိပ်ပါက ထိုဂိမ်း၏ ဝယ်ယူမည့် Page သို့ game.code ယူဆောင်သွားပါမည် (ဥပမာ - /topup/mlbb)
              onClick={() => navigate(`/topup/${game.code}`)} 
              className="bg-[#1A2235] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:ring-2 ring-teal-500 transition flex flex-col"
            >
              <img
                src={game.image_url}
                alt={game.name}
                className="w-full aspect-square object-cover bg-white"
              />
              <div className="p-2 text-center flex-grow flex items-center justify-center">
                <p className="text-[10px] font-semibold line-clamp-2">{game.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}