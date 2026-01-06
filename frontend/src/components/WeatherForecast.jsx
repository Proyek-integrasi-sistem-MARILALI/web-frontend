import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react';

const WeatherForecast = ({ forecast = [], days = 7 }) => {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Forecast data unavailable</p>
      </div>
    );
  }

  const getWeatherIcon = (condition) => {
    const cond = (condition || '').toLowerCase();
    if (cond.includes('rain') || cond.includes('shower')) {
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    } else if (cond.includes('cloud')) {
      return <Cloud className="w-6 h-6 text-gray-500" />;
    } else if (cond.includes('sun') || cond.includes('clear')) {
      return <Sun className="w-6 h-6 text-yellow-500" />;
    }
    return <Cloud className="w-6 h-6 text-gray-500" />;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const displayedForecast = forecast.slice(0, days);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {days}-Day Forecast
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedForecast.map((day, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">
                  {formatDate(day.date || day.datetime)}
                </p>
                <p className="text-xs text-gray-500">{day.condition || 'N/A'}</p>
              </div>
              {getWeatherIcon(day.condition)}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-500">
                    {Math.round(day.tempmax || day.temp_max || day.temp || 0)}°
                  </span>
                  <span className="text-xl text-gray-400">/</span>
                  <span className="text-xl text-blue-500">
                    {Math.round(day.tempmin || day.temp_min || day.temp || 0)}°
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                {day.humidity !== undefined && (
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{day.humidity}%</span>
                  </div>
                )}
                {day.windspeed !== undefined && (
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    <span>{day.windspeed} km/h</span>
                  </div>
                )}
              </div>
            </div>

            {day.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {day.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
