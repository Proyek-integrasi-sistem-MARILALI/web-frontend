import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws an error for testing
const ThrowError = () => {
  throw new Error('Test error');
};

// Component that works fine
const WorkingComponent = () => <div>Working Component</div>;

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders children when there is no error', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Working Component')).toBeInTheDocument();
  });

  test('renders error UI when there is an error', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('renders error message when error occurs', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>
    );

    // Check for the error message text
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
