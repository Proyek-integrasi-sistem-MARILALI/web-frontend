import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { destinationService, weatherService } from "../services/api.service";
import heroImage from "../assets/hero.png";

const Location = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await destinationService.getById(id);
      setDestination(data);
      
      // Fetch weather data after destination is loaded
      if (data && data.city) {
        fetchWeather(data.city, data.country);
      }
    } catch (error) {
      console.error('Failed to fetch destination:', error);
      setError('Failed to load destination details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city, country) => {
    try {
      const location = `${city}, ${country || 'Indonesia'}`;
      const weatherData = await weatherService.getForecast(location, id, 1);
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Don't show error for weather - it's optional
    }
  };


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-[420px] bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            {error || 'Destination not found'}
          </h3>
          <button
            onClick={() => navigate('/explorer')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Explorer
          </button>
        </div>
      </div>
    );
  }

  // Price range display
  const priceRange = destination.price 
    ? `Rp ${Math.floor(destination.price * 0.1).toLocaleString('id-ID')} - Rp ${destination.price.toLocaleString('id-ID')}`
    : 'Rp 100.000 - Rp 1.000.000';

  // Rating display
  const rating = destination.rating || 4;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header with Title */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl font-bold hover:text-blue-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4">
              <p className="text-lg text-gray-600">{priceRange}</p>
              <button className="px-4 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Payment Site
              </button>
              <button
                onClick={() => navigate('/planner/create', { state: { destination } })}
                className="bg-[#00A9E0] text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
              >
                Add to Plan
              </button>
            </div>
          </div>
        </div>

        {/* Weather & Rating on Right */}
        <div className="text-right space-y-2">
          {/* Weather Display */}
          {weather && (
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-600">Weather In {destination.city || destination.location}</p>
              <p className="text-base font-semibold">{weather.condition || 'Cloudy'} ☁</p>
            </div>
          )}
          
          {/* Star Rating */}
          <div className="flex items-center justify-end gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < fullStars
                    ? "fill-yellow-400 text-yellow-400"
                    : i === fullStars && hasHalfStar
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-gray-300"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Image */}
      <img
        src={destination.image_url || heroImage}
        alt={destination.name}
        className="w-full h-[420px] object-cover rounded-lg mb-8"
      />

      <div className="grid grid-cols-1 gap-8">
        {/* Description - Full width */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Destination</h2>
          {destination.description ? (
            destination.description.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>
              Discover the beauty and culture of {destination.name}. This destination offers 
              a unique experience with its stunning landscapes, rich history, and warm hospitality. 
              Whether you're seeking adventure, relaxation, or cultural immersion, this location 
              has something special for every traveler.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;
