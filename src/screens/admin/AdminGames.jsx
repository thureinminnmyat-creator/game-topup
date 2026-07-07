import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Gamepad2, X } from 'lucide-react';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', gameCode: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get('https://topup-bk-production.up.railway.app/api/topup/games');
      setGames(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error", err);
    }
  };

  // Add Game
  const addGame = async () => {
    if (!newGame.name || !newGame.gameCode) return alert("အချက်အလက် ပြည့်စုံအောင်ဖြည့်ပါ။");
    
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.post('https://topup-bk-production.up.railway.app/api/admin/games', newGame, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      alert('ဂိမ်းအသစ် ထည့်သွင်းပြီးပါပြီ။');
      setNewGame({ name: '', gameCode: '', imageUrl: '' }); // Input အကွက်ရှင်းမည်
      fetchGames();
    } catch (err) {
      alert('ဂိမ်းထည့်၍ မရပါ။');
    } finally {
      setLoading(false);
    }
  };

  // 👈 Game Delete လုပ်မည့် Function အသစ်
  const deleteGame = async (id) => {
    if (!window.confirm("ဒီဂိမ်းကို ဖျက်မှာ သေချာပါသလား?")) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.delete(`https://topup-bk-production.up.railway.app/api/admin/games/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      alert('ဂိမ်းဖျက်ပြီးပါပြီ။');
      fetchGames(); // စာရင်းပြန်ဆွဲမည်
    } catch (err) {
      alert('ဂိမ်းဖျက်၍ မရပါ။');
    }
  };

  return (
    <div className="text-white space-y-6 pb-20 animate-fade-in-up">
      <h2 className="text-2xl font-bold">Game Management</h2>
      
      {/* Add Game Form */}
      <div className="bg-[#1A2235] p-5 rounded-2xl border border-slate-700 space-y-3">
        <input 
          className="w-full bg-[#121722] border border-slate-700 p-3 rounded-xl text-sm" 
          placeholder="Game Name (ဥပမာ - Mobile Legends)" 
          value={newGame.name}
          onChange={e => setNewGame({...newGame, name: e.target.value})} 
        />
        <input 
          className="w-full bg-[#121722] border border-slate-700 p-3 rounded-xl text-sm" 
          placeholder="Game Code (ဥပမာ - mlbb)" 
          value={newGame.gameCode}
          onChange={e => setNewGame({...newGame, gameCode: e.target.value})} 
        />
        <button onClick={addGame} disabled={loading} className="w-full bg-teal-500 py-3 rounded-xl font-bold flex justify-center gap-2 hover:bg-teal-600 transition">
          {loading ? 'Adding...' : <><Plus size={20} /> Add Game</>}
        </button>
      </div>

      {/* Game List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {games.map(game => (
          <div key={game._id} className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-teal-400">
                <Gamepad2 size={20} />
              </div>
              <span className="font-bold text-sm">{game.name}</span>
            </div>
            <button 
              onClick={() => deleteGame(game._id)} // 👈 Delete ခလုတ်တွင် function ချိတ်ပေးလိုက်ပါပြီ
              className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}