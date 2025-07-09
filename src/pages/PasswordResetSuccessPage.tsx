
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const PasswordResetSuccessPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image with quote overlay */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              {t('login.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Success message */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 text-center">
          {/* Header with Logo and Language Switcher */}
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-20 w-auto" 
            />
            <LanguageSwitcher />
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {t('password_reset_success.title')}
            </h1>
            
            <p className="text-lg text-gray-600">
              {t('password_reset_success.subtitle')}
            </p>
            
            <p className="text-gray-600">
              {t('password_reset_success.description')}
            </p>
          </div>

          <Link 
            to="/login" 
            className="inline-flex items-center justify-center w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg transition-colors"
          >
            {t('password_reset_success.continue_to_login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccessPage;
