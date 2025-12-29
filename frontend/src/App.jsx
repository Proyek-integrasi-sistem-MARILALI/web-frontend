import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import HomeBefore from "./pages/HomeBefore";
import HomeAfter from "./pages/HomeAfter";
import Login from "./pages/LoginAcc";
import SignUp from "./pages/SignUp";
import Explorer from "./pages/Explorer";
import Profil from "./pages/Profil";

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* PAGES DENGAN NAVBAR */}
      <Route element={<MainLayout />}>
        <Route path="/" element={isLoggedIn ? <HomeAfter /> : <HomeBefore />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/profile" element={<Profil />} />
      </Route>

      {/* AUTH PAGES TANPA NAVBAR */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}
