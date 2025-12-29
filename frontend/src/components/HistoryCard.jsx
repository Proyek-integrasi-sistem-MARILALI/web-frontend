import React from "react";

const HistoryCard = ({ plan }) => {
  return (
    <div className="border border-gray-300 rounded-xl p-6 flex items-center justify-between shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* Kolom Kiri: Detail Teks */}
      <div className="space-y-3">
        <h3 className="text-3xl font-bold flex items-center gap-3">
          {plan.title}{" "}
          <span className="text-lg font-normal text-gray-500">{plan.type}</span>
        </h3>
        <div className="space-y-2 text-gray-700 text-lg">
          <p className="flex items-center gap-2">
            <span className="w-6">📍</span> {plan.location}
          </p>
          <p className="flex items-center gap-2">
            <span className="w-6">⏱</span> {plan.duration}
          </p>
          <p className="flex items-center gap-2 font-medium">
            <span className="w-6">💵</span> Estimasi Biaya - {plan.budget}
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Gambar & Tombol */}
      <div className="flex items-center gap-6">
        {/* Ikon Map Kecil (Sesuai Desain) */}
        <div className="bg-[#00A9E0] p-3 rounded-lg mr-2">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" fill="#00A9E0" />
          </svg>
        </div>

        {/* Galeri Gambar Bertumpuk */}
        <div className="flex -space-x-8">
          {plan.imageUrls.map((url, i) => (
            <img
              key={i}
              className="w-24 h-32 object-cover rounded-lg border-2 border-white shadow-lg"
              src={url}
              alt={`Trip ${i}`}
            />
          ))}
        </div>

        {/* Tombol Go Again */}
        <button className="ml-4 bg-[#00A9E0] text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-blue-600 shadow-md active:scale-95 transition-all">
          Go Again
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
