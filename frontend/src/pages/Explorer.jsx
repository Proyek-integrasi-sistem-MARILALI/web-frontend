import { useState, useEffect } from "react";
import { itineraryService, favoriteService } from "../services/api.service";
import { User, MapPin, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import UserAvatar from "../components/UserAvatar";
import heroImage from "../assets/hero.png";

export default function Explorer() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [votedTrips, setVotedTrips] = useState(new Map()); // Map<tripId, 'upvote'|'downvote'>
  const [votingInProgress, setVotingInProgress] = useState(new Set());

  // Sync search term with URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
  }, [searchParams]);

  // Clear search function
  const clearSearch = () => {
    setSearchTerm("");
    setSearchParams({});
  };
  
  const itemsPerPage = 6;

  // Fetch user's votes on itineraries
  useEffect(() => {
    const fetchVotes = async () => {
      if (!isLoggedIn || trips.length === 0) return;
      try {
        const votePromises = trips.map(trip => 
          itineraryService.getUserVote(trip.id).catch(() => ({ vote_type: null }))
        );
        const votes = await Promise.all(votePromises);
        const voteMap = new Map();
        trips.forEach((trip, index) => {
          if (votes[index].vote_type) {
            voteMap.set(trip.id, votes[index].vote_type);
          }
        });
        setVotedTrips(voteMap);
      } catch (error) {
        console.error('Failed to fetch votes:', error);
      }
    };
    fetchVotes();
  }, [isLoggedIn, trips.length]);

  // Fetch public trips from API
  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      // Fetch itineraries with pagination (load all for now, can be improved later)
      const data = await itineraryService.getAll(0, 1000);
      
      // Handle different response formats
      const tripsArray = Array.isArray(data) ? data : [];
      
      setTrips(tripsArray);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      console.error('Error details:', error.message, error.response);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

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
      
      // If clicking the same vote type, remove the vote
      const response = await itineraryService.vote(tripId, voteType);
      
      const newVotedTrips = new Map(votedTrips);
      
      // Update vote state based on response
      if (response.vote_type) {
        newVotedTrips.set(tripId, response.vote_type);
      } else {
        newVotedTrips.delete(tripId);
      }
      setVotedTrips(newVotedTrips);
      
      // Update trip counts locally
      setTrips(trips.map(trip => {
        if (trip.id !== tripId) return trip;
        
        let upvotes = trip.upvotes || 0;
        let downvotes = trip.downvotes || 0;
        
        // Remove previous vote
        if (currentVote === 'upvote') upvotes = Math.max(0, upvotes - 1);
        if (currentVote === 'downvote') downvotes = Math.max(0, downvotes - 1);
        
        // Add new vote if it's different from removed
        if (response.vote_type === 'upvote') upvotes += 1;
        if (response.vote_type === 'downvote') downvotes += 1;
        
        return { ...trip, upvotes, downvotes };
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to update vote. Please try again.');
    } finally {
      const newVotingInProgress = new Set(votingInProgress);
      newVotingInProgress.delete(tripId);
      setVotingInProgress(newVotingInProgress);
    }
  };

  // Filter trips by category and search term
  const filteredTrips = trips.filter(trip => {
    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== "All") {
      matchesCategory = trip.category === selectedCategory || trip.notes === selectedCategory;
    }

    // Search filter
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      const title = (trip.title || '').toLowerCase();
      const destination = (trip.destination_city || '').toLowerCase();
      const origin = (trip.origin_city || '').toLowerCase();
      const notes = (trip.notes || '').toLowerCase();
      const userName = (trip.user?.name || trip.user_name || '').toLowerCase();
      
      matchesSearch = title.includes(search) || 
                      destination.includes(search) || 
                      origin.includes(search) ||
                      notes.includes(search) ||
                      userName.includes(search);
    }

    return matchesCategory && matchesSearch;
  });

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* ================= HERO ================= */}
      <section
        className="w-full h-[500px] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Explorer</h1>
        <p className="text-xl mt-2 drop-shadow-lg">Find Trip from other people</p>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="grow max-w-7xl w-full mx-auto px-6 py-16">

        {/* Browse + Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <h2 className="text-2xl font-semibold">Browse</h2>

          {/* Search Term Display */}
          {searchTerm && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <span className="text-gray-700">
                Searching: <span className="font-semibold text-blue-600">{searchTerm}</span>
              </span>
              <button
                onClick={clearSearch}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
                title="Clear search"
              >
                <X size={14} className="text-gray-600" />
              </button>
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter {selectedCategory !== "All" && `(${selectedCategory})`}
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
                <div className="p-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 px-2">
                    Category
                  </label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setShowFilterDropdown(false);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="WaterSport">WaterSport</option>
                    <option value="Culture">Culture</option>
                    <option value="Nature">Nature</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {filteredTrips.length > 0 && (
            <span className="text-gray-600 text-sm">
              Showing {Math.min(filteredTrips.length, itemsPerPage)} of {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm 
                ? `No trips found for "${searchTerm}"`
                : selectedCategory === "All" ? "No trips found" : `No ${selectedCategory} trips found`}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : selectedCategory === "All" 
                  ? "Try adjusting your filters or check back later"
                  : "Try selecting a different category"}
            </p>
            <div className="flex gap-3 justify-center mt-4">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  View All Categories
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Trip Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((trip) => (
              <div key={trip.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={trip.image_url || heroImage}
                  alt={trip.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  {/* Trip Title and User */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{trip.title || `Trip ${trip.id}`}</h3>
                    <div className="flex items-center gap-2">
                      <UserAvatar 
                        src={trip.user?.profile_picture || trip.user_profile_picture}
                        name={trip.user?.name || trip.user_name || 'User'}
                        size="sm"
                      />
                      <span className="text-sm text-gray-600">{trip.user?.name || trip.user_name || 'Anonymous'}</span>
                    </div>
                  </div>

                  {/* Participant count */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <User size={14} />
                    <span>{trip.person_count || 1} travelers</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin size={14} />
                    <span>
                      {trip.origin_city && trip.destination_city 
                        ? `${trip.origin_city} - ${trip.destination_city}`
                        : trip.destination_city
                          ? trip.destination_city
                          : trip.destination_country || 'Bali, Indonesia'}
                    </span>
                  </div>

                  {/* Activities */}
                  <p className="text-sm text-gray-600 mb-3">{trip.notes}</p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-lg font-medium">
                      {trip.upvotes || 0}/{(trip.upvotes || 0) + (trip.downvotes || 0)}
                    </span>
                    <span className="text-sm text-gray-500">▲ {trip.upvotes || 0}</span>
                    <span className="text-sm text-gray-500">▼ {trip.downvotes || 0}</span>
                    <div className="flex gap-2 ml-auto">
                      <button 
                        onClick={() => handleVote(trip.id, 'upvote')}
                        disabled={votingInProgress.has(trip.id)}
                        className={`p-1 rounded transition-colors ${
                          votedTrips.get(trip.id) === 'upvote'
                            ? 'bg-blue-100 hover:bg-blue-200' 
                            : 'hover:bg-gray-100'
                        } ${votingInProgress.has(trip.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={votedTrips.get(trip.id) === 'upvote' ? 'Remove upvote' : 'Upvote'}
                      >
                        <ThumbsUp 
                          size={18} 
                          className={votedTrips.get(trip.id) === 'upvote' ? 'text-blue-600 fill-blue-600' : 'text-gray-600'} 
                        />
                      </button>
                      <button 
                        onClick={() => handleVote(trip.id, 'downvote')}
                        disabled={votingInProgress.has(trip.id)}
                        className={`p-1 rounded transition-colors ${
                          votedTrips.get(trip.id) === 'downvote'
                            ? 'bg-red-100 hover:bg-red-200' 
                            : 'hover:bg-gray-100'
                        } ${votingInProgress.has(trip.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={votedTrips.get(trip.id) === 'downvote' ? 'Remove downvote' : 'Downvote'}
                      >
                        <ThumbsDown 
                          size={18} 
                          className={votedTrips.get(trip.id) === 'downvote' ? 'text-red-600 fill-red-600' : 'text-gray-600'} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-xl font-bold mb-4">
                    Rp.{((trip.budget || trip.total_budget || 0)).toLocaleString('id-ID')}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/explore/${trip.id}`)}
                      className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => navigate('/planner/create', { state: { trip } })}
                      className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Add Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredTrips.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(filteredTrips.length / itemsPerPage))}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

      </main>

    </div>
  );
}
