import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileContainer from './components/MobileContainer.jsx';
import Navbar from './components/Navbar.jsx';

import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
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
        
        {/* bg-[#121722] ဖြင့် Dark Theme အရောင် ပြောင်းထားပါသည် */}
        <div className="flex-1 overflow-y-auto bg-[#121722]">
          <Routes>
            {/* Route အားလုံးကို Routes အဖွင့်နှင့် အပိတ် ကြားတွင်သာ ထားရပါမည် */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/topup/:gameCode" element={<Topup />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/social" element={<Social />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
        
        <Navbar />

      </MobileContainer>
    </Router>
  );
}