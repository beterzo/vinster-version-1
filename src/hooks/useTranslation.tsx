
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

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        console.log(`Key not found: ${k} in ${key}, falling back to Dutch`);
        // Fallback to Dutch if key not found in current language
        value = translations.nl;
        for (const fallbackKey of keys) {
          if (typeof value === 'object' && value !== null && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.log(`Key not found in fallback: ${fallbackKey}`);
            return key; // Return key if not found anywhere
          }
        }
      }
    }

    console.log(`Translation result for ${key}:`, value);
    return value;
  };

  return { t, language };
};
