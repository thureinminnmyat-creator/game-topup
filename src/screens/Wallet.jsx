import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, XCircle, ChevronLeft } from 'lucide-react'; // 👈 ChevronLeft အသစ်ထည့်ထားသည်
import { useNavigate } from 'react-router-dom'; // 👈 Page ကူးရန်

export default function Wallet() {
  const [activeTab, setActiveTab] = useState('order');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 Navigate function ကြေညာထားသည်

  useEffect(() => {
    // Backend က Test API ဆီကနေ အကောင့်ဝင်စရာမလိုဘဲ ဒေတာတောင်းခြင်း
    axios.get('https://topup-bk-production.up.railway.app/api/topup/my-orders-test')
      .then((response) => {
        if (response.data && response.data.success) {
          setOrders(response.data.orders);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24 px-4 pt-6">
      
      {/* 👈 အသစ်ထည့်ထားသော Back ခလုတ်နှင့် Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-white transition cursor-pointer">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold ml-2">မှတ်တမ်းများ (History)</h2>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#1A2235] p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('order')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'order' ? 'bg-teal-500/20 text-teal-400 shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          ဝယ်ယူမှုများ
        </button>
        <button
          onClick={() => setActiveTab('transaction')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'transaction' ? 'bg-teal-500/20 text-teal-400 shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          ငွေအဝင်/အထွက်
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-teal-400 text-sm animate-pulse mt-10">ဒေတာများ ရယူနေပါသည်...</p>
        ) : (
          <>
            {/* ဝယ်ယူမှု မှတ်တမ်း တက်ဘ် */}
            {activeTab === 'order' && (
              orders.length === 0 ? (
                <p className="text-center text-gray-500 text-sm mt-10">ဝယ်ယူထားသော မှတ်တမ်း မရှိသေးပါ။</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="bg-[#1A2235] p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center">
                        <ShoppingCart size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase">{order.game_name}</p>
                        <p className="text-[11px] text-gray-400">
                          Product ID: {order.smile_product_id} • Player: {order.game_id}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-white">-{order.price} Ks</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${order.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {order.status === 'success' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span className="text-[10px] capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            {/* ငွေအဝင်/အထွက် တက်ဘ် */}
            {activeTab === 'transaction' && (
              <p className="text-center text-gray-500 text-sm mt-10">ငွေအဝင်/အထွက် လုပ်ဆောင်ချက်ကို Login/Signup ပြီးမှ ချိတ်ဆက်ပါမည်။</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}