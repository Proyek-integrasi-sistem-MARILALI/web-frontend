import React from "react";
import { Search, Home, Map, Calendar, History } from "lucide-react";
import logo from "../assets/logo.png";

// Terima props onNavigate dan currentView dari App.jsx
const Navbar = ({ onNavigate, currentView }) => {
  const navItems = [
    { name: "Home", view: "home", icon: Home },
    { name: "Explorer", view: "explorer", icon: Map },
    { name: "Planner", view: "list", icon: Calendar }, // Planner arahkan ke 'list'
    { name: "History", view: "history", icon: History },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo Marilali */}
            <div
              className="shrink-0 flex items-center cursor-pointer"
              onClick={() => onNavigate("list")} // Klik logo balik ke list
            >
              <img className="h-8 w-auto" src={logo} alt="Marilali Logo" />
              <span className="ml-2 text-xl font-bold text-blue-500 hidden sm:block">
                Marilali
              </span>
            </div>

            {/* Kolom Pencarian */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center border border-gray-300 rounded-lg p-1 bg-gray-50">
              <input
                type="text"
                placeholder="Cari Destinasi..."
                className="p-1 text-sm focus:outline-none bg-transparent w-64 ml-2"
              />
              <button className="p-1 text-gray-400 hover:text-orange-500">
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
                  onClick={() => onNavigate(item.view)} // Jalankan navigasi
                  className={`
                    ${
                      currentView === item.view
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#00A9E0] hover:bg-blue-600 focus:outline-none"
              >
                Dave
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
