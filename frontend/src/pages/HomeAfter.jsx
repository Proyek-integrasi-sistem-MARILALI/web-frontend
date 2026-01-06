import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Footer, TripCard, LocationCard } from "../components";
import { FaSearch } from "react-icons/fa";
import { itineraryService, activityService, destinationService } from "../services/api.service";
import { useAuth } from "../context/AuthContext";

// === IMPORT IMAGE DARI ASSETS ===
import heroImage from "../assets/hero.png";
import stripBg from "../assets/strip-bg.png";

// avatar - removed static imports, will use user profile_picture from API

// trip images
import trip1 from "../assets/Trip-1.png";
import trip2 from "../assets/Trip-2.png";
import trip3 from "../assets/Trip-3.png";

// location images
import location1 from "../assets/location-1.png";
import location2 from "../assets/location-2.png";
import location3 from "../assets/location-3.png";
import location4 from "../assets/location-4.png";

export default function HomeAfter() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  /* =========================
     ITINERARY STATE
  ========================= */
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [exploreTrips, setExploreTrips] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [votedTrips, setVotedTrips] = useState(new Map());
  const [votingInProgress, setVotingInProgress] = useState(new Set());

  const fetchDestinations = useCallback(async () => {
    setDestinationsLoading(true);
    try {
      const data = await destinationService.getPopular(4);
      setDestinations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    } finally {
      setDestinationsLoading(false);
    }
  }, []);

  const fetchExploreTrips = useCallback(async () => {
    setTripsLoading(true);
    try {
      const data = await itineraryService.getAll();
      const tripsArray = Array.isArray(data) ? data : [];
      setExploreTrips(tripsArray.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      console.error('Error details:', error.message);
    } finally {
      setTripsLoading(false);
    }
  }, []);

  // Separate function to fetch votes
  const fetchVotesForTrips = useCallback(async () => {
    if (!isLoggedIn || exploreTrips.length === 0) return;
    
    try {
      const votePromises = exploreTrips.map(trip => 
        itineraryService.getUserVote(trip.id).catch(() => ({ vote_type: null }))
      );
      const votes = await Promise.all(votePromises);
      const voteMap = new Map();
      exploreTrips.forEach((trip, index) => {
        if (votes[index].vote_type) {
          voteMap.set(trip.id, votes[index].vote_type);
        }
      });
      setVotedTrips(voteMap);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    }
  }, [isLoggedIn, exploreTrips]);

  const fetchCurrentItinerary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const itineraries = await itineraryService.getAll();
      
      const itinerariesArray = Array.isArray(itineraries) ? itineraries : [];
      // Get the first planned itinerary (not completed)
      const activeItinerary = itinerariesArray.find(it => it.status === 'planned') || itinerariesArray[0];
      
      if (activeItinerary) {
        setCurrentItinerary(activeItinerary);
        
        // Fetch activities for this itinerary
        try {
          const itineraryActivities = await activityService.getByItinerary(activeItinerary.id);
          setActivities(Array.isArray(itineraryActivities) ? itineraryActivities : []);
        } catch (activityError) {
          console.error('Failed to fetch activities:', activityError);
          setActivities([]);
        }
        
        // Calculate total days
        if (activeItinerary.start_date && activeItinerary.end_date) {
          const start = new Date(activeItinerary.start_date);
          const end = new Date(activeItinerary.end_date);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          setCurrentDay(Math.min(currentDay, days));
        }
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      console.error('Error details:', error.message);
      setError('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  }, [currentDay]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCurrentItinerary();
    fetchDestinations();
    fetchExploreTrips();
  }, [fetchCurrentItinerary, fetchDestinations, fetchExploreTrips]);

  // Fetch votes when trips are loaded or user logs in
  useEffect(() => {
    fetchVotesForTrips();
  }, [fetchVotesForTrips]);

  // Get activities for current day
  const getDayActivities = () => {
    if (!currentItinerary || !activities.length) return [];
    
    const startDate = new Date(currentItinerary.start_date);
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + currentDay - 1);
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.activity_date).toISOString().split('T')[0];
      return activityDate === currentDateStr;
    }).sort((a, b) => {
      if (a.start_time && b.start_time) {
        return new Date(a.start_time) - new Date(b.start_time);
      }
      return a.order_index - b.order_index;
    });
  };

  const getTotalDays = () => {
    if (!currentItinerary || !currentItinerary.start_date || !currentItinerary.end_date) return 1;
    const start = new Date(currentItinerary.start_date);
    const end = new Date(currentItinerary.end_date);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const dayActivities = getDayActivities();
  const totalDays = getTotalDays();

  // Handle voting for trips
  const handleVote = async (tripId, voteType) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (votingInProgress.has(tripId)) return;

    const newVotingInProgress = new Set(votingInProgress);
    newVotingInProgress.add(tripId);
    setVotingInProgress(newVotingInProgress);

    try {
      const currentVote = votedTrips.get(tripId);
      const response = await itineraryService.vote(tripId, voteType);
      
      const newVotedTrips = new Map(votedTrips);
      if (response.vote_type) {
        newVotedTrips.set(tripId, response.vote_type);
      } else {
        newVotedTrips.delete(tripId);
      }
      setVotedTrips(newVotedTrips);
      
      // Update trip counts locally
      setExploreTrips(exploreTrips.map(trip => {
        if (trip.id !== tripId) return trip;
        
        let upvotes = trip.upvotes || 0;
        let downvotes = trip.downvotes || 0;
        
        if (currentVote === 'upvote') upvotes = Math.max(0, upvotes - 1);
        if (currentVote === 'downvote') downvotes = Math.max(0, downvotes - 1);
        
        if (response.vote_type === 'upvote') upvotes += 1;
        if (response.vote_type === 'downvote') downvotes += 1;
        
        return { ...trip, upvotes, downvotes };
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      const newVotingInProgress = new Set(votingInProgress);
      newVotingInProgress.delete(tripId);
      setVotingInProgress(newVotingInProgress);
    }
  };

  /* =========================
     TRIP DATA (REAL-TIME ONLY)
  ========================= */
  const trips = exploreTrips.map((trip, index) => {
    const currentVote = votedTrips.get(trip.id);
    // Use budget or total_budget field
    const budgetValue = trip.budget || trip.total_budget;
    return {
      id: trip.id,
      title: trip.title || `Trip ${trip.id}`,
      owner: trip.user?.name || trip.user_name || "Anonymous",
      avatar: trip.user?.profile_picture || trip.user_profile_picture || null,
      image: trip.image_url || [trip1, trip2, trip3][index % 3],
      rating: trip.upvotes || 0,
      reviewers: (trip.upvotes || 0) + (trip.downvotes || 0),
      price: budgetValue ? `Rp.${budgetValue.toLocaleString('id-ID')}` : null,
      users: trip.person_count || 1,
      location: trip.origin_city && trip.destination_city 
        ? `${trip.origin_city} - ${trip.destination_city}` 
        : null,
      userInitial: (trip.user?.name || trip.user_name)?.charAt(0)?.toUpperCase() || "A",
      categories: trip.notes || null,
      currentVote: currentVote,
      onVoteUp: () => handleVote(trip.id, 'upvote'),
      onVoteDown: () => handleVote(trip.id, 'downvote'),
    };
  });

  // Use real destinations only
  const locations = destinations.map(dest => ({
    id: dest.id,
    title: dest.name,
    image: dest.image_url || location1,
    description: dest.description || "Beautiful destination.",
  }));

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section
        className="w-full h-[500px] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          Explore Bali Finest
        </h1>
        <p className="text-xl mt-2 drop-shadow-lg">
          Your Warmest Trip Planner
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl w-full mx-auto px-6 py-16">

        {/* ===== CURRENT ITINERARY ===== */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Current itinerary
          </h2>

          {loading ? (
            <div className="border border-gray-400 rounded-xl p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : error || !currentItinerary ? (
            <div className="border border-gray-400 rounded-xl p-8 text-center">
              <p className="text-gray-500 mb-4">
                {error || "No active itinerary found"}
              </p>
              <button
                onClick={() => navigate("/planner/create")}
                className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
              >
                Create New Plan
              </button>
            </div>
          ) : (
            <div className="border border-gray-400 rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {currentItinerary.title}
                </h3>
                <span className="text-sm text-gray-600">
                  Day {currentDay} of {totalDays}
                </span>
              </div>

              {dayActivities.length > 0 ? (
                <>
                  <div
                    className="grid text-center font-semibold mb-2"
                    style={{ gridTemplateColumns: `repeat(${dayActivities.length}, minmax(0, 1fr))` }}
                  >
                    {dayActivities.map((activity, i) => (
                      <p key={`time-${i}`}>
                        {activity.start_time 
                          ? new Date(activity.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                          : '10:00'}
                      </p>
                    ))}
                  </div>

                  <div
                    className="grid text-center text-gray-600 mb-6"
                    style={{ gridTemplateColumns: `repeat(${dayActivities.length}, minmax(0, 1fr))` }}
                  >
                    {dayActivities.map((activity, i) => (
                      <p key={`place-${i}`} className="truncate px-2">
                        {activity.title || activity.location}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 mb-6">
                  No activities scheduled for this day
                </p>
              )}

              <div className="w-full h-2 bg-sky-500 rounded-full mb-8" />

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => navigate(`/planner/${currentItinerary.id}/edit`)}
                  className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700"
                >
                  View Plan
                </button>
                
                <button
                  onClick={() => navigate("/planner/create")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Set New Plan
                </button>

                {currentDay > 1 && (
                  <button
                    onClick={() => setCurrentDay(prev => prev - 1)}
                    className="px-6 py-2 rounded-lg text-white bg-sky-600 hover:bg-sky-700"
                  >
                    Previous Day
                  </button>
                )}

                {currentDay < totalDays && (
                  <button
                    onClick={() => setCurrentDay(prev => prev + 1)}
                    className="px-6 py-2 rounded-lg text-white bg-sky-600 hover:bg-sky-700"
                  >
                    Next Day
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ===== EXPLORE ===== */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Explore
          </h2>

          {tripsLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : trips.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-10">
                {trips.map((trip) => (
                  <TripCard key={trip.id} {...trip} />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <button
                  onClick={() => navigate("/explorer")}
                  className="bg-sky-600 text-white px-10 py-3 rounded-lg hover:bg-sky-700"
                >
                  Explore plan
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No Travel Plans Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start exploring and create your first trip plan!
              </p>
              <button
                onClick={() => navigate("/planner/create")}
                className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700"
              >
                Create Your First Plan
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ================= IMAGE STRIP ================= */}
      <section
        className="w-full bg-cover bg-center py-10"
        style={{ backgroundImage: `url(${stripBg})` }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
          {[trip1, trip2, trip3].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-56 object-cover rounded-lg shadow-lg"
            />
          ))}
        </div>
      </section>

      {/* ================= MORE LOCATION ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-20 mb-10">
        <h2 className="text-2xl font-semibold text-center mb-10">
          More Location
        </h2>

        {destinationsLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        ) : locations.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-10">
            {locations.map((loc) => (
              <LocationCard key={loc.id} {...loc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No destinations available at the moment.</p>
          </div>
        )}
      </section>

    </div>
  );
}
