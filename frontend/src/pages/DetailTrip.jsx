import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { itineraryService, activityService } from "../services/api.service";
import UserAvatar from "../components/UserAvatar";

import LocationCard from "../components/IdLocationCard";

// ================= ASSETS =================
import heroTrip from "../assets/hero.png";

export default function DetailTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [itinerary, setItinerary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItinerary();
    fetchActivities();
  }, [id]);

  const fetchItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itineraryService.getById(id);
      setItinerary(data);
      
      // Fetch weather for destination
      if (data && data.destination_city) {
        fetchWeather(data.destination_city, data.destination_country, data.start_date);
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      setError('Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const data = await activityService.getByItinerary(id);
      setActivities(data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setActivities([]);
    }
  };

  const calculateDayNumber = (activityDate, startDate) => {
    if (!activityDate || !startDate) return 1;
    const start = new Date(startDate);
    const activity = new Date(activityDate);
    const diff = Math.ceil((activity - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  };

  const calculateCompletionPercentage = () => {
    if (!activities || activities.length === 0) return 0;
    const completed = activities.filter(a => a.is_completed).length;
    return Math.round((completed / activities.length) * 100);
  };

  const calculateVotePercentage = () => {
    if (!itinerary) return 0;
    const upvotes = itinerary.upvotes || 0;
    const downvotes = itinerary.downvotes || 0;
    const totalVotes = upvotes + downvotes;
    if (totalVotes === 0) return 0;
    return Math.round((upvotes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-[420px] bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  if (error || !itinerary) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center py-16">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            {error || 'Itinerary not found'}
          </h3>
          <button
            onClick={() => navigate('/explorer')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Explorer
          </button>
        </div>
      </main>
    );
  }

  // Group activities by day
  const dayGroups = {};
  activities.forEach(activity => {
    const day = calculateDayNumber(activity.activity_date, itinerary.start_date);
    if (!dayGroups[day]) {
      dayGroups[day] = [];
    }
    dayGroups[day].push(activity);
  });

  const completionPercent = calculateCompletionPercentage();
  const votePercent = calculateVotePercentage();
  const upvotes = itinerary?.upvotes || 0;
  const downvotes = itinerary?.downvotes || 0;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <h1 className="text-3xl font-bold mb-2">{itinerary.title}</h1>

              {/* USER INFO */}
              <div className="flex items-center gap-2">
                <UserAvatar 
                  src={itinerary.user?.profile_picture}
                  name={itinerary.user?.name || 'User'}
                  size="sm"
                  className="border"
                />
                <span className="font-medium text-gray-700">{itinerary.user?.name || 'User'}</span>
                
                <button
                  onClick={() => navigate(`/planner/${id}/edit`)}
                  className="ml-2 text-white text-xs bg-cyan-500 px-3 py-1 rounded font-semibold hover:bg-cyan-600 transition-colors cursor-pointer"
                >
                  Set Plan
                </button>
              </div>
            </div>
          </div>

          {/* VOTING & BUDGET */}
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-2xl font-bold text-green-600">{votePercent}%</span>
              {votePercent >= 50 ? (
                <TrendingUp className="text-green-600" size={20} />
              ) : (
                <TrendingDown className="text-orange-500" size={20} />
              )}
            </div>
            <div className="flex items-center gap-3 justify-end mb-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="text-green-600">▲</span> {upvotes}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-red-600">▼</span> {downvotes}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-800">
              Rp {(itinerary.total_budget || itinerary.budget || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* ================= HERO IMAGE ================= */}
        <img
          src={itinerary.image_url || itinerary.thumbnail_url || heroTrip}
          alt={itinerary.title}
          className="w-full h-[400px] object-cover rounded-2xl mb-8"
        />

        {/* ================= DAYS ================= */}
        {Object.keys(dayGroups).length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No activities planned yet
            </h3>
            <p className="text-gray-500 mb-6">
              This itinerary doesn't have any activities yet
            </p>
          </div>
        ) : (
          Object.keys(dayGroups).sort((a, b) => Number(a) - Number(b)).map((day) => {
            const dayActivities = dayGroups[day];

            return (
              <section key={day} className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">
                  Day {day}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayActivities.map((activity, index) => {
                    const formatTime = (timeStr) => {
                      if (!timeStr) return '';
                      try {
                        const date = new Date(timeStr);
                        return date.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        });
                      } catch {
                        return timeStr;
                      }
                    };

                    return (
                      <LocationCard
                        key={activity.id || index}
                        id={activity.destination_id}
                        image={activity.destination?.image_url || activity.image_url || heroTrip}
                        title={`Location ${index + 1}`}
                        subtitle={activity.title || activity.destination?.name || 'Activity'}
                        weather={`Weather in Building`}
                        cloudy={true}
                        time={`${formatTime(activity.start_time)} - ${formatTime(activity.end_time)}`}
                        rating={5}
                        description={
                          activity.description || 
                          activity.notes || 
                          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris mer ut aliquip ex ea commodo consequat...'
                        }
                      />
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>
    </>
  );
}
