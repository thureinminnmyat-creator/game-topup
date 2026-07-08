import React, { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LuckySpin() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [tickets, setTickets] = useState(0);
  const [loading, setLoading] = useState(true);

  // Page ဖွင့်သည်နှင့် လှည့်ခွင့် (Tickets) ဘယ်လောက်ရှိလဲ လှမ်းစစ်မည်
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

      try {
        const res = await axios.get('https://topup-bk-production.up.railway.app/api/topup/spin-status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setTickets(res.data.tickets);
        }
      } catch (error) {
        console.error("Fetch tickets error");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleSpin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("အကောင့်ဝင် (Login) ရန် လိုအပ်ပါသည်။");
      navigate('/login');
      return;
    }

    if (tickets <= 0) {
      alert("လှည့်ခွင့် (Tickets) မရှိတော့ပါ။ ဂိမ်း 50,000 Ks ဖိုး ဝယ်ယူတိုင်း လှည့်ခွင့် ၁ ခါ ရရှိပါမည်။");
      return;
    }

    setSpinning(true);
    setResult(null);
    
    try {
      // ၁။ Backend ကို ဆုမဲ အရင်လှမ်းတောင်းမည်
      const res = await axios.post(
        'https://topup-bk-production.up.railway.app/api/topup/play-spin',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // ၂။ Backend က ဆုမဲချပေးပြီးပြီဆိုလျှင် UI တွင် ဘီးကို ၃ စက္ကန့် လှည့်ပြမည် (Animation)
        setTimeout(() => {
          setResult(res.data.resultLabel); // ပေါက်သောဆု ပြမည်
          setTickets(res.data.ticketsLeft); // လက်ကျန် Ticket ပြင်မည်
          setSpinning(false);
        }, 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error ဖြစ်ပွားပါသည်။");
      setSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24 overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 bg-[#1A2235] sticky top-0 z-10 shadow-md border-b border-slate-700/50 justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold ml-2">Lucky Spin</h2>
        </div>
        
        {/* လက်ကျန် Tickets ပြသခြင်း */}
        <div className="flex items-center gap-1.5 bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-lg border border-teal-500/30 font-bold text-sm">
          <Ticket size={16} />
          {loading ? '...' : tickets}
        </div>
      </div>

      <div className="p-4 flex flex-col items-center mt-10">
        <h3 className="text-xl font-bold mb-2 text-teal-400">ကံစမ်းမဲ လှည့်ကြစို့!</h3>
        <p className="text-xs text-gray-400 mb-8 text-center px-4">
          စတိုးတွင် 50,000 Ks ဖိုး ဝယ်ယူတိုင်း လှည့်ခွင့် (၁) ကြိမ် ရရှိပါမည်။ 
        </p>

        {/* Spin Wheel ပုံစံ */}
        <div className="relative w-64 h-64 mb-10">
          <div className={`w-full h-full rounded-full border-4 border-teal-500 bg-[#1A2235] flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.2)] transition-transform duration-3000 ease-in-out ${spinning ? 'animate-spin' : ''}`}>
            {spinning ? (
              <HelpCircle size={50} className="text-teal-400 animate-pulse" />
            ) : (
              <span className="text-2xl font-black text-gray-300">SPIN</span>
            )}
          </div>
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-orange-500 drop-shadow-md z-10"></div>
        </div>

        {/* Result Message */}
        {result && (
          <div className="mb-8 p-4 bg-teal-500/20 border border-teal-500/50 rounded-xl text-center w-full max-w-xs animate-fade-in-up">
            <p className="text-sm text-gray-300 mb-1">သင်ရရှိသော ဆုမဲမှာ -</p>
            <p className="text-2xl font-black text-teal-400">{result}</p>
          </div>
        )}

        <button 
          onClick={handleSpin}
          disabled={spinning || loading}
          className={`w-full max-w-sm py-4 rounded-2xl font-bold text-lg transition active:scale-95 shadow-lg ${
            tickets > 0 
              ? 'bg-teal-500 text-[#121722] hover:bg-teal-600 shadow-teal-500/20' 
              : 'bg-[#1A2235] text-gray-500 border border-slate-700 shadow-none'
          }`}
        >
          {spinning ? 'လှည့်နေပါသည်...' : tickets > 0 ? 'ယခုပဲ လှည့်မည်' : 'လှည့်ခွင့် မရှိသေးပါ'}
        </button>
      </div>
    </div>
  );
}
