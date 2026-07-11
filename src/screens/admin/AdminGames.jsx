import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Gamepad2, CheckCircle, Search, AlertCircle } from 'lucide-react';

export default function AdminGames() {
  const [apiGames, setApiGames] = useState([]); 
  const [localGames, setLocalGames] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setApiError(false);
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // ၁။ Local DB
      try {
        const localRes = await axios.get('https://topup-bk-production.up.railway.app/api/admin/games', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setLocalGames(localRes.data?.games || []);
      } catch (err) {
        console.error("Local DB Error:", err.response?.data);
        if (err.response?.status === 401 || err.response?.status === 403) {
           alert("Admin ဝင်ခွင့် (Token) သက်တမ်းကုန်သွားပါပြီ။ ကျေးဇူးပြု၍ Login ပြန်ဝင်ပေးပါ။");
        }
      }

      // ၂။ RapidAPI
      try {
        const apiRes = await axios.get('https://topup-bk-production.up.railway.app/api/topup/games');
        let fetched = [];
        if (Array.isArray(apiRes.data)) fetched = apiRes.data;
        else if (Array.isArray(apiRes.data?.data)) fetched = apiRes.data.data;
        else if (Array.isArray(apiRes.data?.games)) fetched = apiRes.data.games;
        
        setApiGames(fetched);
      } catch (err) {
        setApiError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const addGame = async (game) => {
    setProcessingId(game.code);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.post('https://topup-bk-production.up.railway.app/api/admin/games', { 
        name: game.name, 
        gameCode: game.code, 
        imageUrl: game.image || '' 
      }, { headers: { Authorization: `Bearer ${adminToken}` } });
      fetchAllData(); 
    } catch (err) { alert('ဂိမ်းထည့်၍ မရပါ။'); } 
    finally { setProcessingId(null); }
  };

  const deleteGame = async (localGameId, gameCode) => {
    if (!window.confirm("ဖျက်မှာ သေချာပါသလား?")) return;
    setProcessingId(gameCode);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.delete(`https://topup-bk-production.up.railway.app/api/admin/games/${localGameId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchAllData(); 
    } catch (err) { alert('ဂိမ်းဖျက်၍ မရပါ။'); } 
    finally { setProcessingId(null); }
  };

  const combinedGames = [];
  const localCodes = new Set();

  localGames.forEach(lg => {
    const code = lg.gameCode || lg.code || '';
    localCodes.add(code);
    combinedGames.push({
      _localId: lg._id,
      code: code,
      name: lg.name || 'Unknown',
      image: lg.imageUrl || '',
      isAdded: true
    });
  });

  apiGames.forEach(ag => {
    const code = ag.code || ag.gameCode || ag.id || '';
    if (code && !localCodes.has(code)) {
      combinedGames.push({
        _localId: null,
        code: code,
        name: ag.name || ag.title || 'Unknown API Game',
        // 💡 ဤနေရာတွင် ag.image_url ကို ဖမ်းယူရန် ထပ်ထည့်ထားပါသည်
        image: ag.image_url || ag.image || ag.imageUrl || '',
        isAdded: false
      });
    }
  });

  const filteredGames = combinedGames.filter(game => 
    (game.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (game.code || '').toLowerCase().includes(searchTerm.toLowerCase())
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

      {apiError && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-yellow-500">RapidAPI မှ ဒေတာများ ဆွဲယူ၍ မရပါ။ Backend ကို `git push` လုပ်ထားခြင်း ရှိ/မရှိ စစ်ဆေးပါ။</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10 text-teal-400 animate-pulse">ဒေတာများ ဆွဲယူနေပါသည်...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game, idx) => {
            const isProcessing = processingId === game.code;
            return (
              <div key={game.code || idx} className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[140px] ${game.isAdded ? 'bg-teal-500/10 border-teal-500/50' : 'bg-[#1A2235] border-slate-700'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-800">
  {game.image ? (
    <img 
      // 💡 Admin Panel တွင်လည်း ပုံများပေါ်စေရန် Proxy ဖြင့် ပတ်ခေါ်ပါသည်
      src={`https://topup-bk-production.up.railway.app/api/topup/image-proxy?url=${encodeURIComponent(game.image)}`} 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = '/images/logo.jpg'; 
      }}
    />
  ) : (
    <Gamepad2 size={24} className="text-gray-400" />
  )}
</div>

                    <div>
                      <h3 className="font-bold text-sm line-clamp-1">{game.name}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{game.code}</p>
                    </div>
                  </div>
                  {game.isAdded && <CheckCircle size={20} className="text-teal-400 flex-shrink-0" />}
                </div>

                <div>
                  {game.isAdded ? (
                    <button onClick={() => deleteGame(game._localId, game.code)} disabled={isProcessing} className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 flex justify-center items-center gap-2">
                      {isProcessing ? 'Removing...' : <><Trash2 size={16} /> ဖယ်ရှားမည်</>}
                    </button>
                  ) : (
                    <button onClick={() => addGame(game)} disabled={isProcessing} className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-[#121722] flex justify-center items-center gap-2">
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
