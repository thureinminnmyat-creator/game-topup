import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileContainer from './components/MobileContainer.jsx';
import Navbar from './components/Navbar.jsx';

import AdminLayout from './screens/admin/AdminLayout.jsx';
import AdminDashboard from './screens/admin/AdminDashboard.jsx'; 
import AdminUsers from './screens/admin/AdminUsers.jsx';
import AdminDeposits from './screens/admin/AdminDeposits.jsx';
import AdminSettings from './screens/admin/AdminSettings.jsx';
import AdminOrders from './screens/admin/AdminOrders.jsx';
import AdminGames from './screens/admin/AdminGames.jsx';
// 💡 မှားနေတဲ့နေရာကို ပြင်ထားပါသည် (နာမည်ပြောင်းပြီး အပိတ်လေးတွေ ထည့်ထားသည်)
import AdminSendNoti from './screens/admin/AdminSendNoti.jsx'; 
import AdminSocial from './screens/admin/AdminSocial.jsx';

import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
import Home from './screens/Home.jsx';
import Shop from './screens/Shop.jsx';
import Deposit from './screens/Deposit.jsx';
import Wallet from './screens/Wallet.jsx';
import Social from './screens/Social.jsx';
import Setting from './screens/Setting.jsx';
import Topup from './screens/Topup.jsx';
import Notifications from './screens/Notifications'; 
import DailyBonus from './screens/DailyBonus';
import LuckySpin from './screens/LuckySpin';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================
            👨‍💻 Admin Panel Routes (Mobile Container ပြင်ပတွင် ရှိမည်)
            ========================================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="users" element={<AdminUsers />} /> 
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="social" element={<AdminSocial />} />
          {/* 💡 Menu နှင့် ကိုက်ညီရန် path ကို send-noti ဟု ပြင်ထားပါသည် */}
          <Route path="send-noti" element={<AdminSendNoti />} />
        </Route>
        
        {/* =========================================
            📱 သာမန် User များအတွက် App Routes
            ========================================= */}
        <Route path="*" element={
          <MobileContainer>
            <div className="flex-1 overflow-y-auto bg-[#rgba]">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/topup/:gameCode" element={<Topup />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/social" element={<Social />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/daily-bonus" element={<DailyBonus />} />
                <Route path="/lucky-spin" element={<LuckySpin />} />
                <Route path="/setting" element={<Setting />} />
              </Routes>
            </div>
            <Navbar />
          </MobileContainer>
        } />
      </Routes>
    </Router>
  );
}
