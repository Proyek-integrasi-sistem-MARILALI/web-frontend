import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  Filter,
  Clock,
  Calendar,
  Cloud,
  CloudRain,
} from "lucide-react";
import { activityService, destinationService, itineraryService } from "../services/api.service";

const EditPlacePage = () => {
  const navigate = useNavigate();
  const { id, itineraryId } = useParams(); // id is activityId, itineraryId for add mode
  const [searchParams] = useSearchParams();
  const dayParam = searchParams.get('day');
  
  const [activity, setActivity] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const isAddMode = !id && itineraryId; // Add mode if no activity id but has itinerary id

  useEffect(() => {
    if (id) {
      fetchActivity();
    } else if (itineraryId) {
      fetchItinerary();
    }
  }, [id, itineraryId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const data = await activityService.getById(id);
      setActivity(data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      alert('Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const data = await itineraryService.getById(itineraryId);
      setItinerary(data);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      alert('Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  const calculateActivityDate = (startDate, dayNumber) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toISOString().split('T')[0];
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim() !== "") {
        try {
          setSearching(true);
          const results = await destinationService.search(searchQuery);
          setSearchResults(results.data || results);
          setShowResults(true);
        } catch (error) {
          console.error('Error searching destinations:', error);
          alert('Failed to search destinations');
        } finally {
          setSearching(false);
        }
      }
    }
  };

  const handleReplaceLocation = async (destination) => {
    try {
      if (isAddMode) {
        // Create new activity
        const activityDate = calculateActivityDate(itinerary.start_date, parseInt(dayParam) || 1);
        const newActivity = {
          destination_id: destination.id,
          title: destination.name,
          description: destination.description || '',
          location: destination.location || destination.name,
          activity_date: activityDate,
          start_time: `${activityDate}T09:00:00`,
          end_time: `${activityDate}T12:00:00`,
          estimated_cost: 0,
          notes: '',
          order_index: 0,
        };
        
        await activityService.create(parseInt(itineraryId), newActivity);
        alert('Activity added successfully!');
        navigate(`/planner/${itineraryId}/edit`);
      } else {
        // Update existing activity
        const updatedActivity = {
          destination_id: destination.id,
          title: destination.name || activity.title,
          description: destination.description || activity.description,
          location: destination.location || destination.name,
          // Preserve existing activity data
          activity_date: activity.activity_date,
          start_time: activity.start_time,
          end_time: activity.end_time,
          estimated_cost: activity.estimated_cost,
          notes: activity.notes,
          order_index: activity.order_index,
        };
        
        await activityService.update(id, updatedActivity);
        alert('Location updated successfully!');
        // Navigate back to the itinerary edit page
        if (activity && activity.itinerary_id) {
          navigate(`/planner/${activity.itinerary_id}/edit`);
        } else {
          navigate(-1);
        }
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      alert(`Failed to ${isAddMode ? 'add' : 'update'} activity`);
    }
  };

  const handleApply = () => {
    // Navigate back to the itinerary edit page
    const targetId = isAddMode ? itineraryId : activity?.itinerary_id;
    if (targetId) {
      navigate(`/planner/${targetId}/edit`);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAddMode && !activity) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center">
        <p className="text-xl text-gray-600">Activity not found</p>
      </div>
    );
  }

  if (isAddMode && !itinerary) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center">
        <p className="text-xl text-gray-600">Itinerary not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full transition-all"
            >
              <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
            </button>
            <h1 className="text-2xl font-bold text-black">
              {isAddMode ? 'Add Place' : 'Edit Place'}
            </h1>
          </div>
          <button
            onClick={handleApply}
            className="bg-[#00A9E0] text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* 1. Current Activity Location (only in edit mode) */}
        {!isAddMode && activity && (
          <div className="border border-gray-400 rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/3 h-64 rounded-xl overflow-hidden">
                <img
                  src={activity.destination?.image_url || activity.image_url || "https://images.unsplash.com/photo-1546484406-f138810c9c7e?w=800"}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800";
                  }}
                />
              </div>
              <div className="grow">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-black">{activity.title}</h2>
                  <div className="flex items-center gap-2 text-gray-600 text-xl ml-4">
                    <span>Cloudy</span>
                    <Cloud className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-8 max-w-2xl">
                  {activity.description || 'No description available'}
                </p>
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="flex items-center gap-3 text-xl border-b-2 border-gray-300 pb-1 cursor-pointer">
                    <Clock className="h-6 w-6 text-black" />
                    <span className="font-medium">
                      {activity.start_time ? new Date(activity.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '10:00'} ▼
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xl border-b-2 border-gray-300 pb-1 cursor-pointer">
                    <Calendar className="h-6 w-6 text-black" />
                    <span className="font-medium">
                      {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} ▼
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Search Section */}
        <div className="flex gap-4 items-center mb-10">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Cari Lokasi"
              className="w-full border h-12 border-gray-400 rounded-xl px-6 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <div
              className="absolute right-6 top-1/2 -translate-y-1/2 border-l border-gray-300 pl-4 cursor-pointer"
              onClick={handleSearch}
            >
              <Search className="h-7 w-7 text-gray-800" />
            </div>
          </div>
          <button className="flex items-center gap-4 border border-gray-400 rounded-xl px-10 h-12 hover:bg-gray-50 shrink-0">
            <Filter className="h-7 w-7 text-black fill-current" />
            <span className="text-xl font-medium">Filter</span>
          </button>
        </div>

        {/* Loading state for search */}
        {searching && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">Searching destinations...</p>
          </div>
        )}

        {/* 3. Search Results */}
        {showResults && !searching && (
          <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
            {searchResults.length === 0 ? (
              <p className="text-center text-gray-600 text-xl py-10">No destinations found</p>
            ) : (
              searchResults.map((destination) => (
                <SearchLocationCard
                  key={destination.id}
                  destination={destination}
                  onReplace={handleReplaceLocation}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const SearchLocationCard = ({ destination, onReplace }) => (
  <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm">
    <div className="flex flex-col lg:flex-row gap-8 mb-6">
      <div className="w-full lg:w-[350px] h-[220px] shrink-0 rounded-lg overflow-hidden">
        <img 
          src={destination.image_url || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?w=800"} 
          alt={destination.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800";
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-3">
          <h2 className="text-2xl font-bold text-black">{destination.name}</h2>
          <div className="flex items-center gap-2 text-gray-600 text-xl font-light">
            <span>Cloudy</span>
            <Cloud className="h-6 w-6" />
          </div>
          {destination.price && (
            <span className="text-gray-600 text-xl ml-4 font-medium">
              Rp.{destination.price}
            </span>
          )}
        </div>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-3">
          {destination.description || 'No description available'}
        </p>
        <div className="flex gap-10 items-center">
          <div className="flex items-center gap-2 text-xl border-b border-gray-400 pb-1 cursor-pointer">
            <Clock className="h-6 w-6 text-black" />
            <span className="font-medium text-black">10:00 ▼</span>
          </div>
          <div className="flex items-center gap-2 text-xl border-b border-gray-400 pb-1 cursor-pointer">
            <Calendar className="h-6 w-6 text-black" />
            <span className="font-medium text-black">10 October 2025 ▼</span>
          </div>
        </div>
      </div>
    </div>
    <button 
      onClick={() => onReplace(destination)}
      className="w-full bg-[#00A9E0] text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors"
    >
      Ganti Lokasi
    </button>
  </div>
);

export default EditPlacePage;
