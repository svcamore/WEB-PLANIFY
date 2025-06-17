// src/routes/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Notes from "../App";
import Calender from "../pages/Kalender";
import Task from "../pages/Task";
import Editprofile from "../pages/editprofile";
import Bahasa from "../pages/bahasa";
import Upgrade from "../pages/upgrade";
import Worksspace from "../pages/workspace";
import Recentfile from "../pages/recentFile";
import Favorite from "../pages/favorite";
import Landingpage from "../pages/landingPage";
import SignUp from "../pages/sign_up";
import Login from "../pages/login";
import Archived from "../pages/archived";
import Payment from "../pages/paymentUp";
import Admin from "../pages/dshbrd_Admin";
import UserManagement from "../pages/userManagement";
import Send from "../pages/send_Admin";
import LoginAdmin from "../pages/login_Admin";
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Router Admin */}
         <Route path="/login_Admin" element={<LoginAdmin />} />
         <Route path="/dshbrd_Admin" element={<Admin />} />
         <Route path="/userManagement" element={<UserManagement />} />
         <Route path="/send_Admin" element={<Send />} />
         {/* Router Landing Page */}
          <Route path="/" element={<Landingpage />} />
         {/* Router Login & Sign Up */}
         <Route path="/sign_up" element={<SignUp />} />
         <Route path="/login" element={<Login />} />
        {/* Router After Login */}
        <Route path="/workspace" element={<Worksspace />} />
        <Route path="/recentFile" element={<Recentfile />} />
        <Route path="/archived" element={<Archived />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/notes/:id" element={<Notes />} />
        <Route path="/kalender/:id" element={<Calender />} />
        <Route path="/task/:id" element={<Task />} />
        {/* Router Setting */}
        <Route path="/setting/profile" element={<Editprofile/>} />
        <Route path="/setting/bahasa" element={<Bahasa/>} />
        <Route path="/setting/upgrade" element={<Upgrade/>} />
        <Route path="/setting/paymentUp" element={<Payment/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
