import React from 'react';

export default function MobileContainer({ children }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-900">
      {/* ဒီမှာ Gradient Background လေးကို ထည့်ပေးလိုက်တာပါ */}
      <div className="relative w-full max-w-[480px] min-h-screen bg-gradient-to-br from-[#121722] via-[#293b66] to-[#36a596] bg-[length:200%_200%]animate-gradient-slow overflow-hidden shadow-2xl">
        {children}
      </div>
    </div>
  );
}
