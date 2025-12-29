import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  Star,
  Cloud,
  Clock,
} from "lucide-react";
import Navbar from "../components/navbar";

const CreatePlanPage = ({ onNavigate, onBack, onSavePlan }) => {
  // State untuk alur tampilan: 'input' -> 'flight' -> 'accommodation'
  const [step, setStep] = useState("input");

  const [selectedTrips, setSelectedTrips] = useState([]);

  // State Form
  const [formData, setFormData] = useState({
    startDate: "",
    finishDate: "",
    budget: "",
    personCount: 1,
    location: "",
  });

  const startInputRef = useRef(null);
  const finishInputRef = useRef(null);

  // 1. Fungsi Format Budget (Pemisah Ribuan)
  const formatRibuan = (value) => {
    if (!value) return "";
    const numberString = value.replace(/[^0-9]/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBudgetChange = (e) => {
    const rawValue = e.target.value;
    setFormData({ ...formData, budget: formatRibuan(rawValue) });
  };

  const adjustPerson = (amount) => {
    setFormData((prev) => ({
      ...prev,
      personCount: Math.max(1, prev.personCount + amount),
    }));
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Choose Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Data Mock Hotel
  const hotels = [
    {
      id: 1,
      name: "Hotel 1",
      price: "Rp 200.000 - 400.000",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    },
    {
      id: 2,
      name: "Hotel 2",
      price: "Rp 400.000 - 800.000",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    },
    {
      id: 3,
      name: "Hotel 3",
      price: "Rp 300.000 - 1.000.000",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    },
  ];

  const locations = [
    {
      id: 1,
      name: "Sanur Beach",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    },
    {
      id: 2,
      name: "Uluwatu Temple",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400",
    },
    {
      id: 3,
      name: "Tegalalang Rice Terrace",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400",
    },
  ];

  const addToPlan = (loc) => {
    const newTrip = {
      ...loc,
      instanceId: Date.now(), // ID unik agar bisa tambah lokasi yang sama berkali-kali
      time: "10:00",
      date: "10 October 2025",
      weather: "Cloudy",
    };
    setSelectedTrips([...selectedTrips, newTrip]);
  };

  const removeTrip = (instanceId) => {
    setSelectedTrips(
      selectedTrips.filter((trip) => trip.instanceId !== instanceId)
    );
  };

  const handleApply = () => {
    // Susun data plan yang akan disimpan
    const newPlan = {
      id: Date.now(),
      location: formData.location || "Denpasar", // Default jika kosong
      startDate: formData.startDate,
      finishDate: formData.finishDate,
      budget: formData.budget,
      totalPerson: formData.personCount,
      trips: selectedTrips, // Daftar lokasi yang dipilih (Sanur, dll)
      totalEstimation: "Rp.2.000.000", // Bisa dihitung dinamis nanti
      createdAt: new Date().toLocaleDateString(),
    };

    // Panggil prop onSavePlan (pastikan parent menghandle ini)
    if (onSavePlan) {
      onSavePlan(newPlan);
    }
  };

  // --- VIEW: FINALIZE & LOCATION SEARCH RESULTS ---
  if (step === "finalize" || step === "location_results") {
    return (
      <div className="min-h-screen bg-white font-sans pb-20 text-black">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setStep("accommodation")}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-10 w-10 stroke-[3px]" />
            </button>
            <h1 className="text-3xl font-bold">Create Plan</h1>
          </div>

          <div className="border border-gray-400 rounded-xl p-8 shadow-sm mb-10">
            <h2 className="text-2xl font-bold mb-6">
              Would you like to plan your trip now?
            </h2>
            <div className="mb-8">
              <p className="text-xl mb-4 font-medium">Choose Area</p>
              <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
                <span className="text-xl">Choose Location (Denpasar)</span>
                <ChevronRight className="h-6 w-6 ml-auto" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setStep("location_results")}
                className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold"
              >
                Search location
              </button>
              <button
                onClick={onBack}
                className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold"
              >
                I set my plan later
              </button>
            </div>
          </div>

          {/* GRID HASIL PENCARIAN LOKASI */}
          {step === "location_results" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-white"
                  >
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="h-64 w-full object-cover"
                    />
                    <div className="p-5">
                      <h3 className="text-2xl font-bold mb-2">{loc.name}</h3>
                      <div className="flex mb-3">
                        {[...Array(loc.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit...
                      </p>
                      <div className="flex gap-3">
                        <button className="flex-1 border border-black py-2 rounded-lg font-bold">
                          Details
                        </button>
                        <button
                          onClick={() => addToPlan(loc)}
                          className="flex-1 border border-black py-2 rounded-lg font-bold hover:bg-gray-50"
                        >
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* LIST LOKASI YANG SUDAH DITAMBAHKAN (Trip Added Section) */}
              <div className="space-y-6 mb-10">
                {selectedTrips.map((trip) => (
                  <div
                    key={trip.instanceId}
                    className="border border-gray-400 rounded-xl p-6 flex gap-6 relative shadow-sm"
                  >
                    <img
                      src={trip.image}
                      className="w-64 h-40 object-cover rounded-lg"
                      alt={trip.name}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl font-bold flex items-center gap-2">
                            {trip.name}
                            <span className="text-lg font-normal text-gray-500 flex items-center gap-1">
                              <Cloud className="w-5 h-5" /> {trip.weather}
                            </span>
                          </h3>
                          <p className="text-gray-500 mt-2 line-clamp-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 mt-4 text-xl font-medium">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Clock className="w-6 h-6" /> {trip.time}{" "}
                          <ChevronRight className="w-5 h-5 rotate-90" />
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <CalendarIcon className="w-6 h-6" /> {trip.date}{" "}
                          <ChevronRight className="w-5 h-5 rotate-90" />
                        </div>
                      </div>

                      <button
                        onClick={() => removeTrip(trip.instanceId)}
                        className="w-full bg-red-600 text-white py-3 rounded-xl text-2xl font-bold mt-6 hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
              onClick={handleApply}
              className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-3xl font-bold shadow-md">
                Apply
              </button>
            </>
          )}

          <div className="mt-20 text-3xl font-bold">
            Estimation <span className="ml-10 font-normal">Rp.2.000.000</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Navbar onNavigate={() => {}} currentView="list" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <ChevronLeft className="h-10 w-10 text-black stroke-[3px]" />
          </button>
          <h1 className="text-3xl font-bold text-black">Create Plan</h1>
        </div>

        <div className="space-y-6">
          {/* Card 1: Date, Budget, Person */}
          <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Date</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className="cursor-pointer"
                  onClick={() => startInputRef.current.showPicker()}
                >
                  <p className="text-xl mb-2 font-medium">Start</p>
                  <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
                    <input
                      type="date"
                      ref={startInputRef}
                      className="absolute opacity-0 w-0 h-0"
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                    <div className="flex justify-between items-center w-full">
                      <span
                        className={
                          formData.startDate
                            ? "text-black text-xl font-semibold"
                            : "text-gray-400 text-xl"
                        }
                      >
                        {formatDateDisplay(formData.startDate)}
                      </span>
                      <ChevronRight className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => finishInputRef.current.showPicker()}
                >
                  <p className="text-xl mb-2 font-medium">Finish</p>
                  <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
                    <input
                      type="date"
                      ref={finishInputRef}
                      className="absolute opacity-0 w-0 h-0"
                      onChange={(e) =>
                        setFormData({ ...formData, finishDate: e.target.value })
                      }
                    />
                    <div className="flex justify-between items-center w-full">
                      <span
                        className={
                          formData.finishDate
                            ? "text-black text-xl font-semibold"
                            : "text-gray-400 text-xl"
                        }
                      >
                        {formatDateDisplay(formData.finishDate)}
                      </span>
                      <ChevronRight className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Section dengan Auto-Format */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Budget</h2>
              <div className="border border-black rounded-lg p-4 h-14 flex items-center gap-2">
                <span className="text-xl font-bold">Rp</span>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  placeholder="1.000.000"
                  className="w-full text-xl outline-none bg-transparent placeholder:text-gray-300 font-semibold"
                />
              </div>
            </div>

            {/* Person Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Person</h2>
              <div className="flex items-center justify-between border border-black rounded-lg p-4 h-14">
                <div className="flex items-center gap-3">
                  <User className="h-7 w-7 text-black fill-current" />
                  <span className="text-xl font-bold">
                    {formData.personCount}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => adjustPerson(-1)}
                    className="text-3xl font-bold border border-black rounded-md w-8 h-8 flex items-center justify-center"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustPerson(1)}
                    className="text-3xl font-bold border border-black rounded-md w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Location & Flight Button */}
          <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <p className="text-xl mb-2 font-medium">Your Location</p>
            <div className="relative border border-black rounded-lg h-14 flex items-center px-4 mb-6">
              <select
                className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              >
                <option value="">Choose Location</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bali">Bali</option>
              </select>
              <div className="flex justify-between items-center w-full">
                <span className="text-xl">
                  {formData.location || "Choose Location"}
                </span>
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
            <button
              onClick={() => setStep("flight")}
              className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all"
            >
              Search Flight
            </button>
            {step === "input" && (
              <button className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold mt-4">
                Im a local
              </button>
            )}
          </div>

          {/* SECTION: HASIL FLIGHT */}
          {step !== "input" && (
            <>
              <div className="border border-gray-400 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="text-2xl font-bold">
                    <tr>
                      <th className="p-6">Airline</th>
                      <th className="p-6">Flight</th>
                      <th className="p-6">Boarding</th>
                      <th className="p-6">Arrival</th>
                      <th className="p-6">Price</th>
                      <th className="p-6"></th>
                    </tr>
                  </thead>
                  <tbody className="text-xl border-t border-gray-400">
                    <tr className="border-b border-gray-100">
                      <td className="p-6">Air Asia</td>
                      <td className="p-6">ABC12345</td>
                      <td className="p-6 font-medium">10:00</td>
                      <td className="p-6 font-medium">06:00</td>
                      <td className="p-6 font-bold">Rp 400.000</td>
                      <td className="p-6">
                        <button className="bg-[#c0c0c0] text-white px-8 py-1 rounded-lg text-sm font-bold">
                          Select
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-6">Air Asia</td>
                      <td className="p-6">ABC12345</td>
                      <td className="p-6 font-medium">10:00</td>
                      <td className="p-6 font-medium">06:00</td>
                      <td className="p-6 font-bold">Rp 400.000</td>
                      <td className="p-6">
                        <button className="bg-[#00A9E0] text-white px-8 py-1 rounded-lg text-sm font-bold">
                          Select
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SECTION: SEARCH ACCOMODATION */}
              <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-2">
                  Would you like to book a place?
                </h2>
                <div className="border border-black rounded-lg h-14 flex items-center px-4 my-6">
                  <span className="text-xl">Choose Location (Denpasar)</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setStep("accommodation")}
                    className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold"
                  >
                    Search Accomodation
                  </button>
                  <button className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold">
                    I already book a place
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECTION: DAFTAR HOTEL */}
          {step === "accommodation" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
                    <div className="flex mb-3">
                      {[...Array(hotel.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm border border-black px-2 py-1 rounded font-semibold">
                        {hotel.price}
                      </span>
                      <button className="bg-[#00A9E0] text-white px-6 py-2 rounded-lg font-bold">
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="col-span-full">
                {/* Ganti button Apply lama dengan ini */}
                <button
                  onClick={() => setStep("finalize")} // Mengarahkan ke halaman pilihan lokasi
                  className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-3xl font-bold mt-10"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* ESTIMATION FOOTER */}
          <div className="pt-10 text-3xl font-bold">
            Estimation{" "}
            <span className="ml-6 font-normal">
              Rp.{step === "accommodation" ? "2.000.000" : "1.000.000"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePlanPage;
