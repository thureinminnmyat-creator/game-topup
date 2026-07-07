import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, UploadCloud, X, Copy, Check } from 'lucide-react'; // 👈 Copy နဲ့ Check Icon ထပ်ထည့်ထားသည်
import axios from 'axios';

export default function Deposit() {
  const navigate = useNavigate();
  
  // States
  const [method, setMethod] = useState('kpay'); // 'kpay' or 'wave'
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false); // Copy ကူး/မကူး သိရန် State

  // Admin ဆီမှ ယူမည့် ဖုန်းနံပါတ်များ State
  const [adminAccounts, setAdminAccounts] = useState({
    kpay: { name: 'Wam Trading', phone: 'Loading...' },
    wave: { name: 'Wam Trading', phone: 'Loading...' }
  });

  const quickAmounts = [1000, 3000, 5000, 10000];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://topup-bk-production.up.railway.app/api/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data && res.data.success) {
          setAdminAccounts({
            kpay: { name: 'Wam Trading', phone: res.data.setting.kpayNumber || 'No Number' },
            wave: { name: 'Wam Trading', phone: res.data.setting.waveNumber || 'No Number' }
          });
        }
      } catch (error) {
        console.error("Setting Fetch Error", error);
        setAdminAccounts({
          kpay: { name: 'Wam Trading (Admin)', phone: '09123456789' },
          wave: { name: 'Wam Trading (Admin)', phone: '09987654321' }
        });
      }
    };

    fetchSettings();
  }, []);

  // ဖုန်းနံပါတ် Copy ကူးမည့် Function
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // ၂ စက္ကန့်ကြာရင် အမှန်ခြစ်လေး ပျောက်သွားမည်
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setScreenshot(null);
    setPreviewUrl('');
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    // လုပ်ငန်းစဉ်အမှတ် စစ်ဆေးခြင်းကို ဖြုတ်ထားပါသည်
    if (!amount || !screenshot) {
      alert('ကျေးဇူးပြု၍ ငွေပမာဏ နှင့် ငွေလွှဲ Screenshot ကို ထည့်ပါ။');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('method', method);
      formData.append('amount', amount);
      formData.append('screenshot', screenshot); 

      // ⚠️ ဤနေရာမှ Backend (Deposit API) သို့ ပို့ပါမည်
      // await axios.post('https://topup-bk-production.up.railway.app/api/transactions/deposit', formData, { ... });

      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error(error);
      alert('ငွေသွင်းရန် အခက်အခဲရှိနေပါသည်။');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#blue] flex flex-col items-center justify-center p-4 text-white font-sans animate-fade-in-up">
        <CheckCircle size={64} className="text-teal-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">ငွေသွင်းလွှာ ပို့ပြီးပါပြီ</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Admin မှ သင့်ငွေလွှဲပြေစာအား စစ်ဆေးပြီးပါက အကောင့်သို့ ငွေဝင်လာပါမည်။
        </p>
        <button 
          onClick={() => navigate('/setting')}
          className="bg-[#rgba] border border-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition"
        >
          ဆက်တင်သို့ ပြန်သွားမည်
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24 px-4 pt-6">
      
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">ငွေဖြည့်သွင်းရန် (Deposit)</h2>
      </div>

      <form onSubmit={handleDeposit} className="space-y-6">
        
        <div>
          <label className="text-xs text-gray-400 block mb-3">ငွေပေးချေမည့် နည်းလမ်း ရွေးချယ်ပါ</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('kpay')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                method === 'kpay' ? 'bg-[#007BFF]/10 border-[#007BFF] text-[#007BFF]' : 'bg-[#1A2235] border-slate-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              <span className="font-black text-lg tracking-wider">K PAY</span>
            </button>
            
            <button
              type="button"
              onClick={() => setMethod('wave')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                method === 'wave' ? 'bg-[#FFD100]/10 border-[#FFD100] text-[#FFD100]' : 'bg-[#1A2235] border-slate-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              <span className="font-black text-lg tracking-wider">WAVE</span>
            </button>
          </div>
        </div>

        {/* 👈 Copy ခလုတ်ပါဝင်သော အကောင့်နံပါတ် နေရာ */}
        <div className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden flex justify-between items-center">
          <div className={`absolute top-0 left-0 w-1 h-full ${method === 'kpay' ? 'bg-[#007BFF]' : 'bg-[#FFD100]'}`}></div>
          <div>
            <p className="text-xs text-gray-400 mb-1">အောက်ပါအကောင့်သို့ ငွေလွှဲပေးပါ</p>
            <h3 className="text-xl font-bold mb-1 tracking-widest text-white">{adminAccounts[method].phone}</h3>
            <p className="text-sm text-gray-300 font-semibold">{adminAccounts[method].name}</p>
          </div>
          <button 
            type="button"
            onClick={() => handleCopy(adminAccounts[method].phone)}
            className={`p-2.5 rounded-xl transition ${copied ? 'bg-green-500/20 text-green-400' : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20'}`}
            title="ဖုန်းနံပါတ် ကူးယူမည်"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-2">လွှဲမည့် ငွေပမာဏ</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="ပမာဏ ရိုက်ထည့်ပါ..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#1A2235] border border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-teal-500 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">Ks</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="bg-[#1A2235] border border-slate-700 hover:border-teal-500 text-gray-300 py-2 rounded-lg text-xs font-semibold transition"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-2">ငွေလွှဲထားသော Screenshot</label>
          
          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center w-full h-32 bg-[#1A2235] border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-teal-500 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="text-gray-400 mb-2" size={28} />
                <p className="text-xs text-gray-400 font-semibold">ပုံရွေးချယ်ရန် နှိပ်ပါ</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          ) : (
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-700">
              <img src={previewUrl} alt="Screenshot Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] py-3.5 rounded-xl text-sm font-bold mt-2 transition flex items-center justify-center disabled:opacity-70"
        >
          {loading ? 'ပေးပို့နေပါသည်...' : 'ငွေသွင်းလွှာ ပို့မည်'}
        </button>

      </form>
    </div>
  );
}