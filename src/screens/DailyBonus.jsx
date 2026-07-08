import React, { useState, useEffect } from 'react';
import { ChevronLeft, Gift, Check, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DailyBonus() {
  const navigate = useNavigate();
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true); // 💡 အစပိုင်းတွင် စစ်ဆေးရန် true ပြောင်းထားသည်
  
  // 💡 Custom Toast Alert ပြသရန်အတွက် State များ
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 💡 Page ပွင့်လာသည်နှင့် ယနေ့ ယူပြီးသားလား လှမ်းစစ်မည့် အပိုင်း
  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('https://topup-bk-production.up.railway.app/api/topup/check-daily-bonus', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.claimed) {
          setClaimed(true); // ယူပြီးသားဆိုလျှင် ခလုတ်ပိတ်ထားမည်
        }
      } catch (error) {
        console.error("Error checking bonus status");
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, []);

  const handleClaim = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("လက်ဆောင်ရယူရန် အရင်ဆုံး အကောင့်ဝင် (Login) ပေးပါ။");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Backend API သို့ လှမ်းပို့ခြင်း
      const response = await axios.post(
        'https://topup-bk-production.up.railway.app/api/topup/claim-daily-bonus', 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.success) {
        setClaimed(true);
        // 💡 Custom Toast စတင်ပြသခြင်း
        setToastMessage(`ဂုဏ်ယူပါသည်! နေ့စဉ်လက်ဆောင် ${response.data.bonus} Ks ကို သင့် Wallet ထဲသို့ ပေါင်းထည့်ပေးပြီးပါပြီ။`);
        setShowToast(true);
        
        // ၅ စက္ကန့်ပြည့်ရင် Toast ကို အလိုအလျောက် ပြန်ဖျောက်မည်
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "ယနေ့အတွက် ရယူရာတွင် အဆင်မပြေဖြစ်ပွားခဲ့သည်။");
      // 💡 Backend မှ ယူပြီးသားဟု ငြင်းလိုက်လျှင် ခလုတ်ကို ပိတ်မည်
      if (error.response?.status === 400) setClaimed(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24 relative overflow-hidden">
      
      {/* 💡 လှပသော Custom Toast Design */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-gradient-to-r from-teal-500 to-emerald-500 text-[#121722] p-4 rounded-2xl shadow-[0_10px_30px_rgba(45,212,191,0.3)] z-50 flex items-start gap-3 animate-fade-in-up border border-teal-300/30">
          <div className="p-1.5 bg-white/20 rounded-xl mt-0.5 animate-pulse">
            <Sparkles size={18} className="text-[#121722]" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-sm tracking-wide">SUCCESSFUL!</h4>
            <p className="text-xs font-semibold mt-0.5 leading-relaxed opacity-90">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg transition">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center p-4 bg-[#1A2235] sticky top-0 z-10 shadow-md border-b border-slate-700/50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold ml-2 uppercase tracking-wider">Daily Bonus</h2>
      </div>

      <div className="p-4 flex flex-col items-center justify-center mt-12">
        {/* Gift Box Icon with Glow Effect */}
        <div className="w-32 h-32 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(45,212,191,0.15)] border border-teal-500/20 relative">
          <Gift size={55} className={`text-orange-400 ${claimed ? '' : 'animate-bounce'}`} />
          {!claimed && !loading && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          )}
        </div>
        
        <h3 className="text-2xl font-black mb-2 tracking-wide">နေ့စဉ် အခမဲ့လက်ဆောင်</h3>
        <p className="text-xs text-gray-400 text-center px-6 mb-12 leading-relaxed">
          Faygo games shop သို့ နေ့စဉ်ဝင်ရောက်ပြီး အခမဲ့ငွေသားဆုလာဘ်များကို ရယူလိုက်ပါ။
        </p>

        <button 
          onClick={handleClaim}
          disabled={claimed || loading}
          className={`w-full max-w-sm py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95 duration-200 shadow-lg ${
            claimed 
              ? 'bg-[#1A2235] text-gray-500 border border-slate-700 shadow-none' 
              : 'bg-teal-500 text-[#121722] hover:bg-teal-600 shadow-teal-500/10'
          }`}
        >
          {loading ? (
            'ခေတ္တစောင့်ဆိုင်းပါ...'
          ) : claimed ? (
            <><Check size={20} /> ယနေ့အတွက် ရယူပြီးပါပြီ</>
          ) : (
            <>
              <Sparkles size={18} />
              Claim
            </>
          )}
        </button>
      </div>
    </div>
  );
}
