import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Calendar as CalendarIcon,
  Cloud,
  Star,
} from "lucide-react";
import { itineraryService, flightService, accommodationService, destinationService, activityService } from "../services/api.service";
import { useAuth } from "../context/AuthContext";

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedDestination = location.state?.destination;
  const { user } = useAuth();

  // Get user-specific localStorage key
  const getStorageKey = () => {
    return user ? `createPlanState_${user.id}` : 'createPlanState';
  };

  // Load persisted state from localStorage or use defaults
  const loadPersistedState = () => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
    return {
      step: "input",
      formData: {
        startDate: "",
        finishDate: "",
        budget: "",
        personCount: 1,
        location: "Jakarta",
        destinationLocation: "Denpasar",
      },
      selectedTrips: [],
      selectedFlight: null,
      selectedAccommodation: null,
      accommodationArea: "Kota Denpasar",
      locations: [],
    };
  };

  const persistedState = loadPersistedState();

  const [step, setStep] = useState(persistedState.step);
  const [previousStep, setPreviousStep] = useState(null);
  const [formData, setFormData] = useState(persistedState.formData);
  const [selectedTrips, setSelectedTrips] = useState(persistedState.selectedTrips);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(persistedState.selectedFlight);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(persistedState.selectedAccommodation);
  const [accommodationArea, setAccommodationArea] = useState(persistedState.accommodationArea);
  const [locations, setLocations] = useState(persistedState.locations || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const startInputRef = useRef(null);
  const finishInputRef = useRef(null);

  // Helper function to navigate between steps
  const goToStep = (newStep) => {
    setPreviousStep(step);
    setStep(newStep);
  };

  // Helper function to go back
  const goBack = () => {
    if (previousStep) {
      setStep(previousStep);
      setPreviousStep(null);
    } else {
      setStep("input");
    }
  };

  // Clean up old generic localStorage on mount
  useEffect(() => {
    // Remove old non-user-specific state if it exists
    if (localStorage.getItem('createPlanState')) {
      localStorage.removeItem('createPlanState');
    }
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const stateToSave = {
        step,
        formData,
        locations,
        selectedTrips,
        selectedFlight,
        selectedAccommodation,
        accommodationArea,
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(stateToSave));
    }
  }, [step, formData, selectedTrips, selectedFlight, selectedAccommodation, accommodationArea, locations, user]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await destinationService.getPopular(10);
      setLocations(data);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Choose Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleBudgetChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = parseInt(value).toLocaleString("id-ID");
    }
    setFormData({ ...formData, budget: value });
  };

  const adjustPerson = (delta) => {
    setFormData((prev) => ({
      ...prev,
      personCount: Math.max(1, prev.personCount + delta),
    }));
  };

  const searchFlights = async () => {
    if (!formData.startDate || !formData.location || !formData.destinationLocation) {
      setError('Please fill in dates and locations');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const searchData = {
        origin: formData.location,
        destination: formData.destinationLocation,
        departure_date: new Date(formData.startDate).toISOString(),
        return_date: formData.finishDate ? new Date(formData.finishDate).toISOString() : null,
        passengers: formData.personCount,
        cabin_class: "economy",
        max_price: formData.budget ? parseInt(formData.budget.replace(/\./g, "")) : null,
      };
      const results = await flightService.search(searchData);
      setFlights(results);
      goToStep("flight");
    } catch (err) {
      setError('Failed to search flights');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectFlight = async (flight) => {
    setSelectedFlight(flight);
    // Stay on flight step to show accommodation search section below
  };

  const searchAccommodations = async () => {
    if (!formData.startDate || !formData.finishDate) {
      setError('Please fill in dates');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const searchData = {
        location: accommodationArea,
        check_in: new Date(formData.startDate).toISOString(),
        check_out: new Date(formData.finishDate).toISOString(),
        guests: formData.personCount,
        max_price: formData.budget ? parseInt(formData.budget.replace(/\./g, "")) : null,
      };
      const results = await accommodationService.search(searchData);
      setAccommodations(results);
    } catch (err) {
      setError('Failed to search accommodations');
      console.error('Error searching accommodations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectAccommodation = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const addToPlan = (location) => {
    // Check if location is already added
    const alreadyAdded = selectedTrips.some(trip => trip.id === location.id);
    if (alreadyAdded) {
      alert('This location has already been added to your plan!');
      return;
    }
    
    const newTrip = {
      ...location,
      instanceId: Date.now() + Math.random(),
      time: "10:00",
      date: formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "10 October 2025",
      weather: "Cloudy ☁",
    };
    setSelectedTrips([...selectedTrips, newTrip]);
  };

  const removeTrip = (instanceId) => {
    setSelectedTrips(selectedTrips.filter((t) => t.instanceId !== instanceId));
  };

  const calculateTotalEstimation = () => {
    let total = 0;
    if (selectedFlight && selectedFlight.price) {
      total += selectedFlight.price * formData.personCount;
    }
    if (selectedAccommodation && selectedAccommodation.total_price) {
      total += selectedAccommodation.total_price;
    }
    // Return total or 0 if nothing selected
    return total;
  };

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create the itinerary first
      const payload = {
        title: formData.destinationLocation ? `Trip to ${formData.destinationLocation}` : "My Trip Plan",
        description: "Trip created from planner",
        start_date: formData.startDate,
        end_date: formData.finishDate,
        budget: formData.budget ? parseInt(formData.budget.replace(/\./g, "")) : null,
        destination_city: formData.destinationLocation || null,
        destination_country: "Indonesia",
      };

      const created = await itineraryService.create(payload);
      
      // Add selected destinations as activities
      if (selectedTrips.length > 0) {
        for (let i = 0; i < selectedTrips.length; i++) {
          const trip = selectedTrips[i];
          try {
            // Parse the time from trip or use default
            const timeStr = trip.time || '10:00';
            const activityPayload = {
              destination_id: trip.id,
              activity_date: formData.startDate, // Just the date in YYYY-MM-DD format
              start_time: `${formData.startDate}T${timeStr}:00`, // ISO datetime format
              title: trip.name || 'Activity',
              description: trip.description || `Visit ${trip.name}`,
              location: trip.location || trip.name || 'Location',
              estimated_cost: trip.price || 0,
              notes: trip.category || '',
              order_index: i
            };
            await activityService.create(created.id, activityPayload);
          } catch (err) {
            console.error(`Failed to add activity ${trip.name}:`, err);
            // Continue with other activities even if one fails
          }
        }
      }
      
      // Clear persisted state after successful creation
      localStorage.removeItem(getStorageKey());
      
      // Navigate to edit page
      navigate(`/planner/${created.id}/edit`);
    } catch (error) {
      console.error("Failed to create itinerary:", error);
      setError("Failed to create trip plan");
      alert("Failed to create trip plan");
    } finally {
      setLoading(false);
    }
  };

  // Render finalize step (location selection)
  if (step === "finalize") {
    return (
      <div className="min-h-screen bg-white font-sans pb-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={goBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-all"
            >
              <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
            </button>
            <h1 className="text-3xl font-bold text-black">Create Plan</h1>
          </div>

          {/* SECTION: LOKASI SELECTION */}
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
            <button 
              onClick={fetchDestinations}
              disabled={loading}
              className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold mb-3 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Search location'}
            </button>
            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'I set my plan later'}
            </button>
          </div>

          {/* CARD LOKASI */}
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading destinations...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No destinations found. Try searching for locations above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {locations.map((loc) => (
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
                    <div className="flex mb-4">
                      {[...Array(Math.round(loc.rating || 4))].map((_, i) => (
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
                        onClick={() => addToPlan(loc)}
                        className="flex-1 border border-black py-2 rounded-lg font-bold hover:bg-gray-50"
                      >
                        Add to Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST LOKASI YANG SUDAH DITAMBAHKAN (Trip Added Section) */}
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
                      onClick={() => removeTrip(trip.instanceId)}
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
            onClick={handleApply}
            disabled={loading}
            className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-3xl font-bold shadow-md hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Apply'}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl\">
              {error}
            </div>
          )}

          <div className="mt-20 text-3xl font-bold">
            Estimation <span className="ml-10 font-normal">
              {(() => {
                const total = calculateTotalEstimation();
                if (total > 0) {
                  return `Rp ${total.toLocaleString('id-ID')}`;
                } else if (formData.budget) {
                  return `Rp ${formData.budget}`;
                } else {
                  return 'Rp 2.000.000';
                }
              })()}
            </span>
          </div>
        </main>
      </div>
    );
  }

  // Main form render
  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/planner")}
            className="p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
          </button>
          <h1 className="text-3xl font-bold text-black">Create Plan</h1>
        </div>

        <div className="space-y-6">
          {/* Card 1: Date, Budget, Person */}
          <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Date</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className="cursor-pointer"
                  onClick={() => startInputRef.current?.showPicker()}
                >
                  <p className="text-xl mb-2 font-medium">Start</p>
                  <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
                    <input
                      type="date"
                      ref={startInputRef}
                      className="absolute opacity-0 w-0 h-0"
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                    <div className="flex justify-between items-center w-full">
                      <span
                        className={
                          formData.startDate
                            ? "text-black text-xl font-semibold"
                            : "text-gray-400 text-xl"
                        }
                      >
                        {formatDateDisplay(formData.startDate)}
                      </span>
                      <ChevronRight className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => finishInputRef.current?.showPicker()}
                >
                  <p className="text-xl mb-2 font-medium">Finish</p>
                  <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
                    <input
                      type="date"
                      ref={finishInputRef}
                      className="absolute opacity-0 w-0 h-0"
                      onChange={(e) =>
                        setFormData({ ...formData, finishDate: e.target.value })
                      }
                    />
                    <div className="flex justify-between items-center w-full">
                      <span
                        className={
                          formData.finishDate
                            ? "text-black text-xl font-semibold"
                            : "text-gray-400 text-xl"
                        }
                      >
                        {formatDateDisplay(formData.finishDate)}
                      </span>
                      <ChevronRight className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Budget</h2>
              <div className="border border-black rounded-lg h-14 flex items-center px-4 gap-1">
                <span className="text-xl font-normal flex-shrink-0">Set Budget (Rp</span>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  placeholder="1.000.000"
                  className="flex-1 min-w-0 text-xl outline-none bg-transparent placeholder:text-gray-400"
                />
                <span className="text-xl font-normal flex-shrink-0">)</span>
              </div>
            </div>

            {/* Person Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Person</h2>
              <div className="flex items-center justify-between border border-black rounded-lg px-4 h-14">
                <div className="flex items-center gap-3">
                  <User className="h-7 w-7 text-black fill-current" />
                  <span className="text-xl font-bold">
                    {formData.personCount}
                  </span>
                  <ChevronRight className="h-6 w-6 text-black" />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustPerson(-1)}
                    className="text-2xl font-bold border border-black rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustPerson(1)}
                    className="text-2xl font-bold border border-black rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Location & Flight Button */}
          <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <div className="mb-6">
              <p className="text-xl mb-2 font-medium">Your Location</p>
              <div className="relative border border-black rounded-lg h-14 flex items-center px-4 cursor-pointer">
                <select
                  className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                  value={formData.location || "Jakarta"}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                >
                  <option value="Jakarta">Jakarta</option>
                </select>
                <div className="flex justify-between items-center w-full">
                  <span className="text-xl">
                    {formData.location || "Choose Location"}
                  </span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
            <button
              onClick={searchFlights}
              disabled={loading || !formData.startDate || !formData.location || !formData.destinationLocation}
              className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Flight'}
            </button>
            {step === "input" && (
              <button
                onClick={() => {
                  // Set defaults for local users
                  if (!formData.location) setFormData(prev => ({ ...prev, location: "Jakarta" }));
                  if (!formData.destinationLocation) setFormData(prev => ({ ...prev, destinationLocation: "Denpasar" }));
                  // Go to accommodation selection
                  goToStep("flight");
                }}
                disabled={!formData.startDate || !formData.finishDate}
                className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold mt-4 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title={!formData.startDate || !formData.finishDate ? "Please select dates first" : "Skip flight search - I'm already in Bali"}
              >
                Im a local
              </button>
            )}
          </div>

          {/* SECTION: HASIL FLIGHT */}
          {step === "flight" && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                  {error}
                </div>
              )}
              
              {/* Flight selection table - always visible so users can change their mind */}
              <div className="border border-gray-400 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Searching flights...</p>
                  </div>
                ) : flights.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>No flights found. Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="text-2xl font-bold bg-gray-50">
                      <tr>
                        <th className="p-6">Airline</th>
                        <th className="p-6">Flight</th>
                        <th className="p-6">Boarding</th>
                        <th className="p-6">Arrival</th>
                        <th className="p-6">Price</th>
                        <th className="p-6"></th>
                      </tr>
                    </thead>
                    <tbody className="text-xl border-t border-gray-400">
                      {flights.slice(0, 5).map((flight) => (
                        <tr key={flight.id} className="border-b border-gray-100">
                          <td className="p-6">{flight.airline}</td>
                          <td className="p-6">{flight.flight_number}</td>
                          <td className="p-6 font-medium">
                            {new Date(flight.departure_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </td>
                          <td className="p-6 font-medium">
                            {new Date(flight.arrival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </td>
                          <td className="p-6 font-bold">Rp {flight.price.toLocaleString('id-ID')}</td>
                          <td className="p-6">
                            <button 
                              onClick={() => selectFlight(flight)}
                              className={`px-8 py-2 rounded-lg text-sm font-bold transition-colors ${
                                selectedFlight?.id === flight.id 
                                  ? 'bg-[#00A9E0] text-white' 
                                  : 'bg-[#c0c0c0] text-white hover:bg-[#00A9E0]'
                              }`}
                            >
                              {selectedFlight?.id === flight.id ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* SECTION: SEARCH ACCOMMODATION */}
              <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-2">
                  Would you like to book a place?
                </h2>
                <p className="text-xl mb-4">Choose Area</p>
                <select
                  value={accommodationArea}
                  onChange={(e) => setAccommodationArea(e.target.value)}
                  className="w-full border border-black rounded-lg h-14 px-4 mb-6 text-xl appearance-none cursor-pointer bg-white hover:border-blue-500 focus:outline-none focus:border-blue-600 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem',
                    paddingRight: '3rem'
                  }}
                >
                  <option value="Kota Denpasar">Kota Denpasar</option>
                  <option value="Kabupaten Badung">Kabupaten Badung</option>
                  <option value="Kabupaten Gianyar">Kabupaten Gianyar</option>
                  <option value="Kabupaten Tabanan">Kabupaten Tabanan</option>
                  <option value="Kabupaten Buleleng">Kabupaten Buleleng</option>
                  <option value="Kabupaten Karangasem">Kabupaten Karangasem</option>
                  <option value="Kabupaten Klungkung">Kabupaten Klungkung</option>
                  <option value="Kabupaten Bangli">Kabupaten Bangli</option>
                  <option value="Kabupaten Jembrana">Kabupaten Jembrana</option>
                </select>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => {
                      searchAccommodations();
                      goToStep("accommodation");
                    }}
                    disabled={loading || !formData.startDate || !formData.finishDate}
                    className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search Accomodation'}
                  </button>
                  <button
                    onClick={() => goToStep("finalize")}
                    className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all"
                  >
                    I already book a place
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECTION: DAFTAR HOTEL */}
          {step === "accommodation" && (
            <>
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading accommodations...</p>
                </div>
              ) : accommodations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>No accommodations found. Try adjusting your search.</p>
                  <button
                    onClick={() => goToStep("finalize")}
                    className="mt-6 px-8 py-3 bg-[#00A9E0] text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Skip to Activity Planning
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {accommodations.slice(0, 6).map((accommodation) => (
                    <div
                      key={accommodation.id}
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
                            onClick={() => selectAccommodation(accommodation)}
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
                      onClick={() => goToStep("finalize")}
                      disabled={!selectedAccommodation}
                      className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-3xl font-bold mt-10 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedAccommodation ? 'Apply' : 'Select an accommodation to continue'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ESTIMATION FOOTER */}
          <div className="pt-10 text-3xl font-bold">
            Estimation{" "}
            <span className="ml-6 font-normal">
              {(() => {
                const total = calculateTotalEstimation();
                if (total > 0) {
                  return `Rp ${total.toLocaleString('id-ID')}`;
                } else if (formData.budget) {
                  return `Rp ${formData.budget}`;
                } else {
                  return 'Rp 1.000.000';
                }
              })()}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePlanPage;
