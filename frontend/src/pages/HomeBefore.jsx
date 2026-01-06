import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.png";
import location1 from "../assets/location-1.png";
import stripBg from "../assets/strip-bg.png";
import trip1 from "../assets/Trip-1.png";
import trip2 from "../assets/Trip-2.png";
import trip3 from "../assets/Trip-3.png";
import stevenAvatar from "../assets/avatar-steven.png";

import LocationCard from "../components/LocationCard";
import TripCard from "../components/TripCard";

export default function HomeBefore() {
  const navigate = useNavigate();

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
  ];

  const locations = [
    {
      id: 1,
      title: "Location 1",
      image: location1,
      description: "Beautiful destination in Bali.",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* HERO */}
      <section
        className="w-full h-[500px] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <h1 className="text-5xl font-bold drop-shadow-lg">
          Explore Bali Finest
        </h1>
        <p className="text-xl mt-2 drop-shadow-lg">
          Your Warmest Trip Planner
        </p>
      </section>

      {/* LOCATION */}
      <section className="max-w-6xl mx-auto px-6 mt-20 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-20">
          
          {/* LOCATION CARD */}
          <div className="flex justify-center md:w-1/2">
            {locations.map((loc) => (
              <LocationCard key={loc.id} {...loc} />
            ))}
          </div>

          {/* TEXT + BUTTON */}
          <div className="md:w-1/2 flex flex-col gap-6 text-center md:text-left">
            <h3 className="text-4xl font-semibold leading-snug">
              Find your best suited <br /> Location
            </h3>

            <div>
              <button
                onClick={() => navigate("/login")}
                className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-3 rounded-lg transition"
              >
                Plan now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* IMAGE STRIP */}
      <section
        className="w-full bg-cover bg-center py-10"
        style={{ backgroundImage: `url(${stripBg})` }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
          {[trip1, trip2, trip3].map((img, index) => (
            <img
              key={index}
              src={img}
              alt="trip"
              className="w-full h-56 object-cover rounded-lg shadow-lg"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
