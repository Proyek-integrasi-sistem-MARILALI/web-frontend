/**
 * API Response/Error Interceptors
 * Centralized handling of API responses and errors
 */

/**
 * Response interceptor - processes successful API responses
 * @param {Response} response - Fetch API response object
 * @param {Object} data - Parsed JSON data
 * @returns {Object} Processed data
 */
export const responseInterceptor = (response, data) => {
  // Log successful requests in development
  if (import.meta.env.DEV) {
    console.log(`✅ ${response.url}`, data);
  }

  return data;
};

/**
 * Error interceptor - processes API errors
 * @param {Error} error - Error object
 * @param {string} endpoint - API endpoint that failed
 * @returns {never} Throws formatted error
 */
export const errorInterceptor = (error, endpoint) => {
  // Log errors in development
  if (import.meta.env.DEV) {
    console.error(`❌ ${endpoint}`, error);
  }

  // Format error message
  let errorMessage = 'An unexpected error occurred';
  let errorCode = null;

  if (error.response) {
    // HTTP error response
    errorCode = error.response.status;
    errorMessage = error.response.data?.detail || 
                   error.response.data?.message || 
                   error.message ||
                   `Request failed with status ${errorCode}`;
  } else if (error.message === 'Failed to fetch') {
    errorMessage = 'Cannot connect to server. Please check your internet connection.';
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Create enhanced error object
  const enhancedError = new Error(errorMessage);
  enhancedError.code = errorCode;
  enhancedError.originalError = error;
  enhancedError.endpoint = endpoint;

  throw enhancedError;
};

/**
 * Request interceptor - modifies requests before sending
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Object} Modified options
 */
export const requestInterceptor = (endpoint, options) => {
  // Add timestamp to prevent caching for GET requests
  if (options.method === 'GET') {
    const separator = endpoint.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    return {
      ...options,
      _modifiedEndpoint: `${endpoint}${separator}_t=${timestamp}`,
    };
  }

  return options;
};

/**
 * Network timeout handler
 * @param {Promise} promise - Fetch promise
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Promise that rejects on timeout
 */
export const withTimeout = (promise, timeout = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};
