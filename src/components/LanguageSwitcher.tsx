
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const toggleLanguage = () => {
    console.log('Current language:', language);
    const newLanguage = language === 'nl' ? 'en' : 'nl';
    console.log('Switching to language:', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    >
      <Globe className="w-4 h-4" />
      {language === 'nl' ? 'EN' : 'NL'}
    </Button>
  );
};

export default LanguageSwitcher;
