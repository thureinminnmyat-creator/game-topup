import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Image as ImageIcon, X, Clock, Check, AlertCircle } from 'lucide-react';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected

  // Modals
  const [imageModal, setImageModal] = useState({ show: false, url: '' });
  const [actionModal, setActionModal] = useState({ show: false, type: '', id: '', note: '' });

  const fetchDeposits = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      // ⚠️ Backend တွင် GET /api/admin/deposits လမ်းကြောင်း ရှိရန်လိုအပ်ပါသည်
      const res = await axios.get('https://topup-bk-production.up.railway.app/api/admin/deposits', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.data && res.data.success) {
        setDeposits(res.data.deposits);
      }
    } catch (error) {
      console.error("Deposits Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.put(`https://topup-bk-production.up.railway.app/api/admin/deposits/${actionModal.id}/status`, 
        { status: actionModal.type, adminNote: actionModal.note },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      alert(actionModal.type === 'approved' ? 'ငွေသွင်းလွှာကို လက်ခံလိုက်ပါပြီ။' : 'ငွေသွင်းလွှာကို ငြင်းပယ်လိုက်ပါပြီ။');
      setActionModal({ show: false, type: '', id: '', note: '' });
      fetchDeposits(); // Data ပြန်ခေါ်မည်
    } catch (error) {
      alert(error.response?.data?.message || 'အမှားအယွင်းဖြစ်ပွားခဲ့ပါသည်။');
    }
  };

  const filteredDeposits = deposits.filter(d => d.status === filter);

  return (
    <div className="space-y-4 animate-fade-in-up text-white pb-6">
      <h2 className="text-xl md:text-2xl font-bold">Deposits Management</h2>

      {/* Tabs */}
      <div className="flex bg-[#1A2235] p-1 rounded-xl border border-slate-700 w-full">
        <button 
          onClick={() => setFilter('pending')}
          className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition ${filter === 'pending' ? 'bg-teal-500 text-[#121722]' : 'text-gray-400'}`}
        >
          စစ်ဆေးရန်
        </button>
        <button 
          onClick={() => setFilter('approved')}
          className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition ${filter === 'approved' ? 'bg-green-500 text-[#121722]' : 'text-gray-400'}`}
        >
          လက်ခံပြီး
        </button>
        <button 
          onClick={() => setFilter('rejected')}
          className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition ${filter === 'rejected' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
        >
          ငြင်းပယ်
        </button>
      </div>

      {/* Deposits List */}
      <div className="space-y-3 mt-4">
        {loading ? (
          <div className="text-center py-10 text-teal-400 animate-pulse text-sm">
            ငွေသွင်းလွှာများ ဆွဲယူနေပါသည်...
          </div>
        ) : filteredDeposits.length > 0 ? (
          filteredDeposits.map((item) => (
            <div key={item._id} className="bg-[#1A2235] p-4 rounded-2xl border border-slate-700 shadow-sm flex flex-col gap-3">
              
              <div className="flex justify-between items-start border-b border-slate-700/50 pb-3">
                <div>
                  <h3 className="font-bold text-white text-sm">{item.userId?.name || 'Unknown User'}</h3>
                  <p className="text-[10px] text-gray-400">{item.userId?.email || 'No Email'}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                  item.method === 'kpay' ? 'bg-[#007BFF]/20 text-[#007BFF]' : 'bg-[#FFD100]/20 text-[#FFD100]'
                }`}>
                  {item.method}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">ငွေပမာဏ</p>
                  <p className="font-bold text-teal-400 text-base">{item.amount} Ks</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 mb-0.5">လုပ်ငန်းစဉ်အမှတ်</p>
                  <p className="font-semibold text-white text-sm tracking-widest">{item.transactionId || 'N/A'}</p>
                </div>
              </div>

              {/* Screenshot Button */}
              {item.screenshotUrl && (
                <button 
                  onClick={() => setImageModal({ show: true, url: item.screenshotUrl })}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 text-gray-300 rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
                >
                  <ImageIcon size={14} /> ပြေစာ ပုံကြည့်မည်
                </button>
              )}

              {/* Actions (Only for Pending) */}
              {item.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setActionModal({ show: true, type: 'rejected', id: item._id, note: '' })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition text-xs font-bold"
                  >
                    <XCircle size={16} /> ငြင်းမည်
                  </button>
                  <button 
                    onClick={() => setActionModal({ show: true, type: 'approved', id: item._id, note: 'အောင်မြင်ပါသည်။' })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 text-[#121722] hover:bg-green-600 rounded-xl transition text-xs font-bold"
                  >
                    <CheckCircle size={16} /> လက်ခံမည်
                  </button>
                </div>
              )}

              {/* Status Note for Processed Items */}
              {item.status !== 'pending' && item.adminNote && (
                <div className={`p-2 rounded-lg text-xs mt-1 ${item.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  <strong>မှတ်ချက်:</strong> {item.adminNote}
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm bg-[#1A2235] rounded-2xl border border-slate-700">
            မှတ်တမ်း မရှိသေးပါ။
          </div>
        )}
      </div>

      {/* --- Action Modal (Approve / Reject) --- */}
      {actionModal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1A2235] w-full max-w-sm rounded-2xl border border-slate-700 p-5 relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setActionModal({ show: false, type: '', id: '', note: '' })} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            
            <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${actionModal.type === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
              {actionModal.type === 'approved' ? <Check size={20} /> : <AlertCircle size={20} />}
              {actionModal.type === 'approved' ? 'လက်ခံမည်' : 'ငြင်းပယ်မည်'}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              အောက်ပါ အကြောင်းပြချက် သို့မဟုတ် မှတ်ချက်ကို User ထံ ပြသပါမည်။
            </p>
            
            <form onSubmit={handleActionSubmit}>
              <textarea 
                value={actionModal.note}
                onChange={(e) => setActionModal({...actionModal, note: e.target.value})}
                placeholder="မှတ်ချက် ရိုက်ထည့်ပါ..."
                rows="3"
                className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 mb-5 shadow-inner resize-none"
                required={actionModal.type === 'rejected'}
              />
              <button 
                type="submit" 
                className={`w-full font-bold py-3.5 rounded-xl transition shadow-lg ${
                  actionModal.type === 'approved' ? 'bg-green-500 hover:bg-green-600 text-[#121722] shadow-green-500/20' : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                }`}
              >
                အတည်ပြုမည်
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Image Preview Modal --- */}
      {imageModal.show && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4">
          <button onClick={() => setImageModal({ show: false, url: '' })} className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition">
            <X size={24} />
          </button>
          <img src={imageModal.url} alt="Receipt Screenshot" className="max-w-full max-h-[80vh] object-contain rounded-lg border border-slate-700 shadow-2xl" />
        </div>
      )}

    </div>
  );
}
