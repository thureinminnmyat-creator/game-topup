import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Key, X, Wallet, User as UserIcon } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [balanceModal, setBalanceModal] = useState({ show: false, userId: '', name: '', balance: 0 });
  const [passwordModal, setPasswordModal] = useState({ show: false, userId: '', name: '', newPassword: '' });

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const res = await axios.get('https://topup-bk-production.up.railway.app/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.data && res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Users Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.put(`https://topup-bk-production.up.railway.app/api/admin/users/${balanceModal.userId}/balance`, 
        { balance: balanceModal.balance },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      alert('လက်ကျန်ငွေ ပြင်ဆင်ခြင်း အောင်မြင်ပါသည်။');
      setBalanceModal({ show: false, userId: '', name: '', balance: 0 });
      fetchUsers();
    } catch (error) {
      alert('အမှားအယွင်းဖြစ်ပွားခဲ့ပါသည်။');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordModal.newPassword) return alert("စကားဝှက် အသစ်ထည့်ပါ။");
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.put(`https://topup-bk-production.up.railway.app/api/admin/users/${passwordModal.userId}/password`, 
        { newPassword: passwordModal.newPassword },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      alert('စကားဝှက် ပြောင်းလဲခြင်း အောင်မြင်ပါသည်။');
      setPasswordModal({ show: false, userId: '', name: '', newPassword: '' });
    } catch (error) {
      alert('အမှားအယွင်းဖြစ်ပွားခဲ့ပါသည်။');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in-up text-white pb-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="နာမည် (သို့) Email ရှာရန်..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A2235] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition shadow-sm"
          />
        </div>
      </div>

      {/* 📱 Mobile Optimized Users List (Card ပုံစံ) */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-teal-400 animate-pulse text-sm">
            Users အချက်အလက်များ ဆွဲယူနေပါသည်...
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-sm flex flex-col gap-3">
              
              {/* User Info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{user.name}</h3>
                    <p className="text-[11px] text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                  user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* Balance & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 mt-1">
                <div>
                  <p className="text-[10px] text-gray-400">Balance</p>
                  <p className="font-bold text-teal-400 text-sm">{user.wallet_balance || 0} Ks</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setBalanceModal({ show: true, userId: user._id, name: user.name, balance: user.wallet_balance || 0 })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500 hover:text-[#121722] rounded-lg transition text-xs font-semibold"
                  >
                    <Wallet size={14} /> ငွေပြင်မည်
                  </button>
                  <button 
                    onClick={() => setPasswordModal({ show: true, userId: user._id, name: user.name, newPassword: '' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition text-xs font-semibold"
                  >
                    <Key size={14} /> PW ပြောင်းမည်
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm bg-[#1A2235] rounded-2xl border border-slate-700">
            ရှာဖွေမှုရလဒ် မတွေ့ရှိပါ။
          </div>
        )}
      </div>

      {/* --- Balance Modal --- */}
      {balanceModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1A2235] w-full max-w-sm rounded-2xl border border-slate-700 p-5 relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setBalanceModal({ show: false })} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-1 text-white">Balance ပြင်ဆင်ရန်</h3>
            <p className="text-xs text-teal-400 mb-5">{balanceModal.name} ၏ အကောင့်</p>
            
            <form onSubmit={handleUpdateBalance}>
              <label className="text-xs text-gray-400 block mb-2">ငွေပမာဏ အသစ် (Ks)</label>
              <input 
                type="number" 
                value={balanceModal.balance}
                onChange={(e) => setBalanceModal({...balanceModal, balance: e.target.value})}
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 mb-5 shadow-inner"
              />
              <button type="submit" className="w-full bg-teal-500 text-[#121722] font-bold py-3.5 rounded-xl hover:bg-teal-600 transition shadow-lg shadow-teal-500/20">
                သိမ်းဆည်းမည်
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Password Modal --- */}
      {passwordModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1A2235] w-full max-w-sm rounded-2xl border border-slate-700 p-5 relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setPasswordModal({ show: false })} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-1 text-white">စကားဝှက် ပြောင်းပေးရန်</h3>
            <p className="text-xs text-red-400 mb-5">{passwordModal.name} ၏ အကောင့်</p>
            
            <form onSubmit={handleUpdatePassword}>
              <label className="text-xs text-gray-400 block mb-2">စကားဝှက် အသစ်</label>
              <input 
                type="text" 
                value={passwordModal.newPassword}
                onChange={(e) => setPasswordModal({...passwordModal, newPassword: e.target.value})}
                placeholder="စကားဝှက် အသစ်ရိုက်ထည့်ပါ"
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 mb-5 shadow-inner"
              />
              <button type="submit" className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-500/20">
                ပြောင်းလဲမည်
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}