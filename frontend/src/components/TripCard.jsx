import { useState, useEffect } from "react";
import { FaUser, FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TripCard({
  id,
  title,
  owner,
  avatar,
  userInitial,
  image,
  rating,
  reviewers,
  price,
  users = 0,
  location = "Bali",
  categories = "",
  onAddPlan,
  currentVote,
  onVoteUp,
  onVoteDown,
}) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Use currentVote from props if provided, otherwise use local state
  const [reaction, setReaction] = useState(currentVote || null);

  // Update local state when currentVote prop changes
  useEffect(() => {
    setReaction(currentVote || null);
  }, [currentVote]);

  const handleThumbUp = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // If parent provides handler, use it; otherwise use local state
    if (onVoteUp) {
      onVoteUp();
    } else {
      setReaction((prev) => (prev === "up" ? null : "up"));
    }
  };

  const handleThumbDown = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // If parent provides handler, use it; otherwise use local state
    if (onVoteDown) {
      onVoteDown();
    } else {
      setReaction((prev) => (prev === "down" ? null : "down"));
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        {/* TITLE + OWNER */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">{title}</h3>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{owner}</span>
            {avatar && avatar.trim() ? (
              <img
                src={avatar}
                alt={owner}
                className="w-8 h-8 rounded-full object-cover border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold border"
              style={{display: avatar && avatar.trim() ? 'none' : 'flex'}}
            >
              {userInitial || "U"}
            </div>
          </div>
        </div>

        {/* USERS */}
        {users > 0 && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <FaUser /> {users} {users === 1 ? 'traveler' : 'travelers'}
          </p>
        )}

        {/* LOCATION */}
        {location && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <HiLocationMarker /> {location}
          </p>
        )}

        {/* CATEGORY */}
        {categories && (
          <p className="text-sm text-gray-600">{categories}</p>
        )}

        {/* RATING + THUMBS */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-blue-600 flex items-center gap-1">
            {rating}/{reviewers} <FaStar /> {reviewers > 0 ? `(${reviewers} votes)` : '(No votes)'}
          </p>

          <div className="flex items-center gap-3 text-lg">
            <FaThumbsUp
              onClick={handleThumbUp}
              title={!isLoggedIn ? "Login untuk memberi reaksi" : "Like"}
              className={`transition
                ${
                  !isLoggedIn
                    ? "text-gray-300 cursor-not-allowed"
                    : reaction === "up"
                    ? "text-green-500 cursor-pointer"
                    : "text-gray-400 hover:text-green-400 cursor-pointer"
                }`}
            />

            <FaThumbsDown
              onClick={handleThumbDown}
              title={!isLoggedIn ? "Login untuk memberi reaksi" : "Dislike"}
              className={`transition
                ${
                  !isLoggedIn
                    ? "text-gray-300 cursor-not-allowed"
                    : reaction === "down"
                    ? "text-red-500 cursor-pointer"
                    : "text-gray-400 hover:text-red-400 cursor-pointer"
                }`}
            />
          </div>
        </div>

        {/* PRICE */}
        {price ? (
          <p className="text-sm font-semibold mt-1">{price}</p>
        ) : (
          <p className="text-sm text-gray-500 italic mt-1">Budget not specified</p>
        )}

        {/* ACTION */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate(`/explore/${id}`)}
            className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100"
          >
            Details
          </button>

          <button
            onClick={onAddPlan}
            className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100"
          >
            Add Plan
          </button>
        </div>
      </div>
    </div>
  );
}
