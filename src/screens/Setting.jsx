import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, Key, Globe, Palette, LogOut, 
  ChevronRight, X, Lock, Send 
} from 'lucide-react';
import axios from 'axios';

export default function Setting() {
  const navigate = useNavigate();
  
  // အကောင့်ဝင်ထားသူ၏ အချက်အလက်များ သိမ်းရန် State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTheme, setActiveTheme] = useState('teal');
  const [language, setLanguage] = useState('မြန်မာ (Myanmar)');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const themes = [
    { id: 'teal', color: 'bg-teal-500' },
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'purple', color: 'bg-purple-500' },
    { id: 'orange', color: 'bg-orange-500' },
    { id: 'rose', color: 'bg-rose-500' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      // LocalStorage မှ Token ကို ယူစစ်ခြင်း
      const token = localStorage.getItem('token');
      
      // ⚠️ တကယ်လို့ Token မရှိရင် (Login မဝင်ရသေးရင်) ရိုက်ထည့်ပြီး ဝင်ခိုင်းရန် Login Page သို့ ပို့မည်
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Backend မှ မိမိ Profile Data ကို တောင်းခြင်း
        // (မှတ်ချက်: Backend တွင် /api/auth/profile သို့မဟုတ် သက်ဆိုင်ရာ လမ်းကြောင်း ရှိရပါမည်)
        const response = await axios.get('https://topup-bk-production.up.railway.app/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          setUser(response.data.user); // Database ထဲက user data ကို ထည့်မည်
        }
      } catch (error) {
        console.error("Profile Error:", error);
        // Token သက်တမ်းကုန်သွားခြင်း သို့မဟုတ် အမှားရှိပါက အကောင့်ပြန်ထွက်ခိုင်းမည်
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout ခလုတ်နှိပ်လျှင် LocalStorage ကို ဖျက်ပြီး Login သို့ ပို့မည်
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert("ကျေးဇူးပြု၍ စကားဝှက်များကို ပြည့်စုံစွာ ထည့်ပါ။");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://topup-bk-production.up.railway.app/api/auth/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        alert("စကားဝှက် ပြောင်းလဲခြင်း အောင်မြင်ပါသည်။");
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      alert(error.response?.data?.message || "စကားဝှက် ပြောင်းလဲ၍ မရပါ။");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121722] flex items-center justify-center">
        <p className="text-teal-400 animate-pulse text-sm">အကောင့်အချက်အလက်များ စစ်ဆေးနေပါသည်...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24 px-4 pt-6 relative">
      <h2 className="text-2xl font-bold mb-6">ဆက်တင် (Settings)</h2>

      {/* ၁။ Profile & Wallet Section (တကယ့် Database က ဒေတာများ ပြပါမည်) */}
      <div className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-lg mb-6">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-700/50">
          <div className="w-14 h-14 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full flex items-center justify-center text-[#121722] font-black text-xl shadow-lg uppercase">
            {user?.name ? user.name.charAt(0) : 'U'} {/* နာမည်ရဲ့ ပထမဆုံးစာလုံးကို အလိုအလျောက် ယူပြမည် */}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight capitalize">{user?.name || 'Wam User'}</h3>
            <p className="text-xs text-gray-400">{user?.email || 'email@example.com'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#121722] p-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400">လက်ကျန်ငွေ</p>
              <p className="font-bold text-teal-400">{user?.balance || 0} Ks</p> {/* User ရဲ့ ပိုက်ဆံအစစ် ပြမည် */}
            </div>
          </div>
          <button 
            onClick={() => navigate('/wallet')} 
            className="bg-teal-500 hover:bg-teal-600 text-[#121722] px-4 py-2 rounded-lg text-xs font-bold transition shadow-md"
          >
            ငွေဖြည့်ရန်
          </button>
        </div>
      </div>

      {/* ၂။ App Settings List */}
      <div className="bg-[#1A2235] rounded-2xl border border-slate-700 shadow-lg mb-6 overflow-hidden">
        
        <div 
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center justify-between p-4 border-b border-slate-700/50 cursor-pointer hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 text-gray-300 rounded-lg"><Key size={18} /></div>
            <span className="text-sm font-medium">စကားဝှက် ပြောင်းရန်</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 text-gray-300 rounded-lg"><Globe size={18} /></div>
            <span className="text-sm font-medium">ဘာသာစကား (Language)</span>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#121722] border border-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none text-gray-300"
          >
            <option>မြန်မာ (Myanmar)</option>
            <option>English</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 text-gray-300 rounded-lg"><Palette size={18} /></div>
            <span className="text-sm font-medium">အသွင်အပြင် (Theme)</span>
          </div>
          <div className="flex gap-2">
            {themes.map(theme => (
              <button 
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`w-6 h-6 rounded-full ${theme.color} ${activeTheme === theme.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1A2235]' : 'opacity-50'}`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* ၃။ Connect to Admin */}
      <h3 className="text-sm font-bold text-gray-400 mb-3 px-2">အက်ဒမင်နှင့် ဆက်သွယ်ရန်</h3>
      <div className="bg-[#1A2235] rounded-2xl border border-slate-700 shadow-lg mb-6 flex justify-around p-4">
        <button onClick={() => window.open('https://m.me/your_page', '_blank')} className="text-blue-400 text-sm font-bold hover:underline">
          Facebook
        </button>
        <button onClick={() => window.open('viber://chat?number=09xxxxxxxxx', '_blank')} className="text-purple-400 text-sm font-bold hover:underline">
          Viber
        </button>
        <button onClick={() => alert("WeChat ID: wamtrading_admin")} className="text-green-400 text-sm font-bold hover:underline">
          WeChat
        </button>
      </div>

      {/* ၄။ Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold text-sm transition"
      >
        <LogOut size={18} />
        အကောင့်ထွက်မည် (Logout)
      </button>

      {/* ၅။ Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1A2235] w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-5 relative">
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Key className="text-teal-400" size={20} /> စကားဝှက် ပြောင်းရန်
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">လက်ရှိ စကားဝှက်</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="password" 
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-[#121722] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">စကားဝှက်သစ်</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#121722] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => window.open('https://t.me/wamtrading_admin', '_blank')}
                  className="text-xs font-semibold text-teal-400 hover:underline flex items-center justify-end gap-1 w-full"
                >
                  <Send size={12} /> စကားဝှက် မေ့နေပါသလား?
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] py-3 rounded-xl text-sm font-bold mt-2 transition"
              >
                သိမ်းဆည်းမည်
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}