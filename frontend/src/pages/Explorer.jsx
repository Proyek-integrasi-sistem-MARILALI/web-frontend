import TripCard from "../components/TripCard";
import Pagination from "../components/Pagination";
import heroImage from "../assets/hero.png";

// layout
import { Navbar } from "../components";
import Footer from "../components/Footer";

// icons
import { FiFilter } from "react-icons/fi";

// avatar
import stevenAvatar from "../assets/avatar-steven.png";
import daveAvatar from "../assets/avatar-dave.png";
import sindyAvatar from "../assets/avatar-sindy.png";

// trip images
import trip1 from "../assets/Trip-1.png";
import trip2 from "../assets/Trip-2.png";
import trip3 from "../assets/Trip-3.png";

export default function Explorer() {
  /* =========================
     DUMMY DATA (API READY)
  ========================= */

  const baseTrips = [
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

  // Generate 9 cards (mock API result)
  const trips = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    ...baseTrips[i % baseTrips.length],
  }));

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">

      {/* ================= NAVBAR ================= */}
      {/* ================= HERO ================= */}
      <section
        className="w-full h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Explorer</h1>
        <p className="text-xl mt-2 drop-shadow-lg">Find Trip from other people</p>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="grow max-w-7xl w-full mx-auto px-6 py-16">

        {/* Browse + Filter */}
        <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-semibold">Browse</h2>

            <button
              className="flex items-center gap-2 border px-4 py-1.5 rounded-lg text-sm
                        hover:bg-gray-100 transition"
            >
              <FiFilter className="text-sm" />
              Filter
            </button>
        </div>


        {/* Trip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {trips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center">
          <Pagination />
        </div>

      </main>

      {/* ================= FOOTER ================= */}
    </div>
  );
}
