import React from "react";
import Navbar from "../components/navbar"; // Pastikan path dan huruf besar/kecil benar
import HistoryCard from "../components/HistoryCard";

// TAMBAHKAN onNavigate DI SINI
const HistoryPage = ({ onNavigate, currentView, plans }) => {
  // Gunakan data plans dari App.jsx, jika kosong gunakan array kosong
  const displayPlans = plans || [];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* KIRIMKAN PROPS KE NAVBAR */}
      <Navbar onNavigate={onNavigate} currentView={currentView} />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-10 text-black">History</h1>

        <div className="space-y-8">
          {displayPlans.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-xl italic">
                No history yet. Start planning your trip!
              </p>
            </div>
          ) : (
            displayPlans.map((plan, index) => (
              <HistoryCard key={plan.id || index} plan={plan} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
