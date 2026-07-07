import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, UserCheck, ShoppingCart } from 'lucide-react';

export default function Topup() {
  const { gameCode } = useParams(); // URL ကနေ gameCode (ဥပမာ - mlbb) ကို ဖမ်းယူမည်
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Player Data States
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [playerName, setPlayerName] = useState(null);
  const [checkingName, setCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');

  // Selected Package State
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    // ၁။ ဂိမ်း၏ Package နှင့် ဈေးနှုန်းများကို ဆွဲထုတ်ခြင်း
    axios.get(`https://topup-bk-production.up.railway.app/api/topup/games/${gameCode}/catalogue`)
      .then((response) => {
        if (response.data && response.data.success) {
          // ⚠️ catalogues ဆိုသည့် အခန်းထဲမှ Data ကိုသာ ဆွဲယူရန် ပြင်ဆင်ထားပါသည်
          setPackages(response.data.data.catalogues || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Catalogue Error:", error);
        setLoading(false);
      });
  }, [gameCode]);

  // ၂။ Player နာမည် မှန်/မမှန် စစ်ဆေးခြင်း
  const handleCheckName = async () => {
    if (!playerId) {
      setNameError("Player ID ထည့်ရန် လိုအပ်ပါသည်။");
      return;
    }
    
    setCheckingName(true);
    setNameError('');
    setPlayerName(null);

    try {
      const response = await axios.post('https://topup-bk-production.up.railway.app/api/topup/validate-player', {
        gameCode,
        playerId,
        serverId
      });

      if (response.data && response.data.success) {
        // API မှ ပြန်လာသော နာမည်ကို မှတ်သားမည်
        setPlayerName(response.data.data.name || response.data.data.username); 
      }
    } catch (error) {
      setNameError(error.response?.data?.message || "နာမည်ရှာမတွေ့ပါ။ ID နှင့် Server မှန်/မမှန် စစ်ဆေးပါ။");
    } finally {
      setCheckingName(false);
    }
  };

  // ၃။ ဝယ်ယူမည့် ခလုတ် (လောလောဆယ် UI သက်သက်သာ)
  const handlePurchase = () => {
    if (!playerName) {
      alert("ကျေးဇူးပြု၍ Player နာမည်ကို အရင်စစ်ဆေးပါ။");
      return;
    }
    if (!selectedPackage) {
      alert("ဝယ်ယူမည့် ပက်ကေ့ချ်ကို ရွေးချယ်ပါ။");
      return;
    }
    
    // နောက်ပိုင်းတွင် ဤနေရာမှနေ၍ Purchase API သို့ Token ဖြင့် လှမ်းချိတ်ပါမည်
    alert(`ဝယ်ယူမည်: ${selectedPackage.name}, ဈေးနှုန်း: ${selectedPackage.price} MMK`);
  };

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24">
      {/* Header */}
      <div className="flex items-center p-4 bg-[#1A2235] sticky top-0 z-10 shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold ml-2 uppercase">{gameCode} Top-up</h2>
      </div>

      <div className="p-4 space-y-6">
        
        {/* အဆင့် ၁: Player အချက်အလက်များ ထည့်သွင်းခြင်း */}
        <div className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="font-bold text-sm">အကောင့် အချက်အလက် ထည့်ပါ</h3>
          </div>
          
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Player ID" 
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition"
              />
            </div>
            <div className="w-1/3">
              <input 
                type="text" 
                placeholder="Server ID" 
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition"
              />
            </div>
          </div>

          <button 
            onClick={handleCheckName}
            disabled={checkingName}
            className="w-full bg-teal-500/20 text-teal-400 border border-teal-500/50 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-teal-500/30 transition disabled:opacity-50"
          >
            <UserCheck size={18} />
            {checkingName ? 'စစ်ဆေးနေပါသည်...' : 'နာမည် စစ်ဆေးမည် (Check Name)'}
          </button>

          {/* နာမည်စစ်ဆေးမှု ရလဒ်ပြသရန် */}
          {playerName && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                <UserCheck size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Player Name</p>
                <p className="font-bold text-green-400 text-sm">{playerName}</p>
              </div>
            </div>
          )}
          
          {nameError && (
            <p className="mt-3 text-xs text-red-400 text-center">{nameError}</p>
          )}
        </div>

        {/* အဆင့် ၂: Package ရွေးချယ်ခြင်း */}
        <div className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="font-bold text-sm">ပက်ကေ့ချ် ရွေးချယ်ပါ</h3>
          </div>

                    {/* ... အပေါ်ပိုင်း ကုဒ်များ (မပြောင်းလဲပါ) ... */}

          {loading ? (
            <p className="text-teal-400 text-sm text-center animate-pulse py-6">ပက်ကေ့ချ်များ ယူနေပါသည်...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* ⚠️ အပြောင်းအလဲ - packages က Array ဖြစ်မှသာ map ကို အလုပ်လုပ်စေပါမည် */}
              {Array.isArray(packages) && packages.map((pkg) => (
                <div 
                  key={pkg.id || pkg.name} // id မပါလာခဲ့ရင် name ကို key အဖြစ် ယာယီသုံးပါမည်
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 text-center flex flex-col justify-center min-h-[80px] ${
                    selectedPackage?.id === pkg.id 
                      ? 'bg-teal-500/20 border-teal-500 ring-1 ring-teal-500' 
                      : 'bg-[#121722] border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <p className="font-bold text-sm text-white mb-1">{pkg.name}</p>
                  <p className="text-xs text-teal-400 font-semibold">{pkg.price} Ks</p>
                </div>
              ))}
              
              {/* တကယ်လို့ packages ထဲမှာ ဘာ data မှ မရှိခဲ့ရင် ပြရန် */}
              {(!Array.isArray(packages) || packages.length === 0) && (
                <p className="col-span-full text-center text-sm text-gray-500 py-4">ပက်ကေ့ချ်များ မရှိသေးပါ။</p>
              )}
            </div>
          )}

          {/* ... အောက်ပိုင်း ကုဒ်များ (မပြောင်းလဲပါ) ... */}

        </div>
      </div>

      {/* အောက်ခြေမှ Floating Checkout Bar */}
      {selectedPackage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-slate-800 rounded-2xl p-3 shadow-2xl border border-slate-700 flex justify-between items-center z-40 animate-fade-in-up">
          <div>
            <p className="text-[10px] text-gray-400">ကျသင့်ငွေ</p>
            <p className="text-lg font-bold text-teal-400">{selectedPackage.price} Ks</p>
          </div>
          <button 
            onClick={handlePurchase}
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-teal-500/30"
          >
            <ShoppingCart size={18} />
            ဝယ်ယူမည်
          </button>
        </div>
      )}
    </div>
  );
}
