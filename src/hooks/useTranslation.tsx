
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
    return value;
  };

  return { t, language };
};
