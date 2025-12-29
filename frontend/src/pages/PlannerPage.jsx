import React from "react";
import Navbar from "../components/navbar";
import PlanCard from "../components/PlanCard";

const mockPlans = [
  {
    title: "Jalan Jalan",
    type: "Culture",
    location: "Jimbaran - Bedugul",
    duration: "3 Days",
    budget: "2.000.000",
    imageUrls: [
      "https://images.unsplash.com/photo-1546484406-f138810c9c7e?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1565548671754-0e367c00e62d?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1594968817637-e54972d56157?auto=format&fit=crop&w=150&h=150&q=80",
    ],
  },
  {
    title: "Liburan Bali",
    type: "Nature",
    location: "Uluwatu - Kuta",
    duration: "2 Days",
    budget: "1.500.000",
    imageUrls: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=150&h=150&q=80",
    ],
  },
];

// Tambahkan onEditPlan di dalam destructuring props
const PlannerPage = ({ onNavigate, onCreatePlan, onEditPlan, plans, currentView }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar onNavigate={onNavigate} currentView={currentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-black">List Plan</h1>

          <button
            onClick={onCreatePlan}
            className="px-5 py-2 bg-[#00A9E0] text-white text-xl font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all active:scale-95"
          >
            Create Plan
          </button>
        </div>

        <div className="space-y-6">
          {mockPlans.map((plan, index) => (
            <div
              key={index}
              /* PASANG onEditPlan DI SINI */
              onClick={onEditPlan}
              className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-100"
            >
              <PlanCard
                title={plan.title}
                type={plan.type}
                location={plan.location}
                duration={plan.duration}
                budget={plan.budget}
                imageUrls={plan.imageUrls}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlannerPage;
