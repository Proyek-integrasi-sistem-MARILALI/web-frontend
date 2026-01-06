import React, { useState, useEffect } from 'react';
import { weatherService } from '../../services/api.service';
import { WeatherCard, WeatherAlert } from '../index';

const WeatherPreview = ({ destination, startDate, endDate, compact = true }) => {
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (destination && startDate) {
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, startDate]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const location = destination.city 
        ? `${destination.city}, ${destination.country || ''}`
        : destination.name;
      
      const days = endDate 
        ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
        : 7;

      const weatherData = await weatherService.getForecast(location, destination.id, Math.min(days, 14));
      setWeather(weatherData);
      
      // Generate simple alerts
      if (weatherData.forecast) {
        const weatherAlerts = [];
        weatherData.forecast.forEach(day => {
          if (day.tempmax > 35) {
            weatherAlerts.push({
              severity: 'high',
              title: 'High Temperature',
              message: `Very hot (${Math.round(day.tempmax)}°C) - Stay hydrated!`
            });
          }
          if (day.condition?.toLowerCase().includes('rain')) {
            weatherAlerts.push({
              severity: 'moderate',
              title: 'Rain Expected',
              message: 'Bring an umbrella'
            });
          }
        });
        setAlerts(weatherAlerts.slice(0, 2)); // Only show top 2 alerts
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!destination || !startDate) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Weather Preview</h3>
      <WeatherCard weather={weather} showDetails={!compact} compact={compact} />
      {alerts.length > 0 && (
        <WeatherAlert alerts={alerts} compact={true} />
      )}
    </div>
  );
};

export default WeatherPreview;
