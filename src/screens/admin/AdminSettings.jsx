import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, DollarSign, Phone, Image as ImageIcon, Trash2, Plus } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    usdRate: 3500,
    kpayNumber: '',
    kpayAccountName: '', // 👈 Kpay နာမည်အတွက် အသစ်
    waveNumber: '',
    waveAccountName: '', // 👈 Wave နာမည်အတွက် အသစ်
    banners: []
  });
  
  const [newBanner, setNewBanner] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const res = await axios.get('https://topup-bk-production.up.railway.app/api/admin/settings', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        if (res.data && res.data.success && res.data.setting) {
          setSettings({
            usdRate: res.data.setting.usdRate || 3500,
            kpayNumber: res.data.setting.kpayNumber || '',
            kpayAccountName: res.data.setting.kpayAccountName || '',
            waveNumber: res.data.setting.waveNumber || '',
            waveAccountName: res.data.setting.waveAccountName || '',
            banners: res.data.setting.banners || []
          });
        }
      } catch (error) {
        console.error("Settings Fetch Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Save လုပ်မည့် Function (ခလုတ်အားလုံးအတွက် ပေါင်းသုံးထားသည်)
  const handleSave = async (sectionName) => {
    setSaving(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.put('https://topup-bk-production.up.railway.app/api/admin/settings', 
        settings,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      alert(`${sectionName} အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ။`);
    } catch (error) {
      alert('အမှားအယွင်းဖြစ်ပွားခဲ့ပါသည်။');
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    if (!newBanner) return;
    setSettings({...settings, banners: [...settings.banners, newBanner]});
    setNewBanner('');
  };

  const removeBanner = (index) => {
    setSettings({...settings, banners: settings.banners.filter((_, i) => i !== index)});
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center py-10 text-teal-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up text-white pb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg"><Settings size={24} /></div>
        <h2 className="text-xl md:text-2xl font-bold">App Settings</h2>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* ================= ၁။ USD Rate Section ================= */}
        <div className="bg-[#1A2235] p-5 md:p-6 rounded-2xl border border-slate-700 shadow-lg">
          <label className="text-sm text-gray-400 block mb-3 font-semibold flex items-center gap-2">
            <DollarSign size={18} className="text-teal-400" /> USD မှ MMK ငွေလဲနှုန်း
          </label>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <input 
                type="number" 
                name="usdRate" 
                value={settings.usdRate} 
                onChange={handleChange} 
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-teal-500 outline-none" 
              />
              <span className="absolute right-4 top-3 text-gray-500">Ks</span>
            </div>
            <button 
              onClick={() => handleSave('USD Rate')}
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <Save size={18} /> Save
            </button>
          </div>
        </div>

        {/* ================= ၂။ Payment Accounts Section ================= */}
        <div className="bg-[#1A2235] p-5 md:p-6 rounded-2xl border border-slate-700 shadow-lg">
          <label className="text-sm text-gray-400 block mb-4 font-semibold flex items-center gap-2">
            <Phone size={18} className="text-teal-400" /> ငွေပေးချေမှု အကောင့်များ
          </label>
          
          <div className="space-y-4 mb-4">
            {/* KPay */}
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="kpayNumber" value={settings.kpayNumber} onChange={handleChange} placeholder="K-Pay Number" className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="text" name="kpayAccountName" value={settings.kpayAccountName} onChange={handleChange} placeholder="K-Pay Account Name" className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            {/* Wave */}
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="waveNumber" value={settings.waveNumber} onChange={handleChange} placeholder="Wave Number" className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="text" name="waveAccountName" value={settings.waveAccountName} onChange={handleChange} placeholder="Wave Account Name" className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => handleSave('ငွေပေးချေမှု')}
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <Save size={18} /> Save Accounts
            </button>
          </div>
        </div>

        {/* ================= ၃။ Banners Section ================= */}
        <div className="bg-[#1A2235] p-5 md:p-6 rounded-2xl border border-slate-700 shadow-lg">
          <label className="text-sm text-gray-400 block mb-4 font-semibold flex items-center gap-2">
            <ImageIcon size={18} className="text-teal-400" /> Banners Management
          </label>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newBanner} 
              onChange={(e) => setNewBanner(e.target.value)}
              placeholder="Banner Image URL ထည့်ပါ..."
              className="flex-1 bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none"
            />
            <button type="button" onClick={addBanner} className="bg-teal-500 p-3 rounded-xl hover:bg-teal-600 text-[#121722]">
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {settings.banners.map((url, index) => (
              <div key={index} className="bg-[#121722] p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                <span className="truncate w-[80%] text-gray-300">{url}</span>
                <button type="button" onClick={() => removeBanner(index)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {settings.banners.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">Banner များ မရှိသေးပါ။</p>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-700/50 pt-4">
            <button 
              onClick={() => handleSave('Banner')}
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <Save size={18} /> Save Banners
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
