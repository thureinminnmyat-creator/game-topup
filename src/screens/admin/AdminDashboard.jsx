import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken'); 
        
        const res = await axios.get('https://topup-bk-production.up.railway.app/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${adminToken}` } 
        });
        
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Dashboard Error", error);
        setStats({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-teal-400 animate-pulse text-center mt-20 text-sm">Dashboard အချက်အလက်များ ဆွဲယူနေပါသည်...</div>;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in-up pb-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-6">Dashboard Overview</h2>

      {/* 📊 သတင်းအချက်အလက် ကတ်များ (Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        
        {/* Total Users Card */}
        <div className="bg-[#1A2235] p-4 md:p-6 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-sm md:shadow-lg transition-transform hover:scale-[1.02]">
          <div className="p-3 md:p-4 bg-blue-500/20 text-blue-400 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1">Total Users</p>
            <p className="text-xl md:text-2xl font-black text-white">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-[#1A2235] p-4 md:p-6 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-sm md:shadow-lg transition-transform hover:scale-[1.02]">
          <div className="p-3 md:p-4 bg-purple-500/20 text-purple-400 rounded-xl">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1">Total Orders</p>
            <p className="text-xl md:text-2xl font-black text-white">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-[#1A2235] p-4 md:p-6 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-sm md:shadow-lg sm:col-span-2 md:col-span-1 transition-transform hover:scale-[1.02]">
          <div className="p-3 md:p-4 bg-teal-500/20 text-teal-400 rounded-xl">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1">Total Revenue</p>
            <p className="text-xl md:text-2xl font-black text-white">
              {stats.totalRevenue.toLocaleString()} <span className="text-xs md:text-sm font-bold text-teal-400">Ks</span>
            </p>
          </div>
        </div>

      </div>

      {/* 📈 ယာယီ Chart နေရာလွတ် */}
      <div className="bg-[#1A2235] p-4 md:p-6 rounded-2xl border border-slate-700 h-48 md:h-64 flex flex-col items-center justify-center text-gray-500 shadow-sm md:shadow-lg mt-4 md:mt-6">
        <Activity size={40} className="mb-2 opacity-20" />
        <p className="text-xs md:text-sm">Activity Chart will appear here</p>
      </div>
    </div>
  );
}