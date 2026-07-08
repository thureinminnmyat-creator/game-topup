import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Send, Users, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSendNoti() {
  const [targetType, setTargetType] = useState('all'); // 'all' သို့မဟုတ် 'specific'
  const [selectedUserId, setSelectedUserId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // User စာရင်းကို Dropdown အတွက် ဆွဲယူမည်
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        // အစ်ကို့ရဲ့ admin users api လမ်းကြောင်းအတိုင်း ပြင်နိုင်ပါသည်
        const res = await axios.get('https://topup-bk-production.up.railway.app/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleSendNoti = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (targetType === 'specific' && !selectedUserId) {
      setMessage({ type: 'error', text: 'ကျေးဇူးပြု၍ ပို့ဆောင်လိုသော User ကို ရွေးချယ်ပါ။' });
      return;
    }

    if (!title || !desc) {
      setMessage({ type: 'error', text: 'ခေါင်းစဉ်နှင့် အသေးစိတ်စာသား ပြည့်စုံစွာ ဖြည့်ပါ။' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      const payload = {
        targetUser: targetType === 'all' ? 'all' : selectedUserId,
        title,
        desc
      };

      const res = await axios.post('https://topup-bk-production.up.railway.app/api/admin/send-notification', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Notification အောင်မြင်စွာ ပို့ဆောင်ပြီးပါပြီ။' });
        setTitle('');
        setDesc('');
        setTargetType('all');
        setSelectedUserId('');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Notification ပို့ဆောင်ရာတွင် အမှားအယွင်းရှိပါသည်။' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans text-white">
      <div className="bg-[#1A2235] border border-slate-700 rounded-2xl p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
          <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center">
            <Megaphone size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">ကြေညာချက်ပေးပို့ရန်</h2>
            <p className="text-xs text-gray-400 mt-1">User များဆီသို့ Notification ပို့ဆောင်နိုင်ပါသည်။</p>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSendNoti} className="space-y-5">
          
          {/* Target Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">မည်သူ့ထံ ပို့ဆောင်မည်နည်း?</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setTargetType('all')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition ${
                  targetType === 'all' 
                    ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' 
                    : 'bg-[#121722] border-slate-700 text-gray-400 hover:border-slate-500'
                }`}
              >
                <Users size={18} />
                <span className="text-sm font-medium">User အားလုံးသို့</span>
              </div>
              <div 
                onClick={() => setTargetType('specific')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition ${
                  targetType === 'specific' 
                    ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' 
                    : 'bg-[#121722] border-slate-700 text-gray-400 hover:border-slate-500'
                }`}
              >
                <User size={18} />
                <span className="text-sm font-medium">သီးသန့် User သို့</span>
              </div>
            </div>
          </div>

          {/* User Dropdown (Shown only if 'specific' is selected) */}
          {targetType === 'specific' && (
            <div className="space-y-2 animate-fade-in-up">
              <label className="text-sm font-semibold text-gray-300">User အား ရွေးချယ်ပါ</label>
              <select 
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700 text-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 transition"
              >
                <option value="">-- User ရွေးချယ်ပါ --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email || user.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">ခေါင်းစဉ် (Title)</label>
            <input 
              type="text" 
              placeholder="ဥပမာ - ပရိုမိုးရှင်း အထူးသတင်း"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121722] border border-slate-700 text-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">အသေးစိတ် (Description)</label>
            <textarea 
              rows="4"
              placeholder="ကြေညာလိုသော စာသားများကို ရိုက်ထည့်ပါ..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-[#121722] border border-slate-700 text-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 transition resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {loading ? (
              'ပို့ဆောင်နေပါသည်...'
            ) : (
              <>
                <Send size={18} />
                Notification ပို့မည်
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
