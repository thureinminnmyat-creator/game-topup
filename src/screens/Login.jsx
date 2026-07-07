import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ChevronLeft, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://topup-bk-production.up.railway.app/api/auth/login', {
        email,
        password
      });

      if (response.data && response.data.token) {
        // Token ကို LocalStorage တွင် သိမ်းပါမည်
        localStorage.setItem('token', response.data.token);
        // လိုအပ်ပါက User အချက်အလက်ကိုပါ သိမ်းနိုင်ပါသည်
        // localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // အောင်မြင်ပါက Home Page သို့ ပြန်သွားမည်
        navigate('/');
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121722] text-white font-sans flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col justify-center pb-20">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-[#121722] font-black text-2xl shadow-lg shadow-teal-500/20 mx-auto mb-4">
            W
          </div>
          <h2 className="text-2xl font-bold">Wam Trading သို့ ပြန်လည်ကြိုဆိုပါသည်</h2>
          <p className="text-sm text-gray-400 mt-2">ဆက်လက်လုပ်ဆောင်ရန် အကောင့်ဝင်ပါ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="အီးမေးလ် (Email)" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A2235] border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="စကားဝှက် (Password)" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A2235] border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-[#121722] py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-teal-500/20 mt-6 disabled:opacity-50"
          >
            {loading ? 'ခေတ္တစောင့်ပါ...' : (
              <>
                <LogIn size={18} />
                အကောင့်ဝင်မည်
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          အကောင့်မရှိသေးဘူးလား?{' '}
          <Link to="/signup" className="text-teal-400 font-bold hover:underline">
            အကောင့်သစ်ဖွင့်မည်
          </Link>
        </p>
      </div>
    </div>
  );
}
