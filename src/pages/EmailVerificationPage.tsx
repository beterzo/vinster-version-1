import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

const EmailVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();
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

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: t('email_verification.email_required') || "Email vereist",
        description: t('email_verification.email_required_desc') || "Voer je email adres in om de verificatie email opnieuw te versturen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await resendConfirmation(email);

    if (error) {
      toast({
        title: t('email_verification.resend_error') || "Fout bij versturen email",
        description: error.message || t('email_verification.resend_error_desc') || "Er is een fout opgetreden bij het versturen van de verificatie email.",
        variant: "destructive",
      });
    } else {
      toast({
        title: t('email_verification.email_sent') || "Email verstuurd!",
        description: t('email_verification.verification_email_resent') || "We hebben een nieuwe verificatie email naar je gestuurd.",
      });
    }

    setIsLoading(false);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="relative hidden lg:block">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              "{t('login.quote')}"
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Verification content */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-900" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-vinster-blue">
              {t('email_verification.title')}
            </h1>
            
            <p className="text-gray-600">
              {t('email_verification.description')}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">{t('email_verification.not_received')}</p>
                <p>{t('email_verification.spam_notice') || 'Controleer je spam folder of kies een van de opties hieronder.'}</p>
              </div>
            </div>
          </div>

          {/* Two main options */}
          <div className="space-y-6">
            {/* Option 1: Resend verification email */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-vinster-blue">{t('email_verification.resend_title') || 'Nieuwe verificatie email versturen'}</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email_verification.email') || t('signup.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('email_verification.email_placeholder') || t('signup.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <Button 
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                >
                  {isLoading ? t('email_verification.sending') || "Versturen..." : t('email_verification.resend_email')}
                </Button>
              </div>
            </div>

            {/* Option 2: Go to login */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <ArrowRight className="w-5 h-5" style={{ color: '#E4C05B' }} />
                <h3 className="font-semibold text-vinster-blue">{t('email_verification.already_verified') || 'Al geverifieerd?'}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {t('email_verification.already_verified_desc') || 'Als je account al geverifieerd is, kun je direct inloggen.'}
              </p>
              
              <Button 
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full hover:bg-yellow-50"
                style={{ 
                  borderColor: '#E4C05B', 
                  color: '#E4C05B'
                }}
              >
                {t('email_verification.back_to_login')}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {t('email_verification.back_to_home') || 'Terug naar startpagina'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
