import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileContainer from './components/MobileContainer.jsx';
import Navbar from './components/Navbar.jsx';

import Home from './screens/Home.jsx';
import Shop from './screens/Shop.jsx';
import Wallet from './screens/Wallet.jsx';
import Social from './screens/Social.jsx';
import Setting from './screens/Setting.jsx';
import Topup from './screens/Topup.jsx';

export default function App() {
  return (
    <Router>
      <MobileContainer>
        
        {/* flex-1 ဖြင့် ကျန်တဲ့နေရာအကုန်ယူပြီး ဒီအကွက်လေးထဲမှာပဲ Scroll ဖြစ်စေပါမည် */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/topup/:gameCode" element={<Topup />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/social" element={<Social />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
        
        {/* Navbar က အောက်ဆုံးမှာ သူ့နေရာနဲ့သူ အသေကပ်နေပါပြီ */}
        <Navbar />

      </MobileContainer>
    </Router>
  );
}