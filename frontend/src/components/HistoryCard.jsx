import React, { useState } from "react";
import { MapPin, Clock, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { itineraryService } from "../services/api.service";

const HistoryCard = ({ plan, activities = [] }) => {
  const navigate = useNavigate();
  const [isCopying, setIsCopying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleGoAgain = async () => {
    if (hasCopied || isCopying) return;
    
    setIsCopying(true);
    try {
      const response = await itineraryService.copy(plan.id);
      setHasCopied(true);
      navigate('/planner');
    } catch (error) {
      console.error('Failed to copy itinerary:', error);
      alert('Failed to copy trip. Please try again.');
      setIsCopying(false);
    }
  };
  
  // Default images if no activity images provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
  ];

  // Extract activity images from destinations
  const getActivityImages = () => {
    const activityImages = activities
      .map(activity => activity.destination?.image_url)
      .filter(url => url);
    return activityImages.length > 0 ? activityImages : [];
  };

  const activityImages = getActivityImages();
  
  // Get images: priority is activity images > thumbnail_url > defaults
  const images = activityImages.length > 0 
    ? activityImages
    : plan.thumbnail_url 
      ? [plan.thumbnail_url] 
      : defaultImages;
      
  const displayImages = images.slice(0, 4); // Show max 4 images

  // Format location
  const location = plan.location || `${plan.destination_city || ''}, ${plan.destination_country || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Bali, Indonesia';

  // Format duration
  const duration = plan.duration || (() => {
    if (plan.start_date && plan.end_date) {
      const start = new Date(plan.start_date);
      const end = new Date(plan.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return `${days} Days`;
    }
    return 'Duration not set';
  })();

  // Format budget - check both budget and total_budget fields
  const budgetAmount = plan.budget || plan.total_budget;
  const budget = budgetAmount ? `Rp.${budgetAmount.toLocaleString('id-ID')}` : 'Not set';

  return (
    <div className="border border-gray-300 rounded-xl p-6 flex items-center justify-between shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* Kolom Kiri: Detail Teks */}
      <div className="space-y-3 flex-1 min-w-0">
        <h3 className="text-3xl font-bold flex items-center gap-3">
          <span className="truncate max-w-md" title={plan.title || 'Untitled Trip'}>
            {plan.title || 'Untitled Trip'}
          </span>
          <span className="text-lg font-normal text-gray-500 flex-shrink-0">{plan.type || plan.status}</span>
        </h3>
        <div className="space-y-2 text-gray-700 text-lg">
          <p className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-black-500" /> {location}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-black-500" /> {duration}
          </p>
          <p className="flex items-center gap-2 font-medium">
            <Wallet className="h-5 w-5 text-black-500" /> Estimasi Biaya - {budget}
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Gambar & Tombol */}
      <div className="flex items-center gap-6">
        {/* Ikon Map Kecil (Sesuai Desain) */}
        <div className="flex-shrink-0 text-[#00A9E0]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map h-16 w-16" aria-hidden="true">
              <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z">
              </path>
              <path d="M15 5.764v15">
              </path>
              <path d="M9 3.236v15">
            </path>
          </svg>
        </div>

        {/* Galeri Gambar Bertumpuk */}
        <div className="flex -space-x-8">
          {displayImages.map((url, i) => (
            <img
              key={i}
              className="w-24 h-32 object-cover rounded-lg border-2 border-white shadow-lg"
              src={url}
              alt={`${plan.title || 'Trip'} - Image ${i + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImages[i % defaultImages.length];
              }}
            />
          ))}
        </div>

        {/* Tombol Go Again */}
        <button 
          onClick={handleGoAgain}
          disabled={hasCopied || isCopying}
          className={`ml-4 px-8 py-3 rounded-xl text-xl font-bold shadow-md transition-all ${
            hasCopied || isCopying
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#00A9E0] text-white hover:bg-blue-600 active:scale-95'
          }`}
        >
          {isCopying ? 'Copying...' : hasCopied ? 'Copied' : 'Go Again'}
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;