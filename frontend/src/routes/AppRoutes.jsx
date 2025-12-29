import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import HomeBefore from "../pages/HomeBefore";
import HomeAfter from "../pages/HomeAfter";

import Login from "../pages/LoginAcc";
import SignUp from "../pages/SignUp";
import Profil from "../pages/Profil";
import Explorer from "../pages/Explorer";
import DetailTrip from "../pages/DetailTrip";
import Location from "../pages/Location";

/* ===== ROUTE GUARDS ===== */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token");
  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>

      {/* HOME (AUTO SWITCH) */}
      <Route
        path="/"
        element={isLoggedIn ? <HomeAfter /> : <HomeBefore />}
      />

      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explorer"
        element={
          <ProtectedRoute>
            <Explorer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore/:id"
        element={
          <ProtectedRoute>
            <DetailTrip />
          </ProtectedRoute>
        }
      />

      <Route
        path="/location/:id"
        element={
          <ProtectedRoute>
            <Location />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
