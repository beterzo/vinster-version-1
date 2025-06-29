
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'nl' ? 'en' : 'nl');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm"
    >
      <Globe className="w-4 h-4" />
      {language === 'nl' ? 'EN' : 'NL'}
    </Button>
  );
};

export default LanguageSwitcher;
