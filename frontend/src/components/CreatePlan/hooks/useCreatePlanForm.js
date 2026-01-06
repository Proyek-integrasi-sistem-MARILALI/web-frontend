import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

/**
 * Custom hook to manage Create Plan form state with localStorage persistence
 */
export const useCreatePlanForm = (preselectedDestination = null) => {
  const { user } = useAuth();

  // Get user-specific localStorage key
  const getStorageKey = () => {
    return user ? `createPlanState_${user.id}` : 'createPlanState';
  };

  // Load persisted state from localStorage or use defaults
  const loadPersistedState = () => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
    return {
      step: "input",
      formData: {
        startDate: "",
        finishDate: "",
        budget: "",
        personCount: 1,
        location: "Jakarta",
        destinationLocation: preselectedDestination || "Denpasar",
      },
      selectedTrips: [],
      selectedFlight: null,
      selectedAccommodation: null,
      accommodationArea: "Kota Denpasar",
      locations: [],
      flights: [],
      accommodations: [], // Never persist - always fetch fresh
    };
  };

  const persistedState = loadPersistedState();

  // State management
  const [step, setStep] = useState(persistedState.step);
  const [previousStep, setPreviousStep] = useState(null);
  const [formData, setFormData] = useState(persistedState.formData);
  const [selectedTrips, setSelectedTrips] = useState(persistedState.selectedTrips);
  const [selectedFlight, setSelectedFlight] = useState(persistedState.selectedFlight);
  const [selectedAccommodation, setSelectedAccommodation] = useState(persistedState.selectedAccommodation);
  const [accommodationArea, setAccommodationArea] = useState(persistedState.accommodationArea);
  const [locations, setLocations] = useState(persistedState.locations || []);
  const [flights, setFlights] = useState([]); // Always start fresh - no caching
  const [accommodations, setAccommodations] = useState([]); // Always start fresh - no caching
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigation helpers
  const goToStep = (newStep) => {
    setPreviousStep(step);
    setStep(newStep);
  };

  const goBack = () => {
    if (previousStep) {
      setStep(previousStep);
      setPreviousStep(null);
    } else {
      setStep("input");
    }
  };

  // Clean up old generic localStorage on mount
  useEffect(() => {
    if (localStorage.getItem('createPlanState')) {
      localStorage.removeItem('createPlanState');
    }
  }, []);

  // Persist state to localStorage whenever it changes
  // NOTE: flights and accommodations are NEVER persisted - always fetch fresh from API
  useEffect(() => {
    if (user) {
      const key = user ? `createPlanState_${user.id}` : 'createPlanState';
      const stateToSave = {
        step,
        formData,
        locations,
        selectedTrips,
        selectedFlight,
        selectedAccommodation,
        accommodationArea,
        // Explicitly exclude flights and accommodations - always fetch fresh
      };
      localStorage.setItem(key, JSON.stringify(stateToSave));
    }
  }, [step, formData, selectedTrips, selectedFlight, selectedAccommodation, accommodationArea, locations, user]);

  // Clear persisted state
  const clearPersistedState = () => {
    localStorage.removeItem(getStorageKey());
  };

  return {
    // State
    step,
    previousStep,
    formData,
    selectedTrips,
    selectedFlight,
    selectedAccommodation,
    accommodationArea,
    locations,
    flights,
    accommodations,
    loading,
    error,
    
    // Setters
    setStep,
    setPreviousStep,
    setFormData,
    setSelectedTrips,
    setSelectedFlight,
    setSelectedAccommodation,
    setAccommodationArea,
    setLocations,
    setFlights,
    setAccommodations,
    setLoading,
    setError,
    
    // Helpers
    goToStep,
    goBack,
    clearPersistedState,
    getStorageKey,
  };
};
