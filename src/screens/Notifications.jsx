import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Gift, CheckCircle, XCircle, Megaphone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend မှ Notifications များ ဆွဲယူခြင်း
  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('https://topup-bk-production.up.railway.app/api/topup/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Noti အားလုံးကို ဖတ်ပြီးသားအဖြစ် သတ်မှတ်ခြင်း
  const handleReadAll = async () => {
    const token = localStorage.getItem('token');
    if (!token || notifications.length === 0) return;

    try {
      const res = await axios.post('https://topup-bk-production.up.railway.app/api/topup/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // UI ကို တန်းပြီး Read အဖြစ် ပြောင်းလိုက်မည်
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Type အလိုက် Icon နှင့် အရောင် ကွဲပြားအောင် လုပ်ဆောင်ခြင်း
  const getNotiStyle = (type) => {
    switch (type) {
      case 'deposit_success':
        return { icon: <CheckCircle className="text-emerald-400" size={22} />, bg: 'border-emerald-500/20 bg-emerald-500/5' };
      case 'deposit_fail':
        return { icon: <XCircle className="text-red-400" size={22} />, bg: 'border-red-500/20 bg-red-500/5' };
      case 'order_success':
        return { icon: <Gift className="text-teal-400" size={22} />, bg: 'border-teal-500/20 bg-teal-500/5' };
      case 'order_fail':
        return { icon: <XCircle className="text-orange-400" size={22} />, bg: 'border-orange-500/20 bg-orange-500/5' };
      case 'admin':
      default:
        return { icon: <Megaphone className="text-yellow-400" size={22} />, bg: 'border-yellow-500/20 bg-yellow-500/5' };
    }
  };

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1A2235] sticky top-0 z-10 shadow-md border-b border-slate-700/50">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold ml-2">Notifications</h2>
        </div>
        
        {/* Read All Button */}
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleReadAll}
            className="text-xs text-teal-400 flex items-center gap-1 bg-teal-500/10 px-2.5 py-1.5 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition"
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <p className="text-teal-400 text-sm text-center py-10 animate-pulse">အသိပေးချက်များ ရှာဖွေနေပါသည်...</p>
        ) : notifications.length > 0 ? (
          notifications.map((noti) => {
            const style = getNotiStyle(noti.type);
            return (
              <div 
                key={noti._id} 
                className={`p-4 rounded-xl border flex gap-3.5 transition-all duration-300 ${style.bg} ${
                  noti.isRead ? 'opacity-65 border-slate-800' : 'border-slate-700/60 shadow-md'
                }`}
              >
                <div className="mt-0.5 p-1 bg-slate-800/60 rounded-lg h-fit border border-slate-700/40">
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-bold tracking-wide ${noti.isRead ? 'text-gray-400' : 'text-white'}`}>
                      {noti.title}
                    </h4>
                    {/* မဖတ်ရသေးလျှင် အစိမ်းစက်လေး ပြမည် */}
                    {!noti.isRead && (
                      <span className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-1.5 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-medium">{noti.desc}</p>
                  <p className="text-[10px] text-gray-500 mt-2.5 font-semibold">
                    {new Date(noti.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Bell size={45} className="text-gray-600 mb-3 animate-pulse" />
            <p className="text-sm font-semibold">အသိပေးချက်များ မရှိသေးပါ။</p>
          </div>
        )}
      </div>
    </div>
  );
}
