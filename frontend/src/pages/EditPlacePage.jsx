import React, { useState } from "react";
import {
  ChevronLeft,
  Search,
  Filter,
  Clock,
  Calendar,
  Cloud,
  CloudRain,
} from "lucide-react";
import Navbar from "../components/navbar";

const EditPlacePage = ({ onBack }) => {
  // State untuk mengontrol apakah hasil pencarian muncul atau tidak
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fungsi saat menekan tombol Search atau Enter
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim() !== "") {
        setShowResults(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar onNavigate={() => {}} currentView="list" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-all"
            >
              <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
            </button>
            <h1 className="text-2xl font-bold text-black">Edit Place</h1>
          </div>
          <button
            onClick={onBack}
            className="bg-[#00A9E0] text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* 1. Lokasi Aktif (Kebun Raya) - Selalu Muncul */}
        <div className="border border-gray-400 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 h-64 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1546484406-f138810c9c7e?w=800"
                alt="Kebun Raya"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grow">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-black">Kebun Raya</h2>
                <div className="flex items-center gap-2 text-gray-600 text-xl ml-4">
                  <span>Cloudy</span>
                  <Cloud className="h-6 w-6" />
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mb-8 max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3 text-xl border-b-2 border-gray-300 pb-1 cursor-pointer">
                  <Clock className="h-6 w-6 text-black" />
                  <span className="font-medium">10:00 ▼</span>
                </div>
                <div className="flex items-center gap-3 text-xl border-b-2 border-gray-300 pb-1 cursor-pointer">
                  <Calendar className="h-6 w-6 text-black" />
                  <span className="font-medium">10 October 2025 ▼</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Search Section */}
        <div className="flex gap-4 items-center mb-10">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Cari Lokasi"
              className="w-full border h-12 border-gray-400 rounded-xl px-6 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <div
              className="absolute right-6 top-1/2 -translate-y-1/2 border-l border-gray-300 pl-4 cursor-pointer"
              onClick={handleSearch}
            >
              <Search className="h-7 w-7 text-gray-800" />
            </div>
          </div>
          <button className="flex items-center gap-4 border border-gray-400 rounded-xl px-10 h-12 hover:bg-gray-50 shrink-0">
            <Filter className="h-7 w-7 text-black fill-current" />
            <span className="text-xl font-medium">Filter</span>
          </button>
        </div>

        {/* 3. Search Results (Hanya Muncul Jika showResults true) */}
        {showResults && (
          <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
            <SearchLocationCard
              title="Danau Tamblingan"
              weather="Rainy"
              weatherIcon={<CloudRain className="h-6 w-6" />}
              image="https://images.unsplash.com/photo-1571401834407-7c7066914619?w=800"
            />
            <SearchLocationCard
              title="Danau Beratan"
              weather="Rainy"
              price="Rp.500.000"
              weatherIcon={<CloudRain className="h-6 w-6" />}
              image="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800"
            />
          </div>
        )}
      </main>
    </div>
  );
};

const SearchLocationCard = ({ title, weather, weatherIcon, image, price }) => (
  <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm">
    <div className="flex flex-col lg:flex-row gap-8 mb-6">
      <div className="w-full lg:w-[350px] h-[220px] shrink-0 rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-3">
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <div className="flex items-center gap-2 text-gray-600 text-xl font-light">
            <span>{weather}</span>
            {weatherIcon}
          </div>
          {price && (
            <span className="text-gray-600 text-xl ml-4 font-medium">
              {price}
            </span>
          )}
        </div>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex gap-10 items-center">
          <div className="flex items-center gap-2 text-xl border-b border-gray-400 pb-1 cursor-pointer">
            <Clock className="h-6 w-6 text-black" />
            <span className="font-medium text-black">10:00 ▼</span>
          </div>
          <div className="flex items-center gap-2 text-xl border-b border-gray-400 pb-1 cursor-pointer">
            <Calendar className="h-6 w-6 text-black" />
            <span className="font-medium text-black">10 October 2025 ▼</span>
          </div>
        </div>
      </div>
    </div>
    <button className="w-full bg-[#00A9E0] text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors">
      Ganti Lokasi
    </button>
  </div>
);

export default EditPlacePage;
