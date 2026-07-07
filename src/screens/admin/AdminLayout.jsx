import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, ListOrdered, Settings, LogOut, Menu, Lock, Gamepad2 } from 'lucide-react';
import axios from 'axios';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Admin Security States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretPassword, setSecretPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/deposits', label: 'Deposits', icon: Wallet },
    { path: '/admin/orders', label: 'Orders', icon: ListOrdered },
    { path: '/admin/games', label: 'Games', icon: Gamepad2 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    // Admin Token ရှိ/မရှိ စစ်ဆေးခြင်း
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!secretPassword) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      // ⚠️ Backend သို့ Master Password စစ်ဆေးရန် ပို့ခြင်း
      const res = await axios.post('https://topup-bk-production.up.railway.app/api/admin/verify-secret', 
        { secretPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.success) {
        // မှန်ကန်ပါက Admin Token အသစ်ကို သိမ်းမည်
        localStorage.setItem('adminToken', res.data.adminToken);
        setIsUnlocked(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'စကားဝှက် မှားယွင်းနေပါသည်။');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  // 🔒 Master Password မမှန်သေးပါက လုံခြုံရေး Modal ပြမည်
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#121722] flex items-center justify-center p-4">
        <div className="bg-[#1A2235] p-6 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm animate-fade-in-up">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-1">Admin အတည်ပြုရန်</h2>
          <p className="text-xs text-gray-400 text-center mb-6">ဆက်လက်လုပ်ဆောင်ရန် လျှို့ဝှက်စကားဝှက် ထည့်ပါ</p>
          
          <form onSubmit={handleUnlock}>
            <input 
              type="password" 
              placeholder="Master Password" 
              value={secretPassword}
              onChange={(e) => setSecretPassword(e.target.value)}
              className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition mb-2"
            />
            {error && <p className="text-xs text-red-400 text-center mb-4">{error}</p>}
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold py-3 rounded-xl transition mt-4"
            >
              {loading ? 'စစ်ဆေးနေသည်...' : 'အတည်ပြုမည်'}
            </button>
          </form>
          <button onClick={() => navigate('/')} className="w-full text-center text-xs text-gray-500 mt-4 hover:text-white">
            ပင်မစာမျက်နှာသို့ ပြန်သွားမည်
          </button>
        </div>
      </div>
    );
  }

  // 🔓 Unlocked ဖြစ်သွားပါက ပုံမှန် Admin Layout ကို ပြမည်
  return (
    <div className="min-h-screen bg-[#121722] text-white flex flex-col md:flex-row font-sans animate-fade-in">
      <div className="md:hidden bg-[#1A2235] border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-xl font-black text-teal-400 tracking-wider">WAM ADMIN</h2>
        <button className="text-gray-400"><Menu size={24} /></button>
      </div>

      <div className="hidden md:flex flex-col w-64 bg-[#1A2235] border-r border-slate-700 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-700 text-center">
          <h2 className="text-2xl font-black text-teal-400 tracking-widest">WAM</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Control Panel</p>
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition font-semibold text-sm"
          >
            <LogOut size={20} /> ထွက်မည်
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#1A2235] border-t border-slate-700 flex justify-around p-2 z-50">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} className={`p-2 ${isActive ? 'text-teal-400' : 'text-gray-500'}`}>
              <Icon size={24} />
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
        <Outlet /> 
      </div>
    </div>
  );
}