import { useNavigate } from "react-router-dom";
import { Star, Cloud, Clock } from "lucide-react";

export default function IdLocationCard({
  id,
  image,
  title,
  weather,
  time,
  rating,
  description,
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-3">
        {/* TITLE + WEATHER */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{title}</h3>

          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Cloud size={14} />
            <span>{weather || "No weather"}</span>
          </div>
        </div>

        {/* RATING + TIME */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1 text-yellow-400">
            {Number(rating) > 0 &&
              [...Array(Number(rating))].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill="currentColor"
                />
              ))}
          </div>

          <span className="text-gray-300">|</span>

          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{time || "No time"}</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {description}
        </p>

        {/* ACTION BUTTON */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => navigate(`/location/${id}`)}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 transition"
          >
            Details
          </button>

          <button
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 transition"
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}
