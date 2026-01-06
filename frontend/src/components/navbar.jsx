import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Search, Home, Map, Calendar, History } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Sync search term with URL params when location changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to explorer with search parameter
      navigate(`/explorer?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // Clear search if empty
      navigate('/explorer');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explorer", path: "/explorer", icon: Map },
    { name: "Planner", path: "/planner", icon: Calendar },
    { name: "History", path: "/history", icon: History },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo Marilali */}
            <div
              className="shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img className="h-8 w-auto" src={logo} alt="Marilali Logo" />
              <span className="ml-2 text-xl font-bold text-blue-500 hidden sm:block">
              </span>
            </div>

            {/* Kolom Pencarian */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center border border-gray-300 rounded-lg p-1 bg-gray-50">
              <input
                type="text"
                placeholder="Cari Destinasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="p-1 text-sm focus:outline-none bg-transparent w-64 ml-2"
              />
              <button 
                onClick={handleSearch}
                className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center">
            {/* Navigasi Kanan */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 h-full">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`
                    ${
                      isActive(item.path)
                        ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                        : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                    }
                    inline-flex items-center px-1 pt-1 text-sm transition duration-150 ease-in-out h-full
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Tombol Profil */}
            <div className="ml-4">
              <button
                type="button"
                onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#00A9E0] hover:bg-blue-600 focus:outline-none"
              >
                {isLoggedIn ? (user?.name || "User") : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
