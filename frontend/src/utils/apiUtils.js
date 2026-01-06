/**
 * API Service Utilities
 * Common utilities and helpers for API services
 */

/**
 * Build query string from params object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const buildQueryString = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const query = queryParams.toString();
  return query ? `?${query}` : '';
};

/**
 * Format error for consistent error handling
 * @param {Error} error - Error object
 * @returns {Object} Formatted error
 */
export const formatError = (error) => {
  return {
    message: error.message || 'An error occurred',
    code: error.code || null,
    details: error.details || null,
  };
};

/**
 * Retry failed requests with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Result of function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 408, 429
      if (error.code >= 400 && error.code < 500 && 
          error.code !== 408 && error.code !== 429) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Debounce API calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export const debounceApiCall = (fn, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

/**
 * Cache API responses
 */
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
    });
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();

/**
 * Wrapper for cached API calls
 * @param {string} cacheKey - Cache key
 * @param {Function} fn - Async function to cache
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise} Cached or fresh data
 */
export const withCache = async (cacheKey, fn, useCache = true) => {
  if (useCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }
  
  const data = await fn();
  if (useCache) {
    apiCache.set(cacheKey, data);
  }
  
  return data;
};

/**
 * Batch multiple API requests
 * @param {Array<Function>} requests - Array of async functions
 * @returns {Promise<Array>} Array of results
 */
export const batchRequests = async (requests) => {
  return Promise.all(requests.map(fn => fn().catch(e => ({ error: e }))));
};

/**
 * Sequential API requests (one after another)
 * @param {Array<Function>} requests - Array of async functions
 * @returns {Promise<Array>} Array of results
 */
export const sequentialRequests = async (requests) => {
  const results = [];
  
  for (const fn of requests) {
    try {
      const result = await fn();
      results.push(result);
    } catch (error) {
      results.push({ error });
    }
  }
  
  return results;
};
