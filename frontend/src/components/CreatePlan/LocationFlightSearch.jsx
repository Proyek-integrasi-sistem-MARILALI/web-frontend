import { ChevronRight } from "lucide-react";

/**
 * Location selection and flight search trigger
 */
const LocationFlightSearch = ({ 
  formData, 
  setFormData, 
  loading, 
  onSearchFlights,
  onLocalUser,
  step 
}) => {
  return (
    <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Location</h2>
      <div className="mb-6">
        <p className="text-xl mb-2 font-medium">Your Location</p>
        <div className="relative border border-black rounded-lg h-14 flex items-center px-4 cursor-pointer">
          <select
            className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
            value={formData.location || "Jakarta"}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          >
            <option value="Jakarta">Jakarta</option>
          </select>
          <div className="flex justify-between items-center w-full">
            <span className="text-xl">
              {formData.location || "Choose Location"}
            </span>
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      </div>

      <button
        onClick={onSearchFlights}
        disabled={loading || !formData.startDate || !formData.location || !formData.destinationLocation}
        className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Search Flight'}
      </button>

      {step === "input" && (
        <button
          onClick={onLocalUser}
          disabled={!formData.startDate || !formData.finishDate}
          className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold mt-4 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={!formData.startDate || !formData.finishDate ? "Please select dates first" : "Skip flight search - I'm already in Bali"}
        >
          Im a local
        </button>
      )}
    </div>
  );
};

export default LocationFlightSearch;
