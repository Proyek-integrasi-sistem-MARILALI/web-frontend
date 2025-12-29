import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LocationCard from "../components/IdLocationCard";

// ================= ASSETS =================
import heroTrip from "../assets/hero.png";
import location1 from "../assets/location-1.png";
import location2 from "../assets/location-2.png";
import location3 from "../assets/location-3.png";
import stevenAvatar from "../assets/avatar-steven.png"; // ⬅️ avatar owner

export default function DetailTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================= DUMMY DATA =================
  const trip = {
    id,
    title: `Trip ${id}`,
    owner: "Steven",
    ownerAvatar: stevenAvatar,
    progress: 80,
    budget: "Rp.100.000",
    heroImage: heroTrip,
    days: [
      {
        day: 1,
        locations: [
          {
            id: "1",
            image: location1,
            title: "Location 1",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },
          
        ],
      },
      {
        day: 2,
        locations: [
          {
            id: "1",
            image: location1,
            title: "Location 1",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },
          {
            id: "2",
            image: location2,
            title: "Location 2",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },
          {
            id: "3",
            image: location3,
            title: "Location 3",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },
          {
            id: "4",
            image: location1,
            title: "Location 1",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },

        ],
      },
      {
        day: 3,
        locations: [
          {
            id: "1",
            image: location1,
            title: "Location 1",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },
          {
            id: "2",
            image: location3,
            title: "Location 3",
            weather: "Cloudy",
            time: "10:00 - 13:00",
            rating: 4,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* BACK */}
              <button
                onClick={() => navigate(-1)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>

              <h1 className="text-2xl font-bold">{trip.title}</h1>
            </div>

            {/* OWNER */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <img
                src={trip.ownerAvatar}
                alt={trip.owner}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="font-medium">{trip.owner}</span>

              <button className="ml-2 text-blue-500 text-xs border px-2 py-1 rounded hover:bg-blue-50">
                Set Plan
              </button>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="text-right">
            <p className="text-green-500 font-semibold">
              {trip.progress}%
            </p>
            <p className="font-medium">{trip.budget}</p>
          </div>
        </div>

        {/* ================= HERO IMAGE ================= */}
        <img
          src={trip.heroImage}
          alt={trip.title}
          className="w-full h-[420px] object-cover rounded-xl mb-16"
        />

        {/* ================= DAYS ================= */}
        {trip.days.map((day) => {
          const count = day.locations.length;

          return (
            <section key={day.day} className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-10">
                Day {day.day}
              </h2>

              <div
                className={`
                  flex gap-8 pb-6
                  ${count <= 3 ? "justify-center" : "overflow-x-auto custom-scrollbar"}
                `}
              >
                {day.locations.map((location, index) => (
                  <div
                    key={index}
                    className={`
                      ${
                        count === 1
                          ? "w-full"
                          : count === 2
                          ? "w-[50%]"
                          : count === 3
                          ? "w-[35%]"
                          : "min-w-[360px] max-w-[360px] shrink-0"
                      }
                    `}
                  >
                    <LocationCard {...location} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ================= FOOTER ================= */}
    </>
  );
}
