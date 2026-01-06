import React from 'react';
import { Star } from "lucide-react";

/**
 * Accommodation grid display and selection
 */
const HotelSelectionStep = ({ 
  accommodations, 
  selectedAccommodation, 
  onSelectAccommodation,
  onContinue,
  loading 
}) => {
  // Debug: Log when component receives new data
  React.useEffect(() => {
    console.log('[HotelSelectionStep] Received hotels:', accommodations.length);
    if (accommodations.length > 0) {
      console.log('[HotelSelectionStep] First hotel:', accommodations[0].hotel_name, accommodations[0].total_price);
    }
  }, [accommodations]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading accommodations...</p>
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No accommodations found. Try adjusting your search.</p>
        <button
          onClick={onContinue}
          className="mt-6 px-8 py-3 bg-[#00A9E0] text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Skip to Activity Planning
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      {accommodations.slice(0, 6).map((accommodation, index) => (
        <div
          key={`hotel-${accommodation.id || index}`}
          className={`border rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all ${
            selectedAccommodation?.id === accommodation.id 
              ? 'border-[#00A9E0] border-2' 
              : 'border-gray-300'
          }`}
        >
          <img
            src={accommodation.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"}
            alt={accommodation.hotel_name}
            className="h-64 w-full object-cover"
          />
          <div className="p-5">
            <h3 className="text-2xl font-bold mb-2">{accommodation.hotel_name}</h3>
            <div className="flex mb-3">
              {[...Array(Math.round(accommodation.rating || 4))].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm mb-6 line-clamp-3">
              {accommodation.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm border border-black px-2 py-1 rounded font-semibold">
                Rp {accommodation.price_per_night.toLocaleString('id-ID')} - {accommodation.total_price.toLocaleString('id-ID')}
              </span>
              <button 
                onClick={() => onSelectAccommodation(accommodation)}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  selectedAccommodation?.id === accommodation.id
                    ? 'bg-green-600 text-white'
                    : 'bg-[#00A9E0] text-white hover:bg-blue-600'
                }`}
              >
                {selectedAccommodation?.id === accommodation.id ? 'Selected' : 'Book'}
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="col-span-full">
        <button
          onClick={onContinue}
          disabled={!selectedAccommodation}
          className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-3xl font-bold mt-10 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedAccommodation ? 'Apply' : 'Select an accommodation to continue'}
        </button>
      </div>
    </div>
  );
};

export default HotelSelectionStep;
