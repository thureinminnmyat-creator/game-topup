import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, UserCheck, ShoppingCart, Gem } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Topup() {
  const { gameCode } = useParams();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [usdRate, setUsdRate] = useState(3500); 
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false); 
  
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [playerName, setPlayerName] = useState(null);
  const [checkingName, setCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [needsServerId, setNeedsServerId] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // ၁။ USD Rate
        try {
          const settingRes = await axios.get('https://topup-bk-production.up.railway.app/api/wallet/settings', config);
          if (settingRes.data && settingRes.data.success && settingRes.data.setting?.usdRate) {
            setUsdRate(settingRes.data.setting.usdRate);
          }
        } catch (err) {}

        // ၂။ Fields API ခေါ်ယူခြင်း (Server ID လို/မလို စစ်ရန်)
        try {
          const fieldsRes = await axios.get(`https://topup-bk-production.up.railway.app/api/topup/games/${gameCode}/fields`);
          const fieldsData = fieldsRes.data.data; 
          
          let hasServerId = true; 
          const fieldsArray = fieldsData.fields || [];
          
          if (fieldsArray.length === 1) {
            hasServerId = false;
          } else {
            hasServerId = fieldsArray.some(f => 
              f.toLowerCase().includes('zone') || 
              f.toLowerCase().includes('server')
            );
          }
          
          setNeedsServerId(hasServerId);
        } catch (err) {
          console.error("Fields API Error", err);
          setNeedsServerId(true); 
        }

        // ၃။ ဂိမ်း Packages 
        const catalogRes = await axios.get(`https://topup-bk-production.up.railway.app/api/topup/games/${gameCode}/catalogue`);
        let fetchedPackages = [];
        if (Array.isArray(catalogRes.data)) fetchedPackages = catalogRes.data;
        else if (Array.isArray(catalogRes.data?.data)) fetchedPackages = catalogRes.data.data;
        else if (Array.isArray(catalogRes.data?.data?.catalogues)) fetchedPackages = catalogRes.data.data.catalogues;
        
        setPackages(fetchedPackages);
      } catch (error) {
        console.error("Catalogue Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameCode]);

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
        serverId: needsServerId ? serverId : "" 
      });

      if (response.data && response.data.success) {
        setPlayerName(response.data.data.name || response.data.data.username || response.data.data.charname); 
        toast.success("နာမည်စစ်ဆေးခြင်း အောင်မြင်ပါသည်", {
            style: { background: '#1A2235', color: '#fff', border: '1px solid #2DD4BF' },
            iconTheme: { primary: '#2DD4BF', secondary: '#1A2235' },
        });
      }
    } catch (error) {
      setNameError(error.response?.data?.message || "နာမည်ရှာမတွေ့ပါ။ အချက်အလက်များ မှန်/မမှန် စစ်ဆေးပါ။");
    } finally {
      setCheckingName(false);
    }
  };

  const calculateMMK = (usdPrice) => {
    if (!usdPrice) return 0;
    const cleanPrice = usdPrice.toString().replace(/[^0-9.]/g, ''); 
    const price = parseFloat(cleanPrice);
    const rate = parseFloat(usdRate) || 3500;
    if (isNaN(price)) return 0;
    return Math.ceil(price * rate); 
  };

  const handlePurchase = async () => {
    const errorStyle = { background: '#1A2235', color: '#fff', border: '1px solid #EF4444' };
    
    if (!playerName) return toast.error("ကျေးဇူးပြု၍ Player နာမည်ကို အရင်စစ်ဆေးပါ။", { style: errorStyle });
    if (!selectedPackage) return toast.error("ဝယ်ယူမည့် ပက်ကေ့ချ်ကို ရွေးချယ်ပါ။", { style: errorStyle });
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("ဝယ်ယူရန် အကောင့်ဝင် (Login) ရန် လိုအပ်ပါသည်။", { style: errorStyle });
      navigate('/login');
      return;
    }

    const rawSelectedPrice = selectedPackage.price || selectedPackage.amount || selectedPackage.price_usd || selectedPackage.original_price || 0;
    const mmkPrice = calculateMMK(rawSelectedPrice);

    const confirmMsg = `${playerName} အကောင့်သို့ ${selectedPackage.name} အား ${mmkPrice} Ks ဖြင့် ဝယ်ယူမည်မှာ သေချာပါသလား?`;
    if (!window.confirm(confirmMsg)) return;

    setPurchasing(true);
    const loadingToast = toast.loading('ဝယ်ယူနေပါသည်...', { style: { background: '#1A2235', color: '#fff' }});

    try {
      const response = await axios.post('https://topup-bk-production.up.railway.app/api/topup/purchase', {
        gameCode,
        playerId,
        serverId: needsServerId ? serverId : "",
        playerName,
        // 💡 Provider က နာမည်တောင်းသဖြင့် ID အစား Catalogue Name အတိအကျကိုသာ ပို့ပေးပါမည်
        packageId: selectedPackage.name, 
        packageName: selectedPackage.name,
        price: mmkPrice 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        toast.success("ဝယ်ယူခြင်း အောင်မြင်ပါသည်။", {
          id: loadingToast,
          style: { background: '#1A2235', color: '#fff', border: '1px solid #2DD4BF' },
          iconTheme: { primary: '#2DD4BF', secondary: '#1A2235' },
        });
        navigate('/wallet'); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "ဝယ်ယူခြင်း မအောင်မြင်ပါ။", {
        id: loadingToast,
        style: errorStyle,
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24">
      {/* 💡 Toaster Component ထည့်သွင်းထားပါသည် */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex items-center justify-between p-4 bg-[#rgba] sticky top-0 z-10 shadow-md border-b border-slate-700/50">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold ml-2 uppercase tracking-wide">{gameCode} Top-up</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* အဆင့် ၁: Player အချက်အလက်များ ထည့်သွင်းခြင်း */}
        <div className="bg-[#rgba] p-5 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="font-bold text-sm text-gray-100">အကောင့် အချက်အလက် ထည့်ပါ</h3>
          </div>
          
          <div className="flex gap-3 mb-4 transition-all">
            <div className={needsServerId ? "flex-1" : "w-full"}>
              <input 
                type="text" 
                placeholder="Player ID" 
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full bg-[#0_0_15px_rgba] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition shadow-inner"
              />
            </div>
            
            {needsServerId && (
              <div className="w-1/3 animate-fade-in-up">
                <input 
                  type="text" 
                  placeholder="Server ID" 
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  className="w-full bg-[#0_0_15px_rgba] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition shadow-inner"
                />
              </div>
            )}
          </div>

          <button 
            onClick={handleCheckName}
            disabled={checkingName}
            className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md"
          >
            <UserCheck size={18} />
            {checkingName ? 'စစ်ဆေးနေပါသည်...' : 'နာမည် စစ်ဆေးမည် (Check Name)'}
          </button>

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
        <div className="bg-[#rgba] p-5 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="font-bold text-sm text-gray-100">ပက်ကေ့ချ် ရွေးချယ်ပါ</h3>
          </div>

          {loading ? (
            <p className="text-teal-400 text-sm text-center animate-pulse py-8">ပက်ကေ့ချ်များ ရှာဖွေနေပါသည်...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.isArray(packages) && packages.map((pkg, idx) => {
                const rawPrice = pkg.price || pkg.amount || pkg.usd_price || pkg.price_usd || pkg.original_price || 0;
                const mmkPrice = calculateMMK(rawPrice);
                const pkgId = pkg.id || pkg.code || idx;
                const isSelected = selectedPackage?.id === pkg.id || selectedPackage?.code === pkg.code;

                return (
                  <div 
                    key={pkgId}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[100px] border overflow-hidden ${
                      isSelected 
                        ? 'bg-teal-500/10 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                        : 'bg-[#121722] border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-teal-400 text-[#121722] w-6 h-6 flex items-center justify-center rounded-bl-xl font-bold text-xs">
                        ✓
                      </div>
                    )}
                    
                    {pkg.image || pkg.image_url ? (
                      <img src={pkg.image || pkg.image_url} alt={pkg.name} className="w-10 h-10 object-contain mb-2" />
                    ) : (
                      <Gem size={24} className={`mb-2 ${isSelected ? 'text-teal-400' : 'text-gray-500'}`} />
                    )}
                    
                    <p className={`font-black text-xs text-center mb-1 line-clamp-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {pkg.name || 'Unknown Package'}
                    </p>
                    <p className={`text-[13px] font-bold ${isSelected ? 'text-teal-400' : 'text-gray-400'}`}>
                      {mmkPrice > 0 ? `${mmkPrice} Ks` : '0 Ks'}
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

      {/* Floating Checkout Bar */}
      {selectedPackage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[#1A2235] rounded-2xl p-4 shadow-2xl border border-slate-600 flex justify-between items-center z-40 animate-fade-in-up">
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">စုစုပေါင်း ကျသင့်ငွေ</p>
            <p className="text-xl font-black text-teal-400">
              {calculateMMK(selectedPackage.price || selectedPackage.amount || selectedPackage.usd_price || 0)} Ks
            </p>
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