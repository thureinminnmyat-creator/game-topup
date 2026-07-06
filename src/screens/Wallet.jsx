import React from 'react';

export default function Wallet() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800">ဝေါလက် (Wallet)</h2>
      
      <div className="mt-4 p-5 bg-blue-600 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-80">လက်ကျန်ငွေ</p>
        <h3 className="text-3xl font-bold mt-1">0 Ks</h3>
      </div>

      <button className="mt-6 w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all">
        ငွေဖြည့်မည် (Deposit)
      </button>
    </div>
  );
}
