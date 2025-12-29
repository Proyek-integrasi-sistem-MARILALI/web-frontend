import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Footer, TripCard, LocationCard } from "../components";
import { FaSearch } from "react-icons/fa";

// === IMPORT IMAGE DARI ASSETS ===
import heroImage from "../assets/hero.png";
import stripBg from "../assets/strip-bg.png";

// avatar
import stevenAvatar from "../assets/avatar-steven.png";
import daveAvatar from "../assets/avatar-dave.png";
import sindyAvatar from "../assets/avatar-sindy.png";

// trip images
import trip1 from "../assets/Trip-1.png";
import trip2 from "../assets/Trip-2.png";
import trip3 from "../assets/Trip-3.png";

// location images
import location1 from "../assets/location-1.png";
import location2 from "../assets/location-2.png";
import location3 from "../assets/location-3.png";
import location4 from "../assets/location-4.png";

export default function HomeAfter() {
  const navigate = useNavigate();

  /* =========================
     ITINERARY STATE
  ========================= */
  const itineraries = [
    {
      day: 1,
      times: ["08:00 - 10:00", "12:00 - 15:00", "18:00 - 21:00"],
      places: ["Kebun Raya", "Tirta Empul", "Tanah Lot"],
    },
    {
      day: 2,
      times: ["09:00 - 11:00", "12:00 - 15:00"],
      places: ["Ulun Danu", "Kebun Raya"],
    },
    {
      day: 3,
      times: ["10:00 - 14:00"],
      places: ["Nusa Penida"],
    },
  ];

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const currentItinerary = itineraries[currentDayIndex];

  /* =========================
     DUMMY DATA (TRIP & LOCATION)
  ========================= */
  const trips = [
    {
      id: 1,
      title: "Trip 1",
      owner: "Steven",
      avatar: stevenAvatar,
      image: trip1,
      rating: "8/10",
      reviewers: 300,
      price: "Rp.100.000",
      users: 1000,
      location: "Buleleng - Denpasar",
      categories: "Watersport, Hiking",
    },
    {
      id: 2,
      title: "Trip 2",
      owner: "Dave",
      avatar: daveAvatar,
      image: trip2,
      rating: "2/10",
      reviewers: 120,
      price: "Rp.200.000",
      users: 500,
      location: "Ubud - Gianyar",
      categories: "Culture, Nature",
    },
    {
      id: 3,
      title: "Trip 3",
      owner: "Sindy",
      avatar: sindyAvatar,
      image: trip3,
      rating: "5/10",
      reviewers: 1400,
      price: "Rp.500.000",
      users: 2000,
      location: "Kintamani - Bangli",
      categories: "Mountain, Sunrise",
    },
  ];

  const locations = [
    {
      id: 1,
      title: "Location 1",
      image: location1,
      description: "Beautiful destination in Bali.",
    },
    {
      id: 2,
      title: "Location 2",
      image: location2,
      description: "Popular tourist attraction.",
    },
    {
      id: 3,
      title: "Location 3",
      image: location3,
      description: "Hidden gem for travelers.",
    },
    {
      id: 4,
      title: "Location 4",
      image: location4,
      description: "Best place for relaxation.",
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section
        className="w-full h-[500px] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          Explore Bali Finest
        </h1>
        <p className="text-xl mt-2 drop-shadow-lg">
          Your Warmest Trip Planner
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl w-full mx-auto px-6 py-16">

        {/* ===== CURRENT ITINERARY ===== */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Current itinerary
          </h2>

          <div className="border border-gray-400 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6">
              Day {currentItinerary.day}
            </h3>

            <div
              className={`grid grid-cols-1 md:grid-cols-${currentItinerary.times.length} text-center font-semibold`}
            >
              {currentItinerary.times.map((time, i) => (
                <p key={i}>{time}</p>
              ))}
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-${currentItinerary.places.length} text-center text-gray-600 mb-6`}
            >
              {currentItinerary.places.map((place, i) => (
                <p key={i}>{place}</p>
              ))}
            </div>

            <div className="w-full h-2 bg-sky-500 rounded-full mb-8" />

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/planner")}
                className="bg-sky-600 text-white px-6 py-2 rounded-lg"
              >
                Set New Plan
              </button>

              {currentDayIndex > 0 && (
                <button
                  onClick={() => setCurrentDayIndex((prev) => prev - 1)}
                  className="px-6 py-2 rounded-lg text-white bg-sky-600"
                >
                  Previous Day
                </button>
              )}

              {currentDayIndex < itineraries.length - 1 && (
                <button
                  onClick={() => setCurrentDayIndex((prev) => prev + 1)}
                  className="px-6 py-2 rounded-lg text-white bg-sky-600"
                >
                  Next Day
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ===== EXPLORE ===== */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Explore
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {trips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/explorer")}
              className="bg-sky-600 text-white px-10 py-3 rounded-lg"
            >
              Explore plan
            </button>
          </div>
        </section>
      </div>

      {/* ================= IMAGE STRIP ================= */}
      <section
        className="w-full bg-cover bg-center py-10"
        style={{ backgroundImage: `url(${stripBg})` }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
          {[trip1, trip2, trip3].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-56 object-cover rounded-lg shadow-lg"
            />
          ))}
        </div>
      </section>

      {/* ================= MORE LOCATION ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-20 mb-10">
        <h2 className="text-2xl font-semibold text-center mb-10">
          More Location
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          {locations.map((loc) => (
            <LocationCard key={loc.id} {...loc} />
          ))}
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="max-w-xl mx-auto w-full px-6 mb-20">
        <div className="border rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
          <input
            type="text"
            placeholder="Cari Destinasi..."
            className="w-full outline-none"
          />
          <FaSearch className="text-gray-500" />
        </div>
      </section>
    </div>
  );
}
