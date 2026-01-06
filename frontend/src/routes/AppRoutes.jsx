import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import HomeBefore from "../pages/HomeBefore";
import HomeAfter from "../pages/HomeAfter";

import Login from "../pages/LoginAcc";
import SignUp from "../pages/SignUp";
import Profil from "../pages/Profil";
import Explorer from "../pages/Explorer";
import DetailTrip from "../pages/DetailTrip";
import Location from "../pages/Location";
import PlannerPage from "../pages/PlannerPage";
import CreatePlanPage from "../pages/CreatePlanPage";
import PlannerEditPage from "../pages/PlannerEditPage";
import AddActivityPage from "../pages/AddActivityPage";
import EditPlacePage from "../pages/EditPlacePage";
import HistoryPage from "../pages/HistoryPage";

/* ===== ROUTE GUARDS ===== */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  const { isLoggedIn } = useAuth();

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

      {/* PLANNER ROUTES */}
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <PlannerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner/create"
        element={
          <ProtectedRoute>
            <CreatePlanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner/:id/edit"
        element={
          <ProtectedRoute>
            <PlannerEditPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner/:id/add-activity"
        element={
          <ProtectedRoute>
            <AddActivityPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner/edit-place/:id"
        element={
          <ProtectedRoute>
            <EditPlacePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner/:itineraryId/add-place"
        element={
          <ProtectedRoute>
            <EditPlacePage />
          </ProtectedRoute>
        }
      />

      {/* HISTORY ROUTE */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
