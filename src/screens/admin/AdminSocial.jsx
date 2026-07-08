import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2, Trash2, Image, AlignLeft, Type, Tag, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function AdminSocial() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('promotion');

  // Post များကို ဆွဲယူမည်
  const fetchPosts = async () => {
    try {
      // Public API မှ ဆွဲယူမည် (အရင်က ရေးခဲ့သော API)
      const res = await axios.get('https://topup-bk-production.up.railway.app/api/topup/social');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Post အသစ်တင်မည်
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !description || !imageUrl) {
      setMessage({ type: 'error', text: 'အချက်အလက်များ ပြည့်စုံစွာ ဖြည့်ပါ။' });
      return;
    }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      const payload = { title, description, imageUrl, category };

      const res = await axios.post('https://topup-bk-production.up.railway.app/api/admin/social', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Post အသစ် တင်ပြီးပါပြီ။' });
        // Form ကို အလွတ်ပြန်ထားမည်
        setTitle('');
        setDescription('');
        setImageUrl('');
        setCategory('promotion');
        // Post အသစ်ပါဝင်အောင် ပြန်ခေါ်မည်
        fetchPosts(); 
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Post တင်ရာတွင် အမှားအယွင်းရှိပါသည်။' 
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Post ဖျက်မည်
  const handleDelete = async (id) => {
    if (!window.confirm("ဤ Post ကို ဖျက်ရန် သေချာပါသလား?")) return;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await axios.delete(`https://topup-bk-production.up.railway.app/api/admin/social/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // ဖျက်လိုက်သော Post ကို UI မှ ဖယ်ထုတ်မည်
        setPosts(posts.filter(post => post._id !== id));
      }
    } catch (error) {
      alert("Post ဖျက်ရာတွင် အဆင်မပြေဖြစ်ပွားခဲ့ပါသည်။");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans text-white">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-700/50 pb-4">
        <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center">
          <Share2 size={26} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Social Posts စီမံရန်</h2>
          <p className="text-sm text-gray-400 mt-1">ပရိုမိုးရှင်းများနှင့် သတင်းများ တင်နိုင်ပါသည်။</p>
        </div>
      </div>

      {/* Grid Layout: ဘယ်ဘက်က Form, ညာဘက်က Post List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ========================================== */}
        {/* ဘယ်ဘက်: Add New Post Form */}
        {/* ========================================== */}
        <div className="lg:col-span-1">
          <div className="bg-[#1A2235] border border-slate-700 rounded-2xl p-6 shadow-xl sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus size={20} className="text-teal-400" />
              Post အသစ်တင်ရန်
            </h3>

            {message && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 border text-sm ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Type size={16} /> ခေါင်းစဉ်
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ဥပမာ - 10% Discount"
                  className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <AlignLeft size={16} /> အသေးစိတ်စာသား
                </label>
                <textarea 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ပရိုမိုးရှင်းအကြောင်း အသေးစိတ်..."
                  className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Image size={16} /> ပုံလင့်ခ် (Image URL)
                </label>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (.jpg / .png)"
                  className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Tag size={16} /> အမျိုးအစား (Category)
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121722] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition"
                >
                  <option value="promotion">Promotion (ပရိုမိုးရှင်း)</option>
                  <option value="news">News (သတင်း)</option>
                  <option value="event">Event (ပွဲစဉ်များ)</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={submitLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {submitLoading ? 'တင်နေပါသည်...' : 'Post တင်မည်'}
              </button>
            </form>
          </div>
        </div>

        {/* ========================================== */}
        {/* ညာဘက်: Existing Posts List */}
        {/* ========================================== */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            တင်ထားသော Posts များ
            <span className="bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full text-xs">{posts.length}</span>
          </h3>

          {loading ? (
            <div className="bg-[#1A2235] border border-slate-700 rounded-2xl p-10 text-center text-teal-400 animate-pulse">
              Posts များ ရှာဖွေနေပါသည်...
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map(post => (
                <div key={post._id} className="bg-[#1A2235] border border-slate-700 rounded-2xl overflow-hidden shadow-lg group relative">
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full z-10">
                    {post.category}
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-xl z-10 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>

                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition duration-300"
                  />
                  
                  <div className="p-4">
                    <h4 className="font-bold text-base text-teal-400 mb-2 line-clamp-1">{post.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">{post.description}</p>
                    
                    <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-slate-700/50 pt-3">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-3">
                        <span>❤️ {post.likes?.length || 0}</span>
                        <span>💬 {post.comments?.length || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1A2235] border border-slate-700 rounded-2xl p-10 text-center text-gray-500 flex flex-col items-center">
              <Share2 size={40} className="mb-3 opacity-20" />
              <p>တင်ထားသော Post များ မရှိသေးပါ။</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
