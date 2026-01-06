import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherCard from '../components/WeatherCard';

describe('WeatherCard Component', () => {
  const mockWeather = {
    location: 'Bali',
    current_temp: 28,
    condition: 'Sunny',
    humidity: 70,
    wind_speed: 5.2,
  };

  test('renders weather information correctly', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByText(/Weather in Bali/i)).toBeInTheDocument();
    expect(screen.getByText('28°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  test('displays unavailable message when no weather data', () => {
    render(<WeatherCard weather={null} />);

    expect(screen.getByText('Weather data unavailable')).toBeInTheDocument();
  });

  test('renders in compact mode', () => {
    render(<WeatherCard weather={mockWeather} compact={true} />);

    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('28°C')).toBeInTheDocument();
  });

  test('shows correct temperature color for hot weather', () => {
    const hotWeather = { ...mockWeather, current_temp: 32 };
    render(<WeatherCard weather={hotWeather} />);

    const tempElement = screen.getByText('32°C');
    expect(tempElement).toHaveClass('text-red-600');
  });

  test('shows correct temperature color for warm weather', () => {
    const warmWeather = { ...mockWeather, current_temp: 27 };
    render(<WeatherCard weather={warmWeather} />);

    const tempElement = screen.getByText('27°C');
    expect(tempElement).toHaveClass('text-orange-500');
  });

  test('shows correct temperature color for moderate weather', () => {
    const moderateWeather = { ...mockWeather, current_temp: 22 };
    render(<WeatherCard weather={moderateWeather} />);

    const tempElement = screen.getByText('22°C');
    expect(tempElement).toHaveClass('text-green-600');
  });

  test('renders weather details when showDetails is true', () => {
    render(<WeatherCard weather={mockWeather} showDetails={true} />);

    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  test('handles rainy condition', () => {
    const rainyWeather = { ...mockWeather, condition: 'Rainy' };
    render(<WeatherCard weather={rainyWeather} />);

    expect(screen.getByText('Rainy')).toBeInTheDocument();
  });

  test('handles cloudy condition', () => {
    const cloudyWeather = { ...mockWeather, condition: 'Cloudy' };
    render(<WeatherCard weather={cloudyWeather} />);

    expect(screen.getByText('Cloudy')).toBeInTheDocument();
  });
});
