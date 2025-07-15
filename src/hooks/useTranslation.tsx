import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales';

type TranslationKey = string;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): any => {
    console.log(`Translation requested: ${key} for language: ${language}`);
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.log(`Key not found: ${k} in ${key}, returning key`);
        return key; // Return key if not found
      }
    }

    console.log(`Translation result for ${key}:`, value);
    
    // Add safety check to ensure we don't return objects that could be rendered as React children
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      console.warn(`Warning: Translation key ${key} returned an object:`, value);
      // If it's an object with a 'title' or 'description', return that string instead
      if (value.title) return value.title;
      if (value.description) return value.description;
      if (value.text) return value.text;
      // Otherwise return the key to avoid rendering errors
      return key;
    }
    
    return value;
  };

  return { t, language };
};
