import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Clock, Heart, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function Social() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [expandedPostId, setExpandedPostId] = useState(null); // အသေးစိတ် ကြည့်နေသော Post ID
  const [showCommentsFor, setShowCommentsFor] = useState(null); // Comment ဖွင့်ထားသော Post ID
  const [newComment, setNewComment] = useState(''); // ရိုက်ထည့်လိုက်သော Comment အသစ်

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('https://topup-bk-production.up.railway.app/api/promotions');
        if (response.data && response.data.success) {
          setAnnouncements(response.data.promotions);
        }
      } catch (error) {
        console.error("API မချိတ်ရသေးပါ (ယာယီဒေတာ ပြသပါမည်):", error);
        
        // ယာယီဒေတာ (Like နှင့် Comment အချက်အလက်များ ထပ်တိုးထားပါသည်)
        setAnnouncements([
          {
            _id: '1',
            title: '✨ 10% Discount on Mobile Legends!',
            description: 'Mobile Legends စိန်ဝယ်ယူသူတိုင်းအတွက် ၁၀% လျှော့စျေး အထူးပရိုမိုးရှင်း စတင်နေပါပြီ။ ယနေ့ပဲ Wam Trading တွင် လာရောက်ဝယ်ယူလိုက်ပါ။ ဒီပရိုမိုးရှင်းက လကုန်အထိပဲ ရမှာမို့ လက်မလွှတ်ရအောင် အခုပဲ Top-up လုပ်လိုက်ကြရအောင်ဗျာ!',
            image_url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop',
            createdAt: new Date().toISOString(),
            likes: 45,
            isLiked: false,
            comments: ['အရမ်းမိုက်တယ်!', 'ဘယ်နေ့ထိလဲဗျ?']
          },
          {
            _id: '2',
            title: 'Free Fire 50 Diamonds လက်ဆောင်',
            description: 'Wam Trading တွင် အကောင့်သစ်ဖွင့်ပြီး ပထမဆုံးအကြိမ် ငွေဖြည့်သွင်းသူတိုင်းအတွက် Free Fire စိန် ၅၀ ကို လက်ဆောင်အဖြစ် ပေးသွားမှာ ဖြစ်ပါတယ်။',
            image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            likes: 12,
            isLiked: true,
            comments: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // ၁။ Heart React ပေးရန် Function
  const handleLike = (postId) => {
    setAnnouncements(prev => prev.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // ၂။ Comment အသစ် ထည့်ရန် Function
  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    setAnnouncements(prev => prev.map(post => {
      if (post._id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
    setNewComment(''); // Input ကို ပြန်ရှင်းမည်
  };

  // ၃။ အသေးစိတ်ပြရန် ဖွင့်/ပိတ် Function
  const toggleDetails = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  // ၄။ Comment ကဏ္ဍ ဖွင့်/ပိတ် Function
  const toggleComments = (postId) => {
    setShowCommentsFor(showCommentsFor === postId ? null : postId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#rgba] text-white font-sans pb-24 px-4 pt-6">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
          <Megaphone size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">ကြေညာချက်များ</h2>
          <p className="text-gray-400 text-sm mt-0.5">ပရိုမိုးရှင်းနှင့် လျှော့စျေး အစီအစဉ်များ</p>
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
              
              {item.image_url && (
                <div className="relative w-full h-48">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2235] to-transparent"></div>
                </div>
              )}
              
              <div className="p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white leading-tight pr-2">{item.title}</h3>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap bg-[#121722] px-2 py-1 rounded-md">
                    <Clock size={10} /> {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* 👈 အသေးစိတ်ကြည့်ရန် Function ချိတ်ဆက်ထားသော နေရာ */}
                <p className={`text-sm text-gray-300 leading-relaxed transition-all duration-300 ${expandedPostId === item._id ? '' : 'line-clamp-2'}`}>
                  {item.description}
                </p>
                
                {/* 👈 Action Bar (Like, Comment, Details) */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-5">
                    {/* Like Button */}
                    <button 
                      onClick={() => handleLike(item._id)} 
                      className="flex items-center gap-1.5 transition active:scale-90"
                    >
                      <Heart 
                        size={20} 
                        className={item.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'} 
                      />
                      <span className={`text-sm font-semibold ${item.isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                        {item.likes}
                      </span>
                    </button>

                    {/* Comment Button */}
                    <button 
                      onClick={() => toggleComments(item._id)}
                      className="flex items-center gap-1.5 text-gray-400 hover:text-teal-400 transition active:scale-90"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-semibold">{item.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* View Details Toggle Button */}
                  <button 
                    onClick={() => toggleDetails(item._id)} 
                    className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-lg transition"
                  >
                    {expandedPostId === item._id ? (
                      <>အကျဉ်းချုံးမည် <ChevronUp size={14} /></>
                    ) : (
                      <>အသေးစိတ် <ChevronDown size={14} /></>
                    )}
                  </button>
                </div>

                {/* 👈 Comment ဖွင့်ထားပါက ပြသရန် အပိုင်း */}
                {showCommentsFor === item._id && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in-up">
                    
                    {/* Comment စာရင်းပြသခြင်း */}
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto no-scrollbar pr-1">
                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map((cmt, idx) => (
                          <div key={idx} className="bg-[#121722] p-2.5 rounded-xl border border-slate-700/50">
                            <span className="font-bold text-teal-400 text-[10px] mr-2 block mb-1">User_{idx + 101}</span>
                            <p className="text-xs text-gray-300">{cmt}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-gray-500 py-2">မှတ်ချက် မရှိသေးပါ။ ပထမဆုံး ရေးသားလိုက်ပါ။</p>
                      )}
                    </div>

                    {/* Comment အသစ် ရိုက်ထည့်ရန် Input */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="မှတ်ချက်ရေးရန်..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(item._id)}
                        className="flex-1 bg-[#121722] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
                      />
                      <button 
                        onClick={() => handleAddComment(item._id)}
                        disabled={!newComment.trim()}
                        className="bg-teal-500 text-[#121722] p-2.5 rounded-xl hover:bg-teal-600 transition disabled:opacity-50 disabled:bg-slate-700"
                      >
                        <Send size={16} />
                      </button>
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