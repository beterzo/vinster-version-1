import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // First check for saved language in localStorage
    const savedLanguage = localStorage.getItem('vinster-language');
    
    // Then check for language parameter in URL
    const langParam = searchParams.get('lang');
    
    if (langParam && (langParam === 'nl' || langParam === 'en' || langParam === 'de' || langParam === 'no')) {
      setLanguage(langParam);
    } else if (!savedLanguage && language) {
      // If no URL param and no saved language, use current context language
      setLanguage(language);
    }
  }, [searchParams, setLanguage, language]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              {t('auth.login.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Confirmation content */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 text-center">
          <div className="text-center">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200 mx-auto" 
            />
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {t('auth.email_confirmed.title')}
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              {t('auth.email_confirmed.description')}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-green-800">{t('auth.email_confirmed.subtitle')}</h3>
              <p className="text-sm text-green-700">
                {t('auth.email_confirmed.description')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleGoToLogin} className="w-full h-12 bg-[#232D4B] hover:bg-[#1a2350] text-white font-semibold text-base rounded-[10px]">
              {t('auth.email_confirmed.continue_to_login')}
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              {t('common.tagline')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmedPage;
