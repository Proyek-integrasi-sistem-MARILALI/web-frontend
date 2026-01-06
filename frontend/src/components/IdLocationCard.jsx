import { useNavigate } from "react-router-dom";
import { Star, Cloud, Clock } from "lucide-react";

export default function IdLocationCard({
  id,
  image,
  title,
  subtitle,
  weather,
  cloudy = true,
  time,
  rating = 5,
  description,
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition">
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-3">
        {/* TITLE + WEATHER */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-base">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
            {weather}
            {cloudy && <Cloud size={14} className="ml-1" />}
          </div>
        </div>

        {/* RATING + TIME */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < rating ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
          </div>

          {time && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={14} />
                <span>{time}</span>
              </div>
            </>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (id) navigate(`/location/${id}`);
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
          >
            Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/planner/create');
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}
