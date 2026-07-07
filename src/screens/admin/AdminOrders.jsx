import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, CheckCircle, Clock, XCircle, Gamepad2, User as UserIcon } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, success, failed

  const fetchOrders = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const res = await axios.get('https://topup-bk-production.up.railway.app/api/admin/all-orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.data && res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Orders Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search & Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.playerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.gameCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || order.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Status အရ အရောင်နှင့် Icon ပြောင်းပေးမည့် Function
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'success':
        return { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: <CheckCircle size={14} />, text: 'အောင်မြင်သည်' };
      case 'failed':
        return { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: <XCircle size={14} />, text: 'ကျရှုံးသည်' };
      default:
        return { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: <Clock size={14} />, text: 'လုပ်ဆောင်ဆဲ' };
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up text-white pb-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="text-teal-400" /> Orders History
        </h2>
        
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="User နာမည်၊ Player နာမည် (သို့) ဂိမ်းကုဒ် ရှာရန်..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A2235] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition shadow-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#1A2235] p-1 rounded-xl border border-slate-700 w-full overflow-x-auto hide-scrollbar">
          {['all', 'pending', 'success', 'failed'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-3 text-[11px] md:text-xs font-bold rounded-lg transition whitespace-nowrap capitalize ${
                filter === f ? 'bg-teal-500 text-[#121722]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'အားလုံး' : f === 'pending' ? 'လုပ်ဆောင်ဆဲ' : f === 'success' ? 'အောင်မြင်သည်' : 'ကျရှုံးသည်'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 mt-4">
        {loading ? (
          <div className="text-center py-10 text-teal-400 animate-pulse text-sm">
            အရောင်းမှတ်တမ်းများ ဆွဲယူနေပါသည်...
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusStyle = getStatusDisplay(order.status);
            
            return (
              <div key={order._id} className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                
                {/* ညာဘက်အပေါ်ထောင့်က Status Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-[10px] font-bold ${statusStyle.color}`}>
                  {statusStyle.icon} {statusStyle.text}
                </div>

                {/* ဝယ်ယူသူ အချက်အလက် */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-gray-300">
                    <UserIcon size={12} />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Buyer: <span className="text-white font-bold">{order.userId?.name || 'Unknown'}</span></p>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 my-1"></div>

                {/* Game & Package Info */}
                <div className="flex justify-between items-start mt-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
                      <Gamepad2 size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-teal-400 font-bold uppercase tracking-wider mb-0.5">{order.gameCode}</p>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{order.packageName}</h3>
                    </div>
                  </div>
                </div>

                {/* Player Info Box */}
                <div className="bg-[#121722] p-3 rounded-xl border border-slate-700/50 mt-1 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Player Name / ID</p>
                    <p className="text-xs font-bold text-gray-300">
                      {order.playerName || 'N/A'} <span className="text-gray-500 font-normal">({order.playerId} {order.serverId ? `| ${order.serverId}` : ''})</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 mb-0.5">Price</p>
                    <p className="text-sm font-black text-teal-400">{order.price} Ks</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-[10px] text-gray-500 text-right mt-1">
                  {new Date(order.createdAt).toLocaleString('en-US', { 
                    year: 'numeric', month: 'short', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </p>

              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm bg-[#1A2235] rounded-2xl border border-slate-700">
            မှတ်တမ်း မရှိသေးပါ။
          </div>
        )}
      </div>

    </div>
  );
}
