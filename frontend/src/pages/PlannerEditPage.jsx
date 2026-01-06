import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Edit2 } from 'lucide-react';
import { itineraryService, activityService } from '../services/api.service';
import PlanItemCard from '../components/PlanItemCard';

const PlannerEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [itinerary, setItinerary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Culture');

  useEffect(() => {
    if (id) {
      fetchItinerary();
      fetchActivities();
    } else {
      setError('No itinerary ID provided');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.key]); // Re-fetch when navigating back

  const fetchItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itineraryService.getById(id);
      if (!data) {
        setError('Itinerary not found');
        setItinerary(null);
      } else {
        setItinerary(data);
        setTempTitle(data.title);
        if (data.category) {
          setSelectedCategory(data.category);
        }
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      if (error.response?.status === 404) {
        setError('Itinerary not found');
      } else if (error.response?.status === 401) {
        setError('Please log in to view this itinerary');
      } else {
        setError('Failed to load itinerary. Please try again.');
      }
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const data = await activityService.getByItinerary(id);
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const handleUpdateTitle = async () => {
    if (!tempTitle.trim()) return;
    
    setSaving(true);
    try {
      await itineraryService.update(id, { title: tempTitle });
      setItinerary({ ...itinerary, title: tempTitle });
      setEditingTitle(false);
    } catch (error) {
      console.error('Failed to update title:', error);
      alert('Failed to update title');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!window.confirm('Mark this itinerary as completed?')) return;
    
    setSaving(true);
    try {
      await itineraryService.markComplete(id);
      alert('Itinerary marked as completed! Check your history page.');
      navigate('/history');
    } catch (error) {
      console.error('Failed to mark as complete:', error);
      alert('Failed to mark itinerary as complete');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotalDays = () => {
    if (!itinerary) return 1;
    const start = new Date(itinerary.start_date);
    const end = new Date(itinerary.end_date);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  };

  const calculateDayNumber = (activityDate) => {
    if (!itinerary) return 1;
    const start = new Date(itinerary.start_date);
    const activity = new Date(activityDate);
    const diff = Math.ceil((activity - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  };

  const getActivitiesForDay = (day) => {
    return activities.filter(activity => {
      const dayNumber = calculateDayNumber(activity.activity_date);
      return dayNumber === day;
    });
  };

  const handleEditActivity = (activityId) => {
    navigate(`/planner/edit-place/${activityId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-xl text-gray-600">Loading itinerary...</div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            {error || 'Itinerary not found'}
          </h3>
          <p className="text-gray-500 mb-4">
            {!id ? 'No itinerary ID provided in URL' : 'This itinerary may not exist or you may not have access to it.'}
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Planner
          </button>
        </div>
      </div>
    );
  }

  const totalDays = calculateTotalDays();
  const dayActivities = getActivitiesForDay(currentDay);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/planner')}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
            </button>
            <h1 className="text-2xl font-bold text-black">Planner</h1>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              value={editingTitle ? tempTitle : itinerary.title}
              onChange={(e) => {
                if (editingTitle) {
                  setTempTitle(e.target.value);
                } else {
                  setEditingTitle(true);
                  setTempTitle(e.target.value);
                }
              }}
              onBlur={() => {
                if (editingTitle && tempTitle !== itinerary.title && tempTitle.trim()) {
                  handleUpdateTitle();
                } else {
                  setEditingTitle(false);
                  setTempTitle(itinerary.title);
                }
              }}
              placeholder="Judul Plan"
              maxLength={200}
              className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={saving}
            />
            <select 
              value={selectedCategory}
              onChange={async (e) => {
                const newCategory = e.target.value;
                setSelectedCategory(newCategory);
                try {
                  await itineraryService.update(id, { category: newCategory });
                } catch (error) {
                  console.error('Failed to update category:', error);
                }
              }}
              className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="WaterSport">WaterSport</option>
              <option value="Culture">Culture</option>
              <option value="Nature">Nature</option>
            </select>
            <button
              onClick={handleMarkComplete}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              title="Mark this trip as completed"
            >
              Complete
            </button>
          </div>
        </div>

        {/* Label Hari Dinamis */}
        <h2 className="text-2xl font-medium text-gray-700 mb-4 font-sans">
          Day {currentDay}
        </h2>

        {/* Layout Utama dengan Navigasi di Luar Kotak */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Tombol Panah Kiri */}
          <div className="w-12 shrink-0 flex justify-center">
            {currentDay > 1 && (
              <button
                onClick={() => setCurrentDay(currentDay - 1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
              </button>
            )}
          </div>

          {/* Kotak Konten Utama */}
          <div className="flex-1 border border-gray-400 rounded-2xl p-6 min-h-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Display activities for current day */}
              {dayActivities.map((activity) => (
                <PlanItemCard
                  key={activity.id}
                  activityId={activity.id}
                  title={activity.title || activity.name}
                  price={activity.estimated_cost ? activity.estimated_cost.toString() : null}
                  image={activity.destination?.image_url || activity.image_url || 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=400&q=80'}
                  description={activity.description || 'No description available'}
                  time={activity.start_time ? new Date(activity.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '10:00'}
                  date={activity.activity_date ? new Date(activity.activity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  hasPayment={false}
                  onEdit={handleEditActivity}
                />
              ))}

              {/* Tombol Plus */}
              <div
                onClick={() => navigate(`/planner/${id}/add-place?day=${currentDay}`)}
                className="bg-white border border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 h-40 lg:h-auto min-h-[160px]"
              >
                <div className="w-16 h-16 rounded-full border-4 border-blue-400 flex items-center justify-center">
                  <Plus className="h-10 w-10 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Panah Kanan */}
          <div className="w-12 shrink-0 flex justify-center">
            {currentDay < totalDays && (
              <button
                onClick={() => setCurrentDay(currentDay + 1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                <ChevronRight className="h-10 w-10 text-black stroke-[3px]" />
              </button>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 flex justify-between items-end border-t border-gray-100 pt-8">
          <div className="text-3xl font-light text-gray-800">
            Estimation <span className="ml-3 font-semibold">
              Rp {itinerary.budget ? itinerary.budget.toLocaleString('id-ID') : '0'}
            </span>
          </div>

          <button
            onClick={() => navigate('/planner')}
            className="px-10 py-3 bg-[#00A9E0] text-white text-xl font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95"
          >
            Set Plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default PlannerEditPage;