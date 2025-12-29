import { useParams, useNavigate } from "react-router-dom";
import { Sun, Cloud, CloudRain, CloudSun, ArrowLeft } from "lucide-react";
import locations from "../data/location";

const Location = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = locations.find((item) => item.id === id);

  const getWeatherIcon = (weather) => {
    switch (weather.toLowerCase()) {
      case "sunny":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case "rainy":
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case "partly cloudy":
        return <CloudSun className="w-5 h-5 text-orange-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!location) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold">Location not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl font-bold hover:text-blue-600"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">{location.name}</h1>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-lg font-medium">{location.price}</p>

          <div className="flex gap-3 mt-2">
            <button className="border px-4 py-1 rounded hover:bg-gray-100">
              Payment Site
            </button>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Add to Plan
            </button>
          </div>
        </div>

        {/* Weather */}
        <div className="text-right">
          <p className="font-medium">
            Weather in {location.city}
          </p>

          <div className="flex items-center justify-end gap-2 text-gray-600">
            {getWeatherIcon(location.weather)}
            <span>{location.weather}</span>
          </div>

          <p className="text-yellow-400 text-xl mt-1">
            {"★".repeat(location.rating)}
            {"☆".repeat(5 - location.rating)}
          </p>
        </div>
      </div>

      {/* Image */}
      <img
        src={location.image}
        alt={location.name}
        className="w-full h-[420px] object-cover rounded-xl mb-8"
      />

      {/* Description */}
      <div className="space-y-6 text-gray-700 leading-relaxed">
        {location.description.split("\n").map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default Location;
