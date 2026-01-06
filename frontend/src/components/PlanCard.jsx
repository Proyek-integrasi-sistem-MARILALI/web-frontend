import React from "react";
import { Map } from "lucide-react";

const PlanCard = ({ title, status = 'planned', destination_city, destination_country, start_date, end_date, budget, thumbnail_url, category, activities = [] }) => {
  // Get images from activities
  const getActivityImages = () => {
    const images = activities
      .map(activity => activity.destination?.image_url || activity.image_url)
      .filter(Boolean)
      .slice(0, 4);
    
    // Fill remaining slots with placeholder if less than 4 images
    while (images.length < 4) {
      images.push(null);
    }
    
    return images;
  };

  const activityImages = getActivityImages();

  // Calculate duration from dates
  const calculateDuration = () => {
    if (!start_date || !end_date) return 'Not set';
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} Days`;
  };

  // Format location
  const location = destination_city && destination_country 
    ? `${destination_city} - ${destination_country}` 
    : destination_city || destination_country || 'Bali, Indonesia';
  
  // Format budget
  const formatBudget = (amount) => {
    if (!amount) return 'Not set';
    return amount.toLocaleString('id-ID');
  };

  // Get category/status display - use prop if provided, otherwise default to 'Culture'
  const categoryDisplay = category || 'Culture';

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-6">
        {/* Left Section: Title and Details */}
        <div className="flex-shrink-0 min-w-0">
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-3xl font-bold text-black truncate max-w-md" title={title}>{title}</h2>
            <span className="text-base font-normal text-gray-600 whitespace-nowrap">{categoryDisplay}</span>
          </div>
          
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center text-base">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
            <p className="flex items-center text-base">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {calculateDuration()}
            </p>
            <p className="flex items-center text-base">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Estimasi Biaya ~ {formatBudget(budget)}
            </p>
          </div>
        </div>

        {/* Middle Section: Map Icon */}
        <div className="flex-shrink-0 text-[#00A9E0]">
          <Map className="h-16 w-16" strokeWidth={1.5} />
        </div>

        {/* Right Section: Images Grid */}
        <div className="flex-grow flex gap-2 max-w-xl">
          {activityImages.map((imageUrl, i) => (
            <div key={i} className="flex-1 h-24 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={imageUrl || thumbnail_url || `https://images.unsplash.com/photo-${1537953773345 + i}?w=400&h=300&fit=crop`}
                alt={`Destination ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop';
                }}
              />
            </div>
          ))}
        </div>

        {/* Far Right: Set Trip Button */}
        <div className="flex-shrink-0">
          <button className="px-8 py-3 bg-[#00A9E0] text-white text-xl font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all active:scale-95 whitespace-nowrap">
            Set Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
