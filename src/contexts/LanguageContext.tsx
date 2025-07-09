
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('vinster-language') as Language;
    console.log('Saved language from localStorage:', savedLanguage);
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      console.log('Browser language:', browserLang);
      if (browserLang.startsWith('en')) {
        setLanguageState('en');
      } else {
        setLanguageState('nl'); // Default to Dutch
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    console.log('Setting language to:', lang);
    setLanguageState(lang);
    localStorage.setItem('vinster-language', lang);
    // Mark that the user has manually selected a language
    localStorage.setItem('vinster-language-manual-selection', 'true');
  };

  console.log('Current language in provider:', language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
