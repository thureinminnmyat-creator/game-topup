import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Clock, Heart, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function Social() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [newComment, setNewComment] = useState('');

  // 💡 Post များကို Backend မှ ဆွဲယူခြင်း
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://topup-bk-production.up.railway.app/api/topup/social');
      if (response.data && response.data.success) {
        setAnnouncements(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ၁။ Like ပေးရန်/ဖြုတ်ရန် API ချိတ်ခြင်း
  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Like ပေးရန် Login ဝင်ပါ။");

    try {
      await axios.post(`https://topup-bk-production.up.railway.app/api/topup/social/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Like လုပ်ပြီးရင် Data ပြန်ဆွဲမည်
    } catch (error) {
      alert("Like လုပ်ရာတွင် အမှားအယွင်းရှိပါသည်။");
    }
  };

  // ၂။ Comment အသစ် ထည့်ရန် API ချိတ်ခြင်း
  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return alert("Comment ရေးရန် Login ဝင်ပါ။");

    try {
      await axios.post(`https://topup-bk-production.up.railway.app/api/topup/social/${postId}/comment`, 
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchPosts(); // Comment တင်ပြီးရင် Data ပြန်ဆွဲမည်
    } catch (error) {
      alert("Comment တင်ရာတွင် အဆင်မပြေဖြစ်ပါသည်။");
    }
  };

  const toggleDetails = (postId) => setExpandedPostId(expandedPostId === postId ? null : postId);
  const toggleComments = (postId) => setShowCommentsFor(showCommentsFor === postId ? null : postId);

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans pb-24 px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
          <Megaphone size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">ကြေညာချက်များ</h2>
          <p className="text-gray-400 text-sm mt-0.5">ပရိုမိုးရှင်းနှင့် သတင်းအချက်အလက်များ</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-teal-400 text-sm animate-pulse mt-10">ကြေညာချက်များ ရှာဖွေနေပါသည်...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">လောလောဆယ် ကြေညာချက် မရှိသေးပါ။</p>
        ) : (
          announcements.map((item) => (
            <div key={item._id} className="bg-[#1A2235] rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
              {item.imageUrl && (
                <div className="relative w-full h-48">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className={`text-sm text-gray-300 leading-relaxed ${expandedPostId === item._id ? '' : 'line-clamp-2'}`}>
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-5">
                    <button onClick={() => handleLike(item._id)} className="flex items-center gap-1.5 transition active:scale-90">
  <Heart 
    size={20} 
    className={
      Array.isArray(item.likes) && 
      item.likes.map(id => id.toString()).includes(localStorage.getItem('userId'))
        ? 'fill-red-500 text-red-500' 
        : 'text-gray-400'
    } 
  />
  <span className="text-sm font-semibold text-gray-400">{item.likes?.length || 0}</span>
</button>

                    <button onClick={() => toggleComments(item._id)} className="flex items-center gap-1.5 text-gray-400">
                      <MessageCircle size={20} />
                      <span className="text-sm font-semibold">{item.comments?.length || 0}</span>
                    </button>
                  </div>
                  <button onClick={() => toggleDetails(item._id)} className="text-xs text-teal-400 font-bold flex items-center gap-1">
                    {expandedPostId === item._id ? 'အကျဉ်းချုပ်' : 'အသေးစိတ်'}
                  </button>
                </div>

                {showCommentsFor === item._id && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {item.comments?.map((cmt, idx) => (
                        <div key={idx} className="bg-[#121722] p-2 rounded-lg border border-slate-700">
                          <p className="text-[10px] font-bold text-teal-400">{cmt.user_id?.name || 'User'}</p>
                          <p className="text-xs text-gray-300">{cmt.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-[#121722] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="မှတ်ချက်ရေးရန်..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button onClick={() => handleAddComment(item._id)} className="bg-teal-500 p-2 rounded-xl"><Send size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}