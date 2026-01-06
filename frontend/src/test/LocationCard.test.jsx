import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LocationCard from '../components/LocationCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LocationCard Component', () => {
  const mockProps = {
    id: '1',
    title: 'Bali Beach',
    image: 'https://example.com/bali.jpg',
    description: 'Beautiful tropical paradise',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders location card with correct information', () => {
    render(
      <BrowserRouter>
        <LocationCard {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Bali Beach')).toBeInTheDocument();
    expect(screen.getByText('Beautiful tropical paradise')).toBeInTheDocument();
    expect(screen.getByAltText('Bali Beach')).toHaveAttribute('src', mockProps.image);
  });

  test('renders 5 star rating', () => {
    render(
      <BrowserRouter>
        <LocationCard {...mockProps} />
      </BrowserRouter>
    );

    // Check for star icons in the rating container
    const ratingDiv = document.querySelector('.text-yellow-500');
    expect(ratingDiv).toBeInTheDocument();
  });

  test('navigates to detail page when Details button is clicked', () => {
    render(
      <BrowserRouter>
        <LocationCard {...mockProps} />
      </BrowserRouter>
    );

    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/location/1');
  });

  test('renders Add to Plan button', () => {
    render(
      <BrowserRouter>
        <LocationCard {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/add to plan/i)).toBeInTheDocument();
  });
});
