
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales';

type TranslationKey = string;
type TranslationValue = string | { [key: string]: any };

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        // Fallback to Dutch if key not found in current language
        value = translations.nl;
        for (const fallbackKey of keys) {
          if (typeof value === 'object' && value !== null && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found anywhere
          }
        }
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};
