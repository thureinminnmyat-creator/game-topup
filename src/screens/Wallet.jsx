import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, XCircle, ChevronLeft, ArrowDownCircle, Clock } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

export default function Wallet() {
  const [activeTab, setActiveTab] = useState('order');
  
  // States များ
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]); // 👈 ငွေသွင်းမှတ်တမ်းများ သိမ်းရန်
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert("Login Token မရှိပါ။ ကျေးဇူးပြု၍ အကောင့်ပြန်ဝင်ပါ။");
        setLoading(false);
        return;
      }

      // =====================================
      // ၁။ ငွေသွင်းမှတ်တမ်းများ (Transactions)
      // =====================================
      try {
        const transRes = await axios.get('https://topup-bk-production.up.railway.app/api/wallet/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (transRes.data && transRes.data.success) {
          setTransactions(transRes.data.data);
        }
      } catch (error) {
        console.error("History Error:", error);
        alert("ငွေသွင်းမှတ်တမ်း API မရှိသေးပါ (Status: " + error.response?.status + ")");
      }

      // =====================================
      // ၂။ ဝယ်ယူမှုမှတ်တမ်းများ (Orders)
      // =====================================
      try {
        // မှတ်ချက်: my-orders-test အစား /orders ဟု ပြင်ထားပါသည် (Backend တွင် ရေးထားရန် လိုအပ်သည်)
        const orderRes = await axios.get('https://topup-bk-production.up.railway.app/api/topup/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (orderRes.data && orderRes.data.success) {
          setOrders(orderRes.data.orders);
        }
      } catch (error) {
        console.error("Orders Error:", error);
        // လောလောဆယ် Orders API မရေးရသေးလျှင် (404 ဖြစ်နေလျှင်) ဤအပိုင်းကို ကျော်သွားမည်ဖြစ်၍ App မပျက်တော့ပါ။
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24 px-4 pt-6">
      
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
            {/* ===================== ဝယ်ယူမှု မှတ်တမ်း တက်ဘ် ===================== */}
            {activeTab === 'order' && (
              orders.length === 0 ? (
                <p className="text-center text-gray-500 text-sm mt-10 bg-[#1A2235] py-8 rounded-2xl border border-slate-700">ဝယ်ယူထားသော မှတ်တမ်း မရှိသေးပါ။</p>
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

            {/* ===================== ငွေအဝင်/အထွက် မှတ်တမ်း တက်ဘ် ===================== */}
            {activeTab === 'transaction' && (
              transactions.length === 0 ? (
                <p className="text-center text-gray-500 text-sm mt-10 bg-[#1A2235] py-8 rounded-2xl border border-slate-700">ငွေအဝင်/အထွက် မှတ်တမ်း မရှိသေးပါ။</p>
              ) : (
                transactions.map((txn) => (
                  <div key={txn._id} className="bg-[#1A2235] p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                        <ArrowDownCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Deposit <span className="text-gray-400 text-[10px] uppercase ml-1">({txn.payment_method})</span></p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(txn.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-400">+{txn.amount} Ks</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        txn.status === 'approved' ? 'text-green-400' : 
                        txn.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {txn.status === 'approved' ? <CheckCircle size={12} /> : 
                         txn.status === 'rejected' ? <XCircle size={12} /> : <Clock size={12} />}
                        <span className="text-[10px] capitalize font-bold">{txn.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}