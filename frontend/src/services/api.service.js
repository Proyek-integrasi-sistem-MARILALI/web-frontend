import api from '../config/api';
import { buildQueryString } from '../utils/apiUtils';

// Destination API calls
export const destinationService = {
  // Get all destinations with optional filters
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/destinations${query}`);
  },

  // Get popular destinations
  getPopular: async (limit = 10) => {
    return api.get(`/destinations/popular?limit=${limit}`);
  },

  // Search destinations
  search: async (query, skip = 0, limit = 20) => {
    return api.get(`/destinations/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
  },

  // Get single destination by ID
  getById: async (id) => {
    return api.get(`/destinations/${id}`);
  },

  // Get destinations by country
  getByCountry: async (country, skip = 0, limit = 20) => {
    return api.get(`/destinations/country/${country}?skip=${skip}&limit=${limit}`);
  },
};

// Itinerary API calls
export const itineraryService = {
  // Create new itinerary
  create: async (data) => {
    return api.post('/itinerary/', data);
  },

  // Get all user's itineraries
  getAll: async (skip = 0, limit = 50) => {
    return api.get(`/itinerary/?skip=${skip}&limit=${limit}`);
  },

  // Get itinerary history
  getHistory: async (skip = 0, limit = 50) => {
    return api.get(`/itinerary/history?skip=${skip}&limit=${limit}`);
  },

  // Get single itinerary by ID
  getById: async (id) => {
    return api.get(`/itinerary/${id}`);
  },

  // Update itinerary
  update: async (id, data) => {
    return api.put(`/itinerary/${id}`, data);
  },

  // Mark itinerary as complete
  markComplete: async (id) => {
    return api.put(`/itinerary/${id}/complete`);
  },

  // Restore itinerary to active (from completed)
  restore: async (id) => {
    return api.put(`/itinerary/${id}/restore`);
  },

  // Copy/duplicate itinerary
  copy: async (id) => {
    return api.post(`/itinerary/${id}/copy`);
  },

  // Share itinerary
  share: async (id, shareData) => {
    return api.put(`/itinerary/${id}/share`, shareData);
  },

  // Delete itinerary
  delete: async (id) => {
    return api.delete(`/itinerary/${id}`);
  },

  // Vote on itinerary
  vote: async (id, voteType) => {
    return api.post(`/itinerary/${id}/vote`, { vote_type: voteType });
  },

  // Get user's vote on itinerary
  getUserVote: async (id) => {
    return api.get(`/itinerary/${id}/vote`);
  },

  // Add flight to itinerary
  addFlight: async (itineraryId, flightData) => {
    return api.post(`/itinerary/${itineraryId}/flights`, flightData);
  },

  // Add accommodation to itinerary
  addAccommodation: async (itineraryId, accommodationData) => {
    return api.post(`/itinerary/${itineraryId}/accommodations`, accommodationData);
  },

  // Add activity to itinerary
  addActivity: async (itineraryId, activityData) => {
    return api.post(`/itinerary/${itineraryId}/activities`, activityData);
  },
};

// Review API calls
export const reviewService = {
  create: async (data) => {
    return api.post('/reviews', data);
  },

  getByDestination: async (destinationId) => {
    return api.get(`/reviews/destination/${destinationId}`);
  },

  update: async (id, data) => {
    return api.put(`/reviews/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/reviews/${id}`);
  },
};

// Favorite API calls
export const favoriteService = {
  addDestination: async (destinationId) => {
    return api.post('/favorites/destinations', { destination_id: destinationId });
  },

  removeDestination: async (destinationId) => {
    return api.delete(`/favorites/destinations/${destinationId}`);
  },

  addItinerary: async (itineraryId, notes = null) => {
    return api.post('/favorites/itineraries', { itinerary_id: itineraryId, notes });
  },

  removeItinerary: async (itineraryId) => {
    return api.delete(`/favorites/itineraries/${itineraryId}`);
  },

  getItineraries: async () => {
    return api.get('/favorites/itineraries');
  },

  getAll: async () => {
    return api.get('/favorites');
  },
};

// Budget API calls
export const budgetService = {
  getSummary: async (itineraryId) => {
    return api.get(`/budgets/itinerary/${itineraryId}/budget/summary`);
  },

  addExpense: async (itineraryId, expenseData) => {
    return api.post(`/budgets/itinerary/${itineraryId}/expenses`, expenseData);
  },

  getExpenses: async (itineraryId) => {
    return api.get(`/budgets/itinerary/${itineraryId}/expenses`);
  },

  deleteExpense: async (itineraryId, expenseId) => {
    return api.delete(`/budgets/itinerary/${itineraryId}/expenses/${expenseId}`);
  },
};

// Activity API calls
export const activityService = {
  // Get all activities for an itinerary
  getByItinerary: async (itineraryId) => {
    return api.get(`/activities/itinerary/${itineraryId}/activities`);
  },

  // Get single activity
  getById: async (activityId) => {
    return api.get(`/activities/activities/${activityId}`);
  },

  // Create activity
  create: async (itineraryId, activityData) => {
    return api.post(`/activities/itinerary/${itineraryId}/activities`, activityData);
  },

  // Update activity
  update: async (activityId, activityData) => {
    return api.put(`/activities/activities/${activityId}`, activityData);
  },

  // Delete activity
  delete: async (activityId) => {
    return api.delete(`/activities/activities/${activityId}`);
  },

  // Reorder activities
  reorder: async (itineraryId, activityOrders) => {
    return api.put(`/activities/itinerary/${itineraryId}/activities/reorder`, { activity_orders: activityOrders });
  },

  // Mark activity complete
  markComplete: async (activityId) => {
    return api.patch(`/activities/activities/${activityId}/complete`);
  },
};

// AI Recommendation API calls
export const aiRecommendationService = {
  // Get AI-powered destination recommendations
  getDestinations: async (requestData) => {
    return api.post('/ai/destinations', requestData);
  },

  // Get itinerary suggestions
  getItinerarySuggestions: async (destinationId, days, budget) => {
    return api.post('/ai/itinerary/suggestions', { 
      destination_id: destinationId,
      days,
      budget 
    });
  },

  // Submit feedback on recommendation
  submitFeedback: async (feedbackData) => {
    return api.post('/ai/feedback', feedbackData);
  },
};

// Transportation/Flight API calls
export const flightService = {
  // Search flights
  search: async (searchData) => {
    return api.post('/transportation/flights/search', searchData);
  },

  // Get search history
  getSearchHistory: async () => {
    return api.get('/transportation/flights/search-history');
  },

  // Get flight recommendations
  getRecommendations: async (origin, destination) => {
    return api.get(`/transportation/flights/recommendations?origin=${origin}&destination=${destination}`);
  },

  // Select/book flight
  select: async (flightData) => {
    return api.post('/transportation/flights/select', flightData);
  },
};

// Accommodation API calls
export const accommodationService = {
  // Search accommodations
  search: async (searchData) => {
    return api.post('/accommodation/search', searchData);
  },

  // Get search history
  getSearchHistory: async () => {
    return api.get('/accommodation/search-history');
  },

  // Get recommendations
  getRecommendations: async (location) => {
    return api.get(`/accommodation/recommendations?location=${location}`);
  },

  // Select/book accommodation
  select: async (accommodationData) => {
    return api.post('/accommodation/select', accommodationData);
  },
};

// Weather API calls
export const weatherService = {
  // Get weather forecast
  getForecast: async (location, destinationId = null, days = 7) => {
    const params = new URLSearchParams({ location, days: days.toString() });
    if (destinationId) params.append('destination_id', destinationId);
    return api.get(`/weather/forecast?${params.toString()}`);
  },

  // Create weather alert
  createAlert: async (alertData) => {
    return api.post('/weather/alerts', alertData);
  },

  // Get user's weather alerts
  getAlerts: async () => {
    return api.get('/weather/alerts');
  },

  // Get weather recommendations
  getRecommendations: async (destinationId, travelDate) => {
    return api.post('/weather/recommendations', {
      destination_id: destinationId,
      travel_date: travelDate,
    });
  },
};

// User/Profile API calls
export const userService = {
  // Get current user profile
  getProfile: async () => {
    return api.get('/users/me');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return api.put('/users/me', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return api.put('/users/me/password', passwordData);
  },

  // Update profile picture
  updateProfilePicture: async (imageBase64) => {
    return api.put('/users/me/profile-picture', { profile_picture: imageBase64 });
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    return api.put('/users/me/profile-picture', { profile_picture: '' });
  },
};

export default {
  destinations: destinationService,
  itineraries: itineraryService,
  reviews: reviewService,
  favorites: favoriteService,
  budgets: budgetService,
  activities: activityService,
  aiRecommendations: aiRecommendationService,
  flights: flightService,
  accommodations: accommodationService,
  weather: weatherService,
  users: userService,
};
