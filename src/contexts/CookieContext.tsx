
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CookieConsent {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
}

interface CookieContextType {
  consent: CookieConsent | null;
  hasConsented: boolean;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  updateConsent: (consent: CookieConsent) => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const STORAGE_KEY = 'vinster-cookie-consent';

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
        setHasConsented(true);
        setShowBanner(false);
      } catch (error) {
        console.error('Failed to parse saved cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      // Show banner for first-time visitors
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);

    // Here you would typically initialize analytics/marketing tools based on consent
    console.log('Cookie consent updated:', newConsent);
  };

  const acceptAll = () => {
    const allConsent: CookieConsent = {
      necessary: true,
      statistics: true,
      marketing: true,
    };
    saveConsent(allConsent);
  };

  const acceptNecessary = () => {
    const necessaryConsent: CookieConsent = {
      necessary: true,
      statistics: false,
      marketing: false,
    };
    saveConsent(necessaryConsent);
  };

  const updateConsent = (newConsent: CookieConsent) => {
    saveConsent(newConsent);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <CookieContext.Provider
      value={{
        consent,
        hasConsented,
        showBanner,
        showSettings,
        acceptAll,
        acceptNecessary,
        updateConsent,
        openSettings,
        closeSettings,
        closeBanner,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
};
