import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Toast from "./components/Toast";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import HomeBefore from "./pages/HomeBefore";
import HomeAfter from "./pages/HomeAfter";
import Login from "./pages/LoginAcc";
import SignUp from "./pages/SignUp";
import Explorer from "./pages/Explorer";
import Profil from "./pages/Profil";
import DetailTrip from "./pages/DetailTrip";
import Location from "./pages/Location";
import PlannerPage from "./pages/PlannerPage";
import PlannerEditPage from "./pages/PlannerEditPage";
import CreatePlanPage from "./pages/CreatePlanPage";
import EditPlacePage from "./pages/EditPlacePage";
import HistoryPage from "./pages/HistoryPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <ErrorBoundary>
      <Toast />
      <Routes>
      {/* PAGES DENGAN NAVBAR */}
      <Route element={<MainLayout />}>
        <Route path="/" element={isLoggedIn ? <HomeAfter /> : <HomeBefore />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/explore/:id" element={
          <ProtectedRoute>
            <DetailTrip />
          </ProtectedRoute>
        } />
        <Route path="/location/:id" element={
          <ProtectedRoute>
            <Location />
          </ProtectedRoute>
        } />
        <Route path="/planner" element={
          <ProtectedRoute>
            <PlannerPage />
          </ProtectedRoute>
        } />
        <Route path="/planner/:id/edit" element={
          <ProtectedRoute>
            <PlannerEditPage />
          </ProtectedRoute>
        } />
        {/* <Route path="/planner/:id/add-activity" element={
          <ProtectedRoute>
            <AddActivityPage />
          </ProtectedRoute>
        } /> */}
        <Route path="/planner/create" element={
          <ProtectedRoute>
            <CreatePlanPage />
          </ProtectedRoute>
        } />
        <Route path="/planner/edit-place/:id" element={
          <ProtectedRoute>
            <EditPlacePage />
          </ProtectedRoute>
        } />
        <Route path="/planner/:itineraryId/add-place" element={
          <ProtectedRoute>
            <EditPlacePage />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        } />
      </Route>

      {/* AUTH PAGES TANPA NAVBAR */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </Routes>
    </ErrorBoundary>
  );
}
