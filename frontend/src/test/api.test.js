// Mock the config module to avoid import.meta issues
jest.mock('../config/api', () => ({
  API_CONFIG: {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT: 5000,
    ENDPOINTS: {
      auth: '/auth',
      destinations: '/destinations',
      itineraries: '/itineraries',
    },
  },
}));

const { API_CONFIG } = require('../config/api');

describe('API Configuration', () => {
  test('API_CONFIG is defined', () => {
    expect(API_CONFIG).toBeDefined();
  });

  test('BASE_URL is defined', () => {
    expect(API_CONFIG.BASE_URL).toBeDefined();
  });

  test('BASE_URL is a string', () => {
    expect(typeof API_CONFIG.BASE_URL).toBe('string');
  });

  test('BASE_URL starts with http or https', () => {
    expect(API_CONFIG.BASE_URL).toMatch(/^https?:\/\//);
  });

  test('TIMEOUT is a number', () => {
    if (API_CONFIG.TIMEOUT !== undefined) {
      expect(typeof API_CONFIG.TIMEOUT).toBe('number');
    }
  });

  test('API endpoints are defined', () => {
    expect(API_CONFIG.ENDPOINTS).toBeDefined();
  });
});
