
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en' | 'de' | 'no';
export type EnglishVariant = 'uk' | 'us';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  englishVariant: EnglishVariant;
  setEnglishVariant: (variant: EnglishVariant) => void;
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
  const [englishVariant, setEnglishVariantState] = useState<EnglishVariant>('uk');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('vinster-language') as Language;
    const savedEnglishVariant = localStorage.getItem('vinster-english-variant') as EnglishVariant;
    
    console.log('Saved language from localStorage:', savedLanguage);
    console.log('Saved English variant from localStorage:', savedEnglishVariant);
    
    if (savedEnglishVariant && ['uk', 'us'].includes(savedEnglishVariant)) {
      setEnglishVariantState(savedEnglishVariant);
    }
    
    if (savedLanguage && ['nl', 'en', 'de', 'no'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      console.log('Browser language:', browserLang);
      if (browserLang.startsWith('en')) {
        setLanguageState('en');
        // Check if it's US English
        if (browserLang === 'en-us' || browserLang.includes('us')) {
          setEnglishVariantState('us');
          localStorage.setItem('vinster-english-variant', 'us');
        }
      } else if (browserLang.startsWith('de')) {
        setLanguageState('de');
      } else if (browserLang.startsWith('no') || browserLang.startsWith('nb') || browserLang.startsWith('nn')) {
        setLanguageState('no');
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

  const setEnglishVariant = (variant: EnglishVariant) => {
    console.log('Setting English variant to:', variant);
    setEnglishVariantState(variant);
    localStorage.setItem('vinster-english-variant', variant);
  };

  console.log('Current language in provider:', language, 'English variant:', englishVariant);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, englishVariant, setEnglishVariant }}>
      {children}
    </LanguageContext.Provider>
  );
};

