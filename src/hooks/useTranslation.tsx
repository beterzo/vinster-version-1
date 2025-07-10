
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales';

type TranslationKey = string;
type TranslationValue = string | { [key: string]: any } | any[];

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): any => {
    console.log(`Translation requested: ${key} for language: ${language}`);
    const keys = key.split('.');
    let value: TranslationValue = translations[language];

    // First try the new nested structure
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        console.log(`Key not found in nested structure: ${k} in ${key}`);
        // Fallback to old flat structure - check if the full key exists at root level
        const flatValue = translations[language][key];
        if (flatValue !== undefined) {
          console.log(`Found in flat structure: ${key}`);
          return flatValue;
        }
        
        // Final fallback to Dutch
        console.log(`Key not found: ${k} in ${key}, falling back to Dutch`);
        value = translations.nl;
        for (const fallbackKey of keys) {
          if (typeof value === 'object' && value !== null && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            // Try flat structure in Dutch as well
            const dutchFlatValue = translations.nl[key];
            if (dutchFlatValue !== undefined) {
              return dutchFlatValue;
            }
            console.log(`Key not found in fallback: ${fallbackKey}`);
            return key; // Return key if not found anywhere
          }
        }
        break;
      }
    }

    console.log(`Translation result for ${key}:`, value);
    return value;
  };

  return { t, language };
};
