import React from 'react';

export default function MobileContainer({ children }) {
  return (
    // fixed inset-0 ဖြင့် Page ကြီးတစ်ခုလုံးကို အသေ Lock ချပါမည်
    <div className="fixed inset-0 bg-gray-100 flex justify-center items-center sm:p-4">
      <div className="w-full h-full sm:w-[400px] sm:h-[85vh] sm:max-h-[850px] bg-white sm:rounded-2xl sm:shadow-2xl flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
