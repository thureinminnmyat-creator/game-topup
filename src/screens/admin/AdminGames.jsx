import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Gamepad2, CheckCircle, Search } from 'lucide-react';

export default function AdminGames() {
  const [apiGames, setApiGames] = useState([]); 
  const [localGames, setLocalGames] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const localRes = await axios.get('https://topup-bk-production.up.railway.app/api/admin/games', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setLocalGames(localRes.data.games || []);

      const apiRes = await axios.get('https://topup-bk-production.up.railway.app/api/topup/games');
      const fetchedApiGames = Array.isArray(apiRes.data) ? apiRes.data : (apiRes.data.data || []);
      setApiGames(fetchedApiGames);

    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addGame = async (apiGame) => {
    setProcessingId(apiGame.code);
    try {
      const adminToken = localStorage.getItem('adminToken');
      // 💡 RapidAPI မှ ပုံလင့်ခ်ကို တိုက်ရိုက်ယူသိမ်းပါမည်
      const newGameData = { 
        name: apiGame.name, 
        gameCode: apiGame.code, 
        imageUrl: apiGame.image || '' 
      };

      await axios.post('https://topup-bk-production.up.railway.app/api/admin/games', newGameData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      fetchAllData(); 
    } catch (err) {
      alert('ဂိမ်းထည့်၍ မရပါ။');
    } finally {
      setProcessingId(null);
    }
  };

  const deleteGame = async (localGameId, gameCode) => {
    if (!window.confirm("ဒီဂိမ်းကို Shop ထဲမှ ဖျက်မှာ သေချာပါသလား?")) return;

    setProcessingId(gameCode);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.delete(`https://topup-bk-production.up.railway.app/api/admin/games/${localGameId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      fetchAllData(); 
    } catch (err) {
      alert('ဂိမ်းဖျက်၍ မရပါ။');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredGames = apiGames.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    game.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-white space-y-6 pb-20 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Game Management</h2>
        
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="ဂိမ်းနာမည် ရှာရန်..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A2235] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 outline-none"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-teal-400 animate-pulse">ဂိမ်းစာရင်းများ ဆွဲယူနေပါသည်...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((apiGame) => {
            const savedGame = localGames.find(lg => lg.gameCode === apiGame.code);
            const isAdded = !!savedGame;
            const isProcessing = processingId === apiGame.code;

            return (
              <div 
                key={apiGame.code} 
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] ${
                  isAdded 
                    ? 'bg-teal-500/10 border-teal-500/50 shadow-[0_0_10px_rgba(45,212,191,0.1)]' 
                    : 'bg-[#1A2235] border-slate-700 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* 💡 ဒီနေရာမှာ ပုံအစစ်ကို ပြပေးပါမည် */}
                      <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-800 ${isAdded ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-[#1A2235]' : ''}`}>
                        {apiGame.image ? (
                          <img src={apiGame.image} alt={apiGame.name} className="w-full h-full object-cover" />
                        ) : (
                          <Gamepad2 size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm line-clamp-1">{apiGame.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{apiGame.code}</p>
                      </div>
                    </div>
                    {isAdded && <CheckCircle size={20} className="text-teal-400 flex-shrink-0" />}
                  </div>
                </div>

                <div>
                  {isAdded ? (
                    <button 
                      onClick={() => deleteGame(savedGame._id, apiGame.code)}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? 'Removing...' : <><Trash2 size={16} /> ဖယ်ရှားမည်</>}
                    </button>
                  ) : (
                    <button 
                      onClick={() => addGame(apiGame)}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-[#121722] hover:bg-teal-600 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                    >
                      {isProcessing ? 'Adding...' : <><Plus size={16} /> Shop သို့ ထည့်မည်</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {filteredGames.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">ရှာဖွေမှုနှင့် ကိုက်ညီသော ဂိမ်းမရှိပါ။</p>
          )}
        </div>
      )}
    </div>
  );
}
