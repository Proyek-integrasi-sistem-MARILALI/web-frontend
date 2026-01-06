import React from 'react';

/**
 * Flight selection table component
 */
const FlightSelectionStep = ({ 
  flights, 
  selectedFlight, 
  onSelectFlight, 
  loading, 
  error 
}) => {
  // Debug: Log when component receives new data
  React.useEffect(() => {
    console.log('[FlightSelectionStep] Received flights:', flights.length);
    if (flights.length > 0) {
      console.log('[FlightSelectionStep] First flight:', flights[0].flight_number, flights[0].airline);
    }
  }, [flights]);

  if (loading) {
    return (
      <div className="border border-gray-400 rounded-xl overflow-hidden shadow-sm">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
        {error}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="border border-gray-400 rounded-xl overflow-hidden shadow-sm">
        <div className="text-center py-10 text-gray-500">
          <p>No flights found. Try adjusting your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-400 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="text-2xl font-bold bg-gray-50">
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
          {flights.slice(0, 5).map((flight, index) => (
            <tr key={`flight-${flight.id || index}`} className="border-b border-gray-100">
              <td className="p-6">{flight.airline}</td>
              <td className="p-6">{flight.flight_number}</td>
              <td className="p-6 font-medium">
                {new Date(flight.departure_time).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
                })}
              </td>
              <td className="p-6 font-medium">
                {new Date(flight.arrival_time).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
                })}
              </td>
              <td className="p-6 font-bold">Rp {flight.price.toLocaleString('id-ID')}</td>
              <td className="p-6">
                <button 
                  onClick={() => onSelectFlight(flight)}
                  className={`px-8 py-2 rounded-lg text-sm font-bold transition-colors ${
                    selectedFlight?.id === flight.id 
                      ? 'bg-[#00A9E0] text-white' 
                      : 'bg-[#c0c0c0] text-white hover:bg-[#00A9E0]'
                  }`}
                >
                  {selectedFlight?.id === flight.id ? 'Selected' : 'Select'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightSelectionStep;
