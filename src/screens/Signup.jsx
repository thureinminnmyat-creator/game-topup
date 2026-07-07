import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ChevronLeft, UserPlus } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ⚠️ Backend တွင် Register API လမ်းကြောင်းမှာ /api/auth/register ဖြစ်သည်ဟု ယူဆထားပါသည်
      const response = await axios.post('https://topup-bk-production.up.railway.app/api/auth/register', {
        name,
        email,
        password
      });

      if (response.data) {
        // အကောင့်ဖွင့်ပြီးပါက Token တစ်ခါတည်း ပြန်လာပါက သိမ်းပါမည်
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          // Token ပြန်မလာပါက Login Page သို့ ပို့ပါမည်
          navigate('/login');
        }
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || 'အကောင့်ဖွင့်ရာတွင် အမှားရှိနေပါသည်။');
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
          <h2 className="text-2xl font-bold">အကောင့်သစ် ဖွင့်ပါ</h2>
          <p className="text-sm text-gray-400 mt-2">Wam Trading မှ ကြိုဆိုပါတယ်</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="အမည် (Name)" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A2235] border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition"
            />
          </div>

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
              placeholder="စကားဝှက် (Password ၆ လုံးအထက်)" 
              required
              minLength={6}
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
                <UserPlus size={18} />
                အကောင့်ဖွင့်မည်
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          အကောင့်ရှိပြီးသားလား?{' '}
          <Link to="/login" className="text-teal-400 font-bold hover:underline">
            အကောင့်ဝင်မည်
          </Link>
        </p>
      </div>
    </div>
  );
}
