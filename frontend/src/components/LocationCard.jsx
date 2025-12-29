import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function LocationCard({
  id,
  title,
  image,
  description,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>

        {/* RATING */}
        <div className="text-yellow-500 mt-1 flex">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <FaStar key={i} />
            ))}
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {description}
        </p>

        {/* ACTION */}
        <div className="flex gap-3 mt-4">
          {/* DETAILS */}
          <button
            onClick={() => navigate(`/location/${id}`)}
            className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100"
          >
            Details
          </button>

          {/* ADD TO PLAN */}
          <button
            className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100"
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}
