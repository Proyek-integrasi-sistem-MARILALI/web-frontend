import { useNavigate } from "react-router-dom";
import { Star, Plane } from "lucide-react";

/**
 * AI Recommendation Card with live flight pricing
 * Task 2.2: Displays destination with confidence score and live flight prices
 */
export default function AIRecommendationCard({
  recommendation,
  onAddToPlan,
}) {
  const navigate = useNavigate();
  
  const destination = recommendation.destination;
  const reasoning = recommendation.reasoning || {};
  const flightPrice = reasoning.live_flight_price;
  const confidenceScore = recommendation.confidence_score || 0;
  
  // Format price for display
  const formatPrice = (amount, currency = 'IDR') => {
    if (!amount) return null;
    
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(amount);
  };
  
  // Format confidence as percentage
  const confidencePercent = Math.round(confidenceScore * 100);
  
  // Get confidence badge color
  const getConfidenceBadgeColor = () => {
    if (confidenceScore >= 0.8) return 'bg-green-100 text-green-800 border-green-300';
    if (confidenceScore >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={destination.image_url || "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400"}
        alt={destination.name}
        className="h-64 w-full object-cover"
      />
      
      <div className="p-5">
        {/* Header with confidence badge */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold flex-1">{destination.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getConfidenceBadgeColor()}`}>
            {confidencePercent}% Match
          </span>
        </div>
        
        {/* Rating */}
        <div className="flex mb-4">
          {[...Array(Math.round(destination.rating || 4))].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        
        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
          {destination.description || "Discover this amazing destination in Bali"}
        </p>
        
        {/* Live Flight Price - Task 2.2 */}
        {flightPrice && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-900">
              <Plane className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-700">Live Flight Price</p>
                <p className="text-lg font-bold">
                  {formatPrice(flightPrice.amount, flightPrice.currency)}
                </p>
                <p className="text-xs text-blue-600">
                  {flightPrice.route} • {flightPrice.is_round_trip ? 'Round trip' : 'One way'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Price badge */}
        {destination.price && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold">
              Entry: {formatPrice(destination.price, 'IDR')}
            </span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/location/${destination.id}`)}
            className="flex-1 border border-black py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onAddToPlan(destination)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}
