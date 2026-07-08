import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, UserCheck, ShoppingCart, Gem } from 'lucide-react';

export default function Topup() {
  const { gameCode } = useParams();
  const navigate = useNavigate();

  // Data States
  const [packages, setPackages] = useState([]);
  const [usdRate, setUsdRate] = useState(3500); // Default Rate
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false); // ဝယ်ယူနေစဉ် Loading ပြရန်
  
  // Player Data States
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [playerName, setPlayerName] = useState(null);
  const [checkingName, setCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');

  // Selected Package State
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // ၁။ Admin Panel မှ USD Rate ကို လှမ်းယူခြင်း
        try {
          const settingRes = await axios.get('https://topup-bk-production.up.railway.app/api/settings', config);
          if (settingRes.data && settingRes.data.success && settingRes.data.setting?.usdRate) {
            setUsdRate(settingRes.data.setting.usdRate);
          }
        } catch (err) {
          console.error("Setting API ခေါ်ယူ၍ မရပါ။ Default Rate ကို သုံးပါမည်။");
        }

        // ၂။ ဂိမ်း၏ Package နှင့် ဈေးနှုန်းများကို ဆွဲထုတ်ခြင်း
        const catalogRes = await axios.get(`https://topup-bk-production.up.railway.app/api/topup/games/${gameCode}/catalogue`);
        if (catalogRes.data && catalogRes.data.success) {
          setPackages(catalogRes.data.data.catalogues || []);
        }
      } catch (error) {
        console.error("Catalogue Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameCode]);

  // Player နာမည် မှန်/မမှန် စစ်ဆေးခြင်း
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
        setPlayerName(response.data.data.name || response.data.data.username); 
      }
    } catch (error) {
      setNameError(error.response?.data?.message || "နာမည်ရှာမတွေ့ပါ။ ID နှင့် Server မှန်/မမှန် စစ်ဆေးပါ။");
    } finally {
      setCheckingName(false);
    }
  };

  // USD မှ MMK သို့ ပြောင်းပေးသည့် Function
    // USD မှ MMK သို့ ပြောင်းပေးသည့် Function
  const calculateMMK = (usdPrice) => {
    if (!usdPrice) return 0; // ဈေးနှုန်း မပါလာလျှင် 0 ဟု သတ်မှတ်မည်

    // 💡 အရေးကြီးဆုံးအပိုင်း: "$1.50" သို့မဟုတ် "1.5 USD" ထဲမှ ဂဏန်း (1.5) ကိုသာ သီးသန့် ဆွဲထုတ်မည်
    const cleanPrice = usdPrice.toString().replace(/[^0-9.]/g, ''); 
    
    const price = parseFloat(cleanPrice);
    const rate = parseFloat(usdRate) || 3500; // Rate မရှိခဲ့လျှင် 3500 ဖြင့် မြှောက်မည်

    if (isNaN(price)) return 0; // Error ဆက်တက်နေပါက 0 ပြမည်

    return Math.ceil(price * rate); 
  };


  // တကယ့် ဝယ်ယူမှု ပြုလုပ်မည့် Function
  const handlePurchase = async () => {
    if (!playerName) {
      alert("ကျေးဇူးပြု၍ Player နာမည်ကို အရင်စစ်ဆေးပါ။");
      return;
    }
    if (!selectedPackage) {
      alert("ဝယ်ယူမည့် ပက်ကေ့ချ်ကို ရွေးချယ်ပါ။");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("ဝယ်ယူရန် အကောင့်ဝင် (Login) ရန် လိုအပ်ပါသည်။");
      navigate('/login');
      return;
    }

    const mmkPrice = calculateMMK(selectedPackage.price);
    const confirmMsg = `${playerName} အကောင့်သို့ ${selectedPackage.name} အား ${mmkPrice} Ks ဖြင့် ဝယ်ယူမည်မှာ သေချာပါသလား?`;
    
    if (!window.confirm(confirmMsg)) return;

    setPurchasing(true);
    try {
      // ⚠️ ဤနေရာတွင် သင့် Backend ၏ အမှန်တကယ် Order တင်သည့် လမ်းကြောင်းကို ထည့်ပါ
      const response = await axios.post('https://topup-bk-production.up.railway.app/api/orders/create', {
        gameCode,
        playerId,
        serverId,
        playerName,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        price: mmkPrice // MMK ဖြင့် ပို့ပါမည်
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        alert("ဝယ်ယူခြင်း အောင်မြင်ပါသည်။");
        navigate('/wallet'); // ဝယ်ပြီးပါက History / Wallet စာမျက်နှာသို့ သွားမည်
      }
    } catch (error) {
      console.error("Purchase Error:", error);
      alert(error.response?.data?.message || "ဝယ်ယူခြင်း မအောင်မြင်ပါ။ လက်ကျန်ငွေ လုံလောက်မှု ရှိ/မရှိ စစ်ဆေးပါ။");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24">
      {/* Header */}
      <div className="flex items-center p-4 bg-[#1A2235] sticky top-0 z-10 shadow-md border-b border-slate-700/50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold ml-2 uppercase tracking-wide">{gameCode} Top-up</h2>
      </div>

      <div className="p-4 space-y-6">
        
        {/* အဆင့် ၁: Player အချက်အလက်များ ထည့်သွင်းခြင်း */}
        <div className="bg-[#1A2235] p-5 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="font-bold text-sm text-gray-100">အကောင့် အချက်အလက် ထည့်ပါ</h3>
          </div>
          
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Player ID" 
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition shadow-inner"
              />
            </div>
            <div className="w-1/3">
              <input 
                type="text" 
                placeholder="Server ID" 
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition shadow-inner"
              />
            </div>
          </div>

          <button 
            onClick={handleCheckName}
            disabled={checkingName}
            className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <UserCheck size={18} />
            {checkingName ? 'စစ်ဆေးနေပါသည်...' : 'နာမည် စစ်ဆေးမည် (Check Name)'}
          </button>

          {/* နာမည်စစ်ဆေးမှု ရလဒ်ပြသရန် */}
          {playerName && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 animate-fade-in-up">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                <UserCheck size={20} />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Player Name</p>
                <p className="font-bold text-green-400 text-base">{playerName}</p>
              </div>
            </div>
          )}
          
          {nameError && (
            <p className="mt-4 text-xs text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{nameError}</p>
          )}
        </div>

        {/* အဆင့် ၂: Package ရွေးချယ်ခြင်း */}
        <div className="bg-[#1A2235] p-5 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="font-bold text-sm text-gray-100">ပက်ကေ့ချ် ရွေးချယ်ပါ</h3>
          </div>

          {loading ? (
            <p className="text-teal-400 text-sm text-center animate-pulse py-8">ပက်ကေ့ချ်များ ရှာဖွေနေပါသည်...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.isArray(packages) && packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                const mmkPrice = calculateMMK(pkg.price);

                return (
                  <div 
                    key={pkg.id || pkg.name}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[100px] border-2 overflow-hidden ${
                      isSelected 
                        ? 'bg-teal-500/10 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                        : 'bg-[#121722] border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {/* Active အမှန်ခြစ်လေး */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-teal-400 text-[#121722] w-6 h-6 flex items-center justify-center rounded-bl-xl font-bold text-xs">
                        ✓
                      </div>
                    )}
                    
                    <Gem size={24} className={`mb-2 ${isSelected ? 'text-teal-400' : 'text-gray-500'}`} />
                    <p className={`font-black text-sm text-center mb-1 line-clamp-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {pkg.name}
                    </p>
                    <p className={`text-[13px] font-bold ${isSelected ? 'text-teal-400' : 'text-gray-400'}`}>
                      {mmkPrice} Ks
                    </p>
                  </div>
                );
              })}
              
              {(!Array.isArray(packages) || packages.length === 0) && (
                <p className="col-span-full text-center text-sm text-gray-500 py-6">ပက်ကေ့ချ်များ မရရှိနိုင်သေးပါ။</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* အောက်ခြေမှ Floating Checkout Bar */}
      {selectedPackage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[#1A2235] rounded-2xl p-4 shadow-2xl border border-slate-600 flex justify-between items-center z-40 animate-fade-in-up">
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">စုစုပေါင်း ကျသင့်ငွေ</p>
            <p className="text-xl font-black text-teal-400">{calculateMMK(selectedPackage.price)} Ks</p>
          </div>
          <button 
            onClick={handlePurchase}
            disabled={purchasing}
            className="bg-teal-500 hover:bg-teal-600 text-[#121722] px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-70 shadow-lg"
          >
            {purchasing ? (
              'ဝယ်ယူနေသည်...'
            ) : (
              <>
                <ShoppingCart size={18} />
                ဝယ်ယူမည်
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}