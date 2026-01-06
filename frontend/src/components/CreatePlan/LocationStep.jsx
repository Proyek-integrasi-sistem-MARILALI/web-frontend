import { useNavigate } from "react-router-dom";
import { ChevronRight, Star, Clock, Calendar as CalendarIcon, Cloud } from "lucide-react";
import AIRecommendationCard from "../AIRecommendationCard";

/**
 * Location/destination selection step - final step to add activities
 * Task 2.2: Updated to display AI recommendations with live flight prices
 */
const LocationStep = ({ 
  formData,
  setFormData,
  locations, 
  selectedTrips,
  loading,
  error,
  onFetchDestinations,
  onAddToPlan,
  onRemoveTrip,
  onApply,
  goBack,
  aiRecommendations // Task 2.2: Support AI recommendations with flight prices
}) => {
  const navigate = useNavigate();
  
  // Check if we're showing AI recommendations or regular locations
  const showingAIRecommendations = aiRecommendations && aiRecommendations.length > 0;
  const displayItems = showingAIRecommendations ? aiRecommendations : locations;

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <ChevronRight className="h-10 w-10 text-black stroke-[3px] rotate-180" />
          </button>
          <h1 className="text-3xl font-bold text-black">Create Plan</h1>
        </div>

        {/* SECTION: LOCATION SELECTION */}
        <div className="border border-gray-400 rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Would you like to plan your trip now?
          </h2>
          <p className="text-xl mb-4">Choose Area in Bali</p>
          <div className="border border-black rounded-lg h-14 flex items-center px-4 mb-4">
            <select
              className="w-full text-xl bg-transparent outline-none cursor-pointer"
              value={formData.destinationLocation}
              onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
            >
              <option value="Denpasar">Denpasar</option>
              <option value="Ubud">Ubud</option>
              <option value="Seminyak">Seminyak</option>
              <option value="Nusa Dua">Nusa Dua</option>
              <option value="Sanur">Sanur</option>
              <option value="Canggu">Canggu</option>
            </select>
            <ChevronRight className="ml-auto h-6 w-6" />
          </div>
          <p className="text-sm text-gray-500 mb-4">All locations are in Bali, Indonesia</p>
          <button 
            onClick={onFetchDestinations}
            disabled={loading}
            className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold mb-3 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Search location'}
          </button>
          <button
            onClick={onApply}
            disabled={loading}
            className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'I set my plan later'}
          </button>
        </div>

        {/* CARD LOCATION */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {showingAIRecommendations ? 'Getting AI recommendations...' : 'Loading destinations...'}
            </p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No destinations found. Try searching for locations above.</p>
          </div>
        ) : (
          <>
            {/* Header for AI recommendations */}
            {showingAIRecommendations && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  AI-Powered Recommendations
                </h3>
                <p className="text-sm text-blue-700">
                  These destinations are personalized based on your budget, dates, and preferences. 
                  Live flight prices are shown when available.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {showingAIRecommendations ? (
                /* Task 2.2: Display AI recommendations with flight prices */
                aiRecommendations.map((rec) => (
                  <AIRecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onAddToPlan={onAddToPlan}
                  />
                ))
              ) : (
                locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <img
                      src={loc.image_url || "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400"}
                      alt={loc.name}
                      className="h-64 w-full object-cover"
                    />
                    <div className="p-5">
                      <h3 className="text-2xl font-bold mb-2">{loc.name}</h3>
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                        {loc.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/location/${loc.id}`)}
                          className="flex-1 border border-black py-2 rounded-lg font-bold hover:bg-gray-50"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToPlan(loc)}
                          className="flex-1 border border-black py-2 rounded-lg font-bold hover:bg-gray-50"
                        >
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* LIST OF ADDED LOCATIONS */}
        {selectedTrips.length > 0 && (
          <div className="space-y-6 mb-10">
            {selectedTrips.map((trip) => (
              <div
                key={trip.instanceId}
                className="border border-gray-400 rounded-xl p-6 flex gap-6 relative shadow-sm"
              >
                <img
                  src={trip.image}
                  className="w-64 h-40 object-cover rounded-lg"
                  alt={trip.name}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center gap-2">
                        {trip.name}
                        <span className="text-lg font-normal text-gray-500 flex items-center gap-1">
                          <Cloud className="w-5 h-5" /> {trip.weather}
                        </span>
                      </h3>
                      <p className="text-gray-500 mt-2 line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mt-4 text-xl font-medium">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Clock className="w-6 h-6" /> {trip.time}{" "}
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <CalendarIcon className="w-6 h-6" /> {trip.date}{" "}
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveTrip(trip.instanceId)}
                    className="w-full bg-red-600 text-white py-3 rounded-xl text-2xl font-bold mt-6 hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onApply}
          disabled={loading}
          className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-3xl font-bold shadow-md hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Apply'}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default LocationStep;
