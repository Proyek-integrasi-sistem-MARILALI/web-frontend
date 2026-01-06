import { useState, useCallback } from 'react';

/**
 * Centralized error handling hook
 * Provides consistent error state management and formatting
 */
export const useError = () => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  /**
   * Set error with automatic formatting
   * @param {Error|string|object} err - Error object, message, or API error response
   */
  const handleError = useCallback((err) => {
    let errorMessage = 'An unexpected error occurred';

    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err?.message) {
      errorMessage = err.message;
    } else if (err?.detail) {
      // FastAPI error format
      errorMessage = err.detail;
    } else if (err?.error) {
      errorMessage = err.error;
    }

    setError(errorMessage);
    setIsError(true);
    console.error('Error:', err);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * Handle async operations with automatic error handling
   * @param {Function} asyncFn - Async function to execute
   * @returns {Promise<any>} Result of async function or null on error
   */
  const tryAsync = useCallback(async (asyncFn) => {
    try {
      clearError();
      return await asyncFn();
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError, clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    tryAsync,
  };
};

/**
 * Hook for managing loading states
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(async (asyncFn) => {
    startLoading();
    try {
      return await asyncFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

/**
 * Combined hook for async operations with loading and error states
 */
export const useAsync = () => {
  const { error, isError, handleError, clearError } = useError();
  const { isLoading, withLoading } = useLoading();

  const execute = useCallback(async (asyncFn) => {
    clearError();
    return withLoading(async () => {
      try {
        return await asyncFn();
      } catch (err) {
        handleError(err);
        throw err; // Re-throw for caller to handle if needed
      }
    });
  }, [withLoading, handleError, clearError]);

  return {
    isLoading,
    error,
    isError,
    execute,
    clearError,
  };
};
