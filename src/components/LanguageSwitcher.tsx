import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { Language } from '@/contexts/LanguageContext';

type EnglishVariant = 'uk' | 'us';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [englishVariant, setEnglishVariant] = useState<EnglishVariant>('uk');

  // Load English variant from localStorage
  useEffect(() => {
    const savedVariant = localStorage.getItem('vinster-english-variant') as EnglishVariant;
    if (savedVariant && ['uk', 'us'].includes(savedVariant)) {
      setEnglishVariant(savedVariant);
    }
  }, []);

  const languages = [
    { code: 'nl' as Language, label: 'Nederlands', flag: '🇳🇱', variant: null },
    { code: 'en' as Language, label: 'English (UK)', flag: '🇬🇧', variant: 'uk' as EnglishVariant },
    { code: 'en' as Language, label: 'English (US)', flag: '🇺🇸', variant: 'us' as EnglishVariant },
    { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪', variant: null },
    { code: 'no' as Language, label: 'Norsk', flag: '🇳🇴', variant: null },
  ];

  const handleLanguageSelect = (code: Language, variant: EnglishVariant | null) => {
    setLanguage(code);
    if (code === 'en' && variant) {
      setEnglishVariant(variant);
      localStorage.setItem('vinster-english-variant', variant);
    }
  };

  // Get current flag based on language and variant
  const getCurrentFlag = () => {
    if (language === 'en') {
      return englishVariant === 'us' ? '🇺🇸' : '🇬🇧';
    }
    const lang = languages.find(l => l.code === language && l.variant === null);
    return lang?.flag || '🇳🇱';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2 py-1 text-lg hover:bg-white/20"
        >
          <span className="text-xl">{getCurrentFlag()}</span>
          <ChevronDown className="w-3 h-3 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang, index) => (
          <DropdownMenuItem
            key={`${lang.code}-${lang.variant || index}`}
            onClick={() => handleLanguageSelect(lang.code, lang.variant)}
            className={`flex items-center gap-2 ${
              language === lang.code && (lang.code !== 'en' || englishVariant === lang.variant) 
                ? 'bg-gray-100' 
                : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
