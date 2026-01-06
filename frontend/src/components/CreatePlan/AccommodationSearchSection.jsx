/**
 * Accommodation search interface
 */
const AccommodationSearchSection = ({ 
  accommodationArea, 
  setAccommodationArea, 
  formData,
  loading, 
  onSearchAccommodations,
  onSkipAccommodation 
}) => {
  return (
    <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-2">
        Would you like to book a place?
      </h2>
      <p className="text-xl mb-4">Choose Area</p>
      <select
        value={accommodationArea}
        onChange={(e) => setAccommodationArea(e.target.value)}
        className="w-full border border-black rounded-lg h-14 px-4 mb-6 text-xl appearance-none cursor-pointer bg-white hover:border-blue-500 focus:outline-none focus:border-blue-600 transition-colors"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          backgroundSize: '1.5rem',
          paddingRight: '3rem'
        }}
      >
        <option value="Kota Denpasar">Kota Denpasar</option>
        <option value="Kabupaten Badung">Kabupaten Badung</option>
        <option value="Kabupaten Gianyar">Kabupaten Gianyar</option>
        <option value="Kabupaten Tabanan">Kabupaten Tabanan</option>
        <option value="Kabupaten Buleleng">Kabupaten Buleleng</option>
        <option value="Kabupaten Karangasem">Kabupaten Karangasem</option>
        <option value="Kabupaten Klungkung">Kabupaten Klungkung</option>
        <option value="Kabupaten Bangli">Kabupaten Bangli</option>
        <option value="Kabupaten Jembrana">Kabupaten Jembrana</option>
      </select>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={onSearchAccommodations}
          disabled={loading || !formData.startDate || !formData.finishDate}
          className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Accomodation'}
        </button>
        <button
          onClick={onSkipAccommodation}
          className="w-full bg-[#00A9E0] text-white py-4 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all"
        >
          I already book a place
        </button>
      </div>
    </div>
  );
};

export default AccommodationSearchSection;
