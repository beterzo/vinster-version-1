
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { MailCheck, RotateCcw } from "lucide-react";

const CheckEmailPasswordResetPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  // Get email from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email') || localStorage.getItem('password-reset-email') || '';

  useEffect(() => {
    // Set language from URL parameter if provided
    const langParam = searchParams.get('lang');
    if (langParam && (langParam === 'nl' || langParam === 'en' || langParam === 'de' || langParam === 'no')) {
      setLanguage(langParam);
    }
  }, [searchParams, setLanguage]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: t('auth.email_required'),
        description: t('auth.email_required_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);

    try {
      const redirectUrl = `https://vinster.ai/password-reset-success?lang=${language}`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        let errorMessage = t('auth.password_reset_error');
        
        if (error.message.includes('Email not confirmed')) {
          errorMessage = t('auth.email_not_confirmed');
        } else if (error.message.includes('User not found')) {
          errorMessage = t('auth.user_not_found');
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: t('auth.password_reset_failed'),
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.check_email.email_resent'),
          description: t('auth.check_email.email_resent_desc'),
          duration: 6000,
        });
      }
    } catch (error: any) {
      toast({
        title: t('auth.password_reset_failed'),
        description: t('auth.unexpected_error'),
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image with quote overlay */}
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
              {t('auth.login.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Check email content */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          {/* Header with Logo and Language Switcher */}
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')}
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <LanguageSwitcher />
          </div>

          {/* Check email content */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <MailCheck className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                {t('auth.check_email.title')}
              </h1>
              <p className="text-gray-600">
                {t('auth.check_email.subtitle')}
              </p>
            </div>

            {email && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {t('auth.check_email.sent_to')} <span className="font-medium text-blue-900">{email}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t('auth.check_email.description')}
              </p>
              
              <p className="text-sm text-gray-600">
                {t('auth.check_email.spam_notice')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full h-12 border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)]"
              disabled={isResending || !email}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isResending ? t('auth.sending') : t('auth.check_email.resend_email')}
            </Button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm font-semibold text-yellow-500 hover:text-yellow-600"
              >
                {t('auth.back_to_login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPasswordResetPage;
