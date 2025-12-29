import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Navbar from '../components/navbar';
import PlanItemCard from '../components/PlanItemCard';

const PlannerEditPage = ({ onNavigate, onBack, onAddPlace, onCreatePlan }) => {
  // State untuk melacak hari yang sedang ditampilkan
  const [currentDay, setCurrentDay] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={() => {}} currentView="list" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
            </button>
            <h1 className="text-2xl font-bold text-black">Planner</h1>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Judul Plan"
              className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none">
              <option>WaterSport</option>
              <option>Culture</option>
              <option>Nature</option>
            </select>
          </div>
        </div>

        {/* Label Hari Dinamis */}
        <h2 className="text-2xl font-medium text-gray-700 mb-4 font-sans">
          Day {currentDay}
        </h2>

        {/* Layout Utama dengan Navigasi di Luar Kotak */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Tombol Panah Kiri (Hanya muncul jika Day > 1) */}
          <div className="w-12 shrink-0 flex justify-center">
            {currentDay > 1 && (
              <button
                onClick={() => setCurrentDay(currentDay - 1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
              </button>
            )}
          </div>

          {/* Kotak Konten Utama */}
          <div className="flex-1 border border-gray-400 rounded-2xl p-6 min-h-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tampilkan konten berdasarkan Day */}
              {currentDay === 1 ? (
                <>
                  <PlanItemCard
                    title="Flight 1"
                    price="500.000"
                    image="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=400&q=80"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor..."
                    time="10:00"
                    date="10 October 2025"
                    hasPayment={true}
                  />
                  <PlanItemCard
                    title="Hotel 1"
                    price="500.000"
                    image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor..."
                    time="10:00"
                    date="10 October 2025"
                    hasPayment={true}
                  />
                  <PlanItemCard
                    title="Tanah Lot"
                    image="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor..."
                    time="10:00"
                    date="10 October 2025"
                    hasPayment={false}
                  />
                </>
              ) : (
                /* Konten Halaman Day 2 sesuai desain baru */
                <PlanItemCard
                  title="Kebun Raya"
                  image="https://images.unsplash.com/photo-1546484406-f138810c9c7e?auto=format&fit=crop&w=400&q=80"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor..."
                  time="10:00"
                  date="11 October 2025"
                  hasPayment={false}
                />
              )}

              {/* Tombol Plus (Tetap Muncul di setiap hari) */}
              <div
                onClick={onAddPlace}
                className="bg-white border border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 h-40 lg:h-auto min-h-[160px]"
              >
                <div className="w-16 h-16 rounded-full border-4 border-blue-400 flex items-center justify-center">
                  <Plus className="h-10 w-10 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Panah Kanan */}
          <div className="w-12 shrink-0 flex justify-center">
            <button
              onClick={() => setCurrentDay(currentDay + 1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
            >
              <ChevronRight className="h-10 w-10 text-black stroke-[3px]" />
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 flex justify-between items-end border-t border-gray-100 pt-8">
          <div className="text-3xl font-light text-gray-800">
            Estimation <span className="ml-3 font-semibold">Rp 2.000.000</span>
          </div>

          {/* Tombol Set Plan sekarang memicu onCreatePlan */}
          <button
            onClick={onCreatePlan}
            className="px-10 py-3 bg-[#00A9E0] text-white text-xl font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95"
          >
            Set Plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default PlannerEditPage;