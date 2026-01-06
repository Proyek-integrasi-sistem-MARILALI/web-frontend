import { useState, useEffect } from "react";
import { itineraryService, activityService } from "../services/api.service";
import HistoryCard from "../components/HistoryCard";

const HistoryPage = () => {
  const [plans, setPlans] = useState([]);
  const [planActivities, setPlanActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load with pagination (high limit for now)
      const data = await itineraryService.getHistory(0, 1000);
      setPlans(data);
      
      // Fetch activities for each itinerary to get images
      const activitiesMap = {};
      await Promise.all(
        data.map(async (plan) => {
          try {
            const activities = await activityService.getByItinerary(plan.id);
            activitiesMap[plan.id] = activities;
          } catch (err) {
            console.error(`Failed to fetch activities for itinerary ${plan.id}:`, err);
            activitiesMap[plan.id] = [];
          }
        })
      );
      setPlanActivities(activitiesMap);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setError('Failed to load history');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-10 text-black">History</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="text-6xl mb-4"></div>
            <p className="text-gray-400 text-xl mb-2">
              No completed trips yet
            </p>
            <p className="text-gray-500">
              Your completed travel plans will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map((plan, index) => (
              <HistoryCard 
                key={plan.id || index} 
                plan={plan} 
                activities={planActivities[plan.id] || []}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
