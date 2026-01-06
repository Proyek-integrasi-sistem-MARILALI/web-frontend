import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { flightService, accommodationService, destinationService, activityService, itineraryService, aiRecommendationService } from "../services/api.service";

// Import components
import DateBudgetStep from "../components/CreatePlan/DateBudgetStep";
import LocationFlightSearch from "../components/CreatePlan/LocationFlightSearch";
import FlightSelectionStep from "../components/CreatePlan/FlightSelectionStep";
import AccommodationSearchSection from "../components/CreatePlan/AccommodationSearchSection";
import HotelSelectionStep from "../components/CreatePlan/HotelSelectionStep";
import LocationStep from "../components/CreatePlan/LocationStep";
import { useCreatePlanForm } from "../components/CreatePlan/hooks/useCreatePlanForm";

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedDestination = location.state?.destination;

  // Use custom hook for form state management
  const {
    step,
    formData,
    selectedTrips,
    selectedFlight,
    selectedAccommodation,
    accommodationArea,
    locations,
    flights,
    accommodations,
    loading,
    error,
    setFormData,
    setSelectedTrips,
    setSelectedFlight,
    setSelectedAccommodation,
    setAccommodationArea,
    setLocations,
    setFlights,
    setAccommodations,
    setLoading,
    setError,
    goToStep,
    goBack,
    clearPersistedState,
  } = useCreatePlanForm(preselectedDestination);

  // Track search timestamps for forcing re-renders
  const [flightSearchTime, setFlightSearchTime] = useState(Date.now());
  const [accomSearchTime, setAccomSearchTime] = useState(Date.now());

  // API Operations
  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Task 2.2: Use AI recommendations if we have budget and dates
      if (formData.budget && formData.startDate && formData.finishDate) {
        console.log('[AI] Fetching AI recommendations with flight prices...');
        const aiRequest = {
          budget_max: parseInt(formData.budget.replace(/\./g, "")),
          start_date: new Date(formData.startDate).toISOString().split('T')[0],
          end_date: new Date(formData.finishDate).toISOString().split('T')[0],
          preferences: [formData.destinationLocation?.toLowerCase() || 'beach'],
          limit: 10
        };
        
        const recommendations = await aiRecommendationService.getDestinations(aiRequest);
        console.log('[AI] Got recommendations:', recommendations.length);
        setLocations(recommendations); // Store AI recommendations in locations state
      } else {
        // Fallback to regular destinations
        console.log('[Fallback] Using regular destination search');
        const data = await destinationService.getPopular(10);
        setLocations(data);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to load destinations');
      // Fallback to regular destinations on AI error
      try {
        const data = await destinationService.getPopular(10);
        setLocations(data);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchFlights = async () => {
    console.log('[FLIGHT SEARCH] ====== STARTING NEW SEARCH ======');
    console.log('[FLIGHT SEARCH] Current formData:', formData);
    
    if (!formData.startDate || !formData.location || !formData.destinationLocation) {
      setError('Please fill in dates and locations');
      console.error('[FLIGHT SEARCH] Missing required fields');
      return;
    }

    // CRITICAL: Clear existing flights to force re-render and prevent showing old data
    console.log('[FLIGHT SEARCH] Clearing old flights...');
    setFlights([]);
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
      console.log('[FLIGHT SEARCH] Calling API with payload:', searchData);
      console.log('[FLIGHT SEARCH] API endpoint: /transportation/flights/search');
      
      const results = await flightService.search(searchData);
      
      console.log('[FLIGHT SEARCH] ✓ API Response received');
      console.log('[FLIGHT SEARCH] Received results:', results?.length || 0, 'flights');
      if (results && results.length > 0) {
        console.log('[FLIGHT SEARCH] First 3 flights:', results.slice(0, 3).map(f => ({
          number: f.flight_number,
          airline: f.airline,
          price: f.price
        })));
      }
      
      setFlights(results || []);
      const newTimestamp = Date.now();
      setFlightSearchTime(newTimestamp);
      console.log('[FLIGHT SEARCH] ✓ State updated with new timestamp:', newTimestamp);
      console.log('[FLIGHT SEARCH] ✓ Navigating to flight step');
      console.log('[FLIGHT SEARCH] ====== SEARCH COMPLETE ======');
      goToStep("flight");
    } catch (err) {
      setError('Failed to search flights');
      console.error('[FLIGHT SEARCH] ✗ API Error:', err);
      console.error('[FLIGHT SEARCH] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const selectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  const searchAccommodations = async () => {
    console.log('[ACCOMMODATION SEARCH] ====== STARTING NEW SEARCH ======');
    console.log('[ACCOMMODATION SEARCH] Current formData:', formData);
    console.log('[ACCOMMODATION SEARCH] Accommodation area:', accommodationArea);
    
    if (!formData.startDate || !formData.finishDate) {
      setError('Please fill in dates');
      console.error('[ACCOMMODATION SEARCH] Missing dates');
      return;
    }

    if (!accommodationArea) {
      setError('Please select an accommodation area');
      console.error('[ACCOMMODATION SEARCH] Missing accommodation area');
      return;
    }

    // CRITICAL: Clear existing accommodations to force re-render and prevent showing old data
    console.log('[ACCOMMODATION SEARCH] Clearing old accommodations...');
    setAccommodations([]);
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
      console.log('[ACCOMMODATION SEARCH] Calling API with payload:', searchData);
      console.log('[ACCOMMODATION SEARCH] API endpoint: /accommodation/search');
      
      const results = await accommodationService.search(searchData);
      
      console.log('[ACCOMMODATION SEARCH] ✓ API Response received');
      console.log('[ACCOMMODATION SEARCH] Received results:', results?.length || 0, 'hotels');
      if (results && results.length > 0) {
        console.log('[ACCOMMODATION SEARCH] First 3 hotels:', results.slice(0, 3).map(h => ({
          name: h.hotel_name,
          price: h.total_price,
          rating: h.rating
        })));
      }
      
      setAccommodations(results || []);
      const newTimestamp = Date.now();
      setAccomSearchTime(newTimestamp);
      console.log('[ACCOMMODATION SEARCH] ✓ State updated with new timestamp:', newTimestamp);
      console.log('[ACCOMMODATION SEARCH] ====== SEARCH COMPLETE ======');
    } catch (err) {
      setError('Failed to search accommodations');
      console.error('[ACCOMMODATION SEARCH] ✗ API Error:', err);
      console.error('[ACCOMMODATION SEARCH] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const selectAccommodation = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const addToPlan = (location) => {
    const alreadyAdded = selectedTrips.some(trip => trip.id === location.id);
    if (alreadyAdded) {
      alert('This location has already been added to your plan!');
      return;
    }
    
    // Calculate the date for this trip based on how many trips are already added
    const tripIndex = selectedTrips.length;
    const startDate = formData.startDate ? new Date(formData.startDate) : new Date();
    const tripDate = new Date(startDate);
    tripDate.setDate(startDate.getDate() + tripIndex); // Each trip gets a different day
    
    const newTrip = {
      ...location,
      instanceId: Date.now() + Math.random(),
      image: location.image_url || location.image || "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400",
      time: `${10 + (tripIndex % 8)}:00`, // Vary time between 10:00-17:00
      date: tripDate.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
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
    return total;
  };

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
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
      
      if (selectedTrips.length > 0) {
        for (let i = 0; i < selectedTrips.length; i++) {
          const trip = selectedTrips[i];
          try {
            const timeStr = trip.time || '10:00';
            const activityPayload = {
              destination_id: trip.id,
              activity_date: formData.startDate,
              start_time: `${formData.startDate}T${timeStr}:00`,
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
          }
        }
      }
      
      clearPersistedState();
      navigate(`/planner/${created.id}/edit`);
    } catch (error) {
      console.error("Failed to create itinerary:", error);
      setError("Failed to create trip plan");
      alert("Failed to create trip plan");
    } finally {
      setLoading(false);
    }
  };

  const handleLocalUser = () => {
    if (!formData.location) setFormData(prev => ({ ...prev, location: "Jakarta" }));
    if (!formData.destinationLocation) setFormData(prev => ({ ...prev, destinationLocation: "Denpasar" }));
    goToStep("flight");
  };

  // Render finalize step (location selection)
  if (step === "finalize") {
    // Check if locations contain AI recommendations (have destination property)
    const hasAIRecommendations = locations.length > 0 && locations[0].destination;
    
    return (
      <LocationStep
        formData={formData}
        setFormData={setFormData}
        locations={hasAIRecommendations ? [] : locations}
        aiRecommendations={hasAIRecommendations ? locations : []}
        selectedTrips={selectedTrips}
        loading={loading}
        error={error}
        onFetchDestinations={fetchDestinations}
        onAddToPlan={addToPlan}
        onRemoveTrip={removeTrip}
        onApply={handleApply}
        goBack={goBack}
      />
    );
  }

  // Main form render
  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
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
          {/* Date, Budget, Person */}
          <DateBudgetStep formData={formData} setFormData={setFormData} />

          {/* Location & Flight Search */}
          <LocationFlightSearch
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            onSearchFlights={searchFlights}
            onLocalUser={handleLocalUser}
            step={step}
          />

          {/* Flight Results */}
          {step === "flight" && (
            <>
              <FlightSelectionStep
                key={`flights-${flightSearchTime}`}
                flights={flights}
                selectedFlight={selectedFlight}
                onSelectFlight={selectFlight}
                loading={loading}
                error={error}
              />

              <AccommodationSearchSection
                accommodationArea={accommodationArea}
                setAccommodationArea={setAccommodationArea}
                formData={formData}
                loading={loading}
                onSearchAccommodations={() => {
                  searchAccommodations();
                  goToStep("accommodation");
                }}
                onSkipAccommodation={() => goToStep("finalize")}
              />
            </>
          )}

          {/* Accommodation Results */}
          {step === "accommodation" && (
            <HotelSelectionStep
              key={`hotels-${accomSearchTime}`}
              accommodations={accommodations}
              selectedAccommodation={selectedAccommodation}
              onSelectAccommodation={selectAccommodation}
              onContinue={() => goToStep("finalize")}
              loading={loading}
            />
          )}

          {/* Estimation Footer */}
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
