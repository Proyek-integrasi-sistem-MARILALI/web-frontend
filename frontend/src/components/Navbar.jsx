import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  /* ================= ACTIVE MENU ================= */
  const isActive = (path) => {
    if (path === "/explorer") {
      return location.pathname.startsWith("/explorer");
    }
    return location.pathname === path;
  };

  const menuClass = (path) =>
    isActive(path)
      ? "text-sky-500 font-semibold"
      : "text-gray-600 hover:text-sky-500";

  const mobileMenuClass = (path) =>
    isActive(path)
      ? "bg-sky-50 text-sky-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100";

  /* ================= NAVIGATION ================= */
  const protectedNavigate = (path) => {
    setOpen(false);
    if (!isLoggedIn) navigate("/login");
    else navigate(path);
  };

  const navigateAndClose = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <nav className="w-full bg-white shadow-md">

      {/* ================= DESKTOP (TIDAK DIUBAH) ================= */}
      <div className="hidden lg:flex w-full items-center justify-between px-6 py-6">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={logo} alt="Marilali Logo" className="h-10 w-auto" />
          </div>

          <div className="relative ml-10">
            <input
              type="text"
              placeholder="Cari Destinasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[450px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-10 text-lg font-medium">
          <button onClick={() => navigate("/")} className={menuClass("/")}>
            Home
          </button>

          <button
            onClick={() => protectedNavigate("/explorer")}
            className={menuClass("/explorer")}
          >
            Explorer
          </button>

          <button
            onClick={() => protectedNavigate("/planner")}
            className={menuClass("/planner")}
          >
            Planner
          </button>

          {isLoggedIn && (
            <button
              onClick={() => navigate("/history")}
              className={menuClass("/history")}
            >
              History
            </button>
          )}

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 border border-sky-400 text-sky-500 rounded-lg hover:bg-sky-50"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className={`px-4 py-2 border rounded-lg ${
                isActive("/profile")
                  ? "border-sky-500 text-sky-500 bg-sky-50"
                  : "border-sky-400 text-sky-500 hover:bg-sky-50"
              }`}
            >
              Dave
            </button>
          )}
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden px-6 py-4 flex items-center justify-between">
        <img
          src={logo}
          alt="Marilali Logo"
          className="h-9 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* ================= MOBILE MENU (ANIMATED) ================= */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6">
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">

            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari Destinasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            {/* MENU */}
            <div className="border-t pt-3 space-y-1 text-base font-medium">
              <button
                onClick={() => navigateAndClose("/")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${mobileMenuClass("/")}`}
              >
                Home
              </button>

              <button
                onClick={() => protectedNavigate("/explorer")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${mobileMenuClass("/explorer")}`}
              >
                Explorer
              </button>

              <button
                onClick={() => protectedNavigate("/planner")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${mobileMenuClass("/planner")}`}
              >
                Planner
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => navigateAndClose("/history")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${mobileMenuClass("/history")}`}
                >
                  History
                </button>
              )}
            </div>

            {/* AUTH */}
            <div className="border-t pt-4">
              {!isLoggedIn ? (
                <button
                  onClick={() => navigateAndClose("/login")}
                  className="w-full py-2 border border-sky-400 text-sky-500 rounded-lg hover:bg-sky-50 transition"
                >
                  Log In
                </button>
              ) : (
                <button
                  onClick={() => navigateAndClose("/profile")}
                  className="w-full py-2 border border-sky-400 text-sky-500 rounded-lg hover:bg-sky-50 transition"
                >
                  My Profile
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
