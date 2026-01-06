import { createContext, useContext, useState, useCallback } from 'react';

const AppStateContext = createContext();

/**
 * Global application state provider
 * Manages app-wide state like loading indicators, notifications, etc.
 */
export function AppStateProvider({ children }) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  // Global loading state
  const startGlobalLoading = useCallback(() => setGlobalLoading(true), []);
  const stopGlobalLoading = useCallback(() => setGlobalLoading(false), []);

  // Toast notifications (auto-dismiss after 3 seconds)
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToast(newToast);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  // Success/Error helpers
  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);
  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showWarning = useCallback((message) => showToast(message, 'warning'), [showToast]);
  const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

  // Notifications (persistent until dismissed)
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    // Loading state
    globalLoading,
    startGlobalLoading,
    stopGlobalLoading,

    // Toast (temporary notifications)
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Notifications (persistent)
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}

// Convenience hooks
export function useToast() {
  const { toast, showToast, hideToast, showSuccess, showError, showWarning, showInfo } = useAppState();
  return { toast, showToast, hideToast, showSuccess, showError, showWarning, showInfo };
}

export function useGlobalLoading() {
  const { globalLoading, startGlobalLoading, stopGlobalLoading } = useAppState();
  return { globalLoading, startGlobalLoading, stopGlobalLoading };
}

export function useNotifications() {
  const { notifications, addNotification, removeNotification, clearNotifications } = useAppState();
  return { notifications, addNotification, removeNotification, clearNotifications };
}
