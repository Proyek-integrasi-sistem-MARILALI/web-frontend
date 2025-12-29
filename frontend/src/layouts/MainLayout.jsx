import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Outlet />
      {!isAuthPage && <Footer />}
    </>
  );
}
