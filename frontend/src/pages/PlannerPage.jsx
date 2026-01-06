import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { itineraryService, activityService } from "../services/api.service";
import PlanCard from "../components/PlanCard";

const PlannerPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planActivities, setPlanActivities] = useState({});

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itineraryService.getAll();
      setPlans(data);
      
      // Fetch activities for each itinerary to get destination images
      const activitiesMap = {};
      await Promise.all(
        data.map(async (plan) => {
          try {
            const activities = await activityService.getByItinerary(plan.id);
            activitiesMap[plan.id] = activities;
          } catch (error) {
            console.error(`Failed to fetch activities for itinerary ${plan.id}:`, error);
            activitiesMap[plan.id] = [];
          }
        })
      );
      setPlanActivities(activitiesMap);
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
      setError('Failed to load plans. Please try again.');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const getItineraryCategory = (itinerary) => {
    return itinerary?.category || 'General';
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-black">List Plan</h1>

          <button
            onClick={() => navigate("/planner/create")}
            className="px-5 py-2 bg-[#00A9E0] text-white text-xl font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all active:scale-95"
          >
            Create Plan
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No travel plans yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start planning your next adventure!
            </p>
            <button
              onClick={() => navigate("/planner/create")}
              className="px-5 py-2 bg-[#00A9E0] text-white font-bold rounded-xl hover:bg-blue-600 transition"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => navigate(`/planner/${plan.id}/edit`)}
                className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-100"
              >
                <PlanCard
                  title={plan.title}
                  status={plan.status}
                  destination_city={plan.destination_city}
                  destination_country={plan.destination_country}
                  start_date={plan.start_date}
                  end_date={plan.end_date}
                  budget={plan.budget}
                  thumbnail_url={plan.thumbnail_url}
                  category={getItineraryCategory(plan)}
                  activities={planActivities[plan.id] || []}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlannerPage;
