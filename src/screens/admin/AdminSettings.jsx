import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, DollarSign, Phone, Image as ImageIcon, Trash2, Plus } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    usdRate: 3500,
    kpayNumber: '',
    waveNumber: '',
    banners: [] // 👈 Banner များအတွက် Array
  });
  const [newBanner, setNewBanner] = useState(''); // 👈 Banner အသစ်ထည့်ရန် Input
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
            waveNumber: res.data.setting.waveNumber || '',
            banners: res.data.setting.banners || [] // 👈 Backend ကလာသော Banners
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.put('https://topup-bk-production.up.railway.app/api/admin/settings', 
        settings,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      alert('ဆက်တင်များ အားလုံး သိမ်းဆည်းပြီးပါပြီ။');
    } catch (error) {
      alert('အမှားအယွင်းဖြစ်ပွားခဲ့ပါသည်။');
    } finally {
      setSaving(false);
    }
  };

  // Banner Add & Remove
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

  return (
    <div className="space-y-6 animate-fade-in-up text-white pb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg"><Settings size={24} /></div>
        <h2 className="text-xl md:text-2xl font-bold">App Settings</h2>
      </div>

      <div className="bg-[#1A2235] p-5 md:p-8 rounded-2xl border border-slate-700 shadow-lg max-w-2xl">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Payment & Rate Section */}
          <div className="space-y-6">
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-semibold">USD မှ MMK ငွေလဲနှုန်း</label>
              <div className="relative">
                <input type="number" name="usdRate" value={settings.usdRate} onChange={handleChange} className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-teal-500 outline-none" />
                <span className="absolute right-4 top-3 text-gray-500">Ks</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="kpayNumber" value={settings.kpayNumber} onChange={handleChange} placeholder="K-Pay Number" className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="text" name="waveNumber" value={settings.waveNumber} onChange={handleChange} placeholder="Wave Number" className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
          </div>

          <div className="border-t border-slate-700/50"></div>

          {/* Banner Management Section */}
          <div>
            <label className="text-xs text-gray-400 block mb-3 font-semibold flex items-center gap-2">
              <ImageIcon size={16} /> Banners Management
            </label>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newBanner} 
                onChange={(e) => setNewBanner(e.target.value)}
                placeholder="Banner Image URL ထည့်ပါ..."
                className="flex-1 bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none"
              />
              <button type="button" onClick={addBanner} className="bg-teal-500 p-3 rounded-xl hover:bg-teal-600">
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {settings.banners.map((url, index) => (
                <div key={index} className="bg-[#121722] p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                  <span className="truncate w-[80%]">{url}</span>
                  <button type="button" onClick={() => removeBanner(index)} className="text-red-400 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} />
            {saving ? 'သိမ်းဆည်းနေပါသည်...' : 'အချက်အလက်များ သိမ်းမည်'}
          </button>
        </form>
      </div>
    </div>
  );
}