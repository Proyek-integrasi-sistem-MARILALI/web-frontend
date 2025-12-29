import React from "react";
import { MapPin, Clock, DollarSign, Map } from "lucide-react"; // Menggunakan ikon yang relevan

const PlanCard = ({ title, type, location, duration, budget, imageUrls }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 my-6 border border-gray-100">
      <div className="flex justify-between items-center">
        {/* PERBAIKAN 1: flex-grow diubah menjadi grow */}
        <div className="grow">
          {/* Judul dan Tipe */}
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            {title}
            <span className="ml-3 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {type}
            </span>
          </h2>

          {/* Detail Rencana */}
          <div className="mt-3 space-y-1 text-gray-600">
            <p className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              {location}
            </p>
            <p className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              {duration}
            </p>
            <p className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
              Estimasi Biaya - {budget}
            </p>
          </div>
        </div>

        {/* Ikon Peta Besar */}
        <div className="hidden sm:block mr-6 text-blue-400 opacity-75">
          <Map className="h-16 w-16" />
        </div>

        {/* Kolase Gambar - PERBAIKAN 2: flex-shrink-0 diubah menjadi shrink-0 */}
        <div className="hidden lg:flex shrink-0 w-80 h-32 rounded-lg overflow-hidden border border-gray-200">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="w-1/3 h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          ))}
        </div>

        {/* Tombol Set Trip - PERBAIKAN 3: flex-shrink-0 diubah menjadi shrink-0 */}
        <div className="ml-8 shrink-0">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-150 ease-in-out">
            Set Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
