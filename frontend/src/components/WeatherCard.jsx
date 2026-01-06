import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';

const WeatherCard = ({ weather, showDetails = true, compact = false }) => {
  if (!weather) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-gray-50 rounded-lg`}>
        <p className="text-sm text-gray-500">Weather data unavailable</p>
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

  const getTempColor = (temp) => {
    if (temp >= 30) return 'text-red-600';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 20) return 'text-green-600';
    return 'text-blue-600';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
        {getWeatherIcon(weather.condition)}
        <div className="flex-1">
          <p className="text-sm font-medium">{weather.condition || 'Cloudy'}</p>
          <p className={`text-lg font-bold ${getTempColor(weather.current_temp)}`}>
            {Math.round(weather.current_temp)}°C
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">Weather in {weather.location}</p>
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            <span className="text-lg font-semibold text-gray-800">
              {weather.condition || 'Cloudy'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${getTempColor(weather.current_temp)}`}>
            {Math.round(weather.current_temp)}°C
          </p>
          {weather.description && (
            <p className="text-xs text-gray-600 mt-1">{weather.description}</p>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-200">
          {weather.humidity !== undefined && (
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Humidity</p>
                <p className="text-sm font-semibold">{weather.humidity}%</p>
              </div>
            </div>
          )}
          {weather.wind_speed !== undefined && (
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Wind Speed</p>
                <p className="text-sm font-semibold">{weather.wind_speed} km/h</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
