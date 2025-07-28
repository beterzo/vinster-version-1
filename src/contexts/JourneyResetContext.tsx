import React, { createContext, useContext, useCallback } from 'react';

interface JourneyResetContextType {
  refreshAllData: () => void;
  registerRefreshCallback: (callback: () => void) => void;
  unregisterRefreshCallback: (callback: () => void) => void;
}

const JourneyResetContext = createContext<JourneyResetContextType | undefined>(undefined);

export const useJourneyReset = () => {
  const context = useContext(JourneyResetContext);
  if (context === undefined) {
    throw new Error('useJourneyReset must be used within a JourneyResetProvider');
  }
  return context;
};

export const JourneyResetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const refreshCallbacks = React.useRef<Set<() => void>>(new Set());

  const registerRefreshCallback = useCallback((callback: () => void) => {
    refreshCallbacks.current.add(callback);
  }, []);

  const unregisterRefreshCallback = useCallback((callback: () => void) => {
    refreshCallbacks.current.delete(callback);
  }, []);

  const refreshAllData = useCallback(() => {
    console.log('🔄 Refreshing all data hooks after journey reset');
    refreshCallbacks.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error during data refresh:', error);
      }
    });
  }, []);

  return (
    <JourneyResetContext.Provider value={{
      refreshAllData,
      registerRefreshCallback,
      unregisterRefreshCallback
    }}>
      {children}
    </JourneyResetContext.Provider>
  );
};