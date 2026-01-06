import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TripCard from '../components/TripCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
    user: { id: '1', username: 'testuser' },
  }),
}));

describe('TripCard Component', () => {
  const mockTrip = {
    id: '123',
    title: 'Tokyo Adventure',
    owner: 'John Doe',
    image: 'https://example.com/tokyo.jpg',
    rating: 4.5,
    reviewers: 10,
    price: 5000000,
    location: 'Tokyo',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders trip card with correct title', () => {
    render(
      <BrowserRouter>
        <TripCard {...mockTrip} />
      </BrowserRouter>
    );

    expect(screen.getByText('Tokyo Adventure')).toBeInTheDocument();
  });

  test('displays trip location', () => {
    render(
      <BrowserRouter>
        <TripCard {...mockTrip} />
      </BrowserRouter>
    );

    // Use getAllByText since "Tokyo" appears multiple times (title and location)
    const tokyoElements = screen.getAllByText(/Tokyo/i);
    expect(tokyoElements.length).toBeGreaterThan(0);
  });

  test('renders trip image with correct src', () => {
    render(
      <BrowserRouter>
        <TripCard {...mockTrip} />
      </BrowserRouter>
    );

    const image = screen.getByAltText('Tokyo Adventure');
    expect(image).toHaveAttribute('src', mockTrip.image);
  });

  test('displays owner information', () => {
    render(
      <BrowserRouter>
        <TripCard {...mockTrip} />
      </BrowserRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
